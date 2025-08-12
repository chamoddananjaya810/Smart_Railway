
//window.addEventListener("load",async function (){
//    
//    const  response=await fetch("");
//    
//})
//
async  function getUserData() {
    const  response = await fetch("MyAccount");
    if (response.ok) {
        const  json =await response.json();
//        console.log(json);
        document.getElementById("username").innerHTML=`Hello,${json.fristname}${json.lastname}`; 
        document.getElementById("since").innerHTML=`Smart Trade Member Since,${json.since}`; 
        document.getElementById("fristname").value=json.fristname;
        document.getElementById("lastname").value=json.lastname;
        document.getElementById("currentpassword").value=json.currentpassword;
    
        
    } else {
          console.log("error");
    }
}