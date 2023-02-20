
window.addEventListener("load", function () {
    // document.getElementById("Main").style.display="grid";
    // document.getElementById("Main").style.gridTemplateColumns="15% 85%";
    // document.getElementById("Main").style.gridTemplateRows="100%";
    // $("#Main").append("");
    const slideBar=document.getElementById("slidebar");
    
    // $("#slidebar").append("<div id=board ></div>")
    // $("#slidebar").append("<div id=theme ></div>")
    $("#theme").append("<div id=selectTheme><img class=logo src=./assets/icon-dark-theme.svg /><input id=checkbox type=checkbox />  <img class=logo src=./assets/icon-light-theme.svg </div>")
    $("#theme").append("<div id=hideSidebar class=hideSideBar > <img class=hide src=./assets/icon-hide-sidebar.svg /> Hide Sidebar </div>")
    

    $("#checkbox").click(function(){
        if($("#checkbox").is(":checked")){
            ($("#whole-container").attr("id","WholeContainer"));
            ($("#header").attr("id","HeaderDark"));
            ($("#slidebar").attr("id","slidebarDark"));
            ($("#MenuImg").attr("src","./assets/logo-light.svg"));
            ($("#headDiv").attr("id","headerDiv"));
            ($("#selectTheme").attr("id","darkTheme"));

        }
        else{
            ($("#WholeContainer").attr("id","whole-container"));
            ($("#HeaderDark").attr("id","header"));
            ($("#slidebarDark").attr("id","slidebar"));
            ($("#MenuImg").attr("src","./assets/logo-dark.svg"));
            ($("#darkTheme").attr("id","selectTheme"));

        }
    })
  
    $(".hideSideBar").click(function(){
        $("#slidebar").remove();
        $("#slidebarDark").remove();
        $("#Main").attr("id","mainDiv")
    })

   
 

});

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