
/*
const mongoose = require ('mongoose')

mongoose.connect('mongodb+srv://mobappssolutions181:root123@cluster0.ro8e4sn.mongodb.net/hr_solutions',{
     // mongoose.connect('mongodb://127.0.0.1:27017/hr_solutions', {
        // useNewUrlparser : true ,
        // useUnifiedTopology : true 
})

const db = mongoose.connection

db.on('error', ()=>{
     console.log('error while connecting to momgodb');
})
db.once('open', ()=>{
     console.log('connected to mongodb');
})   */



     const mongoose = require('mongoose');

const dbUrl = process.env.Mongo_DB_URL ;
mongoose.connect(dbUrl, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db;

