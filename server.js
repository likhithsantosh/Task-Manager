require('dotenv').config(); // Needed here if you're using PORT from .env

const express = require('express');

const path = require('path');

const taskroutes = require('./routes/taskroutes');
const userroutes = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
connectDB();

app.get('/html/home.html', (req, res)=>{
  res.sendFile(path.join(__dirname, 'public' , 'html', 'home.html'));
})
app.get('/yourtasks', (req, res)=>{
  res.sendFile(path.join(__dirname, 'public','html', 'yourtasks.html'));
})
app.use('/api',taskroutes);
app.use('/api',userroutes);


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
