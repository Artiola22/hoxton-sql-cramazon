import { PrismaClient } from "@prisma/client";
import  express  from "express";
import cors from 'cors';

const app = express()
app.use(cors())
app.use(express.json())
const PORT = 4000

const prisma = new PrismaClient({ log: ['query', 'error', 'warn', 'info']})

app.get('/users',async (req, res) => {
    const allUsers = await prisma.user.findMany({
         include: { orders: true}})
    res.send(allUsers)
})

app.get('/users/:email', async(req, res) =>{
    const email = req.params.email
try{

    const user = await prisma.user.findFirst({
        where: {email: email},
        include: {orders: true}
    })
    if(user){
        res.send(user)
        
    }else{
        res.status(404).send({error: 'User not found!'})
    }
} catch(err){
    //@ts-ignore
res.send(400).send(`<pre>${err.message}</pre>`)
}
})
app.listen(PORT, ()=> { console.log(`Server is running on : http://localhost:${PORT}`)})
