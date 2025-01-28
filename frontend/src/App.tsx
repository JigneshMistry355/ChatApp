import { BrowserRouter, Routes, Route } from "react-router-dom"
import Screen from "./Chatscreen/screen"
import Login from "./Login/Login"
import RegisterUser from "./Registration/register"

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          
          <Route path="/screen" element={<Screen />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<RegisterUser />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
