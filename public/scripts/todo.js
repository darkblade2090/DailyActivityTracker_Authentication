var todoList=document.getElementById("todoList");
var submit=document.getElementById("submit");
var todoBox=document.getElementById("todoBox");
var nav=document.getElementById("nav")
todo=[];
var emailId;

//Loading header
function loadHeader()
{
   getuserData(function(userData)
   {
    
     // console.log(userData)

   emailId=userData.email;
   var userName=userData.userName;
  
   var h4=document.createElement('h2');
   h4.innerHTML="Welcome " + userName;

   var button=document.createElement('button');
   button.innerHTML='Logout';

   nav.appendChild(h4);
   nav.appendChild(button);

   button.addEventListener("click",logout);
  
   });
   
  
}

//For loading previos todos at start

function onLoad()
{
  var request=new XMLHttpRequest();
    request.open("POST","/todo");
    request.send();
    
    request.addEventListener("load",function()
    {
       var todos = JSON.parse(request.responseText);
       todos.forEach(function(todoData)
       {
         buildTodo(todoData.todo,todoData.marked,todoData.uniqueId);
       });
    })
} 


loadHeader();
onLoad();

//Submit event listener
submit.addEventListener("click", fun);

function fun()
{   
   
   if(todoBox.value)
   {
     var todoData=
     { emailId : emailId,
       todo : todoBox.value,
       marked : false,
       uniqueId : Date.now()

     }
     var request=new XMLHttpRequest();
    request.open("POST","/save");
    request.setRequestHeader("Content-type","application/json");
    request.send(JSON.stringify(todoData));

    todoBox.value="";
    request.addEventListener("load",buildTodo(todoData.todo,todoData.marked,todoData.uniqueId));
    

   }
    
}

function buildTodo(todoValue,marked, uniqueId)
{
       var container=document.createElement("div");
        var task =document.createElement("h4");
        var mark=document.createElement("button");
        var deleteb=document.createElement("button");
        var edit=document.createElement("button");
        
        task.innerHTML=todoValue;

        container.setAttribute("class","container");
        container.setAttribute("id",uniqueId);
        
        
        edit.textContent="Edit";
        deleteb.textContent="Delete";

        //If todo is marked
        if(marked)
        { 
          mark.textContent="Unmark";
          container.setAttribute("style","text-decoration: line-through");
          
        }

        else
        mark.textContent="Mark";
        
        mark.setAttribute("id",uniqueId);
        deleteb.setAttribute("id",uniqueId);
        edit.setAttribute("id",uniqueId);
        
        container.appendChild(task);
        container.appendChild(mark);
        container.appendChild(deleteb);
        container.appendChild(edit);

        todoList.appendChild(container);

        deleteb.addEventListener("click", deleteFunction);
        edit.addEventListener("click",editFunction);
        mark.onclick=markFunction;
}

function deleteFunction(event)
{
    //console.log(event.target.id);
    var container=event.target.parentNode; 
    var delId=event.target.id;
    var data={
      id : delId
    };
    todoList.removeChild(container);
    var request=new XMLHttpRequest();
    request.open("POST","/deleteTodo");
    request.setRequestHeader("Content-type","application/json");
    request.send(JSON.stringify(data));
    request.addEventListener("load", function()
    {
     
      console.log("deleted");

    })

}

function editFunction(event)
{
  var container=event.target.parentNode;
  var eId=event.target.id;

  let newText = prompt("Edit Your Stuff :");

  if (newText.trim()!=='') {
    var request=new XMLHttpRequest();
    request.open("POST","/editTodo");
    request.setRequestHeader("Content-type","application/json");
   
     data={
       id : eId,
       text : newText 
     }
    
    request.send(JSON.stringify(data));
    request.addEventListener("load", function()
    {
      console.log("Edited");
      todoList.innerHTML="";
      onLoad();
    })
   }

}

function markFunction(event)
{
  
    var container=event.target.parentNode;
    //console.log(container.childNodes[1]) 
    var markId=event.target.id;
    var data={
      id : markId
    };
 
    var request=new XMLHttpRequest();
    request.open("POST","/markTodo");
    request.setRequestHeader("Content-type","application/json");
    request.send(JSON.stringify(data));
    request.addEventListener("load", function()
    {
      console.log("Marked/Unmarked");
      todoList.innerHTML="";
      onLoad();
    })
}

//To get data of current user
function getuserData(wait)
{
    var request= new XMLHttpRequest();
    request.open("GET","/getuserData");
    request.send();
    
    request.addEventListener("load",function()
    {
      var response = JSON.parse(request.responseText);
      //console.log(response)
      wait(response);
    })
    
}

function logout()
{
  var request=new XMLHttpRequest;
  request.open("GET","/logout");
  request.send();
  request.addEventListener("load",function()
  {
    if(request.responseText ==='logout success'){
      //window.alert('Logout Successful')
      window.location.href = '/'
    }else{
      window.alert('logout failed')
    }
  })
}

    

      



