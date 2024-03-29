import NextAuth from "next-auth"
import CreadentialsProvider from 'next-auth/providers/credentials'
import bcrypt from "bcryptjs";
import { prisma } from "@/libs/prisma";

const handler = NextAuth({
    providers: [
        CreadentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Correo", type: "email", placeholder: "Correo" },
                password: { label: "Contraseña", type: "password" }
            },
            async authorize(credentials, req) {
                const user = await prisma.users.findFirst({ where: { email: credentials.email } })
                if (!user) throw new Error('Datos de ingreso incorrectos')
                
                const passwordMatch = await bcrypt.compare(credentials.password, user.password)
                if (!passwordMatch) throw new Error('Datos de ingreso incorrectos')

                return {
                    id: user.id,
                    name: user.name,
                    lastname: user.lastname,
                    email: user.email
                }
            }
        })
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) token.user = user
            return token
        },
        session({ session, token }) {
            session.user = token.user
            return session
        }
    },
    pages: {
        signIn: '/signin',
        signOut: '/logout'
    }
})

module.exports = {
    GET: handler,
    POST: handler,
};