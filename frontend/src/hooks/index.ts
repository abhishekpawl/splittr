import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface Participant {
  id: string;
  userId: string;
  expenseId: string;
  amountOwed: number;
  settled: boolean;
  user: User;
}

export interface Expense {
  id: string;
  description: string;
  totalAmount: number;
  payerId: string;
  createdAt: string;
  payer: User;
  participants: Participant[];
}

export const useExpenses = () => {
  const [loading, setLoading] = useState(true)
  const [expenses, setExpenses] = useState<Expense[]>([])
  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/v1/expenses`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((response) => {
        setExpenses(response.data)
        setLoading(false)
      })
  }, [])
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  return {
    loading,
    sortedExpenses
  }
}

export const useExpense = (expenseId: string) => {
  const [loading, setLoading] = useState(true)
  const [expense, setExpense] = useState<Expense>()
  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/v1/expenses/${expenseId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((response) => {
        setExpense(response.data)
        setLoading(false)
      })
  }, [])
  return {
    loading,
    expense
  }
}
export interface Balance {
  balance: number,
  amountLent: number,
  amountOwed: number
}

export const useUserBalanceAndTransactions = () => {
  const token = localStorage.getItem("token")
  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState<Balance>()
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/v1/expenses/balance`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        console.log(response.data)
        setBalance(response.data)
      })
      .then(() => {
        axios.get(`${BACKEND_URL}/api/v1/expenses/user/allExpenses`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then((response) => {
            setExpenses(response.data)
            setLoading(false)
          })
      })
  }, [])
  return {
    loading,
    balance,
    expenses
  }
}

export const useUser = () => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState({})

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/v1/expenses/currentUser`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((response) => {
        setUser(response.data)
        setLoading(false)
      })
  })

  return {
    loading,
    user
  }
}

export interface Transaction {
  from: string,
  to: string,
  amount: number
}

export const useTransactions = () => {
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/v1/expenses/settle/minTransactions`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((response) => {
        setTransactions(response.data)
        setLoading(false)
      })
  })

  return {
    loading,
    transactions
  }
}