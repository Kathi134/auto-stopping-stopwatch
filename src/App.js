import Stopwatch from './components/Stopwatch';
import { keepTheme } from './utils/themes';
import { useEffect } from 'react';
import Header from './components/Header';
import { ModeProvider } from './context/ModeContext';
import { SettingsProvider } from './context/SettingsContext';

function App() {
  useEffect(() => {
    keepTheme();
  })
  return (<ModeProvider><SettingsProvider>
    <Header />
    <Stopwatch />
  </SettingsProvider></ModeProvider>);
}

export default App;
