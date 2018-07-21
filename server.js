#!/usr/bin/env node

const http = require("http");
var mysql = require("mysql2")
var url = require("url");
var express = require('express');
var bodyParser = require('body-parser');


var app = express();


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


var Connection = require('tedious').Connection;  
var config = {  
    userName: '',  
    password: '',  
    server: '',  
    // If you are on Microsoft Azure, you need this:  
    options: {encrypt: true, database: 'mydb'}  
};  


app.get('/', function(req, res) {


  var parsed = url.parse(req.url, true);


  if(Object.keys(parsed.query).length === 0){
    res.end("No queries");
  }

  var desiredMethod = parsed.query.desiredMethod;

  var con = new Connection(config);
  var Request = require('tedious').Request

  con.on('connect', function(error) {
    if (error) throw error;
    console.log("Connected!");
  

    if(desiredMethod == 'USREXISTS'){
      var uname = parsed.query.uname;
      var sql = "SELECT email FROM users WHERE name='" + uname + "'";
      var request = new Request(sql, function(err) {  
       if (err) {  
          console.log(err);
        }  
      })

      request.on('row', function(columns) {  
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
  

    else if(desiredMethod == 'SETWANT'){ //it is upto the frontend to make sure that wantfood is set to null again after a certain time
      var uname = parsed.query.uname;
      var ufood = parsed.query.ufood;
      var sql = "UPDATE users SET wantfood='" + ufood + "' WHERE name='" + uname + "'";
      var request = new Request(sql, function(err) {  
       if (err) {  
          console.log(err);
        }  
      })
      
      request.on('row', function(columns) {  
      })

      request.on('doneInProc', function(rowCount, moore, roows){
        res.end("Set a want");
        
      });

      con.execSql(request);
    }


    else if(desiredMethod == 'RESETWANT'){ //it is upto the frontend to make sure that wantfood is set to null again after a certain time
      var uname = parsed.query.uname;
      var sql = "UPDATE users SET wantfood = NULL WHERE name='" + uname + "'";
      var request = new Request(sql, function(err) {  
       if (err) {  
          console.log(err);
        }  
      })
      
      request.on('row', function(columns) {  
      })

      request.on('doneInProc', function(rowCount, moore, roows){
        res.end("Reset want");
        
      });

      con.execSql(request);
    }


    else if(desiredMethod == 'CHECKWANT'){
      var uname = parsed.query.uname;
      var ufood = parsed.query.ufood;
      var sql = "SELECT wantfood FROM users WHERE name='" + uname + "'";
      var request = new Request(sql, function(err) {  
       if (err) {  
          console.log(err);
        }  
      })
      
      request.on('row', function(columns) {  
        if(columns[0].value != ufood){
          res.end("0");
        }
        else{
          res.end("1");
        }
      })

      request.on('doneInProc', function(rowCount, moore, roows){
        
        
      });

      con.execSql(request);
    }
    

    else if(desiredMethod == 'GETFOODS'){
      var uname = parsed.query.uname;
      var overalllist = [];
      var count = 0;
      var sql = "SELECT food0, food1, food2, food3, food4, food5, food6, food7, food8, food9 FROM users WHERE name='" + uname + "'";
      var request = new Request(sql, function(err) {  
       if (err) {  
          console.log(err);
        }  
      })

      request.on('row', function(columns) {  
        
        columns.forEach(function(column) {
          if(column.value + "" != "null"){
            overalllist.push(column.value);
          }
          count++;  

          if(count == 10){
            res.end(overalllist.toString());
          }
        });  
        
      });

      request.on('doneInProc', function(rowCount, moore, roows){
        if(count == 10){
          res.end(overalllist.toString());
        }
      });

      con.execSql(request);
    }


    else if(desiredMethod == 'ADDFOOD'){
      var uname = parsed.query.uname;
      var ufood = parsed.query.ufood;
      var found = false;
      var toreturn = false;
      var request2;
      var i = 0;
      var count = 0;
      var sql = "SELECT food0, food1, food2, food3, food4, food5, food6, food7, food8, food9 FROM users WHERE name='" + uname + "'";
      var request = new Request(sql, function(err) {  
       if (err) {  
          console.log(err);
        }  
      })

      request.on('row', function(columns) {  
        count = 0;
        columns.forEach(function(column) {
          if(toreturn == true){
            return;
          }
          if((column.value + "") == (ufood + "")){
            toreturn = true;
            return;
          }
          if((column.value + "") == "null" && found == false){
            var con2 = new Connection(config);
            found = true;
            i = count;
            con2.on('connect', function(error) {
              var sql2 = "UPDATE users SET food" + i + "='" + ufood + "' WHERE name='" + uname + "'";
              request2 = new Request(sql2, function(err2) {  
               if (err2) {  
                  console.log(err2);
                }  
              })

              request2.on('row', function(columns2) {  
              })

              request2.on('doneInProc', function(roowCount, moore, roows){
                res.end("Added food" + i);
              });
              con2.execSql(request2);
            })
            
          }
          count++;  
        });  
      });

      

      request.on('doneInProc', function(rowCount, moore, roows){
        if(found == false){
          res.end("No empty food");
        }
        
      });

      con.execSql(request);
    }


    else if(desiredMethod == 'GROUPUSRS'){ 
      var ufood = parsed.query.ufood;
      var overalllist = [];

      var sql = "SELECT name FROM users WHERE (food0='" + ufood + "' OR food1='" + ufood + "' OR food2='" + ufood + "' OR food3='" + ufood + "' OR food4='" + ufood + "' OR food5='" + ufood + "' OR food6='" + ufood + "' OR food7='" + ufood + "' OR food8='" + ufood + "' OR food9='" + ufood + "')"; 
      var request = new Request(sql, function(err) {  
       if (err) {  
          console.log(err);
        }  
      })

      request.on('row', function(columns) {
        overalllist.push(columns[0].value);
      })

      
      request.on('doneInProc', function(rowCount, moore, roows){
        res.write(overalllist.length + ",");
        res.end(overalllist.toString());
      });
      
      con.execSql(request);
    }


    else if(desiredMethod == 'WANTUSRS'){ 
      var ufood = parsed.query.ufood;
      var overalllist = [];

      var sql = "SELECT name FROM users WHERE wantfood='" + ufood + "'"; 
      var request = new Request(sql, function(err) {  
       if (err) {  
          console.log(err);
        }  
      })

      request.on('row', function(columns) {
        overalllist.push(columns[0].value);
      })

      
      request.on('doneInProc', function(rowCount, moore, roows){
        res.write(overalllist.length + ",");
        res.end(overalllist.toString());
      });
      
      con.execSql(request);
    }


    else if(desiredMethod == 'CHECKFREE'){ 
      var uday = parsed.query.uday;
      var uhour = parsed.query.uhour;
      var ufood = parsed.query.ufood;
      var overalllist = [];
      var numdone = 0;
      var rowCount = -1;

      var sql = "SELECT name FROM users WHERE (food0='" + ufood + "' OR food1='" + ufood + "' OR food2='" + ufood + "' OR food3='" + ufood + "' OR food4='" + ufood + "' OR food5='" + ufood + "' OR food6='" + ufood + "' OR food7='" + ufood + "' OR food8='" + ufood + "' OR food9='" + ufood + "') AND (wantfood IS NULL OR wantfood='" + ufood + "')"; 
      var request = new Request(sql, function(err) {  
       if (err) {  
          console.log(err);
        }  
      })

      request.on('row', function(columns) {
        var conn2 = new Connection(config);
        conn2.on('connect', function(error) {
          
          var sql2 = "SELECT avail FROM users WHERE name='" + columns[0].value + "'";
          console.log("Contender: " + columns[0].value)
          var request2 = new Request(sql2, function(err2) {  
           if (err2) {  
              console.log(err2);
            }  
          })

          request2.on('row', function(columns2) {  
            for(var k = 0; k < columns2[0].value.length; k++){
              if(columns2[0].value.charAt(k) + "" == uday){
                for(var l = k + 1; l < columns2[0].value.length; l+=6){
                  if(columns2[0].value.charAt(l) == 'M' || columns2[0].value.charAt(l) == 'T' || columns2[0].value.charAt(l) == 'W' || columns2[0].value.charAt(l) == 'R' || columns2[0].value.charAt(l) == 'F' || columns2[0].value.charAt(l) == 'S' || columns2[0].value.charAt(l) == 'U'){
                    break;
                  }
                  var starttime = columns2[0].value.charAt(l) + columns2[0].value.charAt(l+1);
                  var endtime = columns2[0].value.charAt(l+3) + columns2[0].value.charAt(l+4);
                  console.log(columns[0].value + "'s time: " + columns2[0].value.charAt(k) + starttime + "-" + endtime)
                  if(parseInt(uhour) >= parseInt(starttime) && parseInt(uhour) <= parseInt(endtime)){
                    overalllist.push(columns[0].value);
                    break;
                  }
                }
                break;
              }
            }

          })

          request2.on('doneInProc', function(roowCount, moore, roows) {  
            numdone++;
            if(numdone == rowCount){
              res.write(overalllist.length + ",");
              res.end(overalllist.toString());
            }
          })

          conn2.execSql(request2);
        })
      })

      
      request.on('doneInProc', function(roowCount, moore, roows){
        rowCount = roowCount;
        if(numdone == rowCount){
          res.write(overalllist.length + ",");
          res.end(overalllist.toString());
        }
      });
      
      con.execSql(request);
    }


    else if(desiredMethod == 'USRVOTE'){
      var uname = parsed.query.uname;
      var sql = "SELECT numvotes FROM users WHERE name='" + uname + "'";
      var request = new Request(sql, function(err) {  
       if (err) {  
          console.log(err);
        }  
      })

      request.on('row', function(columns) {  
        
        if(columns[0].value + "" > 0){
          var con2 = new Connection(config);
          con2.on('connect', function(error) {
            var sql2 = "UPDATE users SET numvotes=numvotes-1 WHERE name='" + uname + "'";
            var request2 = new Request(sql2, function(err2) {  
             if (err2) {  
                console.log(err2);
              }  
            })

            request2.on('row', function(columns) { 
            })

            request2.on('doneInProc', function(rowCount, moore, roows){
              var tempnum  = +columns[0].value - 1;
              res.end(tempnum + "");
            });

            con2.execSql(request2);
          })
        }
        else{
          res.end("-1")
        }
        
      });

      request.on('doneInProc', function(rowCount, moore, roows){
        
      });

      con.execSql(request);
    }


    else if(desiredMethod == 'GETVOTES'){
      var uname = parsed.query.uname;
      var sql = "SELECT numvotes FROM users WHERE name='" + uname + "'";
      var request = new Request(sql, function(err) {  
       if (err) {  
          console.log(err);
        }  
      })

      request.on('row', function(columns) {  
        
        res.end(columns[0].value + "");
        
      });

      request.on('doneInProc', function(rowCount, moore, roows){
        
      });

      con.execSql(request);
    }


    else if(desiredMethod == 'GETAVAIL'){
      var uname = parsed.query.uname;
      var sql = "SELECT avail FROM users WHERE name='" + uname + "'";
      //var sql = "UPDATE users SET numvotes=3"
      var request = new Request(sql, function(err) {  
       if (err) {  
          console.log(err);
        }  
      })

      
      request.on('row', function(columns) {  
        
        res.end(columns[0].value);
      })

      request.on('doneInProc', function(rowCount, moore, roows){
        res.end();
      });

      con.execSql(request);
    }


    //For the foodgroup table

    else if(desiredMethod == 'MOSTPOP'){
      var ugroup = parsed.query.ugroup;
      var sql = "SELECT vote0, vote1, vote2, vote3, vote4, vote5, vote6, vote7, vote8, vote9 FROM foodgroup WHERE main='" + ugroup + "'";
      var request = new Request(sql, function(err) {  
       if (err) {  
          console.log(err);
        }  
      })

      
      request.on('row', function(columns) {  
        var biggest = null;
        var count = 0;
        var bigindex = null;
        for(count = 0;count < 10; count++) {
          
          if(columns[count].value + "" != "null"){

            if(biggest == null){
              biggest = columns[count].value;
              bigindex = count;
            }
            else if(columns[count].value > biggest){
              biggest = columns[count].value;
              bigindex = count;
            }
          }
          //count++;
        }

        
        if(bigindex + "" == "null" && count == 10){
          res.end("Vote on a place!")
        }
        

        var con2 = new Connection(config);
        con2.on('connect', function(error) {
          var sql2 = "SELECT want" + bigindex + " FROM foodgroup WHERE main='" + ugroup + "'";
          var request2 = new Request(sql2, function(err2) {  
           if (err2) {  
              console.log(err2);
            }  
          })

          request2.on('row', function(columns2) { 
            res.end(columns2[0].value);
          })

          request2.on('doneInProc', function(rowCount, moore, roows){
          });

          con2.execSql(request2);
        })
      })

      request.on('doneInProc', function(rowCount, moore, roows){
        if(rowCount == 0){
          var con2 = new Connection(config);
          con2.on('connect', function(error) {
            var sql2 = "INSERT INTO foodgroup (main) VALUES ('" + ugroup + "')";
            var request2 = new Request(sql2, function(err2) {  
             if (err2) {  
                console.log(err2);
              }  
            })

            request2.on('row', function(columns) { 
            })

            request2.on('doneInProc', function(rowCount, moore, roows){
              res.end("Vote on a place!")
            });

            con2.execSql(request2);
          })
        }
        
      });

      con.execSql(request);
    }


    else if(desiredMethod == 'ADDVOTE'){
      var ugroup = parsed.query.ugroup;
      var uwant = parsed.query.uwant;
      var found = false;
      var sql = "SELECT want0, want1, want2, want3, want4, want5, want6, want7, want8, want9 FROM foodgroup WHERE main='" + ugroup + "'";
      var request = new Request(sql, function(err) {  
       if (err) {  
          console.log(err);
        }  
      })

      request.on('row', function(columns) {
        var count = 0;
        var i = 0;
        columns.forEach(function(column) {
          if(column.value == uwant){
            count = i;
            found = true;
            var con2 = new Connection(config);
            con2.on('connect', function(error) {
              var sql2 = "UPDATE foodgroup SET vote" + count + " = vote" + count + " + 1 WHERE main='" + ugroup + "'";
              var request2 = new Request(sql2, function(err2) {  
               if (err2) {  
                  console.log(err2);
                }  
              })

              request2.on('row', function(columns) { 
                
              })

              request2.on('doneInProc', function(rowCount, moore, roows){
                res.end("Incremented vote" + count);
              });

              con2.execSql(request2);
            })
          }

          i++;
        });  
         
      });

      request.on('doneInProc', function(rowCount, moore, roows){
        if(rowCount == 0){
          var con2 = new Connection(config);
          con2.on('connect', function(error) {
            var sql2 = "INSERT INTO foodgroup (main, want0, vote0) VALUES ('" + ugroup + "', '" + uwant + "', 1)";
            var request2 = new Request(sql2, function(err2) {  
             if (err2) {  
                console.log(err2);
              }  
            })

            request2.on('row', function(columns) { 
            })

            request2.on('doneInProc', function(rowCount, moore, roows){
              res.end("Inserted " + ugroup)
            });

            con2.execSql(request2);
          })
        }
        if(found == false){
          res.end("Restaurant doesn't exist");
        }
        
      });

      con.execSql(request);
    }


    else if(desiredMethod == 'ADDWANT'){
      var ugroup = parsed.query.ugroup;
      var uwant = parsed.query.uwant;
      var found = false;
      var sql = "SELECT want0, want1, want2, want3, want4, want5, want6, want7, want8, want9 FROM foodgroup WHERE main='" + ugroup + "'";
      var request = new Request(sql, function(err) {  
       if (err) {  
          console.log(err);
        }  
      })

      request.on('row', function(columns) {
        var count = 0;
        var i = 0;
        columns.forEach(function(column) {
          if(column.value + "" == "null" && found == false){
            count = i;
            found = true;
           
            var con2 = new Connection(config);
            con2.on('connect', function(error) {
              var sql2 = "UPDATE foodgroup SET want" + count + "='" + uwant + "', vote" + count + "=1 WHERE main='" + ugroup + "'";
              var request2 = new Request(sql2, function(err2) {  
               if (err2) {  
                  console.log(err2);
                }  
              })

              request2.on('row', function(columns) { 
                
              })

              request2.on('doneInProc', function(rowCount, moore, roows){
                res.end("Set want" + count);
              });

              con2.execSql(request2);
            })
          }

          i++;

          if(found == false && i == 10){
            res.end("want max length reached");
          }
        });  
         
      });

      request.on('doneInProc', function(rowCount, moore, roows){
        if(rowCount == 0){
          var con2 = new Connection(config);
          con2.on('connect', function(error) {
            var sql2 = "INSERT INTO foodgroup (main, want0, vote0) VALUES ('" + ugroup + "', '" + uwant + "', 1)";
            var request2 = new Request(sql2, function(err2) {  
             if (err2) {  
                console.log(err2);
              }  
            })

            request2.on('row', function(columns) { 
            })

            request2.on('doneInProc', function(rowCount, moore, roows){
              res.end("Inserted " + ugroup)
            });

            con2.execSql(request2);
          })
        }
        
        
      });

      con.execSql(request);
    }


    else if(desiredMethod == 'GETWANTS'){
      var ugroup = parsed.query.ugroup;
      var overalllist = [];
      var sql = "SELECT want0, vote0, want1, vote1, want2, vote2, want3, vote3, want4, vote4, want5, vote5, want6, vote6, want7, vote7, want8, vote8, want9, vote9 FROM foodgroup WHERE main='" + ugroup + "'";
      var request = new Request(sql, function(err) {  
       if (err) {  
          console.log(err);
        }  
      })

      request.on('row', function(columns) {
        columns.forEach(function(column) {
          if(column.value + "" != "null"){
            overalllist.push(column.value);
          }
          
        });  
         
      });

      request.on('doneInProc', function(rowCount, moore, roows){
        if(rowCount == 0){
          var con2 = new Connection(config);
          con2.on('connect', function(error) {
            var sql2 = "INSERT INTO foodgroup (main) VALUES ('" + ugroup + "')";
            var request2 = new Request(sql2, function(err2) {  
             if (err2) {  
                console.log(err2);
              }  
            })

            request2.on('row', function(columns) { 
            })

            request2.on('doneInProc', function(rowCount, moore, roows){
              res.end(overalllist.toString());
            });

            con2.execSql(request2);
          })
        }
        else{
          res.end(overalllist.toString());
        }
        
      });

      con.execSql(request);
    }

    //TESTING

    else if(desiredMethod == 'TEST'){ 
      var uname = parsed.query.uname;
      var sql = "CREATE TABLE users (name VARCHAR(255), pass VARCHAR(255), email VARCHAR(255), avail TEXT, wantfood VARCHAR(255), food0 VARCHAR(255),food1 VARCHAR(255),food2 VARCHAR(255),food3 VARCHAR(255),food4 VARCHAR(255),food5 VARCHAR(255),food6 VARCHAR(255),food7 VARCHAR(255),food8 VARCHAR(255),food9 VARCHAR(255), friends TEXT)";
      var request = new Request(sql, function(err) {  
       if (err) {  
          console.log(err);
        }  
      })

      request.on('row', function(columns) {  
        res.write(columns[0].value + '\n')
      })

      request.on('doneInProc', function(rowCount, moore, roows){
        res.end();
      });

      con.execSql(request);
    }

    else if(desiredMethod == 'TEST2'){
    var sql = "INSERT INTO foodgroup (main, want0, vote0, want1, vote1, want2, vote2) VALUES ('group3', 'McD', 5, 'BK', 3, 'Wendys', 7)"
      var request = new Request(sql, function(err) {  
       if (err) {  
          console.log(err);
        }  
      })

      request.on('row', function(columns) {  
        //res.write(columns[0].value + '\n')
      })

      request.on('doneInProc', function(rowCount, moore, roows){
        res.end();
      });

      con.execSql(request);
    }

 
    
  }); 
  

})


app.post('/', function(req, res) {



  var parsed = url.parse(req.url, true);


  if(Object.keys(parsed.query).length === 0){
    res.end("No queries");
  }

  var desiredMethod = parsed.query.desiredMethod;

  var con = new Connection(config);
  var Request = require('tedious').Request

  con.on('connect', function(error) {
    if (error) throw error;
    console.log("Connected!");
    
    if(desiredMethod == 'MAKEUSR'){
      var uname = req.body.uname;
      var upass = req.body.upass;
      var uemail = req.body.uemail;
      var uavail = req.body.uavail;
      var sql = "INSERT INTO users (name, pass, email, avail, numvotes) VALUES ('" + uname + "', '" + upass + "', '" + uemail + "', '" + uavail + "', 3)";
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
      var uname = req.body.uname;
      var upass = req.body.upass;
      var sql = "SELECT pass FROM users WHERE name='" + uname + "'";
      var request = new Request(sql, function(err) {  
       if (err) {  
          console.log(err);
        }  
      })

      request.on('row', function(columns) {  
        if(columns[0].value != upass){
          res.send('0');
        }
        else{
          res.send('1');
        }
      })

      request.on('doneInProc', function(rowCount, moore, roows){
        if(rowCount == 0){
          res.send('0')
        }
        //res.end();
      });

      con.execSql(request);
    }


    if(desiredMethod == 'UPDATEUSR'){
      var uname = req.body.uname;
      var upass = req.body.upass;
      var uemail = req.body.uemail;
      var uavail = req.body.uavail;
      var sql = "";

      if(upass == ""){
        if(uemail == ""){
          sql = "UPDATE users SET avail='" + uavail + "' WHERE name='" + uname + "'";
        }
        else{
          sql = "UPDATE users SET email='" + uemail + "', avail='" + uavail + "' WHERE name='" + uname + "'";
        }
      }
      else{
        if(uemail == ""){
          sql = "UPDATE users SET pass='" + upass + "', avail='" + uavail + "' WHERE name='" + uname + "'";
        }
        else{
          sql = "UPDATE users SET pass='" + upass + "', email='" + uemail + "', avail='" + uavail + "' WHERE name='" + uname + "'";
        }
      }

      var request = new Request(sql, function(err) {  
       if (err) {  
          console.log(err);
        }  
      })

      request.on('doneInProc', function(rowCount, moore, roows){
        res.end("Updated user successfully.");
      });

      con.execSql(request);
    }


  })

})


app.listen(80);

