require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRouter = require('./routes/UserRouter');
const productRouter = require('./routes/ProductRouter');
const stockRouter = require('./routes/StockRouter');
const reportRouter = require('./routes/ReportRouter');
const exportRouter = require('./routes/ExportRouter');

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;


// 🔐 Security Middleware
app.use(helmet());


// 🚦 Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);


// 🔥 CORS FIX (VERY IMPORTANT)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://inventory-management-beta-ashy.vercel.app",
    "https://inventory-management-git-main-nishank-mukhijas-projects.vercel.app"
  ],
  credentials: true
}));


// 📦 Body Parser
app.use(express.json());


// 🔗 Root Route (optional but useful)
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});


// 🗄️ Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));


// 📡 Routes
app.use('/api/auth', userRouter);
app.use('/api/products', productRouter);
app.use('/api/stock', stockRouter);
app.use('/api/reports', reportRouter);
app.use('/api/export', exportRouter);


// ❌ Global Error Handler
const globalErrorHandler = require('./middlewares/GlobalErrorHandler');
app.use(globalErrorHandler);