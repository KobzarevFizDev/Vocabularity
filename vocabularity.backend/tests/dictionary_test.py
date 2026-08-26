import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text
from sqlalchemy.orm import Session

from main import app
from main import engine
from interactors.add_words import AddWordsInteractor
from interactors.delete_words import DeleteWordsInteractor
from models.domain.domain_models import Level
from models.domain.domain_models import Word
from models.dto.generic_dto import WordDto


@pytest.fixture(autouse=True)
def cleanup():
    words: list[str] = []
    yield words
    if words:
        with Session(engine) as session:
            for word in words:
                session.execute(text("DELETE FROM words WHERE word = :word"), {"word": word})
            session.commit()


def test_add_words(cleanup):
    items = [
        WordDto(
            id="00000000-0000-0000-0000-000000000001",
            word="hello",
            translation="привет",
            transcription="həˈloʊ",
            examples=["Hello, how are you?", "Hello, world!"],
            level="A1",
            context_sentence="Hello, it's nice to meet you.",
        ),
    ]

    cleanup.extend(item.word for item in items)

    words = [
        Word(
            id=item.id,
            word=item.word,
            translation=item.translation,
            transcription=item.transcription,
            examples=item.examples,
            context_sentence=item.context_sentence,
            level=Level(value=item.level),
        )
        for item in items
    ]
    ids = [uuid.UUID(item.id) for item in items]

    with Session(engine) as session:
        interactor = AddWordsInteractor(session)
        interactor.execute(words, ids)

    with Session(engine) as session:
        row = session.execute(
            text("SELECT word, translation, context_sentence FROM words WHERE word = :word"),
            {"word": "hello"},
        ).fetchone()

    assert row is not None
    assert row.word == "hello"
    assert row.translation == "привет"
    assert row.context_sentence == "Hello, it's nice to meet you."


def test_delete_words(cleanup):
    word_id = "00000000-0000-0000-0000-000000000002"
    item = WordDto(
        id=word_id,
        word="delete",
        translation="удалить",
        transcription="dɪˈliːt",
        examples=["Delete this entry."],
        level="A1",
        context_sentence="Please delete the file.",
    )

    with Session(engine) as session:
        AddWordsInteractor(session).execute(
            [
                Word(
                    id=item.id,
                    word=item.word,
                    translation=item.translation,
                    transcription=item.transcription,
                    examples=item.examples,
                    context_sentence=item.context_sentence,
                    level=Level(value=item.level),
                ),
            ],
            [uuid.UUID(item.id)],
        )

    cleanup.append(item.word)

    with Session(engine) as session:
        DeleteWordsInteractor(session).execute([word_id])

    with Session(engine) as session:
        row = session.execute(
            text("SELECT id FROM words WHERE id = :id"),
            {"id": word_id},
        ).fetchone()

    assert row is None


def test_add_words_duplicate_returns_400(cleanup):
    client = TestClient(app)
    payload = {
        "id": "00000000-0000-0000-0000-000000000003",
        "word": "duplicate",
        "translation": "дубликат",
        "transcription": "ˈdjuːplɪkət",
        "examples": ["This is a duplicate."],
        "level": "A1",
        "context_sentence": "This word already exists.",
    }
    cleanup.append(payload["word"])

    response = client.post("/dictionary/words", json=[payload])
    assert response.status_code == 200

    duplicate = {**payload, "id": "00000000-0000-0000-0000-000000000004"}

    response = client.post("/dictionary/words", json=[duplicate])
    assert response.status_code == 400


def test_get_words_pagination(cleanup):
    client = TestClient(app)
    with Session(engine) as session:
        initial_total = session.scalar(text("SELECT count(*) FROM words"))
    words = [
        ("apple", "яблоко"),
        ("banana", "банан"),
        ("cherry", "вишня"),
    ]
    for index, (word, translation) in enumerate(words):
        payload = {
            "id": f"00000000-0000-0000-0000-{index + 5:012d}",
            "word": word,
            "translation": translation,
            "transcription": "",
            "examples": [],
            "level": "A1",
            "context_sentence": "",
        }
        cleanup.append(payload["word"])
        response = client.post("/dictionary/words", json=[payload])
        assert response.status_code == 200

    first_page = client.get("/dictionary/words", params={"page": 0, "page_size": 2})
    assert first_page.status_code == 200
    first = first_page.json()
    assert [w["word"] for w in first["words"]] == ["apple", "banana"]
    assert first["total"] == initial_total + 3

    second_page = client.get("/dictionary/words", params={"page": 1, "page_size": 2})
    assert second_page.status_code == 200
    second = second_page.json()
    assert second["words"][0]["word"] == "cherry"
    assert second["total"] == initial_total + 3

