const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config()
const router = require('./routes/web')
const expressValidator = require('express-validator')
const cors = require('cors')
const connectDB = require('./db/connect')
const getAuctionsAndUpdate = require('./app/cron/getAuctionsAndUpdate')

// const sequelize = require('./db/sequelize')


const app = express()

// sequelize() 
connectDB()

app.use(cors())
app.use(express.json({ limit:'50mb' }));
app.use(express.urlencoded({ limit:'50mb', extended: true }));

getAuctionsAndUpdate()



// app.use(expressValidator())
app.use('/api',router)

const port = process.env.PORT || 3333

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

