import { useEffect, useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "../config"
import { useNavigate } from "react-router-dom"

export const CreateExpense = () => {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState(0)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [inputs, setInputs] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(`${BACKEND_URL}/api/v1/user/bulk`)
      const fetchedUsers = response.data
      const fetchedUsers2 = response.data
      // @ts-ignore
      setUsers(fetchedUsers.map((user: any) => ({
        id: user.id,
        name: user.name
      })))
      // @ts-ignore
      const initialInputs = fetchedUsers2.reduce((acc, user) => {
        acc[user] = 0
        return acc
      }, {})
      // @ts-ignore
      setInputs({})
      setLoading(false)
    }
    fetchUsers()
  }, [])

  if(loading) {
    return <div role="status" className="m-12 p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700">
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

  /* @ts-ignore */
  const handleChange = (e, user) => {
    /* @ts-ignore */
    setInputs({
      ...inputs,
      [user.id]: Number(e.target.value)
    })
    console.log(inputs)
  }

  const handleSubmit = async () => {
    // @ts-ignore
    const tempUsers = users.filter(user => inputs[user.id])
    const response = await axios.get(`${BACKEND_URL}/api/v1/expenses/currentUser`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    const payerId = response.data.id
    const participants = tempUsers.map(user => ({
      // @ts-ignore
      userId: user.id,
      // @ts-ignore
      amountOwed: inputs[user.id]
    }))
    const reqBody = {
      description,
      totalAmount: amount,
      payerId,
      participants: participants
    }
    await axios.post(`${BACKEND_URL}/api/v1/expenses`, reqBody, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    navigate("/expenses")
  }

  return <div className="bg-white m-20 rounded-xl shadow-xl p-10">
    <div className="flex flex-col justify-start">
      <div className="flex flex-row justify-start font-extrabold text-2xl [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">
        Create Expense
      </div>
      <div className="flex flex-row justify-start text-slate-400">
      Add a new expense and track who owes what.
      </div>
      <div className="flex flex-col mt-8">
        <label className="block mb-2 text-sm font-medium text-gray-900">Description</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Dinner at judo's" required />
      </div>
      <div className="flex flex-col mt-4">
        <label className="block mb-2 text-sm font-medium text-gray-900">Amount</label>
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="1000" min={0} required />
      </div>
      <div className="flex flex-col justify-start">
        {
          users.map((user, index) => (
            <div key={index} className="flex flex-row mt-4">
              <div className="flex flex-col justify-center">
                <label className="text-sm font-medium text-gray-700">
                  {/* @ts-ignore */}
                  {user.name}
                </label>
              </div>
              <input
                type="number"
                min={0}
                /* @ts-ignore */
                value={inputs[user.id]}
                onChange={(e) => handleChange(e, user)}
                className="mx-3 px-3 py-2 border rounded focus:outline-none focus:ring"
              />
            </div>
          ))
        }
        <button type="button" onClick={handleSubmit} className="mt-4 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Create Expense</button>
      </div>
    </div>
  </div>
}