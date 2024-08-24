import { useUserBalanceAndTransactions } from "../hooks"

export const Balance = () => {
  const { loading, balance, expenses } = useUserBalanceAndTransactions()

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

  return <div className="bg-white m-20 rounded-xl shadow-xl p-10">
    <div className="flex flex-col justify-start">
      <div className="flex flex-row justify-start font-extrabold text-2xl [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">
        Dashboard
      </div>
      <div className="flex flex-row justify-start text-slate-400">
        View your current balances and recent transactions.
      </div>
      <div className="flex flex-row justify-between mt-10">
        <div>
          Amount owed to you
        </div>
        <div className="text-green-500 font-semibold text-lg">
          ₹ {balance?.amountLent}
        </div>
      </div>
      <div className="flex flex-row justify-between mt-10 border-b pb-10">
        <div>
          Amount you owe
        </div>
        <div className="text-red-500 font-semibold text-lg">
          ₹ {balance?.amountOwed}
        </div>
      </div>
      <div className="mt-5 text-lg font-medium">
        Your transactions
      </div>
      <div className="flex flex-col justify-start">
        {
          expenses.map(expense => {
            return <div key={expense.id} className="flex flex-row justify-between mt-4">
              <div className="text-slate-700">
                {expense.description}
              </div>
              <div className="text-slate-600">
                ₹ {expense.totalAmount}
              </div>
            </div>
          })
        }
      </div>
    </div>
  </div>
}