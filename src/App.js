import { keepTheme } from './utils/themes';
import { useEffect } from 'react';
import { ModeProvider } from './context/ModeContext';
import { SettingsProvider } from './context/SettingsContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import JudgePage from './components/judge/JudgePage';
import { TimeProvider } from './context/TimeContext';
import Main from './components/main/Main';

function App() {
  useEffect(() => {
    keepTheme();
  })
  return (
    <ModeProvider><SettingsProvider><TimeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/judge" element={<JudgePage />} />
        </Routes>
      </BrowserRouter>
    </TimeProvider></SettingsProvider></ModeProvider>
  );
}

export default App;
