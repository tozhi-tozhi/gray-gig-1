import { useGame } from './app/store';
import { PhoneFrame } from './ui/PhoneFrame';
import { BootScreen } from './screens/BootScreen';
import { HomeScreen } from './screens/HomeScreen';
import { GigBoardScreen } from './screens/GigBoardScreen';
import { GigDetailScreen } from './screens/GigDetailScreen';
import { ActiveGigScreen } from './screens/ActiveGigScreen';
import { EndOfDayScreen } from './screens/EndOfDayScreen';
import { GameOverScreen } from './screens/GameOverScreen';

export function App() {
  const screen = useGame(s => s.screen);
  return (
    <PhoneFrame>
      {screen === 'boot'      && <BootScreen />}
      {screen === 'home'      && <HomeScreen />}
      {screen === 'gigBoard'  && <GigBoardScreen />}
      {screen === 'gigDetail' && <GigDetailScreen />}
      {screen === 'activeGig' && <ActiveGigScreen />}
      {screen === 'endOfDay'  && <EndOfDayScreen />}
      {(screen === 'gameOver' || screen === 'gameWin') && <GameOverScreen />}
    </PhoneFrame>
  );
}