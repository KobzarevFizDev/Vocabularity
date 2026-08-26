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

class PageAction(BaseModel):
    action_id: Literal["set_page"]
    page_id: str


class SuggestCandidatesAction(BaseModel):
    action_id: Literal["suggest_candidates"]
    words: List[WordDto]


class ClearCandidatesAction(BaseModel):
    action_id: Literal["clear_candidates"]

ActionBody = Annotated[
    Union[SuggestCandidatesAction, ClearCandidatesAction, PageAction],
    Field(discriminator="action_id"),
]

