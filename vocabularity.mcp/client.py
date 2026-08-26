import httpx

from models import PageAction, SuggestCandidatesAction, ClearCandidatesAction, WordDto


class BackendClient:
    def __init__(self, url: str):
        self._url = url.rstrip("/")

    async def suggest_candidates(self, words: list[WordDto]) -> dict:
        for word in words:
            word.id = ""

        async with httpx.AsyncClient() as client:
            request = SuggestCandidatesAction(action_id="suggest_candidates", words=words)
            response = await client.post(
                f"{self._url}/actions/",
                json=request.model_dump()
            )
            response.raise_for_status()
            return response.json()

    async def clear_candidates(self) -> dict:
        async with httpx.AsyncClient() as client:
            request = ClearCandidatesAction(action_id="clear_candidates")
            response = await client.post(
                f"{self._url}/actions/",
                json=request.model_dump()
            )
            response.raise_for_status()
            return response.json()

    async def set_page(self, page_id) -> dict:
        async with httpx.AsyncClient() as client:
            request = PageAction(action_id="set_page", page_id=page_id)
            response = await client.post(
                f"{self._url}/actions/",
                json=request.model_dump()
            )
            response.raise_for_status()
            return response.json()
