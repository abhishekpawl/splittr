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

/* to create a new expense */
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
    const settlePayer = await prisma.expenseParticipant.updateMany({
      where: {
        expenseId: expense.id,
        userId: payerId
      },
      data: {
        settled: true
      }
    })
    return c.json(expense)
  } catch (error) {
    c.status(411)
    return c.json({ error: "Something went wrong" })
  }
})

/* to get all expenses of a user */
expensesRouter.get("/user/:id", async (c) => {
  try {
    const userId = c.req.param("id")
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate())
    const expenses = await prisma.expense.findMany({
      where: {
        participants: {
          some: {
            userId
          }
        }
      },
      include: {
        payer: true,
        participants: {
          include: {
            user: true
          }
        }
      }
    })
    return c.json(expenses)
  } catch (error) {
    c.status(411)
    return c.json({ error: "Something went wrong" })
  }
})

/* get all expenses */
expensesRouter.get("/", async (c) => {
  try {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate())
    const expenses = await prisma.expense.findMany({
      include: {
        payer: true,
        participants: {
          include: {
            user: true
          }
        }
      }
    })
    return c.json(expenses)
  } catch (error) {
    c.status(411)
    return c.json({ error: "Something went wrong" })
  }
})

/* get a specific expense */
expensesRouter.get("/:id", async (c) => {
  try {
    const expenseId = c.req.param("id")
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate())
    const expense = await prisma.expense.findFirst({
      where: {
        id: expenseId
      },
      include: {
        payer: true,
        participants: {
          include: {
            user: true
          }
        }
      }
    })
    if(!expense) {
      c.status(404)
      return c.json({ error: "Expense not found" })
    }
    return c.json(expense)
  } catch (error) {
    c.status(411)
    return c.json({ error: "Something went wrong" })
  }
})

/* to settle expense for a specific participant */
expensesRouter.put("/:expenseId/settle/:userId", async (c) => {
  try {
    const expenseId = c.req.param("expenseId")
    const userId = c.req.param("userId")
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate())
    const participant = await prisma.expenseParticipant.updateMany({
      where: {
        expenseId,
        userId
      },
      data: {
        settled: true
      }
    })
    if(participant.count === 0) {
      c.status(404)
      return c.json({ error: "Expense or User not found" })
    }
    return c.json({
      message: "Participant has settled their share",
      participant
    })
  } catch (error) {
    c.status(411)
    return c.json({ error: "Something went wrong" })
  }
})

/* to settle an expense */
expensesRouter.put("/:expenseId/settle", async (c) => {
  try {
    const expenseId = c.req.param("expenseId")
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate())
    const updateParticipants = await prisma.expenseParticipant.updateMany({
      where: {
        expenseId
      },
      data: {
        settled: true
      }
    })
    return c.json({
      message: "Expense settled for all participants",
      updateParticipants
    })
  } catch (error) {
    c.status(411)
    return c.json({ error: "Something went wrong" })
  }
})