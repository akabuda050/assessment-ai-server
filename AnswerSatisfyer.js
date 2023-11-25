const { Configuration, OpenAIApi } = require("openai");

class AnswerSatisfyer {
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
      Analyze if an answer is satisfying a question and give a single answer, wrapped into shortcode <is-answer-correct>{x}</is-answer-correct>, where {x} is a "no" or "yes". 
      If the answer is partially satisfying the question answer can be <is-answer-correct>partially</is-answer-correct>.
      Add 20 words explanation wrapped to shortcode <reason-or-explanation>{explanation}</reason-or-explanation>:
      `,
    };
    this.request = {
      role: "system",
      content: ``,
    };
  }

  async evaluate(question, answer) {
    const messages = [
      this.rules,
      this.request,
      {
        role: "system",
        content: `Question: "${question}"\n\nAnswer: "${answer}"`,
      },
    ];

    // @ts-ignore
    const response = await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      // @ts-ignore.
      messages: messages,
    });

    const regex = /<is-answer-correct>(.*?)<\/is-answer-correct>/;
    const match = regex.exec(response.data.choices[0].message.content);

    const regex2 = /<reason-or-explanation>(.*?)<\/reason-or-explanation>/;
    const match2 = regex2.exec(response.data.choices[0].message.content);

    const result = {
      satisfied: (match[1] && match[1].toLowerCase()) || null,
      explanation: match2[1],
    };

    return result;
  }
}

module.exports = {
  AnswerSatisfyer,
};
