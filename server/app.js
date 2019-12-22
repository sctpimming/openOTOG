const express = require('express')
const bodyParser = require("body-parser")
const multer  = require('multer')
const cors = require('cors');
const mysql = require('mysql');
const fs = require("fs");
const jwt = require('jsonwebtoken');
const logger = require('morgan');
const path = require('path')
const https = require('https');
require('dotenv').config()
process.env.SECRET_KEY = fs.readFileSync('./private.key', 'utf8');
process.env.PUBLIC_KEY = fs.readFileSync('./public.key', 'utf8');
const config = {
	"host": "localhost",
	"user": "root",
	"password": "0000",
	"database": "openotog"
}
var con = mysql.createConnection(config);
con.connect()
var app = express()
var PORT = process.env.PORT || 8000
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended : true
}))
app.use(logger('dev'));
app.use('/', express.static('build'));
app.get('/api/problem',(req,res) => {
	var sql = "select * from openotog.prob limit 3"
	con.query(sql,(err,result) => {
		if(err) throw err
		//var prob = JSON.stringify(result)
		//console.log(result);
		res.json({
			problem : result
		})
	})
})
app.get('/api/pdf/:sname',(req,res) => {
	var file = fs.createReadStream("./docs/"+req.params.sname+".pdf");
  	file.pipe(res);
})

app.post('/api/user/login',(req,res) => {
	var username = req.body.username;
	var password = req.body.password;
	console.log(username + ' Sign in at' + Date(Date.now()));
	var sql = "SELECT * FROM user WHERE username = ?";
	con.query(sql, [username], (err, result) => {
		if (err) throw err;
		if(result[0] == null) res.status(200).send('')
		else if(result[0].password != password) res.status(200).send('')
		else {
			var data = {username : result[0].username, id : result[0].idUser, sname : result[0].sname};
			let token = jwt.sign(data, process.env.SECRET_KEY, {
				algorithm:  "RS256"
			})
		//console.log(token);
		res.send(token);
		}
	})
})
app.get('/api/submission/:id',(req,res) => {
	var id = req.params.id
	var token = req.headers.authorization
	var decoded = jwt.verify(token, process.env.PUBLIC_KEY)
	var last_query = 'select idResult,result,score,errmsg,scode,status from submis where user_id = ? and prob_id = ? order by idResult desc limit 1'
	var best_query = 'select idResult,result,score,errmsg,scode from submis where user_id = ? and prob_id = ? order by score desc, timeuse asc limit 1'
	var lastest = new Promise((resolve, reject) => con.query(last_query,[decoded.id,id],(err,result) => {
		if(err) throw err
		resolve(result)
	}))
	var best = new Promise((resolve, reject) => con.query(best_query,[decoded.id,id],(err,result) => {
		if(err) throw err
		resolve(result)
	}))
	Promise.all([lastest, best]).then(function(values) {
		//console.log(values);
		res.json({
			lastest_submit : values[0],
			best_submit : values[1]
		})
	})
	//console.log(decoded);
	
})
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads')
	},
	filename: function (req, file, cb) {
		var id = req.params.id
		var token = req.headers.authorization
		var decoded = jwt.verify(token, process.env.PUBLIC_KEY)
		var filename = file.originalname.split('.')
		var fileext = filename[1]
		cb(null, id + "_" + decoded.id + "." +fileext)
	}
})
var upload = multer({ storage: storage })
app.post('/api/upload/:id',upload.single('file'),(req,res) => {
	var id = req.params.id
	var token = req.headers.authorization
	var decoded = jwt.verify(token, process.env.PUBLIC_KEY)
	var upload_file = req.file
	var filename = upload_file.originalname.split('.')
	var fileext = filename[1]
	var millis = Date.now();
	var time_now = Math.floor(millis/1000);
	filename = id + "_" + decoded.id + "." +fileext
	var text = fs.readFileSync('./uploads/'+filename,'utf8');
	var sql = "INSERT INTO submis (time, user_id, prob_id, status,scode) VALUES ?";
	var values = [[time_now,Number(decoded.id),Number(id),0,text],];
	con.query(sql, [values], (err, result) => {if(err) throw err})
	res.status(200).send('Upload Complete!')
})
app.post('/api/quickresend',(req,res) => {
	var id = req.body.id
	var sql = 'select * from submis where idResult = ?'
	con.query(sql,[id],(err,result) => {
		if(err) throw err;
		result = result[0]
		var millis = Date.now();
		var time_now = Math.floor(millis/1000);
		var sql = "INSERT INTO submis (time, user_id, prob_id, status,scode) VALUES ?";
		var values = [[time_now,Number(result.user_id),Number(result.prob_id),0,result.scode],];
		con.query(sql, [values], (err, result) => {if(err) throw err})
	})
	res.status(200).send('Resend Complete!')
})
app.get('/*', function(req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
const options = {
	key: fs.readFileSync('./server.key'),
	cert: fs.readFileSync('./server.crt')
};
var server = https.createServer(options,app);
server.listen(PORT,() => {
	console.log("Starting server at PORT " + PORT)
})
