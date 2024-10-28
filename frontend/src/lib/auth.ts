import prisma from "@/db"
import CredentialsProvider from "next-auth/providers/credentials"
import z from "zod"
import bcrypt from "bcrypt"

const Inputs = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Email" },
                password: { label: "Password", type: "password", placeholder: "password" }
            },
            async authorize(credentials) {
                if (!credentials) {
                    return null
                }

                try {
                    const result = Inputs.safeParse({
                        email: credentials.username,
                        password: credentials.password
                    })

                    if (!result.success) {
                        return null
                    }

                    const user = await prisma.user.findFirst({
                        where: { email: credentials.username }
                    });
                    if (user) {
                        if (await bcrypt.compare(credentials.password, user.password)) {
                            return {
                                id: user.id.toString(),
                                email: user.email,
                                image: user.id.toString()
                            }
                        } else {
                            return null
                        }

                    }
                    const hashedPassword = await bcrypt.hash(credentials.password, 10)
                    const newUser = await prisma.user.create({
                        data: {
                            email: credentials.username,
                            password: hashedPassword
                        }
                    });

                    return {
                        id: newUser.id.toString(),
                        email: newUser.email,
                        image: newUser.id.toString()
                    }
                } catch (e) {
                    console.error(e)
                }
                return null
            }
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
}