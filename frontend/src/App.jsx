import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Football Analytics Dashboard</h1>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
