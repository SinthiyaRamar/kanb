const bodyParser = require('body-parser');
// const { response } = require('express');
const path=require('path')
const express=require('express');
const port=5009;
const app=express();
const datajson=require('./data.json')
const database=require('mysql');
const { connect } = require('http2');
const { urlencoded } = require('body-parser');
var jsonParser = bodyParser.json()
// const fs=require('fs')
// const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
var urlencodedParser = bodyParser.urlencoded({ extended: false })
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



app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'));

app.get('/index',(req,res)=>{
   var sql="SELECT * FROM boardDetails";
   connectDatabase.query(sql,(err,result)=>{
     if(err){
       console.log(err)
     }
     else{
       console.log(result);
       res.render("index", { boardValue: result });
     }
   })
   

})

app.get('/header/:boardId',(req,res)=>{
  let idNo=req.params.boardId;
    //  const boardNameValue=`SELECT  * FROM boardNames WHERE boardNo=${idNo}`;
      const sql=`SELECT  * FROM boardDetails WHERE boardId=${idNo}`;
     connectDatabase.query(sql,(err,result)=>{

         if(err){
           console.log(err);
         }
         else{
             headerTitle=result;
             console.log(result)
             let headerTitleName=headerTitle[0].boardName;
             console.log(headerTitle[0].boardName)
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
    //   let mainContentColumnDetails;
    //  console.log(idValue)
    //  const boardNameValue=`SELECT  * FROM boardcolumnvalue WHERE boardnameidno=${idValue}`;

    //  const sql=`SELECT  * FROM boardcolumnvalue WHERE boardnameidno=${idValue}`;
    // connectDatabase.query(sql,(err,result)=>{

          
      var sql=`SELECT * FROM boardDetails WHERE boardId=${idValue}`;
     //  let boardValue;
      connectDatabase.query(sql,(err,result)=>{
        if(err){
          console.log(err)
        }
        else{
          console.log(result);
         //  boardValue=result;
         //  console.log(boardValue)
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
      console.log(result);
 
      res.render("newBoard",{boardValue:result});
    
  
    }
  })

})
app.get('/newBoardPage',(req,res) =>{
res.render("index")
})
app.post('/newBoardPage',urlencodedParser,(req,res) => {
  console.log(req.body.newboardname)
  var newBoardNameValue=req.body.newboardname;
  var newBoardColumnCount=req.body.ListColumnCount;
  console.log(newBoardColumnCount);
  let NewBoardColumnArray=[]

  for(let i=1; i<= newBoardColumnCount ; i++ ){
     NewBoardColumnArray.push(`${req.body["list"+i]}`)
  }
  let columnnames=JSON.stringify(NewBoardColumnArray)
      // var sql="drop table boardNames"
      // var sql="create table boardNames(boardNo INT AUTO_INCREMENT PRIMARY KEY, boardName varchar(255))";
       var sql = `INSERT INTO boardDetails (boardName, columnName) VALUES ('${newBoardNameValue}', '${columnnames}')`;

    // var sql="SELECT * FROM boardNames";
      connectDatabase.query(sql,(err,result)=>{
          if(err){
                console.log(err);
              }
              else{
                console.log(result)

                var sql="SELECT * FROM boardDetails";
                connectDatabase.query(sql,(err,result)=>{
                  if(err){
                    console.log(err)
                  }
                  else{
                    console.log(result);
                    res.redirect("/index");
                    res.render("index", { boardValue: result });

                  }
                })
              }
           
            });
 
  
 

})
app.get("/createBoard",(req,res)=>{
  res.render("createBoard")
 })

 app.get("/newTask/:boardNamevalue",(req,res)=>{
  const boardnamevalue=req.params.boardNamevalue;
  const boardsplitname=boardnamevalue.split("*");
  const splitnamevalue=boardsplitname.join(" ");

  console.log(splitnamevalue)
  var boardnamecontent=`SELECT * FROM boardDetails WHERE boardName='${splitnamevalue}'`;
  connectDatabase.query(boardnamecontent,(err,resultvalue)=>{
    if(err){
      console.log(err)
    }
    else{
      console.log(resultvalue);
       console.log(JSON.parse(resultvalue[0].columnName))
       res.render("newTask",{columnArrayvalue:JSON.parse(resultvalue[0].columnName)});
    }
  })
 })

 app.post('/newTaskPage',urlencoded,(req,res)=>{
  console.log(req.body)
  res.redirect("index");
 })





 app.use(express.static("public"));
 app.listen(port,()=>console.log(port));
