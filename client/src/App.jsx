import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Singup";
import Login from "./pages/Login";
import Products from "./pages/Products";
import BuyPage from "./pages/BuyPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/singup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/buy/:id"
          element={
            <ProtectedRoute>
              <BuyPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
