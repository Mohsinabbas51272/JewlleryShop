import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./assets/components/WecomeScreen";
import Register from "./assets/components/Register";
import SignUp from "./assets/components/SignUp";
import Login from "./assets/components/Login";
import ProductDetail from "./assets/components/ProductDetail";
import Dashboard from "./assets/components/Dashboard";
import CartPage from "./assets/components/CartPage";
import OrderPlaced from "./assets/components/OrderPlaced";
import AdminDashboard from "./assets/components/AdminDashboard";
//import AdminProductDetails from "./assets/components/AdminProductDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/logIn" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
<Route path="/product/:id" element={<ProductDetail />} />
<Route path="/cart" element={<CartPage />} />
        <Route path="/order-placed" element={<OrderPlaced />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
