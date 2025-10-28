import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/global.scss";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/"></Route>
          <Route path="/shop"></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
