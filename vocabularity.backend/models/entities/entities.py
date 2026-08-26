import uuid

from sqlalchemy import ARRAY
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy import Uuid
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship


from models.domain.domain_models import Level
from models.domain.domain_models import Word as WordDomain


class Base(DeclarativeBase):
    pass


class WordEntity(Base):
    __tablename__ = "words"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    word: Mapped[str] = mapped_column(String(255))
    translation: Mapped[str] = mapped_column(String(255))
    transcription: Mapped[str] = mapped_column(String(255))
    examples: Mapped[list[str]] = mapped_column(ARRAY(String(255)))
    context_sentence: Mapped[str] = mapped_column(String(255))
    level_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("levels.id"))
    level: Mapped["LevelEntity"] = relationship()

    def to_domain(self) -> WordDomain:
        return WordDomain(
            id=self.id,
            word=self.word,
            translation=self.translation,
            transcription=self.transcription,
            examples=self.examples,
            context_sentence=self.context_sentence,
            level=self.level.to_domain(),
        )

class LevelEntity(Base):
    __tablename__ = "levels"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    value: Mapped[str] = mapped_column(String(255))

    def to_domain(self) -> Level:
        return Level(value=self.value)