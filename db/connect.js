const mongoose = require('mongoose')

const connectDB = async () => {

    try {
        const db = await mongoose.connect(process.env.CONN_STRING, {
          useNewUrlParser:true,
          useUnifiedTopology:true,
          useFindAndModify:false
        })

        console.log("MONGO DB CONNECTED")
        
    } catch (error) {
        console.log("DB ERROR!: ",error)
    }

}

module.exports = connectDB