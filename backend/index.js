// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config();


// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
var db= "mongodb+srv://ashish:jpayotei@cluster0.qqvtkdk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

    
// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', require('./routes/auth'));

app.use('/api/seller', require('./routes/seller'));

app.use('/api/products', require('./routes/products'));

app.use('/api/orders', require('./routes/orders'));

app.use('/api/notifications', require('./routes/notifications'));



// Start the server
const PORT = 8000; 
// process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
