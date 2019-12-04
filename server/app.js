const express = require('express')
const bodyParser = require("body-parser")
const mysql = require('mysql');
const fs = require("fs");
var logger = require('morgan');
require('dotenv').config()
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
app.listen(PORT,() => {
	console.log("Starting server at PORT " + PORT)
})
