const { Configuration, OpenAIApi } = require("openai");
const { writeFileSync, existsSync, mkdirSync } = require("fs");
const path = require("path");

class Interviewer {
  constructor(apiKey) {
    this.configuration = new Configuration({
      apiKey,
    });
    this.openai = new OpenAIApi(this.configuration);
    this.defineRules();
  }

  defineRules() {
    this.rules = {
      role: "system",
      content: `
      You are the interviewer's assistant. You will be responsible for identifying areas of expertise and generating questions on a particular area of expertise in request.
      You will generate questions based on a given mastery level or a given grade.
      Questions should be up to date with current year but do not expose year in questions.
        `,
    };

    this.request = {
      role: "system",
      content: ``,
    };
  }

  async proceed(request, numberOfQuestions, masteryLevel) {
    const messages = [
      this.rules,
      this.request,
      {
        role: "system",
        content: `Identify area of expertise or technology and generate ${numberOfQuestions} for next mastery level or grade: "${masteryLevel}" with max 150 words, without explanation, where each question wrapped to shortcodes <question>{question without numbering}</question>:
        If you are unable to identify area of expertise or technology, return a shortcode: <error>{explanation}</error>":\n
        Request: "${request}"`,
      },
    ];

    // @ts-ignore
    const response = await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      // @ts-ignore.
      messages: messages,
    });

    const regex = /<question>(.*?)<\/question>/g;
    const questionsMatch =
      response.data.choices[0]?.message?.content.match(regex);

    const questions =
      questionsMatch?.map(
        (question) =>
          (question && question.replace(/<\/?question>/g, ``)) || null
      ) || [];

    console.log(questions);

    const regex2 = /<error>(.*?)<\/error>/;
    const error = regex2.exec(response.data.choices[0]?.message?.content || "");

    return {
      questions,
      error: (error && error[1]) || null,
    };
  }
}

module.exports = {
  Interviewer,
};
