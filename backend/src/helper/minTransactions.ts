import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export const minTransactions = async ({ DATABASE_URL }: { DATABASE_URL: string }) => {
  const prisma = new PrismaClient({ datasourceUrl: DATABASE_URL }).$extends(withAccelerate())
  // net balance for each user from unsettled expenses
  const unsettledParticipants = await prisma.expenseParticipant.findMany({
    where: {
      settled: false
    },
    include: {
      user: true,
      expense: true
    }
  })
  const balances: {
    [userId: string]: number
  } = {}
  unsettledParticipants.forEach((participant) => {
    const { userId, amountOwed, expense } = participant
    const payerId = expense.payerId
    // for participant
    if(!balances[userId]) balances[userId] = 0
    balances[userId] -= amountOwed
    // for payer
    if(!balances[payerId]) balances[payerId] = 0
    balances[payerId] += amountOwed
  })
  // greedy algorithm to find minimum transactions
  const debts = Object.entries(balances)
                  .map(([ userId, balance ]) => ({ userId, balance }))
                  .filter(({ balance }) => balance !== 0)
  const transactions = []
  while(debts.length > 0) {
    // sorting debts by balance
    debts.sort((a, b) => a.balance - b.balance)
    // person who owes the most
    const debtor = debts[0]
    // person who is owed the most
    const creditor = debts[debts.length - 1]
    const amount = Math.min(-debtor.balance, creditor.balance);
    const debtorUser = await prisma.user.findUnique({
      where: {
        id: debtor.userId
      }
    })
    const creditorUser = await prisma.user.findUnique({
      where: {
        id: creditor.userId
      }
    })
    transactions.push({
      from: debtorUser?.name,
      to: creditorUser?.name,
      amount
    })
    debtor.balance += amount
    creditor.balance -= amount
    if(debtor.balance === 0) debts.shift()
    if(creditor.balance === 0) debts.pop()
  }
  return transactions
}