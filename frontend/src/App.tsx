import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";

function App() {
  const isLoggedIn = false;

  return (
    <div className="px-4 md:px-8">
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={!isLoggedIn ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/signup"
          element={!isLoggedIn ? <Signup /> : <Navigate to="/" replace />}
        />
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />}
        />
      </Routes>
    </div>
  );
}

export default App;
