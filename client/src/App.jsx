import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import CarList from './pages/car/CarList';
import CarCreate from './pages/car/CarCreate';
import Home from "./pages/Home";
import Details from "./pages/car/Details";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/cars" element={<CarList />} />
        <Route path="/cars/:carId" element={<Details />} />
        <Route path="/cars/create" element={<CarCreate />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;


