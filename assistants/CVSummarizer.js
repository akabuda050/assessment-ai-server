const { Configuration, OpenAIApi } = require("openai");
const { complexityLevelsContext } = require("./context/complexityLevelsContext");
const { detailLevelsContext } = require("./context/detailsLevelsContext");
const { gradesLevelsContext } = require("./context/gradesContext");

class CVSummarizer {
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
        You are CV Summarizer.
        Analyze given CV information and generate summary about a candidate in 100 words max in human like manner.

        ${complexityLevelsContext}
        ${detailLevelsContext}
        ${gradesLevelsContext}

        Format of response:"
          <summary>
            {summary}
          </summary>
        ". 
        If you are unable to analyze CV information, return "<error>{reason}</error>".
      `
    };
    this.request = {
      role: "system",
      content: `Analyze CV information and generate summary shortcode:\n\n`,
    };
  }

  async summarize(CV) {
    const messages = [
      this.rules,
      this.request,
      {
        role: "system",
        content: `CV information: "
        Name: "${CV.name}"
        Area of expertise: "${CV.areaOfExpertise}"
        Technologies: "${CV.technologies.join(",")}"
        Key Responsibilities: "${CV.keyResponsibilities.join(",")}"
        Skills: "${CV.skills.join(",")}"
        Possible experience in years: "${CV.experience}"
        Possible grade: "${CV.grade}"
        "
        `,
      },
    ];

    // @ts-ignore
    const response = await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      // @ts-ignore.
      messages: messages,
    });

    const input = response.data.choices[0]?.message?.content || '';

    const summaryMatch = input.match(/<summary>([\s\S]*?)<\/summary>/);
    const summaryText = summaryMatch ? summaryMatch[1].trim() : null;

    const errorMatch = input.match(/<error>([\s\S]*?)<\/error>/);
    const errorText = errorMatch ? errorMatch[1].trim() : null;

    const result = {
      summary: summaryText,
      error: errorText
    }

    return result;
  }
}

module.exports = {
  CVSummarizer
}
