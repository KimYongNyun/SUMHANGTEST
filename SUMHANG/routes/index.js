var fs=require('fs');
var mongoose = require('mongoose');
var url = require('url');



mongoose.connect('mongodb://localhost/membership');

exports.connect = function(){
	
	// get the database connection pool
	mongoose.connect(dbURI);
	
	// DB Connection Events
	// Succeed to connect database
	mongoose.connection.on('connected', function() {
		console.log('Succeed to get connection pool in mongoose,  dbURI is ' + dbURI);
	});
	
	// Failed to connect database
	mongoose.connection.on('error', function(err) {
		console.log('Failed to get connection in mongoose, err is ' + err);
	});
	
	// When the connection has disconnected
	mongoose.connection.on('disconnected', function() {
		console.log('Database connection has disconnected.');
	});
	
	//If the Node.js process is going down, close database connection pool
	process.on('SIGINT', function() {
		mongoose.connection.close(function () {
			console.log('Application process is going down, disconnect database connection...');
			process.exit(0);
		});
	});

};



var db = mongoose.connection;



//for memebership

var memberSchema = mongoose.Schema({
	username:'string',
	password:'string',
	address:'string',
	male:'string'
});

//for contents

var dataSchema = mongoose.Schema({
	title:'string',
	content:'string',
		
});

var Member = mongoose.model('Member', memberSchema);
var Data = mongoose.model('Data', dataSchema);


exports.index=function(req,res){
	res.status(200);
	res.render('index',{
		title:'GCH01',
		page:0,
		url: req.url,
		login: req.session.login,
		username:req.session.username
			
	});
	
};


exports.member_db=function(req,res){
	var uri = url.parse(req.url,true).query;
	if(uri.cmd == "del"){
		Member.remove({_id: uri.id}, function (err,resule){
			res.status(300);
			res.redirect('/MEMBERDB');
		});
	}
	else{
		res.status(200);
		Member.count({}, function(err, count){
			Member.find({}, function(err, result){
				res.render('memberdb',{
					title:'Member DB',
					page: 1,
					url: req.url,
					database: 'local',
					collectionName:'members',
					documentCount:count,
					myMember: result,
					login: req.session.login,
					username: req.session.username
					
					
				});
			});
			
		});
	}
};


//DATA VIEW(page:2)

exports.dataview = function(req, res){
	Data.count({}, function(err, count){
		Data.count({}, function(err,result){
			for(var i=0; i < count ; i++){
				unblockTag(result[i].content);
			};
			res.status(200);
			res.render('dataview',{
				title:'Data View',
				page: 2,
				documentCount: count,
				myData : result,
				url : req.url,
				login: req.session.login,
				username: req.session.username
			});
		});
	});
	
};


//login post

exports.login_post = function(req, res){
	
	res.status(200);
	//pull Member into out of MongoDB here....
	
	Member.findOne({username:req.username, password: req.password}, function(err,member){
			if(member != null){
					req.session.login = 'login';
					req.session.username = req.username;
					
			};
			res.status(200);
			res.redirect(url.parse(req.url, true).query.url);
	});
};


//logout
exports.logout = function(req,res){
	req.session.login='logout';
	
	res.status(200);
	
	res.redirect(url.parse(req.url,true).query.url);
};

//Sign up
exports.sign_up=function(req,res){
	res.status(200);
	res.render('sign_up', {
		title:'Sign up',
		url:req.url,
		page:5,
		login:req.session.login,
		username: req.session.username,
		existingUsername: 'null'
	});
};

//Check Username

exports.checkusername = function(req,res){
	var uri =  url.parse(req.url, true);
	Member.findOne({username:uri.query.id}, function(err,member){
		res.writeHead(200,{'Content-Type': 'text/html'});
		if(member != null){
			res.end('true');
		}
		else{
			res.end('false');
		}
	});
	
}



//Sign up Post
exports.sign_ip_post = function(req, res){
	res.status(200);
	
	var curUsername = req.username;
	if(curUsername == ""){
		res.redirect('/');
	}
	else{
			Member.findOne({username: curUsername}, function (err, member){
				if(err) return handleError(err);
				
				if(member == null){// new username
					//add MyMember int to the model
					var myMember = new Member({username: curUsername, password: req.password, email: req.email});
					myMember.save(function(err,data){
						if(err){
							console.log("error");
						}
						console.log('member is inserted');
					});
					res.redirect('/MEMBERDB');
				}
				else{
					res.redirect('/');
				}
				
			});
	}
	
	
};



//Insert user content(S) throught Naver SmartEditor



exports.insertData= function(req,res){
	if(req.session.login=='login'){
		var myData = new Data({
			title:req.body.title,
			content:req.body.ir1});
		myData.save(function(err, data){
			if(err){
				console.log("error");
			}
		console.log('message is inserted');
		});
	}
	
	res.status(200);
	res.redirect(url.parse(req.url, true).query.url);
};








