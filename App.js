require('dotenv').config();
const mongoose = require('mongoose');

const express = require('express')
const app = express()
const cors = require('cors')
const authRoutes= require('./Routes/AuthRoute');
const adminRoute=require('./Routes/Admin')
const CustomerRoute=require('./Routes/Customer')
const ProductRoutes= require('./Routes/Product');
const SellerRoute=require('./Routes/seller')
const cartRoute=require('./Routes/cart')
const wishlistRoutes= require('./Routes/Wishlist');
const paymentRoute=require('./Routes/PaymentRoute')
const OrderRoute=require('./Routes/Orders')
const CategoryRoutes= require('./Routes/Categories');

//const userRoute=require('./Routes/user')
const cookieParser = require('cookie-parser');

const port = 3000
const dburl=process.env.DB_URL

app.use(cors());
app.use(cookieParser())
app.use(express.json());

app.use('/auth', authRoutes)
app.use('/admin',adminRoute)
app.use('./customer',CustomerRoute)
app.use('./product',ProductRoutes)
app.use('./seller',SellerRoute)
app.use('./cart',cartRoute)
app.use('./wishlist',wishlistRoutes)
app.use('./payment',paymentRoute)
app.use('./order',OrderRoute)
app.use('./categories',CategoryRoutes)

//app.use('/user',userRoute)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

main().catch(err => console.log(err));

async function main() {
  try {
    await mongoose.connect(process.env.DB_URL, {
      
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}