var mysql = require('mysql');

var connection = mysql.createConnection({
    host    :'localhost',
    port : 3306,
    user : 'root',
    password : 'root',
    database:'spring'
});




connection.connect(function(err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }
});

//insert
app.post('/users',function(req,res){
    var user = {'userid':req.body.userid,
                'password':req.body.password,
                'address':req.body.address,
                'male':req.body.male
                };
    var query = connection.query('insert into users set ?',user,function(err,result){
        if (err) {
            console.error(err);
            throw err;
        }
        console.log(query);
        res.send(200,'success');
    });
});


//select all
app.get('/users', function(req,res){
    pool.getConnection(function(err,connection){
        var query = connection.query('select * from users', function (err, rows) {
            if(err){
                connection.release();
                throw err;
            }
            console.log(rows);
            res.json(rows);
            connection.release();
        });
        console.log(query);
    });
});


 
var pool = mysql.createPool({
	
	host    :'locahost',
	port : 3306,
	user : 'root',
	password : 'root',
	database:'spring',
    connectionLimit:20,
    waitForConnections:false
});
 
