$(function() {

    let receivedToken = [];
    let questionArray = [];
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
    let seconds = 30;
    let game;
    let counter = 0;
    let clock;
    let correctAnswer = 0;
    let incorrectAnswer = 0;
    let unansweredQuestion = 0;


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

                questionArray.push(response.results); //Add the data to a question array
            });
    };

    // Function that create category from the Question retrieved 

    var createCategory = function(dataCat) {

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

    // Function that display question from the selected category

    $main.on("click", ".card", function(event) {

        const _this = $(this);

        let categoryValue = _this.attr("data-category");

        $pickCategory.hide();

        displayQuestion(categoryValue);


    });

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

        console.log(categorySelected);

        let qD = $(questionArray); // transorming the array into an jQuery object
        let qDCat = qD[0]; // accessing the array when i created the array from the response.results created a key:0 + then the array
        console.log(qDCat);

        // searching in the array the category that the user selected
        let getCatQ = qDCat.find(catCont => catCont.category === categorySelected);

        // saving the question data into variables
        let displayQ = getCatQ.question;
        let displayCat = getCatQ.category;
        let displayDiff = getCatQ.difficulty;
        let displayType = getCatQ.type;

        // displaying the question and other infos related
        $displayQuestion.text(displayQ);
        $displayCategory.text(`Category: ${displayCat}`);
        $displayDifficulty.text(`Difficulty: ${displayDiff}`);
        $displayType.text(`Type: ${displayType}`);

        console.log(displayQ);
        console.log(displayCat);
        console.log(displayDiff);
        console.log(displayType);

    }

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



    searchTriviaQ();
    $replyQuestion.hide();
    const timer = setTimeout(countdown, 1000);


});