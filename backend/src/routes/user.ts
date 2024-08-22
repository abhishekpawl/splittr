import { Hono } from "hono"
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { z } from "zod"
import { sign } from "hono/jwt"

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>()

const signupInput = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6)
})

const signinInput = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

userRouter.post("/signup", async (c) => {
  const body = await c.req.json()
  const { success } = signupInput.safeParse(body)

  if(!success) {
    c.status(411)
    return c.json({ error: "Invalid inputs" })
  }

  try {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate())
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password
      }
    })
    const jwt = await sign({
      id: user.id
    }, c.env.JWT_SECRET)
    return c.json({ data: {
      ...user,
      jwt: jwt
    } })
  } catch (error) {
    c.status(411)
    return c.json({ error: "Could not create user" })
  }
})

userRouter.post("/signin", async (c) => {
  const body = await c.req.json()
  const { success } = signinInput.safeParse(body)

  if(!success) {
    c.status(403)
    return c.json({ error: "Invalid inputs" })
  }

  try {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate())
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
        password: body.password
      }
    })
    if(!user) {
      c.status(401)
      return c.json({ error: "Invalid credentials" })
    }
    const jwt = await sign({
      id: user.id
    }, c.env.JWT_SECRET)
    return c.json({
      ...user,
      jwt: jwt
    })
  } catch (error) {
    c.status(411)
    return c.json({ error: "Something went wrong" })
  }
})