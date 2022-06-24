var signUp=document.getElementById("signUp");
var login=document.getElementById("login");
var email=document.getElementById("email");
var password=document.getElementById("password");
var wrongInfo=document.getElementById("wrongInfo");

login.onclick=loginFunction;

function loginFunction()
{
  var data={
    email : email.value,
    password : password.value
  }
  console.log(data);

  var request=new XMLHttpRequest();
  request.open("POST",'/login');
  request.setRequestHeader("Content-type","application/json");
  request.send(JSON.stringify(data));

  request.addEventListener("load",function()
  {
    if(request.status==200)
    {
       console.log(request.responseText)
       if(request.responseText.length>0)
       {
         window.location.href='/';
       }
       else
       {
         wrongInfo.style.display='block';
       }
    }
    else
     { console.log("Error Occured");
     wrongInfo.style.display='block';
     }
  })
}

signUp.onclick=function()
{
  window.location="signup.html"
}