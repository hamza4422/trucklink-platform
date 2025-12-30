import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Trucks from "./pages/Trucks";
import Registration from "./pages/Registration";
import DriverDashboard from "./pages/DriverDashboard";
import Footer from "./components/Footer";
import Weather from "./pages/Weather";
import CreateOrder from "./pages/CreateOrder";
import PendingOrders from "./pages/PendingOrders";
import ReadyOrders from "./pages/ReadyOrders";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/TruckLink" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/trucks" element={<Trucks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/dashboard" element={<DriverDashboard />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/create-order/:driverId" element={<CreateOrder />} />
          <Route path="/pending-orders" element={<PendingOrders />} />
          <Route path="/ready-orders" element={<ReadyOrders />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
