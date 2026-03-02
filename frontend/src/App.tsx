import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./login/page";
import RegisterPage from "./register/page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirige la raíz a /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
