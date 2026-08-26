import uuid

from sqlalchemy.orm import Session

from models.repository.word_repository import WordRepository


class DeleteWordsInteractor:
    def __init__(self, session: Session) -> None:
        self._session = session
        self._repo = WordRepository(session)

    def execute(self, ids: list[str]) -> None:
        for id_ in ids:
            self._repo.delete_by_id(uuid.UUID(id_))
        self._session.commit()
