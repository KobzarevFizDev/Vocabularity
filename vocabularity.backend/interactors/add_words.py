from sqlalchemy.orm import Session

from models.domain.domain_models import Word
from models.repository.word_repository import WordRepository


class AddWordsInteractor:
    def __init__(self, session: Session) -> None:
        self._session = session
        self._word_repo = WordRepository(session)

    def execute(self, words: list[Word]) -> None:
        for word in words:
            self._word_repo.add(word)
        self._session.commit()
