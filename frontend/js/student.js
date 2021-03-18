const correct = "CORRECT";
const incorrect = "INCORRECT";
const error_missing_quiz = "Error: No quiz in storage";
const error_storage_not_supported = "Local Storage is not supported this app will not work";
const address = "https://seanwallace.ca/assignment1/questions";

function load(){
   const xhttp = new XMLHttpRequest();
   xhttp.open("GET", address,true);
   xhttp.send();
   xhttp.onreadystatechange = function() {
       if(this.readyState == 4 && this.status == 200){
           let questions = JSON.parse(this.response);
           if(questions['1'] == undefined){
                document.write(error_missing_quiz)
                removeSubmitBtn();
                window.stop();
           }else{
               let questionNum;
                for(let q in questions){
                    questionNum = questions[q]['id'];
                    add(questions[q]['block'],
                        questions[q]['answers'],
                        questionNum)
                        
                }
           }
       }
   }

}

function backBtnClick(){
    window.location.href = './index.html'
}
document.getElementById("backBtn").onclick = backBtnClick;

function add(block, answers, questionNum){
    let qDiv = document.createElement("div");
    qDiv.className = "question";
    qDiv.id = "q"+questionNum;

    let heading = document.createElement("h3");
    heading.innerHTML = "Question "+questionNum;

    let questionBody = document.createElement("textarea");
    questionBody.className = "body";
    questionBody.readOnly= true;
    
    questionBody.value = block;

    let answerContainer = document.createElement("div");
    answerContainer.className = "answerContainer";
    
    for(let i = 0; i < answers.length; i++){
        let answer = document.createElement("div");
        answer.className = "answer";

        let radioInput = document.createElement("input");
        radioInput.type = "radio";
        radioInput.name = questionNum;

        let answerText = document.createElement("textarea");
        answerText.className ="answerText";
        answerText.value = answers[i];
        answerText.readOnly = true;

        answer.appendChild(radioInput);
        answer.appendChild(answerText);

        answerContainer.appendChild(answer);
    }

    qDiv.appendChild(heading);
    qDiv.appendChild(questionBody);
    qDiv.appendChild(answerContainer);
    
    document.getElementById("questionContainer").append(qDiv);
}


function submit(){
    let correctCount = 0;

    let ansK = [];
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", address,true);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200){
            let questions = JSON.parse(this.response);

                
                for(let q in questions){
                    ansK.push(questions[q]['answerNum']);
                }
                
                for(let i = 0; i < ansK.length; i++){
                    let answers = document.getElementsByName(i+1);
                    let userAns = 0;
                    for(let j = 0; j < answers.length; j++){
                        // Disable the radio buttons
                        answers[j].disabled = true
            
                        if( answers[j].checked == true){
                            userAns = j+1;
                        }
                    }
                    correctCount+=checkAnswers(ansK[i], userAns , i);
                   
                }
                displayCounter(correctCount, ansK.length);
            
               removeSubmitBtn();
        }
    }

}

function removeSubmitBtn(){
    document.getElementById("submitBtn").style.display = "none";
}

function displayCounter(count, total){
    let score = document.createElement("h1");
    let scoreText = "Score: "+count+"/"+total;
    alert(scoreText);
    score.innerHTML = scoreText;
    document.getElementById("questionContainer").append(score);
}

function checkAnswers(ans, userAns, question){
    if( ans == userAns){
       
        let status = document.createElement("h2")
        status.innerHTML = correct
        let questionBlock = document.getElementById("q"+(question+1));
        questionBlock.append(status);
        let answerContainerChilds = questionBlock.querySelector(".answerContainer").children;
        for(let i =0; i < answerContainerChilds.length; i ++){
            if(i == ans-1){
                answerContainerChilds[i].classList.add("correct");
            }
        }
        return 1;
    }else{
        let status = document.createElement("h2")
        status.innerHTML = incorrect

        let questionBlock = document.getElementById("q"+(question+1));
        questionBlock.append(status);
        let answerContainerChilds = questionBlock.querySelector(".answerContainer").children;
        for(let i =0; i < answerContainerChilds.length; i ++){
            if(i == ans-1){
                answerContainerChilds[i].classList.add("correct");
            }
            if(userAns > 0 && i == userAns-1){
                answerContainerChilds[i].classList.add("incorrect");
            }
        }
        return 0;
        
    }
}

document.getElementById('submitBtn').onclick = submit;

load();