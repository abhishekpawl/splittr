import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { CreateExpense } from "../components/CreateExpense"

export const Dashboard = () => {
  return <div className="flex flex-col h-screen">
    <Appbar />
    <div className="flex-grow grid grid-cols-2 bg-slate-100">
      <Balance />
      <CreateExpense />
    </div>
  </div>
}