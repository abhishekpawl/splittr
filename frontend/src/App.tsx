import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Auth } from "./pages/Auth"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Auth type={"signup"} />} />
        <Route path="/signin" element={<Auth type={"signin"} />} />
      </Routes>
    </BrowserRouter>
  )
}