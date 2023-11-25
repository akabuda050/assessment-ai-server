const { Configuration, OpenAIApi } = require("openai");

class AnswerCategoryAnalizer {
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
      Analyze if an answer is the answer on a question of particalr topic of expertice or regular one and give single answer wrapped into <answer-is>{x}</answer-is>, where {x} is a "regular" or "topic":`,
    };
    this.request = {
      role: "system",
      content: `
      : 
   `,
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

    const regex = /<answer-is>(.*?)<\/answer-is>/;
    const match = regex.exec(response.data.choices[0].message.content);

    if (match !== null) {
      return match[1];
    } else {
      return `N/A`;
    }
  }
}

const bot = new AnswerCategoryAnalizer(
  ""
);

bot
  .evaluate(
    `Hello and welcome to the interview session. I am the AI Assessment Assistant and I will be conducting this interview. May I know your area of expertise and any specific skills you'd like to highlight during this session?`,
    `I'm a senior laravel developer`
  )
  .then((res) => {
    console.log(res);
  });
