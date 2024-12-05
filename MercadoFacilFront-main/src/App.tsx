import { styled } from "@mui/system";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./Paginas/Home/Home";
import Login from "./Componentes/Login/Login";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home/>}/>
        <Route path="/" element={<Login/>}/>
      </Routes>
    </Router>
  );
}