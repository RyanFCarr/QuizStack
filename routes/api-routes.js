const router = require("express").Router();
const question = require("../models/question");
const highscore = require("../models/highscore");
const category = require("../models/category");

// Api-Route
router.get("/api/question/:id", async (req, res) => res.json(await question.findOne(req.params.id)));

router.post("/api/question", async (req, res) => res.send(await question.add(req.body)));

router.delete("/api/question/:id", async (req, res) => res.json(await question.deleteOne(req.params.id)));

// Save Highscore
router.post("/api/highscore", async (req, res) => {
  try{
    await highscore.save(req.body);
  }catch(error){
    console.error(error);
    res.sendStatus(500);
  }
  res.sendStatus(201);
});

// highScore
router.get("/api/highscore", async (req, res) => res.json(await highscore.findAll()));

router.get("/api/quiz", async (req, res) => res.json(await question.generateQuiz(req.query.category, req.query.questionLimit)));

router.get("/api/category", async (req, res) => res.json(await category.findAll()));

module.exports = router;
