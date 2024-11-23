import { useEffect, useState } from 'react'
import './App.css'
import { Toaster } from "../components/ui/toaster"
import { _toArray } from './utils/_'
import { Dashboard } from './Dashboard'
import { Home } from './Home'

function App() {
    const [route, setRoute] = useState(window.location.pathname);

    useEffect(() => {
        const handlePopState = () => setRoute(window.location.pathname);
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    const navigate = (path: string) => {
        window.history.pushState({}, "", path); // Update the URL
        setRoute(path); // Update the route state
    };

    return <>
        <nav className='absolute bottom-0 right-0 z-20'>
            <button onClick={() => navigate("/")}>Home</button>
            <button onClick={() => navigate("/dashboard")}>About</button>
        </nav>
        <Toaster />
        {route == "/" &&
            <Home />
        }
        {route == "/dashboard" &&
            <Dashboard />
        }
    </>
}

export default App
