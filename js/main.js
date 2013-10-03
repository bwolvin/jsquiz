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
            $(".next-question").bind("click", quiz.nextQuestion);
        },
        build : function() {
            var currentQuestion = this.getQuestionObj(),
                 questionsLength = currentQuestion.choices.length,
                 $questions = $(".quiz-questions"),
                 questionStr;

             // Clear out previos questions
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
                      value = $checked.val();

                if (value === correctAnswer) {
                    quiz.answers.push(value);
                } else {
                    console.log("Wrong Answer");
                }

                return true
            }
        },
        nextQuestion : function (elem) {
            var quizLength = quiz.list.length;

            if (quiz.checkForCheck()) {
                quiz.current++;

                // Only go to the next question if there are more questions
                if (quiz.current < quizLength) {
                    quiz.build();      
                } else {
                    var correctAnswers = quiz.answers.length;

                    // Add amount of correct answers 
                    $(".correct").html(correctAnswers);

                    $(".quiz-wrap").fadeOut(function() {
                        $(".results").fadeIn();  
                    });
                }

            } else {
                alert("Please select an answer");
            }

            return false;
        }
    };


// Start the Quiz
quiz.init();