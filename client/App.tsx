import { createRoot } from 'react-dom/client';

const App = (): JSX.Element => {
  return (
    <div>
      <h1>Blackjack</h1>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);