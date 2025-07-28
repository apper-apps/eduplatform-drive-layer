import React, { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { toast } from 'react-toastify';

const Quiz = ({ lesson, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);

  // Sample quiz questions based on lesson ID
  const getQuizQuestions = (lessonId) => {
    const quizData = {
      3: [ // React Basics Quiz
        {
          id: 1,
          question: "What is the main benefit of using React components?",
          options: [
            "Reusability and modularity",
            "Faster loading times", 
            "Better SEO optimization",
            "Smaller file sizes"
          ],
          correctAnswer: 0,
          explanation: "React components promote reusability and modularity, allowing developers to build complex UIs from simple, reusable pieces."
        },
        {
          id: 2,
          question: "What is JSX in React?",
          options: [
            "A database query language",
            "A JavaScript extension that allows HTML-like syntax",
            "A CSS framework",
            "A testing library"
          ],
          correctAnswer: 1,
          explanation: "JSX is a JavaScript syntax extension that allows you to write HTML-like code in your JavaScript files, making React components more readable and intuitive."
        },
        {
          id: 3,
          question: "Which hook is used for managing component state in functional components?",
          options: [
            "useEffect",
            "useContext", 
            "useState",
            "useReducer"
          ],
          correctAnswer: 2,
          explanation: "useState is the primary hook for managing local component state in functional React components."
        }
      ],
      9: [ // Marketing Strategy Quiz
        {
          id: 1,
          question: "What is the first step in developing a digital marketing strategy?",
          options: [
            "Creating content",
            "Defining target audience",
            "Setting up social media accounts",
            "Designing advertisements"
          ],
          correctAnswer: 1,
          explanation: "Defining your target audience is crucial as it informs all other marketing decisions and ensures your efforts reach the right people."
        },
        {
          id: 2,
          question: "Which metric is most important for measuring brand awareness?",
          options: [
            "Click-through rate",
            "Conversion rate",
            "Reach and impressions",
            "Cost per acquisition"
          ],
          correctAnswer: 2,
          explanation: "Reach and impressions measure how many people see your content, which is the primary indicator of brand awareness growth."
        },
        {
          id: 3,
          question: "What is A/B testing in digital marketing?",
          options: [
            "Testing two different audiences",
            "Comparing two versions of marketing material",
            "Testing on different platforms",
            "Analyzing competitor strategies"
          ],
          correctAnswer: 1,
          explanation: "A/B testing involves comparing two versions of marketing material to determine which performs better with your audience."
        }
      ],
      16: [ // Design Knowledge Check
        {
          id: 1,
          question: "What is the primary goal of user experience (UX) design?",
          options: [
            "Making interfaces look beautiful",
            "Creating usable and enjoyable user interactions",
            "Following design trends",
            "Reducing development costs"
          ],
          correctAnswer: 1,
          explanation: "UX design focuses on creating meaningful and relevant experiences for users by making products usable, accessible, and enjoyable to interact with."
        },
        {
          id: 2,
          question: "Which principle helps establish visual hierarchy in design?",
          options: [
            "Symmetry",
            "Contrast",
            "Balance",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Visual hierarchy is established through multiple principles including contrast (to highlight important elements), balance (to organize content), and symmetry (to create order)."
        },
        {
          id: 3,
          question: "What is the purpose of user personas in UX design?",
          options: [
            "To decorate presentations",
            "To represent target user groups and their needs",
            "To comply with design standards",
            "To impress stakeholders"
          ],
          correctAnswer: 1,
          explanation: "User personas are fictional characters created to represent different user types and help designers understand user needs, experiences, behaviors, and goals."
        }
      ],
      21: [ // Python Skills Assessment
        {
          id: 1,
          question: "Which Python library is primarily used for data manipulation and analysis?",
          options: [
            "NumPy",
            "Pandas",
            "Matplotlib",
            "Scikit-learn"
          ],
          correctAnswer: 1,
          explanation: "Pandas is the go-to library for data manipulation and analysis in Python, providing data structures and operations for manipulating numerical tables and time series."
        },
        {
          id: 2,
          question: "What does the 'shape' attribute of a pandas DataFrame return?",
          options: [
            "The data types of columns",
            "The number of rows and columns as a tuple",
            "The column names",
            "The memory usage"
          ],
          correctAnswer: 1,
          explanation: "The 'shape' attribute returns a tuple representing the dimensionality of the DataFrame - (number of rows, number of columns)."
        },
        {
          id: 3,
          question: "Which method is used to handle missing values in a pandas DataFrame?",
          options: [
            "clean()",
            "remove_null()",
            "dropna() or fillna()",
            "fix_missing()"
          ],
          correctAnswer: 2,
          explanation: "dropna() removes rows/columns with missing values, while fillna() replaces missing values with specified values or strategies."
        }
      ],
      27: [ // Cell Biology Quiz
        {
          id: 1,
          question: "What is the powerhouse of the cell?",
          options: [
            "Nucleus",
            "Mitochondria",
            "Ribosome",
            "Endoplasmic reticulum"
          ],
          correctAnswer: 1,
          explanation: "Mitochondria are known as the powerhouse of the cell because they generate most of the cell's ATP (energy) through cellular respiration."
        },
        {
          id: 2,
          question: "Which organelle is responsible for protein synthesis?",
          options: [
            "Golgi apparatus",
            "Lysosome",
            "Ribosome",
            "Vacuole"
          ],
          correctAnswer: 2,
          explanation: "Ribosomes are the cellular structures responsible for protein synthesis, where amino acids are assembled into proteins according to mRNA instructions."
        },
        {
          id: 3,
          question: "What is the function of the cell membrane?",
          options: [
            "DNA storage",
            "Protein production",
            "Controlling what enters and exits the cell",
            "Energy production"
          ],
          correctAnswer: 2,
          explanation: "The cell membrane is selectively permeable, controlling the movement of substances in and out of the cell to maintain cellular homeostasis."
        }
      ]
    };
    return quizData[lessonId] || [];
  };

  useEffect(() => {
    const quizQuestions = getQuizQuestions(lesson.Id);
    setQuestions(quizQuestions);
  }, [lesson.Id]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (optionIndex) => {
    if (showFeedback) return;
    
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionIndex
    });
  };

  const handleSubmitAnswer = () => {
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
    } else {
      // Calculate final score
      let correctCount = 0;
      questions.forEach((question, index) => {
        if (selectedAnswers[index] === question.correctAnswer) {
          correctCount++;
        }
      });
      setScore(correctCount);
      setQuizCompleted(true);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowFeedback(false);
    setQuizCompleted(false);
    setScore(0);
  };

  const handleCompleteQuiz = () => {
    toast.success("Quiz completed successfully!");
    onComplete();
  };

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center">
        <ApperIcon name="AlertCircle" size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Quiz Available</h3>
        <p className="text-gray-600">This quiz is currently being developed.</p>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
            passed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
          }`}>
            <ApperIcon name={passed ? "CheckCircle" : "XCircle"} size={40} />
          </div>
          
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
            Quiz Completed!
          </h2>
          
          <div className="bg-white rounded-lg p-6 shadow-md mb-6">
            <div className="text-4xl font-bold text-gray-900 mb-2">{percentage}%</div>
            <div className="text-gray-600 mb-4">
              You scored {score} out of {questions.length} questions correctly
            </div>
            
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              passed 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              <ApperIcon 
                name={passed ? "Trophy" : "RotateCcw"} 
                size={16} 
                className="mr-1" 
              />
              {passed ? 'Passed' : 'Needs Improvement'}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Review Summary</h3>
            <div className="space-y-3">
              {questions.map((question, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className="bg-gray-50 rounded-lg p-4 text-left">
                    <div className="flex items-start">
                      <ApperIcon 
                        name={isCorrect ? "CheckCircle" : "XCircle"} 
                        size={20} 
                        className={`mr-3 mt-0.5 ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`} 
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Question {index + 1}: {question.question}
                        </p>
                        <p className="text-sm text-gray-600">
                          Your answer: {question.options[userAnswer]}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-emerald-600 mt-1">
                            Correct answer: {question.options[question.correctAnswer]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4 justify-center mt-8">
            <Button 
              variant="outline" 
              onClick={handleRetakeQuiz}
              className="flex items-center"
            >
              <ApperIcon name="RotateCcw" size={16} className="mr-2" />
              Retake Quiz
            </Button>
            <Button 
              onClick={handleCompleteQuiz}
              className="flex items-center"
            >
              <ApperIcon name="CheckCircle" size={16} className="mr-2" />
              Complete Lesson
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const selectedAnswer = selectedAnswers[currentQuestionIndex];
  const hasSelectedAnswer = selectedAnswer !== undefined;
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
            {currentQuestion?.question}
          </h2>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion?.options.map((option, index) => {
              let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ";
              
              if (showFeedback) {
                if (index === currentQuestion.correctAnswer) {
                  buttonClass += "border-emerald-500 bg-emerald-50 text-emerald-800";
                } else if (index === selectedAnswer) {
                  buttonClass += "border-red-500 bg-red-50 text-red-800";
                } else {
                  buttonClass += "border-gray-200 bg-gray-50 text-gray-600";
                }
              } else if (selectedAnswer === index) {
                buttonClass += "border-primary-500 bg-primary-50 text-primary-800";
              } else {
                buttonClass += "border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showFeedback}
                  className={buttonClass}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                      showFeedback && index === currentQuestion.correctAnswer
                        ? 'border-emerald-500 bg-emerald-500'
                        : showFeedback && index === selectedAnswer && index !== currentQuestion.correctAnswer
                        ? 'border-red-500 bg-red-500'
                        : selectedAnswer === index
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300'
                    }`}>
                      {(selectedAnswer === index || (showFeedback && index === currentQuestion.correctAnswer)) && (
                        <ApperIcon 
                          name={showFeedback && index === currentQuestion.correctAnswer ? "Check" : "Check"} 
                          size={12} 
                          className="text-white" 
                        />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`mt-6 p-4 rounded-lg border ${
              isCorrect 
                ? 'border-emerald-200 bg-emerald-50' 
                : 'border-red-200 bg-red-50'
            }`}>
              <div className="flex items-start">
                <ApperIcon 
                  name={isCorrect ? "CheckCircle" : "XCircle"} 
                  size={20} 
                  className={`mr-3 mt-0.5 ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`} 
                />
                <div>
                  <p className={`font-medium mb-2 ${isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </p>
                  <p className={`text-sm ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                    {currentQuestion?.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <div>
            {currentQuestionIndex > 0 && !showFeedback && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setCurrentQuestionIndex(currentQuestionIndex - 1);
                  setShowFeedback(false);
                }}
              >
                <ApperIcon name="ChevronLeft" size={16} className="mr-2" />
                Previous
              </Button>
            )}
          </div>
          
          <div>
            {!showFeedback ? (
              <Button 
                onClick={handleSubmitAnswer}
                disabled={!hasSelectedAnswer}
                className="flex items-center"
              >
                Submit Answer
                <ApperIcon name="Check" size={16} className="ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleNextQuestion}
                className="flex items-center"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
                <ApperIcon name="ChevronRight" size={16} className="ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;