const bodyParser = require('body-parser');
const path=require('path')
const express=require('express');
const port=5009;
const app=express();
const datajson=require('./data.json')
const database=require('mysql');
const { connect } = require('http2');
const { urlencoded } = require('body-parser'); 
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false });
let connectDatabase=database.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"kanbanApp"
 }
)
connectDatabase.connect((err)=>{
if(err) {
    console.log(err);
}
else{
        // var sql="CREATE TABLE boardDetails(boardId int AUTO_INCREMENT PRIMARY KEY, boardName varchar(255), columnName JSON, tasks JSON)";
        //  var sql="drop table boardDetails"
      //  connectDatabase.query(sql,(err,result)=>{
      //       if(err){
      //         console.log(err)
      //       }
      //       else{
      //         console.log(result);
      //    }      })
    
 }
 })


 app.use(express.static("public"));
app.use(bodyParser.json())
app.use( bodyParser.urlencoded({ extended: false }))

app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'));

app.get('/index',(req,res)=>{
   var sql="SELECT * FROM boardDetails";
   connectDatabase.query(sql,(err,result)=>{
     if(err){
       console.log(err)
     }
     else{
      //  console.log(result);
       res.render("index", { boardValue: result });
     }
   })
   

})

app.get('/header/:boardId',(req,res)=>{
  let idNo=req.params.boardId;
      const sql=`SELECT  * FROM boardDetails WHERE boardId=${idNo}`;
     connectDatabase.query(sql,(err,result)=>{

         if(err){
           console.log(err);
         }
         else{
             headerTitle=result;
            //  console.log(result)
             let headerTitleName=headerTitle[0].boardName;
            //  console.log(headerTitle[0].boardName)
             res.render("header",{headerTitleName,idNo});
            
         }
     
       });
})
app.get('/deleteBoard/:boardName',(req,res)=>{
  let deleteboardname=req.params.boardName;
            res.render("deleteBoard",{deleteboardname});
    })

 app.get('/mainContent/:boardId',(req,res)=>{
         let idValue=req.params.boardId;    
      var sql=`SELECT * FROM boardDetails WHERE boardId=${idValue}`;
     //  let boardValue;
      connectDatabase.query(sql,(err,result)=>{
        if(err){
          console.log(err)
        }
        else{
          // console.log(result);
          res.render("mainContent", { boardValue: result });
        }
      })

  })
   
app.get('/newBoard',(req,res)=>{

  var sql="SELECT * FROM boardDetails";
  connectDatabase.query(sql,(err,result)=>{
    if(err){
      console.log(err)
    }
    else{
      // console.log(result);
 
      res.render("newBoard",{boardValue:result});
    
  
    }
  })

})
app.get('/newBoardPage',(req,res) =>{
res.render("index");
})
app.post('/newBoardPage',function(req,res) {
  // console.log(req.body.newboardname)
  var newBoardNameValue=req.body.newboardname;
  var newBoardColumnCount=req.body.ListColumnCount;
  // console.log(newBoardColumnCount);
  let NewBoardColumnArray=[]

  for(let i=1; i<= newBoardColumnCount ; i++ ){
     NewBoardColumnArray.push(`${req.body["list"+i]}`)
  }
  let columnnames=JSON.stringify(NewBoardColumnArray)
  var sql = `INSERT INTO boardDetails (boardName, columnName, tasks) VALUES ('${newBoardNameValue}', '${columnnames}','[]')`;
      connectDatabase.query(sql,(err,result)=>{
          if(err){
                console.log(err);
              }
              else{
                // console.log(result)

                var sql="SELECT * FROM boardDetails";
                connectDatabase.query(sql,(err,result)=>{
                  if(err){
                    console.log(err)
                  }
                  else{
                    // console.log(result);
                    res.redirect("/index");
                    res.render("index", { boardValue: result });
                  }
                })
              }
           
            });
 
  
 

})
app.get("/createBoard",(req,res)=>{
  res.render("createBoard");
 })

 app.get("/newTask/:boardNamevalue",(req,res)=>{
  const boardnamevalue=req.params.boardNamevalue;
  const boardsplitname=boardnamevalue.split("*");
  const splitnamevalue=boardsplitname.join(" ");

  // console.log(splitnamevalue)
  var boardnamecontent=`SELECT * FROM boardDetails WHERE boardName='${splitnamevalue}'`;
  connectDatabase.query(boardnamecontent,(err,resultvalue)=>{
    if(err){
      console.log(err)
    }
    else{
      // console.log(resultvalue);
      //  console.log(JSON.parse(resultvalue[0].columnName))
       res.render("newTask",{columnArrayvalue:JSON.parse(resultvalue[0].columnName),boardidno:resultvalue[0].boardId});
    }
  })
 })

 app.post('/newTaskPage/:boardidnovalue',function(req,res){
  // console.log(req.body.tasktitle);
  // console.log(req.body.description);
  // console.log(req.body.subtaskListCountvalue);
  // console.log(req.params.boardidnovalue);
  // console.log(req.body.columnname)
  let newsubtaskcount=req.body.subtaskListCountvalue;
  let NewBoardTaskArray=[];

  for(let i=1; i<= newsubtaskcount ; i++ ){
    NewBoardTaskArray.push({tasks:`${req.body["subtasklist"+i]}`,isCompleted:false})
  }
  let subtasknames=JSON.stringify(NewBoardTaskArray);
   let taskvaluesafter;
   var tasksaftervalue=`SELECT * FROM boardDetails WHERE boardId=${req.params.boardidnovalue}`;
   connectDatabase.query(tasksaftervalue,(err,result)=>{
    if(err){
      console.log(err)
    }
    else{
      //  console.log(result[0].tasks);
       taskvaluesafter=result[0].tasks;
       
    }
  })
let tasksArray=[];

   let tasksObject={
    title:`${req.body.tasktitle}`,
    description:`${req.body.description}`,
    subtasks:`${subtasknames}`,
    status:`${req.body.columnname}`,
   }
   console.log(tasksObject);
if(taskvaluesafter!=[]  ){
tasksArray.push(taskvaluesafter);
 
}
console.log("gfhj")
console.log(tasksaftervalue)
console.log("gfhj")

tasksArray.push(tasksObject);
let taskArrayvalue=JSON.stringify(tasksArray);
console.log(tasksArray);

// var taskadd=`UPDATE boardDetails SET tasks='${taskArrayvalue}' WHERE boardId=${req.params.boardidnovalue}`;
// connectDatabase.query(taskadd,(err,result)=>{
//   if(err){
//     console.log(err);
//   }
//   else{
//     // console.log(result);
//   }
// })
  var sql="SELECT * FROM boardDetails";
  connectDatabase.query(sql,(err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      // console.log(result);
      res.redirect("/index")
      // res.render("index", { boardValue: result });
    }
  })
 })


  // app.get('/newBoard',(req,res)=>{
  //   var sql="SELECT * FROM boardDetails";
  //   connectDatabase.query(sql,(err,result)=>{
  //     if(err){
  //       console.log(err)
  //     }
  //     else{
  //       console.log(result);
  //       res.render("index", { boardValue: result });
  //     }
  //   })
  // })
  app.post("/deleteBoardDetails/:boardnamevalue",function(req,res){
    console.log("ghj")
     console.log(req.params.boardnamevalue);
    console.log("ghj")
     var deleteBoardrow=`DELETE FROM boardDetails WHERE boardName='${req.params.boardnamevalue}'`;
     connectDatabase.query(deleteBoardrow,(err,result)=>{
           if(err){
             console.log(err)
           }
           else{
             console.log(result);
     res.redirect("/index");

           }
         })

  })

 app.listen(port,()=>console.log(port));
