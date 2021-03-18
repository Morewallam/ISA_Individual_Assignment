var express = require('express');
var mysql = require('mysql');
var app = express();


const db = mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"",
    database: "ISA"
})

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers','Content-type, Authorization, Content-Length, x-requested-with');
    next();
})

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

app.get('/questions', function (req, res) {
    let data = {};


    // Perform 2 quesries 1 for the question and 1 for the answers.
    db.query('SELECT * FROM question',
    function(error, results, feilds){
        if (error) throw error;
    
        results.forEach(row => {
            data[row.qID]={};
            data[row.qID].id= row.qID;
            data[row.qID].block=row.block;
            data[row.qID].answerNum =row.correct;
            let answers =[];
            let aIDs =[];

            db.query('SELECT ansID,answer FROM answers WHERE qID=?',row.qID,
                function(error, ansResults, feilds){

                ansResults.forEach(answerRow => {
                    answers.push(answerRow.answer);
                    aIDs.push(answerRow.ansID);
                });
                data[row.qID].answers = answers;
                data[row.qID].aIDs = aIDs;
                if(row == results[results.length-1]){
                    res.setHeader("Content-Type", "application/json");
                    res.status(200).send(data);
                }
            })
            
        });
    })
})


app.post('/questions', function (req, res) {
    req.on('data', function (data) {
        console.log(data);
        let question = JSON.parse(data);
        let block = question.block;
        let answers = question.answers;
        let correctAnswer = question.correctAnswer;
        db.query('INSERT INTO question SET ?',
            {block: block, correct: correctAnswer},
            function(error, results, fields){
                if(error)throw error;

                answers.forEach(answer => {

                    db.query('INSERT INTO answers SET ?',
                        {answer: answer, qID:results.insertId},
                        function(error,results,fields){
                            if(error)throw error;
                        })

                });
                

            })
        res.setHeader("Content-Type", "text/html");
        res.status(200).send("Question Added");

    })
})
app.put('/questions', function(req, res) {
    req.on('data', function (data) {
        let question = JSON.parse(data);
        let block = question.block;
        let answers = question.answers;
        let correctAnswer = question.correctAnswer;
        let qID = question.ID;
        let aIDs = question.aIDs;
    
        db.query('UPDATE question SET ? WHERE qID ='+"\'"+qID+"\'",
                {block: block, correct: correctAnswer},
                function(error, results, fields){
                    if(error)throw error;
                })
        for(let i = 0; i < answers.length; i++){
            db.query('UPDATE answers SET ? WHERE ansID ='+"\'"+aIDs[i]+"\'",
            {answer: answers[i], qID:qID},
            function(error,results,fields){
                if(error)throw error;
            })
        }
        res.setHeader("Content-Type", "text/html");
        res.status(200).send("Question Updated");
    })
})
app.listen(3333);