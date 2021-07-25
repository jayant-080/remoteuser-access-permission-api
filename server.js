const express= require('express');
const app = express();
const PORT= process.env.PORT || 3000;
const {DB_URI} = require('./keys')
const mongoose = require('mongoose');
const fileupload = require('express-fileupload');


app.use(fileupload({
    useTempFiles:true
}));




app.use(express.json());
require('./models/user');
require('./models/feed');
const router = require('./routes/auth');
app.use(router);
const routerfeed = require('./routes/feed');
app.use(routerfeed);

mongoose.connect(DB_URI,{
    useNewUrlParser:true,
    useFindAndModify:true,
    useUnifiedTopology:true
});


mongoose.connection.on('connected',()=>{
    console.log("db connected")
});

mongoose.connection.on('error',(error)=>{
    console.log(error)
});








app.listen(PORT,()=>{
console.log(`app is running on port ${PORT}`);
})