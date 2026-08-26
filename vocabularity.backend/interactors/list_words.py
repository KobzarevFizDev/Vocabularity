import uuid

from sqlalchemy.orm import Session

from models.domain.domain_models import Word
from models.domain.domain_models import WordsFilter
from models.repository.word_repository import WordRepository


class ListWordsInteractor:
    def __init__(self, session: Session) -> None:
        self._repo = WordRepository(session)

    def execute(
        self,
        page: int,
        page_size: int,
        include_translate: bool = True,
        include_transcription: bool = True,
        include_examples: bool = True,
        ids: list[str] | None = None,
    ) -> tuple[list[tuple[uuid.UUID, Word]], int]:
        if ids:
            filter_ = WordsFilter(ids=[uuid.UUID(id_) for id_ in ids])
            items = self._repo.list(filter_)
            return items, len(items)
        items, total = self._repo.get_page(page, page_size)
        return items, total
