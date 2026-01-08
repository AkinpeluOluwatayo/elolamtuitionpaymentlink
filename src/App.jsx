import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Payment from './pages/Payment.jsx';
import Success from './pages/Paymentsuccess.jsx';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Payment />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/payment-success" element={<Success />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;