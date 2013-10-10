// closure to prevent leaking to global scope
(function (window, document, $) {

    var quiz = quiz || {};

    (function () {

        var current = 0,
            answersArr = [],
            correctAnswersArr = [],
            questionData = [
                {
                    question: 'Who is Prime Minister of the United Kingdom?',
                    choices: ['David Cameron', 'Gordon Brown', 'Winston Churchill', 'Tony Blair'],
                    correctAnswer: 0
                },
                {
                    question: 'How much wood could a wood chuck?',
                    choices: ['some', 'not much', 'a lot', 'none'],
                    correctAnswer: 2
                },
                {
                    question: 'Which is the largest prime number?',
                    choices: ['5', '39', '44', '93'],
                    correctAnswer: 0
                }
            ];

        quiz.controls = {
            next : function () {
                var quizLength = questionData.length;

                if (quiz.checkForCheck()) {
                    current++;

                    // Only show previous button if we are not on 1st question
                    quiz.controls.togglePrevBtn();

                    // Only go to the next question if there are more questions
                    if (current < quizLength) {
                        quiz.build();

                        // Add previously selected choice value if there is one
                        if (answersArr[current]) {
                            quiz.rememberAnswer();
                        }

                    } else {
                        quiz.showResults();
                    }

                } else {
                    alert('Please select an answer');
                }

                return false;
            },
            prev : function () {
                current--;
                quiz.build();

                quiz.rememberAnswer();

                // Hide previous button if we are on 1st question
                quiz.controls.togglePrevBtn();
            },
            togglePrevBtn : function () {
                var prev = $('.prev-question');
                return current > 0 ? prev.fadeIn() : prev.hide();
            }
        };

        quiz.start = function () {
            var total = questionData.length;

            $('.total').html(total);

            quiz.build();

            $('.prev-question').on('click', quiz.controls.prev);
            $('.next-question').on('click', quiz.controls.next);
        };

        quiz.build = function () {
            var questionObj = questionData[current];

            var questionsLength = questionObj.choices.length,
                $questions = $('.quiz-questions'),
                questionStr;

            // Clear out previous questions
            $questions.html('');

            // Add Question Header Text
            $('.questionHead').html(questionObj.question);

            // Build list of choices from current question
            for (var i = 0; i < questionsLength; i++) {
                questionStr = '<input type="radio" name="answer" value="' + questionObj.choices[i] + '"/>';
                questionStr += '<label>' + questionObj.choices[i] + '</label>';

                $questions.append(questionStr);
            }
        }

        quiz.checkForCheck = function () {
            var choices = $('.quiz-questions').children('input[type="radio"]'),
                currentQuestion = questionData[current],
                correctAnswer = currentQuestion.choices[current];

            // Make sure a choice has been selected
            if ($(choices).is(':checked')) {
                var $checked = $('input:radio:checked'),
                    currentAnswer = answersArr[current],
                    value = $checked.val();

                // Keep track of answers
                if (!currentAnswer) {
                    answersArr.push(value);
                } else {
                    // Update array with modified selected value
                    answersArr[current] = value;
                }

                // Update correct Answer value as long as it is not already there
                if (value === correctAnswer && currentAnswer !== value) {
                    correctAnswersArr.push(value);
                } else {
                    // User went back and changed value and now its wrong
                    if (value !== correctAnswersArr[current]) {
                        var currentCorrectAnswer = correctAnswersArr[current],
                        index = correctAnswersArr.indexOf(currentCorrectAnswer);

                        // Remove previously selected correct answer
                        correctAnswersArr.splice(index, 1);
                    }
                }

                return true;
            }
        };

        quiz.rememberAnswer = function () {
            var checkedValue = answersArr[current],
                $checked = $('input:radio[value="' + checkedValue +'"]');

            $checked.attr('checked', 'checked');
        };

        quiz.showResults = function () {
            var correctAnswers = correctAnswersArr.length;

            // Add amount of correct answers
            $('.correct').html(correctAnswers);

            $('.quiz-wrap').fadeOut(function () {
                $('.results').fadeIn();
            });
        }

    }());

    $(function () {
        quiz.start();
    });

}(this, this.document, this.jQuery));
