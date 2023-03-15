
window.addEventListener("load", function () {
    // document.getElementById("Main").style.display="grid";
    // document.getElementById("Main").style.gridTemplateColumns="15% 85%";
    // document.getElementById("Main").style.gridTemplateRows="100%";
    // $("#Main").append("");
    const slideBar=document.getElementById("slidebar");
    
    // $("#slidebar").append("<div id=board ></div>")
    // $("#slidebar").append("<div id=theme ></div>")
    $("#theme").append("<div id=selectTheme><img class=logo src=./assets/icon-dark-theme.svg /><input id=checkbox  type=checkbox />  <img class=logo src=./assets/icon-light-theme.svg </div>")
    $("#theme").append("<div id=hideSidebar class=hideSideBar hide > <img class=hide hideSideBar src=./assets/icon-hide-sidebar.svg /> Hide Sidebar </div>")
    

    $("#checkbox").click(function(){
        if($("#checkbox").is(":checked")){
            $("#MenuImg").attr("src","./assets/logo-light.svg");
            $("#header").css("background","#2b2c37");
            $("#slidebar").css("background","#2b2c37");
            $("#mainContent").css("background","#20212c");
            $("#headDiv").css("border-left","1px solid #828fa3");
            $("#selectTheme ").css("background-color","#20212c");
            $('#headTitle').css("color","white");
            $('.taskTitle').css("color","white");
            $('#circleDiv').css("color","white");
            $('.taskdiv').css("box-shadow","rgb(0 0 1 / 20%) 1vh 1vh 2vh 0vh")
            $('.taskdiv').css("background","#2b2c37")
            $('.addColumnDiv').css("background","#2b2c37")
            $('.addColumnDiv').css("color","white")
            $('.columnname').css("color","white")      
            $('#slidebar').css("border-top","1px solid #828fa3") 
            $('#mainContent').css("border-left","1px solid #828fa3") 
            $('#theme').css("border-top","1px solid #828fa3") 
            $('#mainContent').css("border-top","1px solid #828fa3") 
            $('#taskscontents').css("background","#2b2c37");
            $("#menu").attr("class","Menu");
            $("#editboardselect").attr("class","boardselect");
            $("#deleteboardselect").attr("class","boardselect");
        }
        else{
            $("#header").css("background","#ffffff");
            $("#slidebar").css("background","white");
            $("#MenuImg").attr("src","./assets/logo-dark.svg");
            $("#slidebar").css("background","white");
            $("#headDiv").css("border-left","1px solid #aba4ff");
            $("#mainContent").css("background","#e4ebfa");
            $("#selectTheme").css('background-color','#f4f7fd');
            $('#headTitle').css("color","black");
            $('.taskTitle').css("color","black");
            $('#circleDiv').css("color","black");
            $('.taskdiv').css("box-shadow","rgb(100 100 111 / 20%) 1vh 1vh 2vh 0vh")
            $('.taskdiv').css("background","white")
            $('.addColumnDiv').css("background","#eaf0fb")
            $('.addColumnDiv').css("color","black")
            $('.columnname').css("color","black")
            $('#slidebar').css("border-top","1px solid #aba4ff") 
            $('#mainContent').css("border-left","1px solid #aba4ff") 
            $('#theme').css("border-top","1px solid #aba4ff")
            $('#mainContent').css("border-top","1px solid #aba4ff")
            $('#taskscontents').css("background","white");
            $("#menu").attr("class","menu");
            $("#editboardselect").attr("class","BoardSelect");
            $("#deleteboardselect").attr("class","BoardSelect");

        }
    })
  
    $(".hideSideBar").click(function(){
        console.log("hi2")
        $("#slidebar").hide();
        $("#slidebarDark").hide();
        $("#Main").attr("id","mainDiv")
        $('#mainDiv').append("<div id='showslidebar' onclick='show()' class='showslidebar' ><img onclick='show()' class='showimg showslidebar' src='./assets/icon-show-sidebar.svg'/></div>")
    })

   


});
function show(){
    console.log("hiii")
    $("#slidebar").show();
    $("#slidebarDark").show();
    $('#showslidebar').hide();
    $("#mainDiv").attr("id","Main")
}

// function sendData(boardColumnDetails){
//     let tasks="";
//     fetch('/index',{
//         method:'POST',
//         headers: {
//             'Content-Type': 'column/json'
//           },
//           body: JSON.stringify({ tasks: boardColumnDetails })
          
//     })
//     .then((res)=>{
//         console.log(tasks)
//         return res.json();
//     })
//     .then((data)=>{
//         console.log(data);
//     })
//     .catch((err)=>{
//         console.log(err);
//     })
// }
