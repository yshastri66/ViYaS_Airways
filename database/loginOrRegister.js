const mysql = require('mysql');

const conn = require('./db');

module.exports.login = function(username,password,Callback){
    const query1 = "SELECT USER_NAME FROM USER WHERE USER_NAME= '"+username+"';"
    conn.query(query1,(err,rows)=>{
        if(err){
            console.log(err);
        }
        else if(rows.length===0){
            Callback("user not found")
        }
        else{
            const query2 = "SELECT USER_NAME FROM USER WHERE PASSWORD='"+password+"';"
            conn.query(query2,(err,rows)=>{
                if(rows.length===0){
                    Callback("password error");
                }
                else if(rows[0].USER_NAME==='admin'){
                    Callback("admin");
                }
                else{
                    Callback("user",username);
                }
            })
            }
            
        
    });
    
}

module.exports.register = function(username,password,DOB,age,sex,address,email,mobnum,Callback){
    check =   "SELECT USER_NAME FROM USER WHERE USER_NAME='"+username+"';";
    insert = `INSERT INTO USER(USER_NAME,PASSWORD,PH_NO,E_MAIL,DOB,ADDRESS,SEX,AGE) VALUES('${username}','${password}','${mobnum}','${email}','${DOB}','${address}','${sex}',${age});`
    
    conn.query(check,(err,rows)=>{
        if(rows.length!==0){
            Callback(false);
        }
        else{
            conn.query(insert,(err)=>{
                if(err){
                    console.log(err);
                }
                else{
                    Callback(true);
                }
            })
        }
    })
    
}

