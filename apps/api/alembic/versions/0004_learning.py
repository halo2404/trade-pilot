"""Add learning_modules, lessons, user_lesson_progress, quiz_questions, quiz_attempts, glossary_entries

Revision ID: 0004
Revises: 0003
Create Date: 2026-05-12
"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0004"
down_revision: str | None = "0003"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "learning_modules",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("description", sa.Text, nullable=False, server_default=""),
        sa.Column("order", sa.Integer, nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "lessons",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "module_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("learning_modules.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("content", sa.Text, nullable=False, server_default=""),
        sa.Column("order", sa.Integer, nullable=False, server_default="0"),
    )

    op.create_table(
        "user_lesson_progress",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
        sa.Column(
            "lesson_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("lessons.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("user_id", "lesson_id", name="uq_progress_user_lesson"),
    )

    op.create_table(
        "quiz_questions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "module_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("learning_modules.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
        sa.Column("question", sa.Text, nullable=False),
        sa.Column("options", postgresql.JSONB, nullable=False),
        sa.Column("correct_index", sa.Integer, nullable=False),
        sa.Column("explanation", sa.Text, nullable=False, server_default=""),
        sa.Column("order", sa.Integer, nullable=False, server_default="0"),
    )

    op.create_table(
        "quiz_attempts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
        sa.Column(
            "module_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("learning_modules.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
        sa.Column("score", sa.Integer, nullable=False),
        sa.Column("total", sa.Integer, nullable=False),
        sa.Column("attempted_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "glossary_entries",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("term", sa.String(100), nullable=False, unique=True),
        sa.Column("definition", sa.Text, nullable=False),
        sa.Column("order", sa.Integer, nullable=False, server_default="0"),
    )


def downgrade() -> None:
    op.drop_table("glossary_entries")
    op.drop_table("quiz_attempts")
    op.drop_table("quiz_questions")
    op.drop_table("user_lesson_progress")
    op.drop_table("lessons")
    op.drop_table("learning_modules")
