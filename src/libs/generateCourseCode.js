import { prisma } from "./prisma"

export default async function generateCourseCode() {
    const characters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

    const codeLenght = 4

    while (true) {
        let code = ''

        for (let i = 0; i < codeLenght; i++) {
            let characterIndex = Math.floor(Math.random() * characters.length)
            code += characters[characterIndex]
        }
        
        const found = await prisma.courses.findFirst({
            where: { code }
        })

        if (found === null) return code
    }    
}