const db = require("../db/models");
//Returns all scores posted on the highscore page and from highest to lowest
const findAll = async () => {
  let highScoreArr = await db.Highscore.findAll({
    order:[
      ["score", "DESC"],
    ],
  });
  let viewModel = highScoreArr.map((highscore) => {
    return {
      username: highscore.username,
      score: highscore.score,
      id: highscore.id
    };
  });
  return {
    highscores: viewModel
  };
};

const save = async (data) => db.Highscore.create(data);

module.exports = { findAll, save };
