// Array to hold quiz questions and answers
const quizData = [
    {
      question: "What is the capital of France?",
      options: ["Paris", "Berlin", "Madrid", "Rome"],
      answer: "Paris"
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      answer: "Mars"
    },
    {
      question: "What is the largest mammal in the world?",
      options: ["Elephant", "Blue Whale", "Shark", "Giraffe"],
      answer: "Blue Whale"
    }
  ];
  
  let currentQuestion = 0;
  let score = 0;
  
  const questionElement = document.querySelector('.quizgame h1');
  const answersList = document.querySelectorAll('.quizgame .answer');
  
  // Function to load a question
  function loadQuestion() {
    const currentQuiz = quizData[currentQuestion];
    questionElement.textContent = currentQuiz.question;
  
    answersList.forEach((answerElement, index) => {
      answerElement.textContent = currentQuiz.options[index];
      answerElement.onclick = () => selectAnswer(currentQuiz.options[index]);
    });
  }
  
  // Function to handle answer selection
  function selectAnswer(selectedOption) {
    const currentQuiz = quizData[currentQuestion];
  
    if (selectedOption === currentQuiz.answer) {
      score++;
    }
  
    currentQuestion++;
  
    if (currentQuestion < quizData.length) {
      loadQuestion();
    } else {
      showResult();
    }
  }
  
  // Function to display the result
  function showResult() {
    const middleContainer = document.getElementById('middle');
    middleContainer.innerHTML = `<h1>You scored ${score} out of ${quizData.length}</h1>`;
  }
  
  // Start the quiz
  loadQuestion();
  