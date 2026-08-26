import uuid
from dataclasses import dataclass
from dataclasses import field


@dataclass
class Level:
    value: str


@dataclass
class Word:
    id: str
    word: str
    translation: str
    transcription: str
    examples: list[str]
    context_sentence: str
    level: Level


@dataclass
class WordsFilter:
    ids: list[uuid.UUID] = field(default_factory=list)
