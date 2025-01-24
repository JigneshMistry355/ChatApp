import { BrowserRouter, Routes, Route } from "react-router-dom"
import Screen from "./Chatscreen/screen"

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/screen" element={<Screen />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
