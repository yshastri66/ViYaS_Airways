const express = require("express");
const app = express();
const mysql = require('mysql');
const methodoverride = require('method-override');
const authent = require('./database/loginOrRegister');
const flight = require('./database/flight');
const ticket = require('./database/ticket');
const crew = require('./database/crew');
const path = require('path');
const { Console } = require("console");
//const hostname = "localhost";
let port = process.env.PORT || 3000;
http = require("http");
const server = http.createServer(app);

const middleware = require('./database/middleware');


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended : true}))
app.use(methodoverride('_method'));




//main page-------------------------------------------------
app.get("/",function(req,res){  
    res.render("landing");
    
});



//login page---------------------------------------------
app.get("/login",function(req,res){
    const error = ""
    res.render("login",{error});
});

app.post('/login',(req,res)=>{
    const{ username , password } = req.body;
    module.exports.globalname = req.body;
    authent.login(username,password,function(authent,username){
        if(authent==='admin'){
            res.redirect('/admin');
        }
        else if(authent==='user'){
            const display = ""
            const display2 = ""
            app.locals.globalname = username;
            module.exports.globalname = req.body;
            res.render('indexPassenger',{display,display2});
        }
        else if(authent==='password error'){
            const error = "password error"
            res.render('login',{error});
        }
        else{
            error = "no user found"
            res.render('login',{error});
        }
    });
})



//register page--------------------------------------------
app.get("/register",function(req,res){
    message = ""
    res.render("register",{message});
});

app.post("/register",(req,res)=>{
    const {username,password,DOB,age,sex,address,email,mobnum} = req.body;
    authent.register(username,password,DOB,age,sex[0],address,email,mobnum,function(value){
        if(value===false){
            message = "user exist"
            res.render('register',{message});
        }
        else{
            error = "";
            res.render('login',{error});
        }
    });
});



//Adding flight---------------------------------------------------
app.get("/addFlight",middleware.mid_ware1,function(req,res){
    res.render("addFlight");
});


app.post("/addFlight",middleware.mid_ware1,(req,res)=>{
    const {From,To,Ddate,Adate,Fare,ArrivalTime,DepartureTime,AvaSeats} = req.body;
    flight.flightadd(From,To,Ddate,Adate,Fare,ArrivalTime,DepartureTime,AvaSeats,function(value){
        if(value===true){
            res.redirect('/admin');
        }
        else{
            res.render("addFlight");
        }
    })

})



//Admin page----------------------------------------------------

app.get("/admin",middleware.mid_ware1,function(req,res){
    
    flight.display(function(table1,table2,table3,table4){
        res.render("indexAdmin",{table1,table2,table3,table4});
    })
   
});

app.post("/admin",middleware.mid_ware1,(req,res)=>{
    const {crewid,flightid} = req.body;
    if(crewid === undefined){
        flight.passenger(flightid,function(table){
            const val=true;
            return(res.render("passengerlist",{table,val}));
    });
    }else if(flightid === undefined){
        crew.display(crewid,function(table){
            res.render("crewEdit",{crewid,table});
        });     
    }
});

app.delete("/admin",middleware.mid_ware1,(req,res)=>{

    const { flightid ,crewid } = req.body;
    if(crewid === undefined){
        flight.flightdelete(flightid);
    }else if(flightid === undefined){
        crew.crew_delete(crewid);
    }
    res.redirect('/admin');
})



// Passenger page ------------------------------------------------------------------
app.get("/passenger",middleware.mid_ware2,function(req,res){
    const display = "";
    const display2="";
    res.render("indexPassenger",{display,display2});

});



//Book ticket page--------------------------------------------------------
app.get("/bookTicket",middleware.mid_ware2,function(req,res){
    const display = false;
    const content = false;
    const main = true;
    ticket.clear();
    res.render("bookTicket",{display,content,main});
});

app.post('/bookTicket',middleware.mid_ware2,(req,res)=>{
    const {From,To,Ddate,flightid,password,pname,mode} = req.body;
    if(password===undefined && flightid===undefined){    
        ticket.search(From,To,Ddate,function(table){
            if(table===false){
                const display = "No flights availble on this day";
                const content = false
                const main = true
                res.render('bookTicket',{display,content,main});
            }
            else{
                const display = true;
                const content = false;
                const main = true;
                res.render('bookTicket',{table,display,content,main});
            }
        })
    }
    else if(flightid !== undefined){
        const main = false;
        const content = true;
        const display = "";
        error = false
        ticket.payment_initial(flightid);
        res.render('bookTicket',{display,main,content,error});
    }
    else{
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        ticket.payment(password,mode,time,pname,function(message){
            if(message==='No user found'){
                const main = false;
                const content = true;
                const display = "";
                const error = true;
                res.render('bookTicket',{display,main,content,error});
            }
            else{
                display = true;
                display2 = ""
                res.render('indexPassenger',{display,display2});
            }
        })


    }
})


//crew add---------------------------------------------------------

app.get("/addCrewDetails",middleware.mid_ware1,function(req,res){
    message = ""
    res.render("addCrewDetails",{message});
});

app.post("/addCrewDetails",middleware.mid_ware1,(req,res)=>{
    const {name,type,dob,age,sex,Flight_Id,address,salary,email,phone} = req.body;
    crew.crew_add(name,type,dob,age,sex[0],Flight_Id,address,salary,email,phone,function(value1){
        if(value1 === 'flight id error'){
            message = "Flight ID doesnt exist..";
            res.render("addCrewDetails",{message});
        }else if(value1 === true) {
            res.redirect("/admin");
        }
        else{message = "";
            res.render("addCrewDetails",{message});
        }
    })
});

app.post("/crewEditDetails",middleware.mid_ware1,(req,res)=>{
    const {name,type,dob,age,sex,Flight_Id,address,salary,email,phone,crewid} = req.body;
    crew.edit(name,type,dob,age,sex[0],Flight_Id,address,salary,email,phone,crewid,function(value){
        if(value === true){
            res.redirect("/admin");
        }else if(value === false){
            res.redirect("/admin");
        }
    })
})



//passenger display -------------------------------------------------------------
app.get('/passlist',middleware.mid_ware1,(req,res)=>{
    const val =false
    res.render('passengerlist',{val});
})


//Ticket display ------------------------------------------------------------------
app.get('/ticket',middleware.mid_ware2,(req,res)=>{
    const table=""
    res.render('viewTicket',{table});
})

app.post('/ticket',middleware.mid_ware2,(req,res)=>{
    const {submit,tick} = req.body;
    if(tick===undefined){
        ticket.disTicket(submit,function(table){
        res.render('viewTicket',{table});
        })
    }
    else{
        console.log(tick)
        ticket.deleteTicket(tick,function(ans){
            display = ""
            display2 = true;
            res.render('indexPassenger',{display,display2})
        })
    }
})


// Sever running -----------------------------------------------------------
server.listen(port,()=>{
    console.log("Server running")
})

//---------------------------------------------------- END --------------------------------------------
