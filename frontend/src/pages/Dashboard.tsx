import { useEffect } from "react"
import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { CreateExpense } from "../components/CreateExpense"
import { useNavigate } from "react-router-dom"

export const Dashboard = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if(!localStorage.getItem("token")) {
      navigate("/signup")
    }
  })

  return <div className="flex flex-col h-screen">
    <Appbar />
    <div className="flex-grow grid grid-cols-2 bg-slate-200">
      <Balance />
      <CreateExpense />
    </div>
  </div>
}