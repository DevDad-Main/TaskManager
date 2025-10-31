import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import { TaskProvider } from "./contexts/TaskContext";

function App() {
  return (
    <TaskProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </TaskProvider>
  );
}

export default App;
