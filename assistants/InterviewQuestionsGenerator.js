const { Configuration, OpenAIApi } = require("openai");
const { complexityLevelsContext } = require("./context/complexityLevelsContext");
const { detailLevelsContext } = require("./context/detailsLevelsContext");
const { gradesLevelsContext } = require("./context/gradesContext");

class InterviewQuestionsGenerator {
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
      You are the interview questions generator assistant. 
      You will be responsible for identifying areas of expertise, technologies and skills and generating questions for interviews based on project information if the project information is provided and on identified candidate information.
      You will generate questions based on complexity level and level of detail required for the answer to the question applicable to a given grade.
      Do not generate questions that are similar sense to questions which are provided in "questions to exclude" section.
      Questions should be up to date with the current year but do not expose the year in question.
      Each question should be max 150 words in length.
      
      ${complexityLevelsContext}
      ${detailLevelsContext}
      ${gradesLevelsContext}

      Format of response:"
      <questions>
        <question>{question}</question>
        ...
      </questions>".
      If you are unable to identify or generate questions, return "<error>{reason}</error>".
        `,
    };
  }

  async generate(
    numberOfQuestions,
    questionsToExlude,
    candidateInfo,
    projectInfo
  ) {
    this.request = {
      role: "system",
      content: `Generate ${numberOfQuestions} interview questions:`,
    };

    const messages = [
      this.rules,
      this.request,
      {
        role: "system",
        content: `Candidate information: "
          Area Of Expertise: "${candidateInfo.areaOfExpertise}"
          Technologies: "${candidateInfo.technologies?.join(",") || ""}"
          Skills: "${candidateInfo.skills?.join(",") || ""}"
          Key Responsibilities: "${
            candidateInfo.keyResponsibilities?.join(",") || ""
          }"
          Possible experience in years: "${candidateInfo.experience || ""}"
          Possible grade: "${candidateInfo.grade || ""}"
        "
        ${
          projectInfo
            ? `
        Project information: "
          Area Of Expertise: "${projectInfo.areaOfExpertise}"
          Technologies: "${projectInfo.technologies?.join(",") || ""}"
          Key Responsibilities: "${
            projectInfo.keyResponsibilities?.join(",") || ""
          }"
          Required experience in years: "${projectInfo.experience || ""}"
          Required grade: "${projectInfo.grade || ""}"
        "
        `
            : ``
        }
        ${
          questionsToExlude.length
            ? `
        Questions to exclude: "${questionsToExlude.join(",")}"
        `
            : ``
        }
        `,
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

    const regex2 = /<error>(.*?)<\/error>/;
    const error = regex2.exec(response.data.choices[0]?.message?.content || "");

    return {
      questions,
      error: (error && error[1]) || null,
    };
  }
}

module.exports = {
  InterviewQuestionsGenerator,
};
