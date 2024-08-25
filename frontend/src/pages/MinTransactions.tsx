import { Appbar } from "../components/Appbar"
import { ClipboardPen, ChevronsRight } from "lucide-react"
import { useTransactions } from "../hooks"
import { Avatar } from "../components/Avatar"

export const MinTransactions = () => {
  const { loading, transactions } = useTransactions()

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

  return <div className="flex flex-col h-screen">
    <Appbar />
    <div className="flex-grow bg-slate-200 grid grid-cols-3">
      <div className="col-start-2 bg-white my-40 rounded-xl shadow-xl flex flex-col justify-start h-96">
        <div className="flex flex-row justify-center text-2xl font-bold mt-10 [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">
          <ClipboardPen className="w-10 h-10" />&nbsp;
          <div className="flex flex-col justify-center">
            Simplify balances
          </div>
        </div>
        <div className="flex flex-row justify-center text-slate-400">
          Simplify your balances with the minimum transactions.
        </div>
        <div className="flex flex-col justify-start">
          {
            transactions.map((t) => {
              return <div className="flex flex-row justify-between mt-12">
                <div className="flex flex-row justify-between w-96">
                  <div className="pl-10">
                    <Avatar name={t.from} />{` ${t.from}`}
                  </div>
                  <div className="px-2 ml-auto flex flex-col justify-center">
                    <ChevronsRight className="w-6 h-6" />
                  </div>
                  <div className="px-2 left-0">
                    <Avatar name={t.to} />{` ${t.to}`}
                  </div>
                </div>
                <div className="pl-2 pr-10 text-xl font-semibold">
                  ₹ {t.amount}
                </div>
              </div>
            })
          }
        </div>
      </div>
    </div>
  </div>
}