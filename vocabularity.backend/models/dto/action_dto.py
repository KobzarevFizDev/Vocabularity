from typing import Annotated, Literal, Union

from pydantic import BaseModel, Field

from models.dto.generic_dto import WordDto


class PageAction(BaseModel):
    action_id: Literal["set_page"]
    page_id: str


class SuggestCandidatesAction(BaseModel):
    action_id: Literal["suggest_candidates"]
    words: list[WordDto]


class ClearCandidatesAction(BaseModel):
    action_id: Literal["clear_candidates"]


WsMessage = Annotated[
    Union[PageAction, SuggestCandidatesAction, ClearCandidatesAction],
    Field(discriminator="action_id"),
]
