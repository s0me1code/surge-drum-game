import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useHelper } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import './App.css'
import { useCoord } from './state/coordinates.state'
import Gauges from './components/gauges/_gauge'
import { _toArray } from './utils/_'
// import { LevaCoord } from './state/cootdinates.leva'
import { Ground } from './components/ground'
import { Model } from './components/Model'
import { Perf } from 'r3f-perf'
import { Overlay } from './components/overlay/Overlay'
import { Dashboard } from './Dashboard'
import { Experinace } from './Experiance'

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
        {route == "/" &&
            <Experinace />
        }
        {route == "/dashboard" &&
            <Dashboard />
        }
    </>
}

export default App
