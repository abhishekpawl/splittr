import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Auth } from "./pages/Auth"
import { Expenses } from "./pages/Expenses"
import { Expense } from "./pages/Expense"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Auth type={"signup"} />} />
        <Route path="/signin" element={<Auth type={"signin"} />} />
        <Route path="/expenses/:expenseId" element={<Expense />} />
        <Route path="/expenses" element={<Expenses />} />
      </Routes>
    </BrowserRouter>
  )
}