import { useEffect, useState } from "react";
import type { ClearCandidatesAction, PageAction, SuggestCandidatesAction } from "../api";

type WsMessage =
  | (PageAction & { action_id: 'set_page' })
  | (SuggestCandidatesAction & { action_id: 'suggest_candidates' })
  | (ClearCandidatesAction & { action_id: 'clear_candidates' })
  | { action_id: 'none' };

export function useWebSocket(url: string) {
  const [message, setMessage] = useState<WsMessage>({"action_id":"none"});
  const [connectionState, setConnectionState] = useState("");

  useEffect(() => {
    const socket = new WebSocket(url);
    
    socket.addEventListener("message", (event) => {
      const msg: WsMessage = JSON.parse(event.data);
      setMessage(msg);
      setConnectionState("connected");
    });

    socket.addEventListener("error", (event) => {
      console.log("Error: ", event);
      setConnectionState("connected");
    })

    socket.addEventListener("open", () => {
      console.log("Opened");
    })

    return () => {
      socket.close();
    }
  }, [url])


  return { message, connectionState };
}