const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config()
const router = require('./routes/web')
const expressValidator = require('express-validator')
const cors = require('cors')
const connectDB = require('./db/connect')
var exphbs = require('express-handlebars');
// const Auction = require('./app/models/Auction');
const cron = require('node-cron');
// const socketBidding = require('./app/socket/socketBidding');
const appSocket = require('./app/socket/appSocket');
const getAuctionsAndStart = require('./app/cron/getAuctionsAndStart');
const getAuctionsAndStop = require('./app/cron/getAuctionsAndStop');
const getProjectsAndUpdate = require('./app/cron/getProjectsAndUpdate');
const getAgreementsAndSignStatus = require('./app/cron/getAgreementsAndSignStatus');
const getPromotionsAndStart = require('./app/cron/getPromotionsAndStart');
const getPromotionsAndStop = require('./app/cron/getPromotionsAndStop');

const app = express()
const server = require('http').createServer(app)

app.use(cors())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'))
// app.engine('.hbs', exphbs({extname: '.hbs'}));
// app.set('view engine', '.hbs');


const io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
})

// sequelize() 
connectDB()

getAuctionsAndStart(cron)
getAuctionsAndStop(cron)

getPromotionsAndStart(cron)
getPromotionsAndStop(cron)

getProjectsAndUpdate(cron)
getAgreementsAndSignStatus(cron)

let users = []

const addUser = (userId, socketId) => {
    !users.some(user => user.userId == userId) && users.push({ userId, socketId })
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId != socketId)
}

io.on('connection', socket => {
    //Take user ID and Socket ID

    // When a user connect
    socket.on('addUser', (userId) => {
        addUser(userId, socket.id)
        io.emit('getUsers', users)
    })


    const getUser = (userId) => {
        return users.find(user => user.userId == userId)
    }

    socket.on('messageSent', async ({ senderId, receiverId, message }) => {

        const user = getUser(receiverId)

        io.to(user?.socketId).emit('messageReceived', { senderId, message })
        io.emit('updateMessanger', senderId)
    })


    socket.on('userTyping', async ({ senderId, receiverId }) => {

        const user = getUser(receiverId)

        io.to(user?.socketId).emit('userTypingReceived', senderId)

    })

    appSocket(io, socket)

    // When a user disconnect
    socket.on('disconnect', () => {
        removeUser(socket.id)
        io.emit('getUsers', users)
    })


})
// io.on('connection', socket => {

//     console.log('Socket Connection Established: ')

//     socket.on('bidToAuction', async ({ auctionId }) => {

//         console.log("My Bidding: ", auctionId)

//         const auction = await Auction.findById(auctionId)
//             .populate(
//                 [
//                     {
//                         path: 'property',
//                         model: 'Property',
//                     },
//                     {
//                         path: 'developer',
//                         model: 'User',
//                         select: { 'password': 0 },
//                     },
//                     {
//                         path: 'bids',
//                         model: 'Bid',
//                         options: { sort: { 'price': -1 } },
//                         populate: {
//                             path: 'buyer',
//                             model: 'User',
//                             select: { 'password': 0 },
//                         }

//                     },

//                 ]
//             )

//         if (auction) {
//             io.emit('bidToAuction', auction)
//         }


//     })
// })


// app.use(expressValidator())
app.use('/api', router)

const port = process.env.PORT || 3333

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

