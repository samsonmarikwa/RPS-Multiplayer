$(document).ready(function() {
    //declare variables
    var randomNum; // pick random questions from questions array
    var correctAnsCnt; // count correct answers
    var incorrectAnsCnt; // count incorrect answers
    var unAnsQuestionCnt; // count unanswered questions
    var choice; // record the answer index number selected by the user
    var intervalId; // interval id from setInterval
    var secondsElapsed; // seconds elapsed counter

    // init variables
    correctAnsCnt = 0;
    incorrectAnsCnt = 0;
    unAnsQuestionCnt = 0;
    intervalId = 0;
    secondsElapsed = 0;

    // declare questions array
    var questions = [];

    // declare two dimensional array for answers. Each question has 4 multiple choices.
    var answers = [];

    // declare array with correct answers index numbers to the answers array
    var CorrectChoice = [];

    // declare array with image sources of the correct answers
    var Images = [];


    /*
     * The function allows the user to select an answer from a ul. The answer will be check
     * if its correct and a feedback function is called with a parameter. A respective counter
     * is accumulated. The function calls start so the next question is prepared.
     */
    function selectAnswer() {

        // set choice to index number of the clicked li element
        choice = $(this).index();

        // check if the answer is correct
        if (choice === CorrectChoice[randomNum]) {
            correctAnsCnt++; // increment correct answers counter 

            displayFeedback("CORRECT"); // display feedback on correct answer

        } else {

            displayFeedback("INCORRECT");

            incorrectAnsCnt++; // increment incorrect answers counter
        }

        // since a selection has been made, no need to wait for the counter hence disrupting
        // it to enable the system to ask the next question immediately within the start function
        secondsElapsed = -5;

        start();
    }

    /*
     * Retrieves the correct answer from the answers array using the random number which
     * was used to pull out the question.
     */
    function getAnswer(num) {
        return answers[num][CorrectChoice[num]];
    }

    /*
     * Retrieves the image matching the answer using the random number which
     * was used to pull out the question.
     */
    function getImage(num) {
        return Images[num];
    }

    /*
     * function sets up the wait time which is five seconds for the user to select the
     * correct answer. The secondsElapsed is decremented by one. If the user does not
     * select a choice, a feedback message is given and the system goes to the start
     * function to prepare another question.
     */
    function waitUserChoice() {
        if (secondsElapsed === -5) {
            secondsElapsed = 11;
            getQuestion();
        }

        // show time left
        secondsElapsed--; //  decrement counter
        $("#seconds-elapsed").html("<strong>" + secondsElapsed + " seconds</strong>");

        if (secondsElapsed < 0) {
            unAnsQuestionCnt++;

            displayFeedback("TIMEOUT")

            secondsElapsed = -5; // disrupt counter so as to ask next question immedately

            start();
        }

    }

    /*
     * function display feedback on the answer selected or when the user does not
     * respond in time to the question.
     */
    function displayFeedback(fdbk) {

        // hide answers-div
        $(".answers-div").css("display", "none");

        // display feedback div
        $(".feedback-div").css("display", "block");
        $("#seconds-elapsed").html("<strong>" + secondsElapsed + " seconds</strong>");

        if (fdbk === "TIMEOUT") {
            $("#feedback1").html("<h2><strong>Out of Time !!!</strong></h2>");

            //display correct answer
            $("#feedback2").html("<h2><strong>The correct answer was: " + getAnswer(randomNum) + " </strong></h2>");
        } else if (fdbk === "CORRECT") {
            $("#feedback1").html("<h2>Correct!!!</h2>");
            $("#feedback2").html("");
        } else {

            $("#feedback1").html("<h2><strong>Nope!!!</strong></h2>");

            //display correct answer
            $("#feedback2").html("<h2><strong>The correct answer was: " + getAnswer(randomNum) + " </strong></h2>");
        }
        //display image
        $("#image").html("<img src='" + getImage(randomNum) + "' height='280' width='350'>");

        // a processed question should be deleted from the questions array
        deleteQuestion(randomNum);

    }

    /*
     * Delete an asked question from the questions array and all related elements from the
     * other arrays. An empty question array is tested to stop the timer and prompt a restart
     * within the getQuestion function.
     */
    function deleteQuestion(num) {

        questions.splice(num, 1);
        answers.splice(num, 1);
        CorrectChoice.splice(num, 1);
        Images.splice(num, 1);

    }

    /*
     * retrieve a question from the questions array using a random number and display multiple
     * choice answers.
     */
    function getQuestion() {

        // check if more questions available
        if (questions.length > 0) {
            // more questions available to process

            // get random number to pick up question from array
            randomNum = Math.floor(Math.random() * questions.length);

            // hide answers, feedback and start-over divs
            $(".start-div").css("display", "none");
            $(".feedback-div").css("display", "none");
            $(".start-over-div").css("display", "none");

            // display answers div
            $(".answers-div").css("display", "block");
            $("#question").html("<h2>" + questions[randomNum] + "</h2>");

            // display multiple choice answers
            $("#answers-choice").html("<ul id='choice'>");
            for (let answer of answers[randomNum]) {
                $("ul").append("<li id='selection'><a href='#'>" + answer + "</a></li>");
            }

        } else {
            // no more questions. Clear interval identity and display the results
            clearInterval(intervalId);
            results();
        }
    }

    /*
     * display results from the test
     */
    function results() {

        $(".answers-div").css("display", "none");
        $(".feedback-div").css("display", "none");

        $(".start-over-div").css("display", "block");

        $("#correct").html("<strong>" + correctAnsCnt + "</strong>");
        $("#incorrect").html("<strong>" + incorrectAnsCnt + "</strong>");
        $("#unanswered").html("<strong>" + unAnsQuestionCnt + "</strong>");

    }

    /*
     * executed when the Start utton is clicked. Function can also be initiated without
     * a button click in order to pick up the next question. When the function is initiated
     * through a button click, we ask the next question immediatedly. When initiated within
     * the program logic, we allow the feedback from the previous question to display longer
     */
    function start() {

        clearInterval(intervalId);
        if (secondsElapsed === -5) {
            intervalId = setInterval(waitUserChoice, 3000);
        } else {

            secondsElapsed = 11;

            getQuestion();

            intervalId = setInterval(waitUserChoice, 3000);
        }

    }

    /*
     * Put data into the arrays
     */
    function populateArrays() {

        questions = ["Who is Chuck Noris?", "Who is Taylor Swift?", "What is Barack Obama known for?",
            "What is Albert Einstein known for?", "Where is Cecil John Rhodes buried?",
            "Which is out of place?"
        ];

        answers = [
            ["Actor", "Singer", "Massachusets Former Governor", "Lakewood Church Pastor"],
            ["Olympic Gold Medalist", "Tennis No.1 seed", "Singer", "US Ambassador to United Nations"],
            ["Actor", "Inventor of Linux Operating System", "US Ambassador to United Nations",
                "President of United States"
            ],
            ["Theoretical physicist", "Germany Evangelist", "German Chancellor", "Bulb Inventor"],
            ["Zimbabwe Matopo Hills", "St George's Chapel, Windsor Castle",
                "Andrew Johnson National Cemetery", "Queen Victoria Falls, Zimbabwe"
            ],
            ["North Carolina", "New York", "London", "New Jersey"]
        ];

        CorrectChoice = [0, 2, 3, 0, 0, 2];

        Images = ["assets/images/ChuckNorris.gif", "assets/images/Taylor.gif", "assets/images/Obama.gif", "assets/images/Albert.gif", "assets/images/Matobo.jpg", "assets/images/London.gif"];

    }

    /*
     * executes when the restart button is clicked. variables and arrays are re-initialized.
     * the function then calls the start function.
     */
    function restart() {
        correctAnsCnt = 0;
        incorrectAnsCnt = 0;
        unAnsQuestionCnt = 0;
        intervalId = 0;
        secondsElapsed = 0;

        populateArrays();

        start();

    }

    populateArrays();
    $("body").on("click", "#btn-start", start);
    $("body").on("click", "#selection", selectAnswer);
    $("body").on("click", "#btn-restart", restart);

});