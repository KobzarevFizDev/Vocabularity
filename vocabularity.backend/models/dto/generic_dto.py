from typing import Annotated, List, Literal, Union

from pydantic import BaseModel, Field


class WordDto(BaseModel):
    id: str
    word: str
    translation: str
    transcription: str
    examples: list[str]
    level: str
    context_sentence: str


class ActionResponse(BaseModel):
    error: str
    status: int


class AddWordsResponse(BaseModel):
    added: int
    total: int


class DeleteWordsResponse(BaseModel):
    deleted: int


class WordListResponse(BaseModel):
    words: list[WordDto]
    total: int
    page: int
    page_size: int

