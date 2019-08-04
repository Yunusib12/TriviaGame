$(function() {

    /* GLOBAL VARIABLES 
     ======================================================================= */

    let receivedToken = [];
    let questionArray = [];
    let indexQuestionArray = [];
    let choice = [];
    let $pickCategory = $("#pickCategory");
    let $genCat = $("#genCat");
    let $main = $("#main");
    let $timeLeft = $("#timeLeft");
    let $instructionCat = $(".instructionCat");
    let $replyQuestion = $("#replyQuestion");
    let $displayQuestion = $("#displayQuestion");
    let $displayCategory = $("#displayCategory");
    let $displayDifficulty = $("#displayDifficulty");
    let $displayType = $("#displayType");
    let $message = $("#message");
    let $answer = $("#answers");
    let $correctCountText = $("#correctAnswer");
    let $incorrectCountText = $("#wrongAnswer");
    let $notAnsweredText = $("#notAnswered");
    let $quizInfo = $("#quizInfo");
    let $imgLoading = $("#imgLoading");
    let tokenUrl = "https://opentdb.com/api_token.php?command=request";
    let getQuestions = "https://opentdb.com/api.php?amount=5&token=";
    let giphyUrl = "https://api.giphy.com/v1/gifs/search?q=";
    let giphyApiKey = "LSCkVZDfb9GAYZwtXeOtw4jD8pzZ9GDM";
    let seconds = 30;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredQuestion = 0;
    let indexQuestion = -1;
    let isTheGameStarted = false;
    let timerActive = false;
    let timerId;
    let messageText;
    let correctA;


    /* FUNCTIONS
    ======================================================================= */

    // function determin which category to display (OPEN DB Trivia / Local Array)
    let whichCategoryToDisplay = function() {

        if (isTheGameStarted) {
            console.log("Am here too");
            $replyQuestion.hide();
            let countQuestionLeft = questionArray[0].length;
            console.log("CountQuestionLeft", countQuestionLeft);

            if (countQuestionLeft === 0) {

                console.log("game Over");

            } else {
                console.log("indexQuestion", indexQuestionArray);
                $pickCategory.show();
                questionArray[0].splice(parseInt(indexQuestionArray), 1);

                console.log("New array", questionArray);
                setTimeout(createCategory(questionArray), 3000);
            }

        } else {
            console.log("Am here - Get question from OTDB");
            searchTriviaQ();
        }


    };


    //Function get Question from OpendDB Trivia
    let searchTriviaQ = function() {

        let querySession = $.get(tokenUrl);

        querySession.done(function(session) {

            receivedToken.push(session.token); // save the token

        });

        var queryURL = getQuestions + receivedToken;

        $.get(getQuestions + receivedToken)
            .then(function(response) {
                console.log(response);

                questionArray.push(response.results); //Add the data to a question array
                console.log(questionArray);
                createCategory(questionArray); //create category from the response
            });
    };

    // Function that create category from the Question retrieved 

    let createCategory = function(dataCat) {

        $genCat.empty();

        let categoryData = dataCat[0];

        console.log("CategoryData", categoryData);

        categoryData.forEach(function(catData) {

            let categoryName = catData.category;

            let genDiv = $("<div>")
                .addClass("card text-center maxWidth")
                .attr("data-category", categoryName);

            $genCat.append(genDiv);

            let insDiv = $("<div>")
                .addClass("card-body")
                .text(categoryName);
            genDiv.append(insDiv);

            let getImg = $.get(giphyUrl + categoryName + "&api_key=" + giphyApiKey + "&limit=1");

            getImg.then(function(dataImg) {

                let imgSrc = dataImg.data[0].images.original.url;

                let img = $("<img>")
                    .attr("src", imgSrc)
                    .addClass("img-fluid img-thumbnail rounded");

                insDiv.append(img);

            });

        });

    };

    // stops the timer and resets it to 0
    let stopTimer = function() {
        clearTimeout(timerId);
        seconds = 30;
        timerActive = false;
        $timeLeft.hide();
    };


    //Function Count Down for the user to pick the right answer
    function timerCountdown() {

        $timeLeft.show();
        timerActive = true;
        seconds--;

        // console.log(seconds);

        $timeLeft.text(seconds);

        if (seconds === 0) {
            clearTimeout(timerId)
            timerActive = false;
            showResult();
            return false;
        }

        timerId = setTimeout(timerCountdown, 1000);

    }

    // Function display Question Category Selected 

    let displayQuestion = function(categorySelected) {

        // displaying the question <div> / hide instruction from preview page
        $replyQuestion.show();
        $instructionCat.hide();
        $answer.empty();
        $answer.show();


        // change the game status to started
        isTheGameStarted = true;

        //Start the timer countdown
        stopTimer();
        timerCountdown(seconds);


        let qDCat = questionArray[0]; // accessing the array 0 that contains all the categories and answers

        // find the question index 
        let filteredObj = qDCat.find(function(item, i) {
            if (item.category === categorySelected) {
                indexQuestion = i;
                return i;
            }
        });

        // add the index question to the array
        indexQuestionArray.push(indexQuestion);

        // searching in the array the category that the user selected
        let getCatQ = qDCat.find(catCont => catCont.category === categorySelected);

        // saving the question data into variables
        let displayQ = getCatQ.question;
        let displayCat = getCatQ.category;
        let displayDiff = getCatQ.difficulty;
        let displayType = getCatQ.type;

        if (displayType === "boolean") {
            displayType = "True / False";
        }

        // displaying the question and other infos related
        $displayQuestion.html(displayQ);
        $displayCategory.text(`Category: ${displayCat}`);
        $displayDifficulty.text(`Difficulty: ${displayDiff}`);
        $displayType.text(`Type: ${displayType}`);

        // console.log(getCatQ.incorrect_answers);
        //cycling through the incorect answers and display them
        getCatQ.incorrect_answers.forEach(function(incAnsw) {

            //console.log(incAnsw);
            let incorectAnsw = $("<div>")
                .addClass("answer")
                .html(incAnsw)
                .attr({
                    "data-answer": incAnsw,
                    "data-value": 0
                })
                .appendTo($answer);
        });

        // display the correct answer
        let correctAnswer = getCatQ.correct_answer;
        let divCorrectAnswer = $("<div>")
            .addClass("answer")
            .html(correctAnswer)
            .attr({
                "data-answer": correctAnswer,
                "data-value": 1
            })
            .appendTo($answer);
        correctA = correctAnswer;

    };

    // Function that process the user answer and display the result
    let showResult = function(userAnswer, answerV) {

        // active timer means an answer was clicked, so process answer
        if (timerActive) {

            // result for a correct answer
            if (answerV === 1) {
                messageText = "You got it! " + userAnswer + " is the correct answer!";
                $message.text(messageText)
                    .addClass("alert alert-success")
                    .attr("role", "alert");;
                correctCount++;
                updateInfo();
                stopTimer();
                setTimeout(whichCategoryToDisplay, 3000);
                whichCategoryToDisplay();


                //result for an incorrect answer
            } else {

                switch (correctA) {
                    case 0:
                        correctA = "False";
                        break;
                    case 1:
                        correctA = "True";
                        break;
                }
                messageText = "Your Answer: " + userAnswer + "<br>" + "Correct Answer: " + correctA;
                $message.html(messageText)
                    .addClass("alert alert-danger")
                    .attr("role", "alert");
                incorrectCount++;
                updateInfo();
                stopTimer();
                setTimeout(whichCategoryToDisplay, 3000);
                whichCategoryToDisplay();

            };

            // function was called when timer hit 0
        } else {
            $timeLeft.hide();
            $answer.hide();
            messageText = "The Correct Answer was " + correctA;
            $message.text("Time's Up! - " + messageText)
                .addClass("alert alert-danger")
                .attr("role", "alert");;
            unansweredQuestion++;
            stopTimer();
            updateInfo();
            setTimeout(whichCategoryToDisplay, 3000);
            whichCategoryToDisplay();
        }

    }

    // Function reset 
    let reset = function() {

        receivedToken = [];
        questionArray = [];
        indexQuestionArray = [];

    };


    // Function update
    let updateInfo = function() {

        $correctCountText.text(`Correct Answer : ${correctCount}`)
            .appendTo($quizInfo);

        $incorrectCountText.text(`Incorrect Answer : ${incorrectCount}`)
            .appendTo($quizInfo);

        $notAnsweredText.text(`Not Answered : ${unansweredQuestion}`)
            .appendTo($quizInfo);

    };


    /* EVENTS ON CLICK
      ======================================================================= */

    //Display question for the selected category

    $main.on("click", ".card", function(event) {

        let _this = $(this);

        let categoryValue = _this.attr("data-category");

        $pickCategory.hide();
        $instructionCat.hide();

        console.log(categoryValue);

        displayQuestion(categoryValue); // Function that display question from the selected category


    });

    // Pick the right answer

    $answer.on("click", ".answer", function(event) {

        let _this = $(this);
        let dataAnswer = _this.attr("data-answer"); //get the answer value 
        let dataValue = parseInt(_this.attr("data-value")); //get the answer value 

        $answer.hide()

        //Check the user answer 
        showResult(dataAnswer, dataValue);

    });


    /* GAME START HERE
      ======================================================================= */


    whichCategoryToDisplay();
    $replyQuestion.hide();

});