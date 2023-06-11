import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./Nav";
import Home from "./Home";
import HowItWorks from "./HowItWorks";
import Footer from "./Footer";

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/howitworks" element={<HowItWorks />}></Route>
        <Route path="*" element={<h1>404 Not Found</h1>}></Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
