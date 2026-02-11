import Dashboard from "./components/Dashboard";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Dashboard />
    </>
  );
}

export default App;
