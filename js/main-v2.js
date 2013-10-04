var quiz = quiz || {};

    quiz =  {
        current : 0,
        list : [
            {
                question: "Who is Prime Minister of the United Kingdom?", 
                choices: ["David Cameron", "Gordon Brown", "Winston Churchill", "Tony Blair"], 
                correctAnswer:0
            },
            {
                question: "How much wood could a wood chuck", 
                choices: ["dasgdsa", "asdg", "asdg", "test"], 
                correctAnswer:2
            },
            {
                question: "Who is Prime Minister of the United Kingdom?", 
                choices: ["1", "2", "3", "4"], 
                correctAnswer:3
            }
        ],
        answers : [],
        correctAnswers : [],
        getQuestionObj : function() {
            var questionPos = this.current;
                  question = this.list[questionPos];

            // Get Current Question Object
            return question;
        },
        init : function() {
            var total = quiz.list.length;
            
            $(".total").html(total);

            quiz.build();
            quiz.bindEvents();

        },
        bindEvents : function() {
            $(".prev-question").bind("click", quiz.prevQuestion);
            $(".next-question").bind("click", quiz.nextQuestion);
        },
        build : function() {
            var currentQuestion = this.getQuestionObj(),
                 questionsLength = currentQuestion.choices.length,
                 $questions = $(".quiz-questions"),
                 questionStr;

             // Clear out previous questions
             $questions.html("");

             // Add Question Header Text
            $(".questionHead").html(currentQuestion.question);

            // Build list of choices from current question
            for (var i = 0; i < questionsLength; i++) {
                questionStr = "<input type='radio' name='answer' value='" + currentQuestion.choices[i] + "'/>";
                questionStr += "<label>" + currentQuestion.choices[i] + "</label>";

                $questions.append(questionStr);
            }
        },
        checkForCheck : function() {
            var  choices = $(".quiz-questions").children("input[type='radio']"),
                  current = quiz.current,
                  currentQuestion = quiz.list[current],
                  correctAnswer = currentQuestion.choices[current];
            
            // Make sure a choice has been selected
            if ($(choices).is(":checked")) {
                var $checked = $("input:radio:checked"),
                      currentAnswer = quiz.answers[current],
                      value = $checked.val();

                // Keep track of answers
                if (!currentAnswer) {
                    quiz.answers.push(value);
                } else {
                    // Update array with modified selected value
                    quiz.answers[current] = value;
                }

                // Update correct Answer value as long as it is not already there
                if (value === correctAnswer && currentAnswer != value) {
                    quiz.correctAnswers.push(value);
                } else {
                    // User went back and changed value and now its wrong
                    if (value != quiz.correctAnswers[current]) {
                        var currentCorrectAnswer = quiz.correctAnswers[current],
                              index = quiz.correctAnswers.indexOf(currentCorrectAnswer);

                       // Remove previously selected correct answer
                        quiz.correctAnswers.splice(index, 1);
                    }
                }

                return true
            }
        },
        rememberAnswer : function() {
            var checkedValue = quiz.answers[quiz.current],
                 $checked = $("input:radio[value='" + checkedValue +"']");

            $checked.attr("checked", "checked");    
        },
        prevQuestion : function () {
            quiz.current--;
            quiz.build();

            quiz.rememberAnswer();

            if (quiz.current < 1) {
                $(".prev-question").hide();
            }
        },
        showResults : function () {
            var correctAnswers = quiz.correctAnswers.length;

            // Add amount of correct answers 
            $(".correct").html(correctAnswers);

            $(".quiz-wrap").fadeOut(function() {
                $(".results").fadeIn();  
            });
        },
        nextQuestion : function (elem) {
            var quizLength = quiz.list.length;

            if (quiz.checkForCheck()) {
                quiz.current++;

                // Only show previous button if we are not on 1st question
                if (quiz.current != 0) {
                    $(".prev-question").fadeIn();
                }

                // Only go to the next question if there are more questions
                if (quiz.current < quizLength) {
                    quiz.build(); 

                    // Add previously selected choice value if there is one
                    if (quiz.answers[quiz.current]) {
                        quiz.rememberAnswer();
                    }

                } else {
                    quiz.showResults();
                }

            } else {
                alert("Please select an answer");
            }

            return false;
        }
    };


// Start the Quiz
quiz.init();