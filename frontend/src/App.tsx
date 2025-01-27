import { BrowserRouter, Routes, Route } from "react-router-dom"
import Screen from "./Chatscreen/screen"
import Login from "./Login/Login"

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          
          <Route path="/screen" element={<Screen />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
