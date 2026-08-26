import uuid

from sqlalchemy import delete
from sqlalchemy import func
from sqlalchemy import select
from sqlalchemy.orm import Session

from models.domain.domain_models import Word
from models.domain.domain_models import WordsFilter
from models.entities.entities import LevelEntity
from models.entities.entities import WordEntity


class WordRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def add(self, word: Word) -> None:
        level = self._session.scalar(
            select(LevelEntity).where(LevelEntity.value == word.level.value)
        )
        if level is None:
            raise ValueError(f"Unknown level: {word.level.value}")

        entity = WordEntity(
            word=word.word,
            translation=word.translation,
            transcription=word.transcription,
            examples=word.examples,
            context_sentence=word.context_sentence,
            level_id=level.id,
        )
        self._session.add(entity)

    def delete_by_id(self, word_id: uuid.UUID) -> None:
        self._session.execute(delete(WordEntity).where(WordEntity.id == word_id))

    def exists_by_ids(self, ids: list[uuid.UUID]) -> set[uuid.UUID]:
        if not ids:
            return set()
        rows = self._session.scalars(
            select(WordEntity.id).where(WordEntity.id.in_(ids))
        ).all()
        return set(rows)

    def get_page(self, page: int, page_size: int) -> tuple[list[tuple[uuid.UUID, Word]], int]:
        total = self._session.scalar(select(func.count()).select_from(WordEntity))
        entities = self._session.scalars(
            select(WordEntity)
            .order_by(WordEntity.word)
            .offset(page * page_size)
            .limit(page_size)
        ).all()
        return [(e.id, e.to_domain()) for e in entities], total

    def list(self, filter_: WordsFilter) -> list[tuple[uuid.UUID, Word]]:
        stmt = select(WordEntity).order_by(WordEntity.word)
        if filter_.ids:
            stmt = stmt.where(WordEntity.id.in_(filter_.ids))
        entities = self._session.scalars(stmt).all()
        return [(e.id, e.to_domain()) for e in entities]
