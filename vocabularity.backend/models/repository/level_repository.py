from sqlalchemy import select
from sqlalchemy.orm import Session

from models.domain.domain_models import Level
from models.entities.entities import LevelEntity


class LevelRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def get(self, level_value: str) -> Level | None:
        entity = self._session.scalar(
            select(LevelEntity).where(LevelEntity.value == level_value)
        )
        return entity.to_domain() if entity else None