#!/usr/bin/env node

const http = require("http");
var mysql = require("mysql2")
var url = require("url")

var Connection = require('tedious').Connection;  
var config = {  
    userName: 'aseem',  
    password: '***',  
    server: '***',  
    // If you are on Microsoft Azure, you need this:  
    options: {encrypt: true, database: 'mydb'}  
};  


var server = http.createServer(function (req, res) {
	
  var parsed = url.parse(req.url, true);
  var desiredMethod = parsed.query.desiredMethod;

  var con = new Connection(config);
  var Request = require('tedious').Request

  con.on('connect', function(error) {
    if (error) throw error;
    console.log("Connected!");
  

    if(desiredMethod == 'MAKEUSR'){
      var uname = parsed.query.uname;
      var upass = parsed.query.upass;
      var uemail = parsed.query.uemail;
      var uavail = parsed.query.uavail;
      var sql = "INSERT INTO users (name, pass, email, avail) VALUES ('" + uname + "', '" + upass + "', '" + uemail + "', '" + uavail + "')";
      var request = new Request(sql, function(err) {  
       if (err) {  
          console.log(err);
        }  
      })

      request.on('doneInProc', function(rowCount, moore, roows){
        res.end("Made user");
      });

      con.execSql(request);
    }


    else if(desiredMethod == 'CHECKUSR'){
      var uname = parsed.query.uname;
      var upass = parsed.query.upass;
      var sql = "SELECT pass FROM users WHERE name='" + uname + "'";
      var request = new Request(sql, function(err) {  
       if (err) {  
          console.log(err);
        }  
      })

      request.on('row', function(columns) {  
        if(columns[0].value != upass){
          res.write('0');
        }
        else{
          res.write('1');
        }
      })

      request.on('doneInProc', function(rowCount, moore, roows){
        res.end();
      });

      con.execSql(request);
    }


    else if(desiredMethod == 'USREXISTS'){
      var uname = parsed.query.uname;
      var sql = "SELECT email FROM users WHERE name='" + uname + "'";
      var request = new Request(sql, function(err) {  
       if (err) {  
          console.log(err);
        }  
      })

      request.on('doneInProc', function(rowCount, moore, roows){
        if(rowCount == 0){
          res.end("0");
        }
        else{
          res.end("1");
        }
        
      });

      con.execSql(request);
    }


    else if(desiredMethod == 'ADDFOOD'){
      var uname = parsed.query.uname;
      var ufood = parsed.query.ufood;
      var returned = null;

      for(var i = 0; i < 10; i++){
        var sql = "SELECT food" + i + " FROM users WHERE name='" + uname + "'";
        var request = new Request(sql, function(err) {  
         if (err) {  
            console.log(err);
          }  
        })

        request.on('row', function(columns) {  
          returned = columns[0];

          if(returned == "null"){
            sql = "UPDATE users SET food" + i + "='" + ufood + "' WHERE name='" + uname + "'";
            var request2 = new Request(sql, function(err2) {  
             if (err2) {  
                console.log(err2);
              }  
            })

            request2.on('doneInProc', function(rowCount, moore, roows){
              res.end("Added food" + i);
            });

            con.execSql(request2);
          }
        })

        request.on('doneInProc', function(rowCount, moore, roows){
          if(i == 9 && returned != "null"){
            res.end("No empty food slots");
          }
          
        });

        con.execSql(request);
      } 
    }


    else if(desiredMethod == 'SETWANT'){ //it is upto the frontend to make sure that wantfood is set to null again after a certain time
      var uname = parsed.query.uname;
      var ufood = parsed.query.ufood;
      var sql = "UPDATE users SET wantfood='" + ufood + "' WHERE name='" + uname + "'";
      var request = new Request(sql, function(err) {  
       if (err) {  
          console.log(err);
        }  
      })
      
      request.on('doneInProc', function(rowCount, moore, roows){
        res.end("Set a want");
        
      });

      con.execSql(request);
    }


    else if(desiredMethod == 'GETFOODS'){
      var uname = parsed.query.uname;
      var sql = "SELECT food0, food1, food2, food3, food4, food5, food6, food7, food8, food9 FROM users WHERE name='" + uname + "'";
      var request = new Request(sql, function(err) {  
       if (err) {  
          console.log(err);
        }  
      })

      request.on('row', function(columns) {  
        var count = 0;
        res.write("{");
        columns.forEach(function(column) {
          res+= "food" + count + ": " column.value ", ";
          count++;  
        });  
        
        res.end("}"); 
      })

      con.execSql(request);
    }

    
    else if(desiredMethod == 'CHECKFREE'){ 
      var uname = parsed.query.uname;
      var uday = parsed.query.uday;
      var uhour = parsed.query.uhour;
      var ufood = parsed.query.ufood;
      var overalllist = [];
      for(var i = 0; i < 10; i++){
        var sql = "SELECT name FROM users WHERE food" + i + "='" + ufood + "' AND wantfood='null'"; 
        var request = new Request(sql, function(err) {  
         if (err) {  
            console.log(err);
          }  
        })

        request.on('row', function(columns) {  
          var sql2 = "SELECT avail FROM users WHERE name='" + columns[0].value + "'";
          var request2 = new Request(sql2, function(err2) {  
           if (err2) {  
              console.log(err2);
            }  
          })

          request2.on('row2', function(columns2) {  
            for(var k = 0; k < columns2[0].value.length; k++){
              if(columns2[0].value.charAt(k) == uday){
                  for(var l = k + 1; l < avail.length; l+=6){
                    if(columns2[0].value.charAt(l) == 'M' || columns2[0].value.charAt(l) == 'T' || columns2[0].value.charAt(l) == 'W' || columns2[0].value.charAt(l) == 'R' || columns2[0].value.charAt(l) == 'F' || columns2[0].value.charAt(l) == 'S' || columns2[0].value.charAt(l) == 'U'){
                      break;
                    }
                    var starttime = columns2[0].value.charAt(l) + columns2[0].value.charAt(l+1);
                    var endtime = columns2[0].value.charAt(l+3) + columns2[0].value.charAt(l+4);
                    if(+uhour >= +starttime && +uhour <= +endtime ){
                      overalllist += columns[0].value;
                      break;
                    }
                  }
                  break;
                }
              }

            })

        })

        request.on('doneInProc', function(rowCount, moore, roows){
          if(i == 9){
            res.end(overalllist.toString());
          }
        });
        
      }
      
    }
    
  });  
  
})

server.listen(80, (err) => {
	if ( ! err) {
		console.log(`server is listening on 80`)
	}
})

