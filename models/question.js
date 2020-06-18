//Calls the database models
const db = require("../db/models");
const Op = require("sequelize").Op;

// Asks database to find all answers to the questions provided
const findOne = async (id) => {
  let findAnswersArr = await db.Answer.findAll({
    where: { questionId: id },
    include: [
      {
        model: db.Question,
      },
    ],
  });

  if (findAnswersArr.length === 0) {
    return;
  }

  let question = {
    id,
    questionText: findAnswersArr[0].Question.questionText,
    answers: [],
  };

  //Remapping sequelize model to a plane array
  findAnswersArr.forEach((answer) => {
    let a = {
      answerText: answer.answerText,
      isCorrect: answer.isCorrect,
    };
    question.answers.push(a);
  });
  return question;
};

//runs corrects answers in the background and returns when selected
const add = async (data) => {
  const newQuestion = await db.Question.create({ questionText: data.question, categoryId: data.category });
  let newAnswers = [{ answerText: data.correctAnswer, isCorrect: true, questionId: newQuestion.id }];
  newAnswers = newAnswers.concat(data.answers.map(answer => {
    return {
      answerText: answer,
      isCorrect: false,
      questionId: newQuestion.id
    };
  }));

  return db.Answer.bulkCreate(newAnswers.filter(answer => answer.answerText.trim()));
};

//Generates the quiz format from the main page
const generateQuiz = async (categories, questionLimit) => {
  // Input validation
  if (!categories) {
    // Default to SQL
    categories = [2];
  }
  if (!questionLimit) {
    questionLimit = 10;
  }
  if (!Array.isArray(categories)) {
    // Op.in requires and array, so make sure we have one
    categories = [categories];
  }

  // Get all questions for the given categories
  let allQuestions = await db.Question.findAll({ attributes: ["id"], where: { categoryId: { [Op.in]: categories } } });
  let questions = [];

  // If we don't have enough questions, just return the entire list
  if (allQuestions.length <= questionLimit) {
    return allQuestions.map(question => question.id);
  }

  // Otherwise, get a random list of questions
  for (let i = 0; i < questionLimit; i++) {
    let randomIndex = Math.floor(Math.random() * allQuestions.length);
    let randomQuestion = allQuestions[randomIndex].id;

    // Check if we already have the question
    if(questions.includes(randomQuestion)) {
      // Move the counter backwards so that we try again
      i--;
    } else {
      // Add question to out list
      questions.push(randomQuestion);
    }
  }

  return questions;
};

module.exports = { findOne, add, generateQuiz };
