const { Configuration, OpenAIApi } = require("openai");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { detailLevelsContext } = require("./context/detailsLevelsContext");
const {
  complexityLevelsContext,
} = require("./context/complexityLevelsContext");

class QuestionTimeLimitGenerator {
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
      content: `You are a time limit generator assistant for interview questions. 
      You will be responsible for identifying the complexity level of a question and the required level of detail required for the answer to that question and generating a time limit for provided questions.
      As the time limit generator assistant, you should be able to understand the nuances of the question and if it requires time limits.
      As the time limit generator assistant, you should be able to analyze the complexity of the questions and the required level of detail required for the answer to the question.
      The time limit should be based on the level of complexity of the question and on the level of detail required for the answer to that question.
      Take into account a speed of the answer also.

      ${complexityLevelsContext}
      ${detailLevelsContext}
      
      Format of response:"
        <questions>
          <question>
             <details>{question}</details>
             <time-limit>{single number in seccods}</time-limit>
             <complexity-level>{complexity}</complexity-level>
             <level-of-detail-required>{required level of detail for the anaswer}</level-of-detail-required>
           </question>
          ...
        </questions>".
      If you are unable to identify or generate time limits or the question type does not requires time limits such as greetings or cross-questions, return:"
        <questions>
          <question>
            <details>{question}</details>
            <time-limit>0</time-limit>
            <error>{reason}</error>
          </question>
          ...
        </questions>".
      `,
    };

    this.request = {
      role: "system",
      content: `
      Understand if questions require time limits. 
      Analyze complexity of the questions and required level of details for the answers to the questions and generate time limits:
      Do not explain or do not add notes to the response:\n\n
   `,
    };
  }

  async generate(
    guestions,
    speedOfTypingWordsPerMinite
  ) {
    const messages = [
      this.rules,

      this.request,
      {
        role: "system",
        content: `
        Questions: "${guestions.join(",")}"\n\n
        Speed of the answer: "${speedOfTypingWordsPerMinite} words per minute"\n\n
        `,
      },
    ];

    const response = await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      // @ts-ignore.
      messages: messages,
    });

    const input = response.data.choices[0]?.message?.content || "";

    return this.parseQuestions(input);
  }

  parseQuestions(xmlString) {
    const dom = new JSDOM(xmlString);
    const questions = Array.from(dom.window.document.getElementsByTagName("question"));
    const questionList = questions.map((question) => {
      const details = question.getElementsByTagName("details")[0].textContent;
      const timeLimit = parseInt(question.getElementsByTagName("time-limit")[0].textContent);
      const complexityLevel = question.getElementsByTagName("complexity-level")[0].textContent;
      const levelOfDetailRequired = question.getElementsByTagName("level-of-detail-required")[0].textContent;
      return { details, timeLimit, complexityLevel, levelOfDetailRequired };
    });
    return questionList;
  }
}

module.exports = {
  QuestionTimeLimitGenerator,
};
