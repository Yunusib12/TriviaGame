$(function() {

    let receivedToken = [];
    let tokenUrl = "https://opentdb.com/api_token.php?command=request";
    let getQuestions = "https://opentdb.com/api.php?amount=5&token=";
    let giphyUrl = "http://api.giphy.com/v1/gifs/search?q=";
    let giphyApiKey = "LSCkVZDfb9GAYZwtXeOtw4jD8pzZ9GDM";
    let $pickCategory = $("#pickCategory");
    let $genCat = $("#genCat");
    let $main = $("#main");




    let searchTriviaQ = function() {

        let querySession = $.get(tokenUrl);

        querySession.done(function(session) {

            receivedToken.push(session.token);

        });

        var queryURL = getQuestions + receivedToken;

        $.get(getQuestions + receivedToken)
            .then(function(response) {
                createCategory(response);
            });
    };

    var createCategory = function(dataCat) {

        let categoryData = dataCat.results;

        console.log(categoryData);

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

    $main.on("click", function(event) {

        const _this = $(this);

        let categoryValue = _this.attr("data-category");

        console.log(event);

        console.log(categoryValue);

    });





    // let getGifImg = function(catName) {


    // };

    searchTriviaQ();
    // if (qT.response_code != 4) {

    //     console.log("Session still on", qT);


    // };


    // let queryToken = function() {

    //     let qT = $.get(tokenUrl);

    //     qT.done(function(session) {
    //         receivedToken = session.token
    //             // console.log("Inside", session.token);
    //     });
    // };

    // let querySession = $.get(tokenUrl);

    // querySession.done(function(session) {

    //     receivedToken = session.token;
    //     console.log("My Session", receivedToken);

    // }).then(function() {

    //     let queryUrl = $.get(getQuestions + receivedToken);

    //     queryUrl.done(function(question) {

    //         console.log("Got some questions ", question);

    //         getCategory(question);

    //     });
    // });

    // let getCategory = function(data) {
    //     console.log("Get Cat", data.results.category);
    // }



    //queryToken();

    //console.log("My Token", receivedToken);
    //console.log("Outside", results.category);






    // let token;

    // let querySession = $.get("");

    // querySession.done(function(session) {

    //     token = session.token;
    //     console.log("My Session", token);

    // }).then(function() {

    //     let queryUrl = $.get("https://opentdb.com/api.php?amount=10&token=" + token);

    //     queryUrl.done(function(question) {

    //         console.log("Got some questions ", question);

    //     });
    // });



    // let weather = $.get("https://api.openweathermap.org/data/2.5/weather?q=Portland,US&APPID=23f01da04b864d241e7b00caec810037");

    // weather.done(function(datas) {

    //     console.log("My weather datas", datas);
    // });


});