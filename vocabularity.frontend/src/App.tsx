import styles from './App.module.css'
import Navbar from './components/Navbar'
import { Route, Routes, useNavigate } from 'react-router'
import CandidatesPage from './pages/CandidatesPage'
import DictionaryPage from './pages/DictionaryPage'
import StatusPopup from './Popups/StatusPopup'
import AddToDictionaryPopup from './Popups/AddToDictionaryPopup'
import { useWebSocket } from './hooks/useWebSocket'
import { useEffect } from 'react'
import { useWordStore } from './stores/wordsStore'

const ActionId = {
  SetPage: 'set_page',
  SuggestCandidates: 'suggest_candidates',
  ClearCandidates: 'clear_candidates',
} as const;

function App() {
  const navigate = useNavigate();
  const wsUrl = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`;
  const { message } = useWebSocket(wsUrl);

  useEffect(() => {
    console.log(message);
    switch (message.action_id)
    {
      case ActionId.SetPage:
        navigate(`/${message.page_id}`);
        break;

      case ActionId.SuggestCandidates:
        useWordStore.getState().suggestCandidates(message.words);
        break;

      case ActionId.ClearCandidates:
        useWordStore.getState().clearCandidates();
        break;
    }
  }, [message])


  return (
    <div className={styles.page}>
      <Navbar/>
      <Routes>
        <Route path="candidates" element={<CandidatesPage />}></Route>
        <Route path="dictionary" element={<DictionaryPage />}></Route>
      </Routes>
      <StatusPopup />
      <AddToDictionaryPopup />
    </div>
  )
}

export default App
