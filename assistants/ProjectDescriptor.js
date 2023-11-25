const { Configuration, OpenAIApi } = require("openai");
const { complexityLevelsContext } = require("./context/complexityLevelsContext");
const { detailLevelsContext } = require("./context/detailsLevelsContext");
const { gradesLevelsContext } = require("./context/gradesContext");

class ProjectDescriptor {
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
      content: ``,
    };
    this.request = {
      role: "system",
      content: `
      You are Project descriptor.

      Analyze project description and generate areas of expertise and technologies and key responsibilities and experience in years which will be achievable for the given grade.
      
      ${complexityLevelsContext}
      ${detailLevelsContext}
      ${gradesLevelsContext}

      Format of response:"
      <project-description>
        <area-of-expertise>
          {20 words about area of expertise}
        </area-of-expertise>
        <key-responsibilities>
          <key-responsibility>
            {single key responsibility}
          </key-responsibility>
          ...add 5 more if possible
        </key-responsibilities>
        <technologies>
          <technology>
            {single technology}
          </technology>
          ...add 5 more if possible
        </technologies>
        <experience>{experience}</experience>
      </project-description>
        ".
      If you are unable to analyze the project description or the given grade, return "<error>{reason}</error>".:\n\n
   `,
    };
  }

  async describe(description, grade) {
    const messages = [
      this.rules,
      this.request,
      {
        role: "system",
        content: `Project description: "${description}"\n\n Required grade: "${grade}"`,
      },
    ];

    // @ts-ignore
    const response = await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      // @ts-ignore.
      messages: messages,
    });

    const input = response.data.choices[0]?.message?.content || "";

    const expertiseMatch = input.match(
      /<area-of-expertise>([\s\S]*?)<\/area-of-expertise>/
    );
    const expertiseText = expertiseMatch ? expertiseMatch[1].trim() : null;

    const technologiesMatch = input.match(
      /<technologies>([\s\S]*?)<\/technologies>/
    );
    const technologiesText = technologiesMatch
      ? technologiesMatch[1].trim()
      : "";
    const technologiesArray = technologiesText
      .split("</technology>")
      .filter(Boolean)
      .map((t) => t.replace(/<[^>]+>/g, "").trim());

    const keyResponsibilityMatch = input.match(
      /<key-responsibilities>([\s\S]*?)<\/key-responsibilities>/
    );
    const keyResponsibilityText = keyResponsibilityMatch
      ? keyResponsibilityMatch[1].trim()
      : "";
    const keyResponsibilityArray = keyResponsibilityText
      .split("</key-responsibility>")
      .filter(Boolean)
      .map((t) => t.replace(/<[^>]+>/g, "").trim());

    const experienceMatch = input.match(/<experience>([\s\S]*?)<\/experience>/);
    const experienceText = experienceMatch ? experienceMatch[1].trim() : null;

    const errorMatch = input.match(/<error>([\s\S]*?)<\/error>/);
    const errorText = errorMatch ? errorMatch[1].trim() : null;

    const result = {
      areaOfExpertise: expertiseText,
      technologies: technologiesArray,
      keyResponsibilities: keyResponsibilityArray,
      experience: experienceText,
      grade: grade.trim(),
      error: errorText,
    };

    return result;
  }
}

module.exports = {
  ProjectDescriptor,
};
