import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import TTS from "./pages/TTS";
import { useState } from "react";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogin = (t) => {
    localStorage.setItem("token", t);
    setToken(t);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/tts"
          element={token ? <TTS token={token} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}
