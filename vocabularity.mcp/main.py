import os
from pathlib import Path

from dotenv import load_dotenv
from fastmcp import FastMCP
from fastapi import FastAPI
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
import uvicorn

from client import BackendClient
from models import WordDto

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

_backend_host = os.getenv("BACKEND_HOST", "127.0.0.1")
_backend_port = os.getenv("BACKEND_PORT", "8000")

BACKEND_URL = f"http://{_backend_host}:{_backend_port}"

mcp = FastMCP(name="Vocabularity MCP")
backend = BackendClient(BACKEND_URL)


@mcp.tool
async def suggest_vocabulary_candidates(words: list[WordDto]) -> dict:
    """Suggests vocabulary candidate words that the user can add to their study list or reject if they already know them."""
    return await backend.suggest_candidates(words)

@mcp.tool
async def clear_vocabulary_candidates() -> dict:
    """Clears the suggested candidate words."""
    return await backend.clear_candidates()

@mcp.tool
async def set_page(page_id: str) -> dict:
    """Opens the requested page in the frontend. `page_id` is `dictionary` for the word dictionary or `candidates` for the candidate words the MCP server works with; content sent by the agent is shown on that page."""
    return await backend.set_page(page_id)

app = mcp.http_app()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["mcp-session-id"],
)

if __name__ == "__main__":
    host = os.getenv("MCP_HOST", "127.0.0.1")
    port = int(os.getenv("MCP_PORT", "9000"))
    uvicorn.run(app, host=host, port=port)
