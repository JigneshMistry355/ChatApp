import { BrowserRouter, Routes, Route } from "react-router-dom"
import Screen from "./Chatscreen/screen"
import Login from "./Login/Login"
import RegisterUser from "./Registration/register"
import Home from "./Home/Home"

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/screen" element={<Screen />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
