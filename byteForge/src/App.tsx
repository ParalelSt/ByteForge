import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "@/styles/globalStyles.scss";
import Home from "@/pages/Home";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/shop"></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
