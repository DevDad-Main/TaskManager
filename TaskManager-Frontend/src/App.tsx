import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import { TaskProvider } from "./contexts/TaskContext";

function App() {
  return (
    <TaskProvider>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </TaskProvider>
  );
}

export default App;
