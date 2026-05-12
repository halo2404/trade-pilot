import uuid
from datetime import datetime

from pydantic import BaseModel


class LessonSummary(BaseModel):
    id: uuid.UUID
    title: str
    order: int
    completed: bool = False

    model_config = {"from_attributes": True}


class LessonDetail(BaseModel):
    id: uuid.UUID
    module_id: uuid.UUID
    title: str
    content: str
    order: int
    completed: bool = False

    model_config = {"from_attributes": True}


class ModuleSummary(BaseModel):
    id: uuid.UUID
    title: str
    description: str
    order: int
    lesson_count: int
    completed_count: int
    has_quiz: bool

    model_config = {"from_attributes": True}


class ModuleDetail(BaseModel):
    id: uuid.UUID
    title: str
    description: str
    order: int
    lessons: list[LessonSummary]
    lesson_count: int
    completed_count: int
    has_quiz: bool

    model_config = {"from_attributes": True}


class QuizQuestionResponse(BaseModel):
    id: uuid.UUID
    question: str
    options: list[str]
    order: int

    model_config = {"from_attributes": True}


class QuizSubmitRequest(BaseModel):
    answers: list[int]


class QuizResultItem(BaseModel):
    question: str
    options: list[str]
    your_answer: int
    correct_index: int
    explanation: str
    correct: bool


class QuizResult(BaseModel):
    score: int
    total: int
    passed: bool
    items: list[QuizResultItem]


class QuizAttemptSummary(BaseModel):
    id: uuid.UUID
    score: int
    total: int
    attempted_at: datetime

    model_config = {"from_attributes": True}


class GlossaryEntryResponse(BaseModel):
    id: uuid.UUID
    term: str
    definition: str
    order: int

    model_config = {"from_attributes": True}
