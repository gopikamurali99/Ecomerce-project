const mongoose = require('mongoose');

const express = require('express')
const app = express()
const cors = require('cors')
const authRoutes= require('./Routes/AuthRoute')
const port = 3000

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

main().catch(err => console.log(err));

async function main() {
  try {
    await mongoose.connect('mongodb+srv://gopikamurali8089:VQAvauHQc896XyKq@cluster0.jltk1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}