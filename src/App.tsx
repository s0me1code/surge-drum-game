import './App.css'
import { Toaster } from "../components/ui/toaster"
import { _toArray } from './utils/_'
import { Dashboard } from './Dashboard'
import { Home } from './Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router';


function App() {
    return <>
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
            <Toaster />
        </Router>
    </>
}

export default App
