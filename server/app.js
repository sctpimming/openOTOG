const express = require('express')
const bodyParser = require("body-parser")
const mysql = require('mysql');
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
		//console.log(prob);
		res.json({
			problem : result
		})
	})
})
app.listen(PORT,() => {
	console.log("Starting server at PORT " + PORT)
})
