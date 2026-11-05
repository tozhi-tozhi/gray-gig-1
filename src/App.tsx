import { useGame } from './app/store';
import { PhoneFrame } from './ui/PhoneFrame';
import { ScreenMotion } from './ui/ScreenMotion';
import { BootScreen } from './screens/BootScreen';
import { HomeScreen } from './screens/HomeScreen';
import { GigBoardScreen } from './screens/GigBoardScreen';
import { GigDetailScreen } from './screens/GigDetailScreen';
import { GigCutsceneScreen } from './screens/GigCutsceneScreen';
import { ActiveGigScreen } from './screens/ActiveGigScreen';
import { EndOfDayScreen } from './screens/EndOfDayScreen';
import { GameOverScreen } from './screens/GameOverScreen';
import { EventScreen } from './screens/EventScreen';

export function App() {
  const screen = useGame(s => s.screen);

  return (
    <PhoneFrame>
      <ScreenMotion key={screen}>
        {screen === 'boot'         && <BootScreen />}
        {screen === 'home'         && <HomeScreen />}
        {screen === 'gigBoard'     && <GigBoardScreen />}
        {screen === 'gigDetail'    && <GigDetailScreen />}
        {screen === 'gigCutscene'  && <GigCutsceneScreen />}
        {screen === 'activeGig'    && <ActiveGigScreen />}
        {screen === 'endOfDay'     && <EndOfDayScreen />}
        {screen === 'event'        && <EventScreen />}
        {(screen === 'gameOver' || screen === 'gameWin') && <GameOverScreen />}
      </ScreenMotion>
    </PhoneFrame>
  );
}