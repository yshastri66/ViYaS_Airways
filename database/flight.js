const mysql = require('mysql');

const conn = require('./db');


module.exports.flightadd = function(From,To,Ddate,Adate,Fare,ArrivalTime,DepartureTime,AvaSeats,Callback){
    const insert = `INSERT INTO FLIGHT(TOTAL_SEATS,DEP_TIME,ARR_TIME,FROM_CITY,TO_CITY,ARR_DATE,FARE,DEP_DATE) VALUES(${AvaSeats},'${DepartureTime}','${ArrivalTime}','${From}','${To}','${Adate}',${Fare},'${Ddate}');`;
    conn.query(insert,(err)=>{
        if(err){
            console.log(err);
            Callback(false);
        }
        else{
            const flightidtaking = "SELECT FLIGHT_ID FROM FLIGHT WHERE AVAIL_SEATS IS NULL;";
            conn.query(flightidtaking,(err,rows)=>{
                if(err) throw err;
                trig_name = 'seat'+rows[0].FLIGHT_ID;
                // 2 triggers.. One for reducing seats and another one for increasing seat.
                const trigger1 = `UPDATE FLIGHT SET AVAIL_SEATS=${AvaSeats} WHERE FLIGHT_ID=${rows[0].FLIGHT_ID};\
                CREATE TRIGGER ${trig_name} BEFORE INSERT ON BOARDING_PASS FOR EACH ROW BEGIN\
                UPDATE FLIGHT SET AVAIL_SEATS=CASE WHEN AVAIL_SEATS>1 THEN AVAIL_SEATS-1 ELSE NULL END WHERE FLIGHT_ID=${rows[0].FLIGHT_ID};\
                END;`;

                trig_name = 'seats'+rows[0].FLIGHT_ID;
                const trigger2 = `CREATE TRIGGER ${trig_name} BEFORE UPDATE ON BOARDING_PASS FOR EACH ROW BEGIN\
                UPDATE FLIGHT SET AVAIL_SEATS=CASE WHEN AVAIL_SEATS<${AvaSeats} THEN AVAIL_SEATS+1 ELSE AVAIL_SEATS END WHERE FLIGHT_ID=${rows[0].FLIGHT_ID};\
                END;`;

                conn.query(trigger1,(err)=>{
                    if(err){
                        console.log(err);
                    }
                    conn.query(trigger2,(err)=>{
                        if(err){
                            console.log(err);
                        }else{
                            Callback(true);
                        }
                            
                    })
                })   
            })
        }
    })
}


module.exports.flightdelete = function(flightid,Callback){
    query = "DELETE FROM FLIGHT WHERE FLIGHT_ID="+flightid+";";
    conn.query(query,(err)=>{
        if(err){
            console.log(err);
        }
    })

}

module.exports.display = function(Callback){
    query = "CALL FlightList();";

    conn.query(query,(err,rows)=>{
        if(err){
            console.log(err);
        }else{
            let table1 = []
            for(let i=0; i<rows.length;i+=2){
                table1.push(rows[i])
            }
            q4 = "SELECT * FROM CREW WHERE TYPE= 'Pilot';";
            conn.query(q4,(err,rows1)=>{
                if(err){
                    console.log(err)
                }else{
                    const table2 = rows1
                    q5 = "SELECT * FROM CREW WHERE TYPE= 'Air hostess';";
                    conn.query(q5,(err,rows2)=>{
                        if(err){
                            console.log(err);
                        }else{
                            q6 = "SELECT * FROM CREW;";
                            const table3 = rows2;
                            conn.query(q6,(err,rows3)=>{
                                if(err){
                                    console.log(err);
                                }else{
                                    
                                    Callback(table1,table2,table3,rows3);
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

module.exports.passenger = function(flightid,Callback){
    q7 = `SELECT U.USER_ID,B.PASS_NAME,B.STATUS,P.TRANS_ID,P.MODE,P.TIME,P.FARE,B.SEAT_NUMBER,P.FLIGHT_ID FROM USER U,PAYMENT P,BOARDING_PASS B WHERE U.USER_ID = P.USER_ID AND P.TRANS_ID=B.TRANS_ID AND P.FLIGHT_ID = '${flightid}'`;

    conn.query(q7,(err,rows)=>{
        if(err){
            console.log(err);
        }else{
            Callback(rows);
        }
    })
}