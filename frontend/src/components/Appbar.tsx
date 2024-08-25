import { WalletIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { Avatar } from "./Avatar"
import { useUser } from "../hooks"

export const Appbar = () => {
  const token = localStorage.getItem("token")
  const { loading, user } = useUser()

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

  return <header className="bg-card px-4 py-3 shadow-sm sm:px-6 md:px-8">
  <div className="container mx-auto flex items-center justify-between">
    <Link to="/signup" className="flex items-center gap-2 text-lg font-bold">
      <WalletIcon className="h-6 w-6 text-primary" />
      Splittr
    </Link>
    {token ? <div className="flex items-center gap-4">
      <Link to="/" className="hidden text-sm font-medium text-muted-foreground sm:block">
        Dashboard
      </Link>
      <Link to="/expenses" className="hidden text-sm font-medium text-muted-foreground sm:block">
        Expenses
      </Link>
      <div className="flex flex-col justify-center">
        {/* @ts-ignore */}
        <Avatar name={user.name} />
      </div>
    </div> : <div className="flex items-center gap-4">
      <Link to="/signin" className="text-sm font-medium text-muted-foreground hover:text-primary">
        Login
      </Link>
      <Link
        to="/signup"
        className="inline-flex h-9 items-center justify-center rounded-md bg-black px-4 py-2 text-sm text-white font-medium text-primary-foreground shadow-sm transition-colors hover:bg-slate-900 hover:ring-1 focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none"
      >
        Sign Up
      </Link>
    </div>}
  </div>
</header>
}