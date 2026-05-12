import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.learning import (
    GlossaryEntry,
    Lesson,
    LearningModule,
    QuizAttempt,
    QuizQuestion,
    UserLessonProgress,
)
from app.models.user import User
from app.schemas.learning import (
    GlossaryEntryResponse,
    LessonDetail,
    LessonSummary,
    ModuleDetail,
    ModuleSummary,
    QuizAttemptSummary,
    QuizQuestionResponse,
    QuizResult,
    QuizResultItem,
    QuizSubmitRequest,
)

router = APIRouter(prefix="/learning", tags=["learning"])


# ── Helpers ───────────────────────────────────────────────────────────

async def _completed_lesson_ids(user_id: uuid.UUID, db: AsyncSession) -> set[uuid.UUID]:
    result = await db.execute(
        select(UserLessonProgress.lesson_id).where(UserLessonProgress.user_id == user_id)
    )
    return set(result.scalars().all())


# ── Modules ───────────────────────────────────────────────────────────

@router.get("/modules", response_model=list[ModuleSummary])
async def list_modules(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[ModuleSummary]:
    modules_result = await db.execute(
        select(LearningModule).order_by(LearningModule.order)
    )
    modules = list(modules_result.scalars().all())

    completed_ids = await _completed_lesson_ids(current_user.id, db)

    summaries: list[ModuleSummary] = []
    for mod in modules:
        lessons_result = await db.execute(
            select(Lesson).where(Lesson.module_id == mod.id)
        )
        lessons = list(lessons_result.scalars().all())
        lesson_count = len(lessons)
        completed_count = sum(1 for l in lessons if l.id in completed_ids)

        quiz_result = await db.execute(
            select(QuizQuestion.id).where(QuizQuestion.module_id == mod.id).limit(1)
        )
        has_quiz = quiz_result.scalar_one_or_none() is not None

        summaries.append(
            ModuleSummary(
                id=mod.id,
                title=mod.title,
                description=mod.description,
                order=mod.order,
                lesson_count=lesson_count,
                completed_count=completed_count,
                has_quiz=has_quiz,
            )
        )
    return summaries


@router.get("/modules/{module_id}", response_model=ModuleDetail)
async def get_module(
    module_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ModuleDetail:
    mod_result = await db.execute(
        select(LearningModule).where(LearningModule.id == module_id)
    )
    mod = mod_result.scalar_one_or_none()
    if not mod:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Modul nicht gefunden.")

    lessons_result = await db.execute(
        select(Lesson).where(Lesson.module_id == mod.id).order_by(Lesson.order)
    )
    lessons = list(lessons_result.scalars().all())

    completed_ids = await _completed_lesson_ids(current_user.id, db)
    completed_count = sum(1 for l in lessons if l.id in completed_ids)

    quiz_result = await db.execute(
        select(QuizQuestion.id).where(QuizQuestion.module_id == mod.id).limit(1)
    )
    has_quiz = quiz_result.scalar_one_or_none() is not None

    return ModuleDetail(
        id=mod.id,
        title=mod.title,
        description=mod.description,
        order=mod.order,
        lessons=[
            LessonSummary(
                id=l.id,
                title=l.title,
                order=l.order,
                completed=l.id in completed_ids,
            )
            for l in lessons
        ],
        lesson_count=len(lessons),
        completed_count=completed_count,
        has_quiz=has_quiz,
    )


# ── Lessons ───────────────────────────────────────────────────────────

@router.get("/lessons/{lesson_id}", response_model=LessonDetail)
async def get_lesson(
    lesson_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> LessonDetail:
    lesson_result = await db.execute(select(Lesson).where(Lesson.id == lesson_id))
    lesson = lesson_result.scalar_one_or_none()
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lektion nicht gefunden.")

    progress_result = await db.execute(
        select(UserLessonProgress).where(
            UserLessonProgress.user_id == current_user.id,
            UserLessonProgress.lesson_id == lesson_id,
        )
    )
    completed = progress_result.scalar_one_or_none() is not None

    return LessonDetail(
        id=lesson.id,
        module_id=lesson.module_id,
        title=lesson.title,
        content=lesson.content,
        order=lesson.order,
        completed=completed,
    )


@router.post("/lessons/{lesson_id}/complete", status_code=status.HTTP_204_NO_CONTENT)
async def complete_lesson(
    lesson_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    lesson_result = await db.execute(select(Lesson.id).where(Lesson.id == lesson_id))
    if lesson_result.scalar_one_or_none() is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lektion nicht gefunden.")

    existing_result = await db.execute(
        select(UserLessonProgress).where(
            UserLessonProgress.user_id == current_user.id,
            UserLessonProgress.lesson_id == lesson_id,
        )
    )
    if existing_result.scalar_one_or_none() is None:
        db.add(UserLessonProgress(user_id=current_user.id, lesson_id=lesson_id))
        await db.commit()


# ── Quiz ──────────────────────────────────────────────────────────────

@router.get("/modules/{module_id}/quiz", response_model=list[QuizQuestionResponse])
async def get_quiz(
    module_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[QuizQuestionResponse]:
    mod_result = await db.execute(
        select(LearningModule.id).where(LearningModule.id == module_id)
    )
    if mod_result.scalar_one_or_none() is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Modul nicht gefunden.")

    questions_result = await db.execute(
        select(QuizQuestion)
        .where(QuizQuestion.module_id == module_id)
        .order_by(QuizQuestion.order)
    )
    questions = list(questions_result.scalars().all())

    return [
        QuizQuestionResponse(id=q.id, question=q.question, options=q.options, order=q.order)
        for q in questions
    ]


@router.post("/modules/{module_id}/quiz", response_model=QuizResult)
async def submit_quiz(
    module_id: uuid.UUID,
    body: QuizSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> QuizResult:
    mod_result = await db.execute(
        select(LearningModule.id).where(LearningModule.id == module_id)
    )
    if mod_result.scalar_one_or_none() is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Modul nicht gefunden.")

    questions_result = await db.execute(
        select(QuizQuestion)
        .where(QuizQuestion.module_id == module_id)
        .order_by(QuizQuestion.order)
    )
    questions = list(questions_result.scalars().all())

    if len(body.answers) != len(questions):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erwartet {len(questions)} Antworten, erhalten {len(body.answers)}.",
        )

    items: list[QuizResultItem] = []
    score = 0
    for q, answer in zip(questions, body.answers):
        correct = answer == q.correct_index
        if correct:
            score += 1
        items.append(
            QuizResultItem(
                question=q.question,
                options=q.options,
                your_answer=answer,
                correct_index=q.correct_index,
                explanation=q.explanation,
                correct=correct,
            )
        )

    total = len(questions)
    db.add(
        QuizAttempt(
            user_id=current_user.id,
            module_id=module_id,
            score=score,
            total=total,
        )
    )
    await db.commit()

    return QuizResult(score=score, total=total, passed=score >= (total * 0.7), items=items)


@router.get("/modules/{module_id}/quiz/attempts", response_model=list[QuizAttemptSummary])
async def get_quiz_attempts(
    module_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[QuizAttemptSummary]:
    result = await db.execute(
        select(QuizAttempt)
        .where(
            QuizAttempt.user_id == current_user.id,
            QuizAttempt.module_id == module_id,
        )
        .order_by(QuizAttempt.attempted_at.desc())
        .limit(10)
    )
    attempts = result.scalars().all()
    return [
        QuizAttemptSummary(
            id=a.id, score=a.score, total=a.total, attempted_at=a.attempted_at
        )
        for a in attempts
    ]


# ── Glossary ──────────────────────────────────────────────────────────

@router.get("/glossary", response_model=list[GlossaryEntryResponse])
async def get_glossary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[GlossaryEntryResponse]:
    result = await db.execute(
        select(GlossaryEntry).order_by(GlossaryEntry.term)
    )
    entries = result.scalars().all()
    return [
        GlossaryEntryResponse(id=e.id, term=e.term, definition=e.definition, order=e.order)
        for e in entries
    ]
