import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Payment from './pages/Payment.jsx';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/payment" element={<Payment />} />
            </Routes>
        </Router>
    );
}

export default App;