var buttonColors = ["red","blue","green","yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var started = false;

// Wait for keyboard input to start game
$(document).on("keydown", function() {
    // started=false on load - runs nextSequence for the first time and updates started to true to stop listening for keyboard input
    if(!started) {
        const startSound = new Audio("sounds/alert.wav");
        startSound.play();
        
        $("level-title").text("Level " + level);
        started = true;
        
        startSound.onended = function() {
            nextSequence();
        };
    }
    
});

function nextSequence () {
    // Reset user input array
    userClickedPattern = [];
    
    // Increment level by 1 and change header to show level number
    level++;
    $("#level-title").text("Level "+level);

    // Generate random number 1-4 and assign to randomChosenColor, then push color to the gamePattern array
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber]; 
    gamePattern.push(randomChosenColor);
    
    // Pass chosen color to animate and sound functions
    animatePress(randomChosenColor);
    playSound(randomChosenColor);
}

// Target all elements with "btn" class and listen for user click
$(".btn").on("click", function () {
    // Retrieve id of button clicked and set as userChosenColor
    var userChosenColor = $(this).attr("id");
    // Push userChosenColor to userClickedPattern array
    userClickedPattern.push(userChosenColor);
    // Pass user color to animate and sound functions
    playSound(userChosenColor);
    animatePress(userChosenColor);
    // Pass the index of the last item in the userClickedPattern array to the checkAnswer function
    checkAnswer(userClickedPattern.length-1);
    
});

function playSound (name) {
    const buttonSound = new Audio(`sounds/${name}.mp3`);
    buttonSound.play();
}

function animatePress(currentColor) {
    $("#"+currentColor).addClass("pressed");
    setTimeout(function() {
        $("#"+currentColor).removeClass("pressed");
    },100);
}

function checkAnswer(currentIndex) {
    // Checks if the last item in the userClickedPattern array = the last item in the gamePattern array
    if (gamePattern[currentIndex] === userClickedPattern[currentIndex]) {
        // Checks if the user's sequence is complete by checking the length of both arrays
        if (gamePattern.length === userClickedPattern.length) {
            // if the user sequence is complete, runs nextSequence after a delay of 1000ms
            setTimeout(nextSequence,1000);
        }
    }
    // if the user input != the gamePattern, play wrongSound, apply game-over class for 200ms, set title to game over text, run startOver function 
    else {
        const wrongSound = new Audio("sounds/wrong.mp3");
        wrongSound.play();
        $("#level-title").text("Game Over, Press Any Key to Restart");
        $("body").addClass("game-over");

        setTimeout(function() {
            $("body").removeClass("game-over");
        },200);
        startOver();
    }
}

// startOver resets level, gamePattern array, and sets started flag to false (which starts listening for keyboard input again)
function startOver() {
    level = 0;
    gamePattern = [];
    started = false;
}