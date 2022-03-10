import { PrismaClient } from "@prisma/client";
import  express  from "express";
import cors from 'cors';
import { create } from "ts-node";
import { isTemplateExpression } from "typescript";

const app = express()
app.use(cors())
app.use(express.json())
const PORT = 4000

const prisma = new PrismaClient({ log: ['query', 'error', 'warn', 'info']})

// - A user can order many items
// - An item can be ordered by many people
// - Populate your database with some users and items✅ 
// - Create routes with Express + Prisma to:
// - Get a list of items ✅
// - View an individual item✅
// - View user information✅
// - Place (create) an order
// - Create a new item
// - Update an existing user
// - Cancel (delete) an order

//get all users
app.get('/users',async (req, res) => {
    const allUsers = await prisma.user.findMany({
         include: { orders: true}})
    res.send(allUsers)
})


//get user by email
app.get('/users/:email', async(req, res) =>{
    const email = req.params.email
try{

    const user = await prisma.user.findUnique({
        where: {email: email},
        include: {
            orders:{
                select: {Item: true, quantity: true}
            }
            }
             
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

//create a new user

app.post('/users', async(req, res)=> {
    const {name, email, order = []} = req.body

    try{

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                orders: {
                    connectOrCreate: order.map((order: any)=> ({
                        where: { name: order.name},
                        create: order
                    }))
                }
            },
            include: {
                orders: true
            }
        })
        res.send(newUser)
    }catch(err){
        //@ts-ignore
        res.status(400).send({err: message})
    }
})


//get all orders
app.get('/orders', async(req, res) => {
    const orders = await prisma.order.findMany({ include: {user: true}})
    res.send(orders)
})

//get an item with a specific id
app.get('/items/:id', async(req, res )=> {
    const id = Number(req.params.id)

    try{
const item = await prisma.item.findUnique({
    where: {id},
    include: {orders: true}

})
if(item){
res.send(item)
}else{
    res.status(404).send({error: 'Item not found!'})
}

    }catch(err){
        //@ts-ignore
res.status(400).send(`<pre>${err.message}</pre>`)
    }
})

// app.post('/addItem', async(req, res) => {
//     const {title, image, price } = req.body

//     try{
//         const item = await prisma.item.create({
//            data: {
//                title,
//                image, 
//                price
//            }

//         })


//     }catch(err){

//     }
// })


app.listen(PORT, ()=> { console.log(`Server is running on : http://localhost:${PORT}`)})
