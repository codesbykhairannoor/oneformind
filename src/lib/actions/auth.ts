"use server"

import { signIn } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"

export async function loginAction(
  prevState: any,
  formData: FormData,
) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Please provide both email and password." }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false, // Prevent standard NextAuth redirect error handling in Server Action
    })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." }
        default:
          return { error: "An error occurred during sign in." }
      }
    }
    throw error // Re-throw NEXT_REDIRECT to allow redirect to work
  }
}

export async function registerAction(
  prevState: any,
  formData: FormData,
) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const passwordConfirmation = formData.get("password_confirmation") as string

  if (!name || !email || !password) {
    return { error: "All fields are required." }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." }
  }

  if (password !== passwordConfirmation) {
    return { error: "Passwords do not match." }
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { error: "Email is already registered." }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })

    // Automatically sign in the user after successful registration
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created, but failed to log in automatically." }
    }
    throw error
  }
}
