const path = require("path");
const { Configuration, OpenAIApi } = require("openai");
const { JSDOM } = require("jsdom");
const { CVParser } = require("../services/CVParser");
const { cvSectionsContext } = require("./context/CV/cvSectionsContext");
const { cvTemplateContext } = require("./context/CV/cvTemplateContext");
const { writeFileSync } = require("fs");

class CVParserAssistant {
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
      content: `You are CV Analyzer.
      Format CV and remove all unnessesary words such html tags or special chars.  
      Analyze given CV in detail and identify following sections:

      "${cvSectionsContext}"
      
      Please do not invent any information that does not exist in the CVs we review. It is important that we evaluate candidates based on their actual skills and experiences
      It would be helpful if you could gather as much information as possible in each section, but to avoid adding any information that does not exist.
     
      Format of response is valid xml with following template: "${cvTemplateContext}".
      If you are unable to analyze CV at all, return xml with "<error>{reason}</error>".
      \n\n`,
    };
    this.request = {
      role: "system",
      content: `Analyze CV:`,
    };
  }

  async analyze(CV) {
    const messages = [
      this.rules,
      this.request,
      {
        role: "system",
        content: `"${CV}"`,
      },
    ];

    // @ts-ignore
    const response = await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      // @ts-ignore.
      messages: messages,
    });

    const input = response.data.choices[0]?.message?.content || "";
    console.log(input);

    return input;
  }

  parseCV(xmlString) {
    const dom = new JSDOM(xmlString);
    const cv = Array.from(dom.window.document.getElementsByTagName("cv"));
    const cvObject = cv.map((question) => {
      const name = question.getElementsByTagName("name")[0].textContent;

      return { name };
    });
    return cvObject;
  }
}

const bot = new CVParserAssistant(
  ""
);

const cvParser = new CVParser();
const filePath = path.resolve(
  path.join(__dirname, "../data/CV/0ddf7f84fb27efc08b4d10adbe9b7fc9")
);
cvParser.parse(filePath).then((res) => {
  bot.analyze(res).then((cv) => {
    writeFileSync(
      path.resolve(path.join(__dirname, "../data/cv/TEST_.xml")),
      cv
    );
  });
});
