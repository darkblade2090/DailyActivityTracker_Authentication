const express = require('express')
const app = express()
var fs=require("fs");
var session = require('express-session');
const port = 3000; 


app.use(express.json());
app.use(express.static("./public"));
app.use(express.static("./public/scripts"));

app.use(session({
  secret: 'keyboard cat',
  saveUninitialized: true,
	resave: true
}))

//To set view engine
//app.set("view engine","ejs");
//app.set("views","file_name");
 
app.get('/', (req, res) => {
   
		if(req.session.isLoggedIn)
		{
			fs.readFile('./public/todo.html','utf-8',(err,data) =>
			{
				if(err)
					console.log("Error");
				else
				res.end(data);
			})

		}
		else
		{
			fs.readFile('./public/login.html','utf-8',(err,data) =>
			{
				if(err)
					console.log("Error");
				else
				res.end(data);
			})
}
})

//Login/Signup

app.get('/login',(req,res)=>{
	
	if(req.session.isLoggedIn){
		res.redirect('/')
	}else{
			fs.readFile('./public/todo.html','utf-8',(err,data) =>
			{
				if(err)
					console.log("Error");
				else
				res.end(data);
			})
	}
})

app.post('/saveData',(req,res) => {

	var xname=req.body.userName;
	var mail=req.body.email;
	var pass=req.body.password;
  var userData=[];
  var matched=false;
	fs.readFile("./database/login.txt","utf-8", function(err, data){
		
		if(err){
			res.status = 404
			res.end('error')
		}else{
			
			if(data.length>0)
		{
			  userData=JSON.parse(data);
				for(var i=0;i<userData.length;i++)
			{
				//console.log(userData[i].email);
				if(mail === userData[i].email)
					{
						matched=true;
						res.end('User already exists');
					}	
			}
		}
		}
	
   if(!matched)
		{userData.push({
			userName : xname,
			email : mail,
			password : pass
		});
		console.log(userData);

		fs.writeFile("./database/login.txt",JSON.stringify(userData), function(err)
					{
						if(err)
						{
							res.end("Error Occured");
						}
						else
						{
							console.log("Data Saved");
							res.end();
						}
					})
	}
	})


})

app.post('/login',(req,res) =>
{
	var mail=req.body.email;
	var pass=req.body.password;
	//console.log(mail,pass)

		fs.readFile('./database/login.txt','utf-8',(err,data) =>
	{
		if(err)
			{
				res.status = 404;
				res.end('error');
			}
		else
		{   if(data.length>0)
				{		var userData=JSON.parse(data);
						//console.log(userData);
						
						if(userData.length>0)
						{
							var match= x();
							function x()
							{
									for(var i=0;i<userData.length;i++)
								{
									if(mail == userData[i].email && pass == userData[i].password)
										return i;
								}
								return -1;
							}
							//console.log(match);
							if(match!=-1)
							{
								req.session.isLoggedIn = true;
								//console.log(userData[match].userName)
								req.session.userName = userData[match].userName;
								req.session.email = userData[match].email;
							//	console.log(userData[match].userName);
								res.status(200)
								res.end("true");
							}
							else
							{
								res.status(404);
								res.end("Wrong info");
							}
						}
		}
		else
		{
			res.status(404);
			res.end("Signup first");
		}
		}
	})
	

})

app.get("/logout",(req,res) => 
{
	req.session.destroy();
	res.send('logout success')
})

//Todo App

app.post('/save', (req,res) => {
  fs.readFile("./database/db.txt","utf-8",function(err,data)
	{
		var todo=[];

		if(data.length >0)
		{
			todo=JSON.parse(data);
		}

		todo.push(req.body);

		fs.writeFile("./database/db.txt",JSON.stringify(todo), function(err)
		{
			if(err)
			{
				res.end("Error Occured");
			}
			else
			{
				res.end();
			}
		})
	})
})

app.post('/todo', (req,res) => {
    
   userMail=req.session.email;

		fs.readFile("./database/db.txt","utf-8",function(err,data)
			{
				if(err)
					res.end("Error")
					else
			{	if(data)
			{
				console.log(JSON.parse(data));
				var userData=JSON.parse(data).filter(function(key)
				{
					if(userMail==key.emailId)
						return true;
					else
						return false;
				})
				res.end(JSON.stringify(userData));
			}}
			})
	
})

app.post('/deleteTodo', (req,res) => {
 	var id=req.body.id;
	 //console.log(id)
	
	 fs.readFile("./database/db.txt","utf-8",function(err,data)
	 {
		 
		 var todoData= JSON.parse(data);
		 //console.log(req.body,JSON.parse(data));
		 if(todoData.length>0)
		 {
			 for(var i=0;i<todoData.length;i++)
			 {
				 if(id==todoData[i].uniqueId)
				 {
					 todoData.splice(i,1);
					 break;
				 }
			 }
			 fs.writeFile("./database/db.txt",JSON.stringify(todoData), function(err)
					{
						if(err)
						{
							res.end("Error Occured");
						}
						else
						{
							res.end();
						}
					})
		 }
		 else
		 res.end();
	 })
})

app.post('/editTodo', (req,res) => {
 	var id=req.body.id;
	
	 fs.readFile("./database/db.txt","utf-8",function(err,data)
	 {
		 var todoData= JSON.parse(data);
		 //console.log(data);
		 if(todoData.length>0)
		 {
			 for(var i=0;i<todoData.length;i++)
			 {
				 if(id==todoData[i].uniqueId)
				 {
					 todoData[i].todo=req.body.text;
					 break;
				 }
			 }
			 fs.writeFile("./database/db.txt",JSON.stringify(todoData), function(err)
					{
						if(err)
						{
							res.end("Error Occured");
						}
						else
						{
							res.end();
						}
					})
		 }
		 else
		 res.end();
	 })
})

app.post('/markTodo', (req,res) => {
 	var id=req.body.id;
	
	 fs.readFile("./database/db.txt","utf-8",function(err,data)
	 {
		 var todoData= JSON.parse(data);
		 //console.log(data);
		 if(todoData.length>0)
		 {
			 for(var i=0;i<todoData.length;i++)
			 {
				 if(id==todoData[i].uniqueId)
				 {
					 todoData[i].marked=(!todoData[i].marked);
					 break;
				 }
			 }
			 fs.writeFile("./database/db.txt",JSON.stringify(todoData), function(err)
					{
						if(err)
						{
							res.end("Error Occured");
						}
						else
						{
							res.end();
						}
					})
		 }
		 else
		 res.end();
	 })
})


//To get emailId
app.get("/getuserData",function(req,res)
{

	res.json({email:req.session.email, userName : req.session.userName});
})


app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
