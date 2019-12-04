const express = require('express')
const bodyParser = require("body-parser")
const mysql = require('mysql');
const fs = require("fs");
var jwt = require('jsonwebtoken');
var logger = require('morgan');
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

app.get('/problem',(req,res) => {
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
app.get('/pdf/:sname',(req,res) => {
	var file = fs.createReadStream("./docs/"+req.params.sname+".pdf");
  	file.pipe(res);
})

app.post('/user/login',(req,res) => {
	var username = req.body.username;
	var password = req.body.password;
	console.log(username + ' Sign in at' + Date(Date.now()));
	var sql = "SELECT * FROM user WHERE username = ?";
	con.query(sql, [username], (err, result) => {
		if (err) throw err;
		if(result[0] == null) res.status(200).send('')
		else if(result[0].password != password) res.status(200).send('')
		else {
			var data = {username : result[0].username, id : result[0].id, sname : result[0].sname};
			let token = jwt.sign(data, process.env.SECRET_KEY, {
				algorithm:  "RS256"
			})
		//console.log(token);
		res.send(token);
		}
	})
})
app.listen(PORT,() => {
	console.log("Starting server at PORT " + PORT)
})
