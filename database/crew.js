const mysql = require('mysql');

const conn = require('./db');

module.exports.crew_add = function(name,type,dob,age,sex,Flight_Id,address,salary,email,phone,Callback){
    const q1 = "SELECT FLIGHT_ID FROM FLIGHT WHERE FLIGHT_ID = "+Flight_Id+";";
    const q2 = `INSERT INTO CREW(NAME,TYPE,DOB,ASS_FLIGHT,AGE,SEX,SALARY,EMAIL,PH_NO,ADDRESS) VALUES('${name}','${type}','${dob}',${Flight_Id},${age},'${sex}',${salary},'${email}','${phone}','${address}');`;

    conn.query(q1,(err,rows)=>{
        if(rows.length === 0){
            Callback("flight id error");
        }else{
            conn.query(q2,(err)=>{
                if(err){
                    console.log(err);
                }else{
                    
                    Callback(true);
                }
            })
        }
    })
}

module.exports.crew_delete = function(crewid,Callback){
    q3 = "DELETE FROM CREW WHERE CREW_ID= "+crewid+";";

    conn.query(q3,(err)=>{
        if(err){
            console.log(err);
        }
    })
}

module.exports.display = function(crewid,Callback){
    q6 = "SELECT * FROM CREW WHERE CREW_ID="+crewid+";";
    
    conn.query(q6,(err,rows)=>{
        if(err){
            console.log(err);
        }else{
            Callback(rows);
        }
    })
}

module.exports.edit = function(name,type,dob,age,sex,Flight_Id,address,salary,email,phone,crewid,Callback){
    q7 = `UPDATE CREW SET NAME ='${name}' ,TYPE = '${type}',DOB = '${dob}',ASS_FLIGHT=${Flight_Id},AGE=${age},SEX='${sex}',ADDRESS='${address}',SALARY='${salary}',EMAIL='${email}',PH_NO='${phone}' WHERE CREW_ID='${crewid}';`;

    conn.query(q7,(err,rows)=>{
        if(err){
            console.log(err);
            Callback(false);
        }else{
            Callback(true);
        }
    })
}