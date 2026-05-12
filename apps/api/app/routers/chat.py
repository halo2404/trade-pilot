import json
import uuid
from collections.abc import AsyncGenerator

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal, get_db
from app.core.deps import get_current_user
from app.models.chat import ChatMessage, ChatSession
from app.models.user import User
from app.schemas.chat import ChatMessageResponse, ChatSessionSummary, SendMessageRequest
from app.services.ai_client import stream_ai_response

router = APIRouter(prefix="/chat", tags=["chat"])

_MAX_HISTORY = 20  # messages sent to the AI


# ── Sessions ──────────────────────────────────────────────────────────

@router.get("/sessions", response_model=list[ChatSessionSummary])
async def list_sessions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[ChatSessionSummary]:
    result = await db.execute(
        select(ChatSession)
        .where(ChatSession.user_id == current_user.id)
        .order_by(ChatSession.updated_at.desc())
        .limit(30)
    )
    sessions = result.scalars().all()
    return [
        ChatSessionSummary(id=s.id, title=s.title, created_at=s.created_at, updated_at=s.updated_at)
        for s in sessions
    ]


@router.post("/sessions", response_model=ChatSessionSummary, status_code=status.HTTP_201_CREATED)
async def create_session(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ChatSessionSummary:
    session = ChatSession(user_id=current_user.id)
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return ChatSessionSummary(
        id=session.id, title=session.title, created_at=session.created_at, updated_at=session.updated_at
    )


@router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(
    session_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    result = await db.execute(
        select(ChatSession).where(
            ChatSession.id == session_id, ChatSession.user_id == current_user.id
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Unterhaltung nicht gefunden.")
    await db.delete(session)
    await db.commit()


# ── Messages ──────────────────────────────────────────────────────────

@router.get("/sessions/{session_id}/messages", response_model=list[ChatMessageResponse])
async def get_messages(
    session_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[ChatMessageResponse]:
    session_result = await db.execute(
        select(ChatSession).where(
            ChatSession.id == session_id, ChatSession.user_id == current_user.id
        )
    )
    if session_result.scalar_one_or_none() is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Unterhaltung nicht gefunden.")

    result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.asc())
    )
    return [
        ChatMessageResponse(
            id=m.id, session_id=m.session_id, role=m.role, content=m.content, created_at=m.created_at
        )
        for m in result.scalars().all()
    ]


@router.post("/sessions/{session_id}/messages")
async def send_message(
    session_id: uuid.UUID,
    body: SendMessageRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> StreamingResponse:
    session_result = await db.execute(
        select(ChatSession).where(
            ChatSession.id == session_id, ChatSession.user_id == current_user.id
        )
    )
    session = session_result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Unterhaltung nicht gefunden.")

    # Persist user message and update session title
    user_msg = ChatMessage(session_id=session_id, role="user", content=body.content)
    db.add(user_msg)
    if session.title == "Neue Unterhaltung":
        session.title = body.content[:80].strip()
    await db.commit()

    # Build context history for the AI
    history_result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.desc())
        .limit(_MAX_HISTORY)
    )
    history = [
        {"role": m.role, "content": m.content}
        for m in reversed(history_result.scalars().all())
    ]

    async def _generate() -> AsyncGenerator[bytes, None]:
        tokens: list[str] = []
        async for chunk in stream_ai_response(history):
            yield chunk.encode()
            try:
                payload = json.loads(chunk.removeprefix("data: ").strip())
                if payload.get("type") == "token":
                    tokens.append(payload["content"])
            except (json.JSONDecodeError, ValueError):
                pass

        # Persist assistant response in a fresh session after stream ends
        assistant_content = "".join(tokens).strip()
        if assistant_content:
            async with AsyncSessionLocal() as save_db:
                save_db.add(
                    ChatMessage(session_id=session_id, role="assistant", content=assistant_content)
                )
                await save_db.commit()

    return StreamingResponse(
        _generate(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
