let globalname = require("../app");


var middlewareObj = {};


middlewareObj.mid_ware1 = function(req,res,next){

     if(globalname.globalname === undefined) {
         //unauthorised
        //console.log(globalname);
        res.redirect("/login")
    }else if(globalname.globalname.username && globalname.globalname.username === 'admin'){
        //authorised
        //console.log(globalname);
        next();
     }else{
        res.redirect("/login")
     }
}

middlewareObj.mid_ware2 = function(req,res,next){
    if(globalname.globalname === undefined) {
        //unauthorised
       //console.log(globalname);
       res.redirect("/login")
   }else if(globalname.globalname.username && globalname.globalname.username !== 'admin' ){
       //authorised
       //console.log(globalname);
       next();
    }else{
        res.redirect("/login")
     }
}

module.exports = middlewareObj;

