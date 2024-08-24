import { WalletIcon } from "lucide-react"
import { Link } from "react-router-dom"

export const Appbar = () => {
  return <header className="bg-card px-4 py-3 shadow-sm sm:px-6 md:px-8">
  <div className="container mx-auto flex items-center justify-between">
    <Link to="/signup" className="flex items-center gap-2 text-lg font-bold">
      <WalletIcon className="h-6 w-6 text-primary" />
      Splittr
    </Link>
    <div className="flex items-center gap-4">
      <Link to="/signin" className="text-sm font-medium text-muted-foreground hover:text-primary">
        Login
      </Link>
      <Link
        to="/signup"
        className="inline-flex h-9 items-center justify-center rounded-md bg-black px-4 py-2 text-sm text-white font-medium text-primary-foreground shadow-sm transition-colors hover:bg-slate-900 hover:ring-1 focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none"
      >
        Sign Up
      </Link>
    </div>
  </div>
</header>
}