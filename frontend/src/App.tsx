import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import RootLayout from "./layouts/root";
import AdminLayout from "./layouts/admin";
import AddProblem from "./pages/add-problem";
import ProtectedLayout from "./layouts/protected";
import AuthLayout from "./layouts/auth";

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />]
        </Route>
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Home />} />
          <Route element={<AdminLayout />}>
            <Route path="/add-problem" element=<AddProblem /> />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
