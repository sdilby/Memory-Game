/* Create a list that holds all of your cards */

//card types, storage for moves and matches
var cardList = ["fa-birthday-cake", "fa-child", "fa-fighter-jet", "fa-flask", "fa-gamepad", "fa-paw", "fa-motorcycle", "fa-wrench"];
var moves = 0;
var match_found = 0;

// check when first card is opened
var start_game = false;

// timer object
var timer = new Timer();
timer.addEventListener('secondsUpdated', (e) => {
    $('#timer').html(timer.getTimeValues().toString());
})

// reference to reset button
$('#reset-button').click(resetGame);

// create and reset card html to start new game
var createCard = (card) => {
    $('#deck').append(`<li class="card animated"><i class="fa ${card}"></i></li>`);
}

// creates random cards for deck
var createCards = () => {
    for (let i = 0; i < 2; i++) {
        cardList = shuffle(cardList);
        cardList.forEach(createCard);
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
var shuffle = (array) => {
    let currentIndex = array.length
        , temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// blank array for cards
var openCards = [];

// function takes user click (input)
// starts timer when first card is opened
// defines up to two cards flipping open with animateCss
function cardSelection() {

    if (start_game == false) {
        start_game = true;
        timer.start();
    }

    if (openCards.length === 0) {
        $(this).toggleClass("show open").animateCss('flipInY');
        openCards.push($(this));
        disableSelection();
    }
    else if (openCards.length === 1) {
        // increment moves
        userMoves();
        $(this).toggleClass("show open").animateCss('flipInY');
        openCards.push($(this));
        setTimeout(matchOpenCards, 1100);
    }
}

// Disable click of the open Cards
// takes in user input as a click
// ensures potential match is selected to continue
var disableSelection = () => {
    openCards.forEach((card) => {
        card.off('click');
    });
}

// allows card to flip over when a match is not found
// also allows card to be selected again as an opencard
var enableSelection = () => {
    openCards[0].click(cardSelection);
}

// check openCards if they match or not
var matchOpenCards = () => {
    if (openCards[0][0].firstChild.className == openCards[1][0].firstChild.className) {
        console.log("matchCard");
        openCards[0].addClass("match").animateCss('tada');
        openCards[1].addClass("match").animateCss('tada');
        disableSelection();
        removeOpenCards();
        setTimeout(checkWin, 1000);
    }
    else {
        openCards[0].toggleClass("show open").animateCss('flipInY');
        openCards[1].toggleClass("show open").animateCss('flipInY');
        enableSelection();
        removeOpenCards();
    }
}

// function to remove openCards
var removeOpenCards = () => {
    openCards = [];
}

// add animation to cards opening and flipping
$.fn.extend({
    animateCss: function (animationName) {
        let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass(animationName).one(animationEnd, function () {
            $(this).removeClass(animationName);
        });
        return this;
    }
})

// update user move counter
// this is used to update win screen
var userMoves = () => {
    moves += 1;
    $('#moves').html(`${moves} Moves`);
    if (moves == 24) {
        addBlankStar();
    }
    else if (moves == 15) {
        addBlankStar();
    }
}

// add blank stars
var addBlankStar = () => {
    $('#stars').children()[0].remove();
    $('#stars').append('<li><i class="fa fa-star-o"></i></li>');
}

// loop (input) that creates the initial 3 stars (output)
var addStars = () => {
    for (let i = 0; i < 3; i++) {
        $('#stars').append('<li><i class="fa fa-star"></i></li>');
    }
}

// loops through matches to see if 8 are found
// 8 matches triggers WinScreen
var checkWin = () => {
    match_found += 1;
    if (match_found == 8) {
        showWinScreen();
    }
}

// reset the game
// input: reset button
// output: blank board
// output: new deck
// output: 0:00 on timer

function resetGame() {
    moves = 0;
    match_found = 0;
    $('#deck').empty();
    $('#stars').empty();
    $('#game-deck')[0].style.display = "";
    $('#victory-result')[0].style.display = "none";
    start_game=false;
    timer.stop();
    $('#timer').html("00:00:00");
    playGame();
}

// Calls functions to generate cards
// generate move counter
// generate stars
var playGame = () => {
    createCards();
    $('.card').click(cardSelection);
    $('#moves').html("0 Moves");
    addStars(3);
}

// shows result of the game
// takes 8 matches as input to activate
// also takes in html code to create boxes for information
// outputs: Congratulations, stars, and timer
var showWinScreen = () => {
    $('#victory-result').empty();
    timer.pause();
    const scoreBoard = `
        <div class ="congratulations"> Congratulations!</div>
        <div class ="congratulations"> You matched all the pairs!</div>
        <p>
            <span class="score-titles">Moves:</span>
            <span class="score-values">${moves}</span>
            <span class="score-titles">Time:</span>
            <span class="score-values">${timer.getTimeValues().toString()}</span>
        </p>
        <div class="text-center star-margin">
             <div class="star">
                <i class="fa fa-star fa-3x"></i>
             </div>
             <div class="star">
                <i class="fa ${ (moves > 24) ? "fa-star-o" : "fa-star"}  fa-3x"></i>
             </div>
            <div class="star">
                <i class="fa ${ (moves > 15) ? "fa-star-o" : "fa-star"} fa-3x"></i>
             </div>
        </div>
        <div class="text-center star-margin" id="restart">
            <i class="fa fa-repeat fa-2x"></i>
          </div>
    `;
    $('#game-deck')[0].style.display = "none";
    $('#victory-result')[0].style.display = "block";
    $('#victory-result').append($(scoreBoard));
    $('#restart').click(resetGame);
}

// start the game
playGame();
