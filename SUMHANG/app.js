
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
/*  , engine = require('ejs-locals')*/
  , fs = require('fs')
  , util = require('util')
  , crypto = require('crypto')
  , path = require('path');

/*var MongoClient = require('mongodb').MongoClient
var Server = require('mongodb').Server;*/


/*비밀번호 암호화 처리*/

var myHash = function myHash(key){
	var Hash = crypto.createHash('sha1');
	hash.upadate(key);
	return hash.digest('hex');
}

var createSession = function createSession(){
	return function(req, res, next){
		if(!req.session.login){
			req.session.login = 'logout';
		}
		next();
	};
};




var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine','ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({limit:'800mb', uploadDir:__dirname+'/public/se/uploadTmp'}));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session({secret:'keyboard cat', cookie:{maxAge:600000}}));
app.use(createSession());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

 
app.get('/',routes.index);


app.get('/MEMBERDB', routes.member_db);


app.get('/DATAVIEW',routes.dataview);

app.post('/LOGIN', function(req,res,next){
	req.username = req.body.username;
	req.password = myHash(req.body.password);
	next();
},routes.login_post);

app.get('/LOGOUT', routes.logout);

app.get('/SIGN_UP', routes.sign_up);
app.post('/SIGN_UP',function(req,res,next){
	if(req.body.password == req.body.confirm_password){
		req.username = req.body.username;
		req.password = myHash(req.body.password);
		req.email = req.body.email;
		next();
	}
	else{
		res.redirect('/');
	};
},routes.sign_up_post);


app.get('/CHECKUSERNAME',routes.checkusername);


app.post('/UPLOAD', function(req,res){
	var str=req.header('User-Agent');
	var os = str.search("Win");
	var fileName = req.files.file.path;
	if(os == -1) {
		fileName = fileName.split('/')[fileName.split('/').length-1];
	}
	else{
		fileName=fileName.split('\\')[fileName.split('\\').length-1];
	}
	res.writeHeader(200,{'Content-Type':'text/plain'});
	res.write('&bNewLine=true');
	res.write('&sFileName='+fileName);
	res.write('&sFileURL=/se/uploadTmp/'+fileName);
	res.end();
});





/*var createSession = function createSession{
	return function(req, res, next){
		if(!req.session.login){
			req.session.login='logout';
		}
		next();
	};
	
};*/
/*var mongoclient = new MongoClient(new Server('localhost',27017,{'native_parser':true}));
var db = mongoclient.db('test');


app.get('/', function(req,res) {
	   db.collection('users').findOne({},function(err,doc){
	       if(err) throw err;
	       res.send(doc);
	   });
	});


mongoclient.open(function(err, mongoclient) {
    if(err) throw err;
    console.log('mongo client connected');
    http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
    });
 
});*/
 

/*var mongoclient = new MongoClient(new Server('localhost',27017,{'native_parser':true,'poolSize':8,'maxPoolSize':10}));


db.collection('users').insert({city:'suji'},function(err,doc){
    console.log('inserted '+doc[0]._id+':'+doc[0].city);
});

*/


 

 

//

/*app.get('/wines', function(req, res) {
    res.send([{name:'wine1'}, {name:'wine2'}]);
});
app.get('/wines/:id', function(req, res) {
    res.send({id:req.params.id, name: "The Name", description: "description"});
});
  
app.listen(3000);
console.log('Express Listening on port 3000...');*/


//

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


app.post('/SUBMIT', routes.insertData);



/*
세션설정
var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;



passport.use(new LocalStrategy({
    usernameField : 'userid',
    passwordField : 'password',
    passReqToCallback : true
}
,function(req,userid, password, done) {
    if(userid=='hello' && password=='world'){
        var user = { 'userid':'hello',
                      'email':'hello@world.com'};
        return done(null,user);
    }else{
        return done(null,false);
    }
}
));


passport.serializeUser(function(user, done) {
    console.log('serialize');
    done(null, user);
});



//인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.
passport.deserializeUser(function(user, done) {
    //findById(id, function (err, user) {
    console.log('deserialize');   
    done(null, user);
    //});
});



assport.serializeUser(function(user, done) {
    done(null, user.id);
  });

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });



app.use(passport.initialize());
app.use(passport.session());







app.use(express.cookieDecoder());
app.use(express.session());


app.get('/users', function(req, res) {
	  req.session.message = 'Hello World';
	});




*/

