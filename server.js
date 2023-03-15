const bodyParser = require('body-parser');
const path=require('path')
const express=require('express');
const port=5010;
const app=express();
const datajson=require('./data.json');
const database=require('mysql');
const { connect } = require('http2');
const { urlencoded } = require('body-parser'); 
const { compile } = require('ejs');
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
                // var sql="CREATE TABLE boardDetails(boardId int AUTO_INCREMENT PRIMARY KEY, boardName varchar(255), columnName JSON)";
                  //  var sql="drop table boardDetails"
              //  connectDatabase.query(sql,(err,result)=>{
              //      if(err){
              //          console.log(err)
              //        }
              //        else{
              //          console.log(result);
              //     }      })
    
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
          console.log(err);
        }
        else{
       res.render("index",{boardValue:result});
        }
      })

})
app.get('/createBoard',(req,res)=>{
  res.render("createBoard")
})
app.get('/newBoard',(req,res)=>{
  var sql="SELECT * FROM boardDetails";
  connectDatabase.query(sql,(err,result)=>{
    if(err){
          console.log(err);
        }
        else{
       res.render("newBoard",{boardValue:result});
        }
      })
})

app.get('/newBoardPage',(req,res)=>{
  res.render("index")
})


app.post('/newBoardPage',function(req,res) {
  var newBoardNameValue=req.body.newboardname;
  var newBoardColumnCount=req.body.ListColumnCount;
  let NewBoardColumnArray=[];

  for(let i=1; i<= newBoardColumnCount ; i++ ){
     NewBoardColumnArray.push(`${req.body["list"+i]}`)
  }
  let columnnames=JSON.stringify(NewBoardColumnArray)
  var sql = `INSERT INTO boardDetails (boardName, columnName) VALUES ('${newBoardNameValue}', '${columnnames}')`;
      connectDatabase.query(sql,(err,result)=>{
          if(err){
                console.log(err);
              }
              else{
                  // console.log(result)

                  var boardtablename=newBoardNameValue.split(" ").join("_");
                  var boardTable = `CREATE TABLE ${boardtablename}(TASKCOUNT INT AUTO_INCREMENT PRIMARY KEY, Title varchar(255),Description TEXT,Subtasks JSON,status varchar(255))`;
                  connectDatabase.query(boardTable,(err,result)=>{
                      if(err){
                            console.log(err);
                          }
                          else{
                              // console.log(result)
            
            
                               res.redirect('/index')
             
                          }
                       
                        });
      

                  //  res.redirect('/index')
 
              }
           
            });
 
  
          
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
   let tasksvalue=result;
    var showtablename=(tasksvalue[0].boardName).split(" ").join("_");
    var sql=`SELECT * FROM ${showtablename}`;
    //  let boardValue;
    connectDatabase.query(sql,(err,result)=>{
     if(err){
       console.log(err)
     }
     else{
     var taskdetailsvalue=result;
     console.log(taskdetailsvalue)
   res.render("mainContent", { boardValue: tasksvalue,taskdetailsvalues:taskdetailsvalue });
     }
    })
 }
})

})
app.get('/newColumn/:boardid',(req,res)=>{
  var boardidvalueno=req.params.boardid;
  res.render("newColumn",{boardidvalueno});
})

app.get('/deleteBoard/:boardName',(req,res)=>{
  let deleteboardname=(req.params.boardName).split("*").join(" ");
  console.log(deleteboardname)
            res.render("deleteBoard",{deleteboardname});
    })


    app.get('/createColumn/:columnboardid',(req,res)=>{
      var createcolumnboard=`SELECT * FROM boardDetails WHERE boardId=${req.params.columnboardid}`;
      connectDatabase.query(createcolumnboard,(err,result)=>{
       if(err){
         console.log(err)
       }
       else{
         console.log(result);
         res.render("createColumn",{columnresult:result[0]});
       }
     })
   })


   app.post('/addnewcolumn/:boardidnovalue',(req,res)=>{
    console.log(req.params.boardidnovalue)
    console.log(req.body.newcolumnobject)
    var columnarrays=[];
    var newcolumnarray=req.body.newcolumnobject;
    columnarrays.push(newcolumnarray)
  var columnadd=`UPDATE boardDetails SET columnName='${columnarrays}' WHERE boardId=${req.params.boardidnovalue}`;
  connectDatabase.query(columnadd,(err,result)=>{
    if(err){
      console.log(err)
    }
    else{
     console.log(result);
    }
  })

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
       res.render("newTask",{columnArrayvalue:JSON.parse(resultvalue[0].columnName),boardidno:resultvalue[0].boardId,boardname:resultvalue[0].boardName});
    }
  })
 })

 app.post('/addnewtask/:boardname',(req,res)=>{
  console.log(req.params.boardname)
  var inserttablename=(req.params.boardname).split(" ").join("_");
  console.log(inserttablename)
  // console.log(req.body.newtaskobject)
  var newtaskobject=JSON.parse(req.body.newtaskobject);
  console.log(newtaskobject)
  console.log(newtaskobject.title)
   var sql=`insert into ${inserttablename} (Title,Description,Subtasks,status) values ('${newtaskobject.title}','${newtaskobject.description}','${JSON.stringify(newtaskobject.subtasks)}','${newtaskobject.status}') `
   connectDatabase.query(sql,(err,result)=>{
    if(err){
      console.log(err)
    }
    else{
      
    }
   })
 
  })
 
  app.get('/task/:currboardnamevalue/:taskcount/:boardno',(req,res)=>{
    console.log(req.params.currboardnamevalue)
    console.log(req.params.taskcount);
    var taskvalue=`SELECT * FROM ${req.params.currboardnamevalue} WHERE TASKCOUNT=${req.params.taskcount}`;
    connectDatabase.query(taskvalue,(err,result)=>{
      if(err){
        console.log(err);
      }
      else{
        console.log(result)
        res.render("task",{taskvalues:result,boardidnumber:req.params.boardno,currboardname:req.params.currboardnamevalue})
      }
    })
  })


  app.post("/deleteBoardDetails/:boardnamevalue",function(req,res){
     console.log(req.params.boardnamevalue);
     var deleteBoardrow=`DELETE FROM boardDetails WHERE boardName='${req.params.boardnamevalue}'`;
     connectDatabase.query(deleteBoardrow,(err,result)=>{
           if(err){
             console.log(err)
           }
           else{
             console.log(result);

             var deletetable=`DROP TABLE ${(req.params.boardnamevalue).split(" ").join("_")}`;
             connectDatabase.query(deletetable,(err,result)=>{
              if(err){
                console.log(err);
              }
              else{

              }
             })
     res.redirect("/index");

           }
         })

  })

  app.get('/editBoard/:boardnames',(req,res)=>{
    var currentboardname=req.params.boardnames
    currentboardname=currentboardname.split("*").join(" ");
    var columnresultquery=`SELECT * FROM boardDetails WHERE boardName='${currentboardname}'`
    connectDatabase.query(columnresultquery,(err,result)=>{
      if(err){
        console.log(err)
      }
      else{
       res.render("editBoard",{columnresult:result})
      
      }
    })

  })

  app.post('/editBoard/:boardno',(req,res)=>{
    console.log((req.body.neweditcolumnobject).columnarrayvalue)
    // var newBoardColumnCount=req.body.ListColumnCount;
    // let NewBoardColumnArray=[];
  
    // for(let i=1; i<= newBoardColumnCount ; i++ ){
    //    NewBoardColumnArray.push(`${req.body["list"+i]}`)
    // }
    var editboardcommand=`UPDATE boardDetails SET boardName='${(req.body.neweditcolumnobject).boardnamevalue}', columnName='${JSON.stringify((req.body.neweditcolumnobject).columnarrayvalue)}' WHERE boardId=${req.params.boardno}`;
    connectDatabase.query(editboardcommand,(err,result)=>{
      if(err){
        console.log(err)
      }
      else{

      }
    })
  })
  app.get('/editTask/:BoardNo/:taskcount',(req,res)=>{

    console.log(req.params.BoardNo)
    console.log(req.params.taskcount)
    var edittaskquery=`SELECT * FROM boardDetails WHERE boardId=${req.params.BoardNo}`;
    connectDatabase.query(edittaskquery,(err,result)=>{
      if(err){
        console.log(err)
      }
      else{
        console.log(result[0].boardName);
        var boardsplitname=(result[0].boardName).split(" ").join("_");
        var coulmnnames=result[0].columnName;
        var collecttaskdetails=`SELECT * FROM ${boardsplitname} WHERE TASKCOUNT=${req.params.taskcount}`;
        connectDatabase.query(collecttaskdetails,(err,result)=>{
          if(err){
            console.log(err)
          }
          else{
            res.render("editTask",{taskdetails:result[0],columndetails:coulmnnames,boardname:boardsplitname,taskcount:req.params.taskcount,boardno:req.params.BoardNo})

          }
        })
      }
    })
  })
  app.post('/editnewtask/:boardname/:taskcount',(req,res)=>{

    console.log(req.params.boardname)
    console.log(req.params.taskcount)
    console.log(JSON.parse(req.body.newtaskobject).title);
    var newtaskobject=JSON.parse(req.body.newtaskobject);
    var sql=`UPDATE ${req.params.boardname} SET Title='${newtaskobject.title}',Description='${newtaskobject.description}',Subtasks='${JSON.stringify(newtaskobject.subtasks)}',status='${newtaskobject.status}' WHERE TASKCOUNT=${req.params.taskcount} `
    connectDatabase.query(sql,(err,result)=>{
     if(err){
       console.log(err)
     }
     else{
       
     }
    })
  })

  app.get('/deleteTask/:boardname/:taskcount/:boardidnumber',(req,res)=>{
    console.log(req.body.boardname);
    console.log(req.body.taskcount);
    var sql=`SELECT * FROM ${req.params.boardname} WHERE TASKCOUNT=${req.params.taskcount}`;
    connectDatabase.query(sql,(err,result)=>{
      if(err){
        console.log(err)
      }
      else{
    res.render("deleteTask",{tasktitle:result[0].Title,taskcountvalue:req.params.taskcount,boardName:req.params.boardname,boardidnumber:req.params.boardidnumber})
                               
      }
    })
  })
app.get('/deleteTaskDetails/:boardName/:taskcount',(req,res)=>{
  res.redirect("/index")
})
  app.post('/deleteTaskDetails/:boardName/:taskcount',(req,res)=>{
    var sql=`DELETE FROM ${req.params.boardName} WHERE TASKCOUNT=${req.params.taskcount}`;
    connectDatabase.query(sql,(err,result)=>{
      if(err){
        console.log(err)
      }
      else{
           res.redirect("/index")
      }
    })
  })

  app.post('/addnewsubtaskvalue/:boardname/:taskcount',(req,res)=>{
    var editquery=`UPDATE ${req.params.boardname} SET Subtasks='${req.body.newtaskobject}' WHERE TASKCOUNT=${req.params.taskcount}`
    connectDatabase.query(editquery,(err,result)=>{
      if(err){
        console.log(err)
      }
      else{

      }
    })
  
  
  })
 app.listen(port,()=>console.log(port));
