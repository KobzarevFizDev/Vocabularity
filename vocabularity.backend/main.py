import asyncio
import json
import os
from pathlib import Path
from typing import Union

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi import WebSocket, WebSocketException

from fastapi.websockets import WebSocketState
from sqlalchemy import create_engine
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from models.domain.domain_models import Level
from models.domain.domain_models import Word
from models.dto.generic_dto import *
from models.dto.action_dto import WsMessage
from interactors.add_words import AddWordsInteractor
from interactors.delete_words import DeleteWordsInteractor
from interactors.list_words import ListWordsInteractor

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _sqlalchemy_url() -> str:
    host = os.getenv("DB_HOST", "127.0.0.1")
    port = os.getenv("DB_PORT", "5000")
    name = os.getenv("DB_NAME", "vocabularity")
    user = os.getenv("DB_USER", "vocabularity")
    password = os.getenv("DB_PASSWORD", "1234567890")
    return f"postgresql://{user}:{password}@{host}:{port}/{name}"


engine = create_engine(_sqlalchemy_url())

ws_client: WebSocket | None = None

@app.post("/actions/", response_model=ActionResponse, tags=["actions"])
async def action(body: WsMessage):
    global ws_client
    if ws_client is None:
        return ActionResponse(error="No client connected", status=400)

    if ws_client.client_state == WebSocketState.DISCONNECTED:
        ws_client = None
        return ActionResponse(error="ws is closed", status=400)

    await ws_client.send_text(json.dumps(body.model_dump(mode="json")))
    return ActionResponse(error="", status=200)

@app.post("/dictionary/words", response_model=AddWordsResponse, tags=["dictionary"])
def add_words_to_dictionary(items: list[WordDto]):
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
    with Session(engine) as session:
        try:
            interactor = AddWordsInteractor(session)
            interactor.execute(words)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except IntegrityError:
            session.rollback()
            raise HTTPException(status_code=400, detail="Word with this text already exists")
    return AddWordsResponse(added=len(items), total=len(items))


@app.delete("/dictionary/words", response_model=DeleteWordsResponse, tags=["dictionary"])
def delete_words_from_dictionary(ids: list[str]):
    with Session(engine) as session:
        interactor = DeleteWordsInteractor(session)
        interactor.execute(ids)
    return DeleteWordsResponse(deleted=len(ids))


@app.get("/dictionary/words", response_model=WordListResponse, tags=["dictionary"])
def get_words(
    page: int = 0,
    page_size: int = 20,
    include_translate: bool = True,
    include_transcription: bool = True,
    include_examples: bool = True,
    ids: list[str] | None = None,
):
    with Session(engine) as session:
        interactor = ListWordsInteractor(session)
        items, total = interactor.execute(
            page, page_size,
            ids=ids,
        )
    words = [
        WordDto(
            id=str(w.id),
            word=w.word,
            translation=w.translation if include_translate else "",
            transcription=w.transcription if include_transcription else "",
            examples=w.examples if include_examples else [],
            context_sentence=w.context_sentence,
            level=w.level.value,
        )
        for _, w in items
    ]
    return WordListResponse(words=words, total=total, page=page, page_size=page_size)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    global ws_client
    await websocket.accept()
    ws_client = websocket
    try:
        while True:
            await asyncio.sleep(1)
    finally:
        ws_client = None


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("BACKEND_HOST", "127.0.0.1")
    port = int(os.getenv("BACKEND_PORT", "8000"))
    print(host)
    uvicorn.run(app, host=host, port=port)
