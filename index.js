const express = require('express');
const cors = require('cors');
const app = express();
const AWS = require('aws-sdk');
const multer = require('multer');
const upload = multer();

const config = new AWS.Config({
    accessKeyId: 'AKIA5LHV54SWPUO6XWL5',
    secretAccessKey: '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',
    region: 'ap-southeast-1',
})

AWS.config = config;

const docClient = new AWS.DynamoDB.DocumentClient();
const table = 'mypaper';

app.use(cors());
app.use(express.json({extend: false}));
app.use(express.static('./views'))
app.set('view engine','ejs');
app.set('views','./views');

app.get('/add',(req,res)=>{
    return res.render('add');
})
app.post('/add',upload.fields([]),(req,res) =>{
    const {id,name,quantity,image} = req.body;
    const params = {
        TableName: table,
        Item:{
            id,
            name,
            quantity,
            image,
        }
    }
    docClient.put(params,(err,data) =>{
        if(err){
            return res.status(500).json(err);
        }else{
            return res.redirect('/');
        }
    })
})

app.post('/delete',upload.fields([]),(req,res) =>{
    const {id} = req.body;
    console.log(req.body);
    const params = {
        TableName: table,
        Key:{
            id,
        }
    }
    docClient.delete(params,(err,data) =>{
        if(err){
            return res.status(400).json(err);
        }else{
            return res.redirect('/');
        }
    })
})

app.get('/',(req,res) =>{
    const params = {
        TableName: table,
    }
    docClient.scan(params,(err,data) =>{
        if(err){
           return res.status(500).json(err);
        }else{
            return res.render('index',{mypaper: data.Items});
        }
    })
})


app.listen(9000,()=>{
    console.log('server is running');
})