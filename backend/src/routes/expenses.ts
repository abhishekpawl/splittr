import { Hono } from "hono"
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { z } from "zod"

export const expensesRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>()

const expensesInput = z.object({
  description: z.string(),
  totalAmount: z.number(),
  payerId: z.string(),
  participants: z.array(z.object({
    userId: z.string(),
    amountOwed: z.number()
  }))
})

expensesRouter.post("/", async (c) => {
  const body = await c.req.json()
  const { success } = expensesInput.safeParse(body)

  if(!success) {
    c.status(403)
    return c.json({ error: "Invalid inputs" })
  }

  try {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate())
    const { description, totalAmount, payerId, participants } =  body
    const expense = await prisma.expense.create({
      data: {
        description,
        totalAmount,
        payerId,
        participants: {
          create: participants.map((p: {
            userId: string,
            amountOwed: number
          }) => ({
            userId: p.userId,
            amountOwed: p.amountOwed
          }))
        }
      }
    })
    return c.json(expense)
  } catch (error) {
    c.status(411)
    return c.json({ error: "Something went wrong" })
  }
})