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
      Identify the next information:
Category: Education

Information type: Degrees
Information type: Certifications
Information type: Courses
Information type: Training programs
Category: Work experience

Information type: Jobs
Information type: Roles
Information type: Responsibilities
Information type: Achievements
Category: Skills

Information type: Technical skills
Information type: Soft skills
Information type: Transferable skills
Category: Personal information

Information type: Name
Information type: Contact information
Information type: Location
Category: References

Information type: Professional or academic references
Category: Projects

Information type: Scope of projects
Information type: Timeline of projects
Information type: Budget of projects
Information type: Outcome of projects
Category: Awards and honors

Information type: Awards
Information type: Scholarships
Information type: Grants
Category: Publications

Information type: Papers
Information type: Articles
Information type: Reports
Information type: Books
Category: Extracurricular activities

Information type: Clubs
Information type: Teams
Information type: Volunteer work
Information type: Hobbies

in a candidate's CV.
      
      detail level: 10
      

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
  path.join(__dirname, "../data/CV/5034540a98602df5263fc61f606e8c06")
);
cvParser.parse(filePath).then((res) => {
  bot.analyze(res).then((cv) => {
    writeFileSync(
      path.resolve(path.join(__dirname, "../data/cv/TEST_.xml")),
      cv
    );
  });
});
