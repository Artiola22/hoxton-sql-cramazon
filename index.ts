import { PrismaClient } from "@prisma/client";
import  express  from "express";
import cors from 'cors';

const app = express()
app.use(cors())
app.use(express.json())


const prisma = new PrismaClient({ log: ['query', 'error', 'warn', 'info']})

app.listen(4000, ()=> { console.log('Server is running on : http://localhost:4000')})
