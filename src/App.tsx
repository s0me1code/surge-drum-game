import './App.css'
import { Toaster } from "../components/ui/toaster"
import { _toArray } from './utils/_'
import { Dashboard } from './Dashboard'
import { Home } from './Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router';


function App() {
    return <>
        <Router>
            <div className='w-screen h-screen overflow-hidden absolute'>
                <div className='my-bg absolute h-screen w-screen scale-125' />
            </div>
            <Noise />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
            <Toaster />
        </Router>
    </>
}
const Noise = () => {
    return <div className="absolute h-screen w-screen overflow-hidden">
        < div className="noise" />
    </div >
}
export default App
