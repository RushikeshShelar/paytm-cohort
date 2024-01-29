import { 
  BrowserRouter, 
  Route, 
  Routes
} from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import SendMoney from "./pages/SendMoney";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />}/>
          <Route path="/signin" element={<SignIn />}/>
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route path="/send" element={<SendMoney />}/>
        </Routes>
      </BrowserRouter>
      <ToastContainer autoClose={2000} />
    </>
  )
}

export default App;
