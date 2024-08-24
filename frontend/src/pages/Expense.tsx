import { useNavigate, useParams } from "react-router-dom"
import { Appbar } from "../components/Appbar"
import { useExpense } from "../hooks"
import { ScrollText } from "lucide-react"
import { Avatar } from "../components/Avatar"
import axios from "axios"
import { BACKEND_URL } from "../config"

export const Expense = () => {
  const { expenseId } = useParams()
  const { loading, expense } = useExpense(expenseId || "")
  const navigate = useNavigate()
  console.log(expense)
  if(loading) {
    return <div role="status" className="p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700">
      <div className="flex items-center justify-between">
          <div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  }

  const settleHandler = ({ expenseId, userId }: { expenseId: string, userId: string }) => {
    axios.put(`${BACKEND_URL}/api/v1/expenses/${expenseId}/settle/${userId}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((response) => {
        console.log(response)
        navigate(`/expenses`)
      })
  }

  return <div className="flex flex-col h-screen">
    <Appbar />
    <div className="flex-grow grid grid-cols-3 bg-slate-100">
      <div className="my-10 min-w-96 col-start-2 flex justify-start bg-white p-5 rounded-lg shadow-lg">
        <div className="flex flex-col justify-start w-full">
          <div className="text-2xl font-bold flex flex-row justify-start [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)] mb-4">
            <ScrollText className="h-10 w-10 text-primary" />&nbsp;{expense?.description}
          </div>
          <div className="flex flex-row justify-start mb-4">
            <p className="text-lg font-bold">Total amount:&nbsp;</p>
            <p className="text-xl">{ expense?.totalAmount }</p>
          </div>
          <div className="flex flex-row justify-start mb-4">
            <p className="text-lg font-bold">Paid by:&nbsp;</p>
            <p className="text-xl">{ expense?.payer.name }</p>
          </div>
          <div className="flex flex-row justify-start mb-4">
            <p className="text-lg font-bold">Created at:&nbsp;</p>
            <p className="text-xl">{`${new Date(expense?.createdAt || "").getDate()}-${new Date(expense?.createdAt || "").getMonth()}-${new Date(expense?.createdAt || "").getFullYear()}  ${new Date(expense?.createdAt || "").getHours()}:${new Date(expense?.createdAt || "").getMinutes()}`}</p>
          </div>
          <div className="flex flex-col justify-start">
            <div className="flex flex-row justify-start">
              <p className="text-lg font-bold">Participants:</p>
            </div>
            {
              expense?.participants.map((participant) => {
                let expenseId = participant.expenseId
                let userId = participant.userId
                return (
                  <div key={participant.id} className="flex flex-row justify-between px-2 py-5 border-b-2">
                    <div className="flex flex-col justify-center">
                      <div className="flex flex-row justify-start">
                        <Avatar name={participant.user.name} />&nbsp;&nbsp;
                      {participant.user.name}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="flex flex-row justify-end">
                        <div className="flex flex-col justify-center">
                          <p className="text-lg">₹ {participant.amountOwed}&nbsp;</p>
                        </div>
                        {
                          participant.settled === false ? <div className="flex flex-col justify-center">
                            <button type="button" onClick={() => settleHandler({ expenseId, userId })} className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-2 py-2 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Settle</button>
                          </div> : null
                        }
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  </div>
}