/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

async function signOut(){
//     document.getElementById("spinner").style.display="block";
    const  response=await fetch("SignOut");
    try {
          if (response.ok) {
        const  json=  await response.json();
        if (json.status) {
            window.location = "sign-in.html";
        } else {
            window.location.reload();
        }
    }else{
        
        console.log("Logout");
    }
    } catch (e) {
        
    }finally {
//        document.getElementById("spinner").style.display="none";
    }

    
}
