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
    let $gameOver = $("#gameOver");
    let $imgGameOver = $("#imgGameOver");
    let $correctAnswerFR = $("#correctAnswerFR");
    let $wrongAnswerFR = $("#wrongAnswerFR");
    let $notAnsweredFR = $("#notAnsweredFR");
    let $finalScoreResult = $("#finalScoreResult");
    let $restartGame = $("#restartGame");
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

            $replyQuestion.hide();
            $gameOver.hide();
            let countQuestionLeft = questionArray[0].length - 1;
            console.log("CountQuestionLeft", countQuestionLeft);

            if (countQuestionLeft === 0) {

                console.log("game Over");
                $gameOver.show();
                // get Game Over Image from Giphy 
                let imgName = "Game Over";
                let getGameOVerImg = $.get(giphyUrl + imgName + "&api_key=" + giphyApiKey + "&limit=1")
                    .then(function(dataImgGO) {

                        let imgGOSrc = dataImgGO.data[0].images.original.url;

                        $imgGameOver.attr("src", imgGOSrc)
                            .addClass("img-fluid img-thumbnail rounded")
                            .show();

                    });

                // Display the final Score

                finalResult();

            } else {
                $pickCategory.show();
                questionArray[0].splice(parseInt(indexQuestionArray), 1);

                console.log("New array", questionArray);
                setTimeout(createCategory(questionArray), 3000);
            }

        } else {
            $gameOver.hide();
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

            let getImg = $.get(giphyUrl + categoryName + "&api_key=" + giphyApiKey + "&limit=1")
                .then(function(dataImg) {

                    let imgSrc = dataImg.data[0].images.original.url;

                    let img = $("<img>")
                        .attr("src", imgSrc)
                        .addClass("img-fluid img-thumbnail rounded");

                    insDiv.append(img);

                });

        });

    };

    // // Function starts the timer
    // let startTimer = function(startValue) {
    //     if (!timerActive) {
    //         seconds = startValue;
    //         timerId = setTimeout(timerCountdown, 1000)
    //         timerActive = true;
    //         $timeLeft.show();
    //     }
    // };

    // stops the timer and resets it to 0
    let stopTimer = function() {
        clearTimeout(timerId);
        seconds = 30;
        timerActive = false;
        $timeLeft.hide();
    }


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
            showResult("", 0);
            return false;
        }

        timerId = setTimeout(timerCountdown, 1000);

    }

    // Function display Question Category Selected 

    let displayQuestion = function(categorySelected) {

        // displaying the question <div> / hide instruction from preview page
        $replyQuestion.show();
        $instructionCat.hide();
        $message.hide();
        $answer.empty();
        $answer.show();

        // change the game status to started
        isTheGameStarted = true;

        stopTimer();
        //Start the timer countdown
        timerCountdown();

        // let qD = $(questionArray); // Category Array that contains one question and answers - transorming the array into an jQuery object
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
                $message.show();
                $message.text(messageText)
                    .removeClass()
                    .addClass("alert alert-success")
                    .attr("role", "alert");;
                correctCount++;
                updateInfo();
                stopTimer();
                setTimeout(whichCategoryToDisplay, 5000);
                //whichCategoryToDisplay();

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
                $message.show();
                $message.html(messageText)
                    .removeClass()
                    .addClass("alert alert-danger")
                    .attr("role", "alert");
                incorrectCount++;
                updateInfo();
                stopTimer();
                setTimeout(whichCategoryToDisplay, 5000);
                //whichCategoryToDisplay();

            };

            // function was called when timer hit 0
        } else {
            $timeLeft.hide();
            $answer.hide();
            messageText = "The Correct Answer was " + correctA;
            $message.show();
            $message.text("Time's Up! - " + messageText)
                .addClass("alert alert-danger")
                .attr("role", "alert");;
            unansweredQuestion++;
            stopTimer();
            updateInfo();
            setTimeout(whichCategoryToDisplay, 5000);
            //whichCategoryToDisplay();
        }

    }

    // Function reset 
    let reset = function() {

        receivedToken = [];
        questionArray = [];
        indexQuestionArray = [];
        isTheGameStarted = false

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

    // Function Display Final Result

    let finalResult = function() {

        $restartGame.show();
        $correctAnswerFR.text(`Correct Answer : ${correctCount}`)
            .appendTo($finalScoreResult);

        $wrongAnswerFR.text(`Incorrect Answer : ${incorrectCount}`)
            .appendTo($finalScoreResult);

        $notAnsweredFR.text(`Not Answered : ${unansweredQuestion}`)
            .appendTo($finalScoreResult);

    };

    /* EVENTS ON CLICK
      ======================================================================= */

    //Display question for the selected category

    $main.on("click", ".card", function(event) {

        let _this = $(this);

        let categoryValue = _this.attr("data-category");

        $pickCategory.hide();

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

    // Restart The Game

    $restartGame.on("click", function(event) {

        reset();
        $pickCategory.empty();
        whichCategoryToDisplay();
        updateInfo();
        $replyQuestion.hide();
        $pickCategory.show();

    });

    /* GAME START HERE
      ======================================================================= */


    whichCategoryToDisplay();
    updateInfo();
    $replyQuestion.hide();
    $restartGame.hide();




});