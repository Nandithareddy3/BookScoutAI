import React from 'react'
import { Outlet } from 'react-router-dom';
import Header from './components/Header.jsx';
function App() {
  return (
    <div className="min-h-screen w-full bg-zinc-900 text-white">
  <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
export default App;
