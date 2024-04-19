import Stopwatch from './Stopwatch';
import { keepTheme } from './themes';
import { useEffect } from 'react';
import Header from './Header';
import { ModeProvider } from './ModeContext';
import { SettingsProvider } from './SettingsContext';

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
