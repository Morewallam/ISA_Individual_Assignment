let questionNum = 1
let answerNum = 0;
const address = "https://seanwallace.ca/assignment1/questions";

function Question (block,answers,answerNum){
    this.block = block;
    this.answers = answers;
    this.answerNum = answerNum;
}

function load(){
   const xhttp = new XMLHttpRequest();
   xhttp.open("GET", address,true);
   xhttp.send();
   xhttp.onreadystatechange = function() {
       if(this.readyState == 4 && this.status == 200){
           let questions = JSON.parse(this.response);
           if(questions['1'] == undefined){
            //    add(0,"",["",""],[0,0],0);
           }else{
                for(let q in questions){
                    questionNum = questions[q]['id'];
                    add(questions[q]['id'],
                        questions[q]['block'],
                        questions[q]['answers'],
                        questions[q]['aIDs'],
                        questions[q]['answerNum'])
                }
                // add(0,"",["",""],[0,0],0);
           }
       }
   }

}

function backBtnClick(){
    window.location.href = './index.html'
}
document.getElementById("backBtn").onclick = backBtnClick; 


function add(id,block, answers,aIds, ans){
    let qDiv = document.createElement("div");
    qDiv.className = "question";
    qDiv.id = id;

    let heading = document.createElement("h3");
    if(id == 0 ){
        heading.innerHTML = "New Question";
    }else{
        questionNum = id;
        heading.innerHTML = "Question "+id;
    }
    

    let questionBody = document.createElement("textarea");
    questionBody.className = "body";
    questionBody.value = block;

    let answerContainer = document.createElement("div");
    answerContainer.className = "answerContainer";
    
    for(let i = 0; i < answers.length; i++){
        let answer = document.createElement("div");
        answer.className = "answer";
        if(id != 0){
            answer.id = aIds[i];
            answerNum = aIds[i];
        }
        

        let radioInput = document.createElement("input");
        radioInput.type = "radio";
        radioInput.name = id;

        if( (i+1) == ans){
            radioInput.checked = true;
        }
        let answerText = document.createElement("textarea");
        answerText.className ="answerText";
        answerText.value = answers[i];

        answer.appendChild(radioInput);
        answer.appendChild(answerText);

        answerContainer.appendChild(answer);
    }

    if(id == 0 ){
        let addAnsBtn = document.createElement("button");
        addAnsBtn.textContent = "Add Answer";
        addAnsBtn.id = "addAnswerBtn";
        addAnsBtn.onclick = addAnswer
        answerContainer.appendChild(addAnsBtn);
    }

    qDiv.appendChild(heading);
    qDiv.appendChild(questionBody);
    qDiv.appendChild(answerContainer);
    
    document.getElementById("questionContainer").append(qDiv);
    
}
function removeAnswer(){
    let button = document.querySelector("#remAnswerBtn")
    
    let answers = button.parentElement.getElementsByClassName("answer");
    console.log(answers);
    answers[answers.length-1].remove();
    if( button.parentElement.childElementCount > 3){
        button.parentElement.append(button);
        
    }else{
        let addAnsBtn = document.createElement("button");
        addAnsBtn.textContent = "Add Answer";
        addAnsBtn.id = "addAnswerBtn";
        addAnsBtn.onclick = addAnswer
        
        button.parentElement.append(addAnsBtn);
        button.remove();
        
    }
    
}



function addAnswer() {
    let button = document.querySelector("#addAnswerBtn")

    let answer = document.createElement("div");
    answer.className = "answer";
    
    let radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.name = 0;

    let answerText = document.createElement("textarea");
    answerText.className ="answerText";

    answer.appendChild(radioInput);
    answer.appendChild(answerText);
    button.parentElement.append(answer);
    if( button.parentElement.childElementCount < 5){
        button.parentElement.append(button);
        
    }else{
        let remAnsBtn = document.createElement("button");
        remAnsBtn.textContent = "Remove Answer";
        remAnsBtn.id = "remAnswerBtn";
        remAnsBtn.onclick = removeAnswer;
        button.parentElement.append(remAnsBtn);
        button.remove();
        
    }
}

function addClick(){
    save();
    add(0,"",["",""],[0,0],0);
    // }else{
    //     console.log("New question fields not filled in")
    // }
}
document.getElementById("addBtn").onclick = addClick;


// function del(){
//     var question = document.getElementById("q"+(questionNum-1))
//     question.parentNode.removeChild(question);
//     questionNum--;
//     save();
    
// }
// document.getElementById("delBtn").onclick = del;


function save(){
    
    // get all the element in the question container and go though each question and fill in the json.

    let questions = document.getElementsByClassName("question");
    let questionBodies = document.getElementsByClassName("body");

    for(let i = 0; i < questions.length; i++){

            let aIDs = [];
            let qID = questions[i].id;
            let questionBody = questionBodies[i];

            let answerContainer = document.getElementsByClassName("answerContainer");
        
            
            let answerGroup  = []
            let children = answerContainer[i].children
            for (let j = 0; j< children.length; j++){
                if(children[j].className == "answer"){
                    answerGroup.push(children[j]);
                    aIDs.push(children[j].id);
                }
            }
            

            let answer = 1;
            let radioBtns = document.getElementsByName(qID);
            
            for(let j = 0; j < radioBtns.length; j++){
                if( radioBtns[j].checked){
                    answer = j+1;
                    break;
                }
            } 

            let answers = []
            for (let j =0; j < answerGroup.length; j++){
                answers.push(answerGroup[j].querySelector("textarea").value);
            }

            if(qID == 0){

                //Elements of new question
                // let question = req.body.question;
                // let block = question.block;
                // let answers = question.answers;
                // let correctAnswer = question.answerNum;

                let question = {};
                if(questionBody.value  || correctAnswer != undefined){
                    question.block = questionBody.value;
                    question.answers = answers;
                    question.correctAnswer = answer;
                    const xhttp = new XMLHttpRequest();
                    xhttp.open("POST", address,true);
                    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xhttp.send(JSON.stringify(question));
                    console.log("question=" + JSON.stringify(question));
                

                    questions[i].id = ++questionNum;
                    for (let j = 0; j< children.length; j++){
                        if(children[j].className == "answer"){
                            children[j].id = ++answerNum;
                            let input = children[j].querySelector("input");
                            input.name = questions[i].id;
                            console.log(qID);
                        }
                        if(children[j].tagName == "BUTTON" ){
                            children[j].remove();
                        }
                    }
                    questions[i].querySelector("h3").innerHTML ="Question "+questions[i].id;

                }
                
            }else{
                //do the update question
                //Elements of updating
                // let question = req.body.question;
                // let block = question.block;
                // let answers = question.answers;
                // let correctAnswer = question.answerNum;
                // let qID = question.ID;
                // let aIDs = question.aID;
                let question = {};
                question.block = questionBody.value;
                question.answers = answers;
                question.correctAnswer = answer;
                question.ID = qID;
                question.aIDs = aIDs;
                const xhttp = new XMLHttpRequest();
                xhttp.open("PUT", address,true);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.send(JSON.stringify(question));
            }

            // let q = new Question(questionBody.value,answers,answer)
            // console.log(q);
            // data['questions'][questions[i].getAttribute("id")] = q;
        
    }
}

document.getElementById("saveBtn").onclick = save;

load();