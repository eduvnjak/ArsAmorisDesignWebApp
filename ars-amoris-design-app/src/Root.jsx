import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
//import './Root.css';
import { Link, Outlet } from 'react-router-dom';
import NavigationMenu from './components/NavigationMenu';
import AuthenticationMenu from './components/AuthenticationMenu';

function Root() {
	//provjeri login
	return (
		<>
			<div className='flex justify-between bg-gradient-to-r from-red-800 to-red-900 overflow-auto'>
				<NavigationMenu />
				<AuthenticationMenu />
			</div>
			<Outlet />
		</>
	);
}
/* function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
} */

export default Root;
