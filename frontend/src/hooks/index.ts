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