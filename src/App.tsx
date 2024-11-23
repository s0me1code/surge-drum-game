import './App.css'
import { Toaster } from "../components/ui/toaster"
import { _toArray } from './utils/_'
import { Dashboard } from './Dashboard'
import { Home } from './Home'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';


function App() {
    return <>
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
            <nav className='absolute bottom-0 right-0 z-20'>
                <Link to={"/"}> Home</Link>
                <Link to={"/dashboard"}>Dashboard</Link>
            </nav>
            <Toaster />
        </Router>
    </>
}

export default App
