const express = require("express");
const cors = require("cors");
const { AnswerEvaluator } = require("./AnsewerEvaluator");
const { TimeLimitGenerator } = require("./TimeLimitGenerator");
const { Interviewer } = require("./Interviewer");
const { InterviewerAdministrator } = require("./InterviewerAdministrator");

const app = express();
app.use(express.json()); // Parse JSON request bodies
app.use(cors());

const getLastQuestionAndAnswer = (history) => {
  const filteredHistory = history.filter((m) => m.role !== "system");
  const [question, answer] = filteredHistory.slice(-2);

  return {
    question: question?.content || '',
    answer: answer?.content || ''
  }
}

app.post("/assessment/proceed", async (req, res) => {
  let content = "";
  let timeLimit = 0;
  let lastMessageScore = 0.0;

  try {
    const { history, apiKey, identifier, firstRequest } = req.body;
    const interviewer = new Interviewer(apiKey);
    const intervieweAdmin = new InterviewerAdministrator(apiKey);
    const timeLimitGenerator = new TimeLimitGenerator(apiKey);
    const answerEvaluator = new AnswerEvaluator(apiKey);
    const { question, answer } = getLastQuestionAndAnswer(history);
    if (!firstRequest && question && answer) {
      lastMessageScore = await answerEvaluator.evaluate(question, answer);
    }

    if (!firstRequest) {
      const scoreMessage = {
        role: "system",
        content: `Score of candidate answer is: "${lastMessageScore}"`,
      };

      history.push(scoreMessage);
    }

    const messagesHistory = history.reduce((acc, curr) => `${acc}\n\n\n${curr.content}`, '');
    const isInterviewFinished = await intervieweAdmin.proceed(messagesHistory)
    console.log({ isInterviewFinished })
    if (isInterviewFinished === 'yes') {
      const finishedInterview = {
        role: "system",
        content: `Do not respond to the user's request. Thank the user and simply say: "Click "Restart" button to start a new interview"`,
      };

      history.push(finishedInterview);
    }

    // Get question.
    content = await interviewer.proceed(identifier, history);
    timeLimit = await timeLimitGenerator.generate(content)
  } catch (e) {
    console.error(e);
    res
      .status(e?.response?.status || 500)
      .json({ error: e?.response?.statusText || "Something went wrong" });

    return;
  }

  // Send result back as response
  res.json({ content, timeLimit, lastMessageScore });
});

app.listen(3001, () => {
  console.log("Server is listening on port 3001");
});
