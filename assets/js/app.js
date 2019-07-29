$(function() {

    /* GLOBAL VARIABLES 
    ======================================================================= */

    let receivedToken = [];
    let questionArray = [];
    let indexQuestionArray = [];
    let tokenUrl = "https://opentdb.com/api_token.php?command=request";
    let getQuestions = "https://opentdb.com/api.php?amount=5&token=";
    let giphyUrl = "http://api.giphy.com/v1/gifs/search?q=";
    let giphyApiKey = "LSCkVZDfb9GAYZwtXeOtw4jD8pzZ9GDM";
    let $pickCategory = $("#pickCategory");
    let $genCat = $("#genCat");
    let $main = $("#main");
    let $timeLeft = $("#timeLeft");
    let $replyQuestion = $("#replyQuestion");
    let $displayQuestion = $("#displayQuestion");
    let $displayCategory = $("#displayCategory");
    let $displayDifficulty = $("#displayDifficulty");
    let $displayType = $("#displayType");
    let $answer = $("#answers");
    let seconds = 30;
    let game;
    let counter = 0;
    let clock;
    let correctAnswer = 0;
    let incorrectAnswer = 0;
    let unansweredQuestion = 0;
    let indexQuestion = -1;


    /* FUNCTIONS
    ======================================================================= */

    //Function get Question from OpendDB Trivia

    let searchTriviaQ = function() {

        let querySession = $.get(tokenUrl);

        querySession.done(function(session) {

            receivedToken.push(session.token); // save the token

        });

        var queryURL = getQuestions + receivedToken;

        $.get(getQuestions + receivedToken)
            .then(function(response) {

                createCategory(response); //create category from the response
                // console.log(response);
                questionArray.push(response.results); //Add the data to a question array
                // console.log(questionArray);
            });
    };

    // Function that create category from the Question retrieved 

    let createCategory = function(dataCat) {

        let categoryData = dataCat.results;

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

    // Wait while loading data

    let waitLoading = function() {

        setTimeout(function() {
            let imgUrl = "./assets/images/comets-loading.svg";

            let loadimg = $("<img>")
                .attr("src", imgUrl);

            $main.append(loadimg);

        }, 1000);
    }

    // Function display Question Category Selected 

    let displayQuestion = function(categorySelected) {

        // displaying the question <div>
        $replyQuestion.show();

        let qD = $(questionArray); // Category Array that contains one question and answers - transorming the array into an jQuery object
        let qDCat = qD[0]; // accessing the array 0 that contains all the categories and answers

        // find the question index 
        let filteredObj = qDCat.find(function(item, i) {
            if (item.category === categorySelected) {
                indexQuestion = i;
                return i;
            }
        });

        // add the index question to the array
        indexQuestionArray.push(indexQuestion);
        console.log(indexQuestionArray);

        // searching in the array the category that the user selected
        let getCatQ = qDCat.find(catCont => catCont.category === categorySelected);

        // saving the question data into variables
        let displayQ = getCatQ.question;
        let displayCat = getCatQ.category;
        let displayDiff = getCatQ.difficulty;
        let displayType = getCatQ.type;


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
                .attr("data-answer", 0)
                .appendTo($answer);
        });

        // display the correct answer
        let correctAnswer = getCatQ.correct_answer;
        let divCorrectAnswer = $("<div>")
            .addClass("answer")
            .html(correctAnswer)
            .attr("data-answer", 1)
            .appendTo($answer);
    };

    //Function Count Down for the user to pick the right answer
    function countdown() {

        seconds--;

        // console.log(seconds);

        $timeLeft.text(seconds);

        if (seconds === 0) {
            clearTimeout(timer)
            return false;
        }

        setTimeout(countdown, 1000);

    }

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

        let answerValue = parseInt(_this.attr("data-answer")); //get the answer value 

        if (answerValue === 1) {

            //when user get the right answer
            console.log("Good Job");

        } else {

            console.log("wrong");
        }

    });


    searchTriviaQ();
    $replyQuestion.hide();
    const timer = setTimeout(countdown, 1000);


});