import { createRoot } from 'react-dom/client';
import Board from './Components/Board';

const App = (): JSX.Element => {
  return (
    <div>
      <h1>Blackjack</h1>
      <Board />
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);