const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const { CVParser } = require("./services/CVParser");
const { CVAnalyzer } = require("./assistants/CVParserAssistant");
const { CVSummarizer } = require("./assistants/CVSummarizer");
const {
  InterviewQuestionsGenerator,
} = require("./assistants/InterviewQuestionsGenerator");

const {
  QuestionTimeLimitGenerator,
} = require("./assistants/QuestionTimeLimitGenerator");

const app = express();
app.use(express.json()); // Parse JSON request bodies
app.use(cors());

const upload = multer({ dest: "data/cv" });

const apiKey = "";
const cvParser = new CVParser();
const cvAnalyzer = new CVAnalyzer(apiKey);
const cVSummarizer = new CVSummarizer(apiKey);

app.post("/assessment/analyze-cv", upload.single("file"), async (req, res) => {
  if (req?.file?.path) {
    const filePath = path.resolve(req?.file?.path);

    const parsed = await cvParser.parse(filePath);
    const result = await cvAnalyzer.analyze(parsed);
    const summary = await cVSummarizer.summarize(result);
    res.json({ result, summary });

    return;
  }

  res.json({ error: "Unable to upload file!" });
});

const interviewQuestionsGenerator = new InterviewQuestionsGenerator(apiKey);
const timeLimitGenerator = new QuestionTimeLimitGenerator(apiKey);
app.post("/assessment/get-questions", async (req, res) => {
  const { candidateInformation } = req.body;
  const questions = await interviewQuestionsGenerator.generate(
    5,
    [],
    candidateInformation,
    null
  );

  const timeLimits = await timeLimitGenerator.generate(
    questions.questions,
    10
  );

  res.json({ questions: timeLimits });
});

app.listen(3001, () => {
  console.log("Server is listening on port 3001");
});
