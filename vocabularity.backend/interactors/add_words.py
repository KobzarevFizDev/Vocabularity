import uuid

from sqlalchemy.orm import Session

from models.domain.domain_models import Word
from models.repository.word_repository import WordRepository


class AddWordsInteractor:
    def __init__(self, session: Session) -> None:
        self._session = session
        self._word_repo = WordRepository(session)

    def execute(self, words: list[Word], ids: list[uuid.UUID]) -> None:
        existing_ids = self._word_repo.exists_by_ids(ids)

        for word, word_id in zip(words, ids):
            if word_id in existing_ids:
                continue
            self._word_repo.add(word)

        self._session.commit()
