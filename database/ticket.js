const mysql = require('mysql');

const conn = require('./db');


module.exports.search = function(from,to,date,Callback){
    query = `SELECT * FROM FLIGHT WHERE FROM_CITY = '${from}' AND TO_CITY = '${to}' AND DEP_DATE = '${date}';`;

    conn.query(query,(err,rows)=>{
        if(err){
            console.log(err);
        }else if(rows.length ===0){
            Callback(false);
        }
        else{
            Callback(rows);
        }
    })

}

module.exports.payment_initial = function(flightid){
    query = `INSERT INTO PAYMENT(FLIGHT_ID) VALUES(${flightid});`
    conn.query(query,(err)=>{
        if(err){
            console.log(err);
        }
    })
}

//PAYMENT QUERY-----------------------------------------------------------------------------------------------------------------------
module.exports.payment =function(password,mode,time,pname,Callback){
    const check_user = "SELECT USER_ID FROM USER WHERE PASSWORD='"+password+"';"
    
    conn.query(check_user,(err,rows)=>{
        if(err) console.log(err);
        if(rows.length===0){
            Callback("No user found");
        }
        else{
            const flight_query = "SELECT FLIGHT_ID,TRANS_ID FROM PAYMENT WHERE USER_ID IS NULL;";
            const userid = rows[0].USER_ID;
            conn.query(flight_query,(err,rows)=>{
                if(err) console.log(err);
                const flightid = rows[0].FLIGHT_ID;
                const transid = rows[0].TRANS_ID;
                message = fary(flightid,userid,transid,time,mode,pname);
                Callback(message);
                
            }) 
    
        }
    })
}


function fary(flightid,userid,transid,time,mode,pname){
    query = `SELECT FARE FROM FLIGHT WHERE FLIGHT_ID=${flightid};`;
    conn.query(query,(err,rows)=>{
        if(err) console.log(err);
        const fare = rows[0].FARE;
        return(finale(flightid,userid,transid,fare,time,mode,pname));
    })

}

function finale(flightid,userid,transid,fare,time,mode,pname){
    query = `UPDATE PAYMENT SET MODE='${mode}' ,USER_ID=${userid} ,FARE=${fare} ,TIME='${time}' WHERE TRANS_ID=${transid};`;
    conn.query(query,(err)=>{
        if(err) console.log(err);
        return(board_pass(pname,flightid,transid));
    })
    

}

//-----------------------------------------------------------------------------------------------------------------------------


function board_pass(pname,flightid,transid){
    const query = `SELECT F.DEP_DATE,F.DEP_TIME,F.FROM_CITY,F.TO_CITY FROM FLIGHT F WHERE F.FLIGHT_ID=${flightid};`
    const alpha = "ABCDEFGH";
    const nums = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
    let random1 = alpha[Math.floor(Math.random()*8)];
    let random2 = nums[Math.floor(Math.random()*20)];
    const seatnumber = random1+random2;
    conn.query(query,(err,rows)=>{
        if(err) throw err;
        console.log(rows);   
        in_query = `INSERT INTO BOARDING_PASS(PASS_NAME,TRANS_ID,DATE,BOARD_TIME,FROM_CITY,TO_CITY,SEAT_NUMBER,STATUS) VALUES('${pname}',${transid},'${rows[0].DEP_DATE}','${rows[0].DEP_TIME}','${rows[0].FROM_CITY}','${rows[0].TO_CITY}','${seatnumber}','Confirmed');`;
        conn.query(in_query,(err)=>{
            if(err) throw err;
            return("success");
        })
    })
};


module.exports.clear = function(){
    const query = 'DELETE FROM PAYMENT WHERE USER_ID IS NULL;'
    conn.query(query,(err)=>{
        if(err) throw err;
    })
}



module.exports.disTicket = function(username,Callback){
    query= `SELECT B.PNR_NUM,B.PASS_NAME,B.DATE,B.BOARD_TIME,B.FROM_CITY,B.TO_CITY,B.SEAT_NUMBER,P.FARE,B.STATUS FROM BOARDING_PASS B,PAYMENT P,USER U WHERE U.USER_ID=P.USER_ID AND P.TRANS_ID=B.TRANS_ID AND U.USER_NAME='${username}';`
    conn.query(query,(err,rows)=>{
        if(err) throw err;
        Callback(rows);
    })
}


module.exports.deleteTicket = function(pnr,Callback){
    query = `UPDATE BOARDING_PASS SET STATUS='Cancelled' where PNR_NUM=${pnr};`
    conn.query(query,(err)=>{
        if(err) Callback("failed")
        else Callback("success")
    })
}