const context = (question, answer) => `
Criteria:
Clarity of information: The degree to which the information is easy to understand and comprehend.
Relevance to the research question or hypothesis: The extent to which the information is directly related to the research question or hypothesis being investigated.
Completeness of information: The degree to which the information provides a full and comprehensive understanding of the topic being investigated.
Accuracy of information: The extent to which the information is free from errors and is factually correct.
Consistency of information: The degree to which the information is consistent with other information sources and does not contradict previous research findings.
Originality of information: The degree to which the information presents new and unique insights or perspectives on the topic being investigated.
Significance of information to the field: The extent to which the information has the potential to significantly impact the field and advance current knowledge and understanding.
Depth of analysis: The degree to which the information provides a detailed and thorough analysis of the topic being investigated.
Breadth of analysis: The extent to which the information covers a wide range of relevant topics and aspects related to the research question or hypothesis.
Quality of sources used: The degree to which the information is supported by high-quality and reputable sources of information.
Coherence of arguments presented: The degree to which the information presents a clear and logical argument that is easy to follow and understand.
Usefulness for future research: The extent to which the information provides a valuable resource for future research studies and investigations.
Limitations acknowledged: The degree to which the information acknowledges any limitations or weaknesses in the research methods or findings.
Interpretation and explanation provided: The degree to which the information provides clear and comprehensive interpretation and explanation of the findings and results.
Detail provided: The extent to which the information provides sufficient detail and explanation of the research methods, procedures, and data analysis.
Innovation of information: The degree to which the information presents new and innovative approaches or methods to investigate the research question or hypothesis.
Timeliness of information: The extent to which the information is current and up-to-date with the latest research and developments in the field.
Objectivity of information: The degree to which the information is unbiased and free from personal opinions or prejudices.
Usefulness for practical applications: The extent to which the information provides practical applications or implications for the topic being investigated.
Contribution to current knowledge and understanding: The degree to which the information makes a significant contribution to current knowledge and understanding in the field.

Likert Scale:
-20: The information provided is entirely irrelevant and not related to the research question or hypothesis, and provides no useful insights whatsoever.
-19: The information provided is almost entirely irrelevant and not useful for addressing the research question or hypothesis, and contains significant errors or inconsistencies.
-18: The information provided is highly irrelevant and not useful for addressing the research question or hypothesis, and contains major errors or inconsistencies.
-17: The information provided is very irrelevant and not useful for addressing the research question or hypothesis, and contains substantial errors or inconsistencies.
-16: The information provided is largely irrelevant and not useful for addressing the research question or hypothesis, and contains some errors or inconsistencies.
-15: The information provided is somewhat relevant but does not contribute substantially to the research question or hypothesis, and requires significant refinement and additional information.
-14: The information provided is somewhat relevant and contributes somewhat to the research question or hypothesis, but lacks clarity and completeness.
-13: The information provided is somewhat relevant and contributes somewhat to the research question or hypothesis, but requires additional interpretation and explanation.
-12: The information provided is somewhat relevant and contributes moderately to the research question or hypothesis, but requires further refinement and additional data.
-11: The information provided is relevant and contributes substantially to the research question or hypothesis, but lacks clarity and completeness.
-10: The information provided is relevant and contributes substantially to the research question or hypothesis, but requires additional interpretation and explanation.
-9: The information provided is relevant and contributes substantially to the research question or hypothesis, but requires some refinement and additional data.
-8: The information provided is mostly relevant and clear in addressing the research question or hypothesis but requires further refinement and interpretation.
-7: The information provided is mostly relevant and clear in addressing the research question or hypothesis but requires some interpretation and explanation.
-6: The information provided is mostly relevant and clear in addressing the research question or hypothesis, but lacks some details and explanations.
-5: The information provided is mostly relevant and clear in addressing the research question or hypothesis, but requires some refinement and additional data.
-4: The information provided is mostly relevant and clear in addressing the research question or hypothesis, but requires some interpretation and explanation.
-3: The information provided is somewhat relevant, clear, and comprehensive in addressing the research question or hypothesis, but requires some refinement and additional data.
-2: The information provided is somewhat relevant, clear, and comprehensive in addressing the research question or hypothesis, but requires some interpretation and explanation.
-1: The information provided is somewhat relevant, clear, and comprehensive in addressing the research question or hypothesis, but requires some refinement and additional data.
0: The information provided is neutral and neither supports nor contradicts the research question or hypothesis.
1: The information provided is somewhat relevant, clear, and comprehensive in addressing the research question or hypothesis, but requires some refinement and additional data.
2: The information provided is somewhat relevant, clear, and comprehensive in addressing the research question or hypothesis, but requires some interpretation and explanation.
3: The information provided is relevant, clear, and comprehensive in addressing the research question or hypothesis, but requires some refinement and additional data.
4: The information provided is mostly relevant, clear, and comprehensive in addressing the research question or hypothesis, with little or no room for improvement.
5: The information provided is mostly relevant, clear, and comprehensive in addressing the research question or hypothesis, but requires some refinement and interpretation.
6: The information provided is mostly relevant, clear, and comprehensive in addressing the research question or hypothesis, but lacks some details and explanations.
7: The information provided is mostly relevant, clear, and comprehensive in addressing the research question or hypothesis, but may lack some details or require additional explanation.
8: The information provided is highly relevant, clear, and comprehensive in addressing the research question or hypothesis, with little or no room for improvement.
9: The information provided is highly relevant, clear, and comprehensive in addressing the research question or hypothesis, and makes a significant contribution to the field.
10: The information provided is highly relevant, clear, and comprehensive in addressing the research question or hypothesis, and provides a comprehensive understanding of the topic.
11: The information provided is highly relevant, clear, and comprehensive in addressing the research question or hypothesis, and exceeds expectations in providing valuable insights.
12: The information provided is exceptionally relevant, insightful, and sophisticated, advancing the research question or hypothesis to a new level of understanding.
13: The information provided is exceptionally relevant, insightful, and sophisticated, providing groundbreaking insights that change the way we think about the topic.
14: The information provided is exceptionally relevant, insightful, and sophisticated, providing a new paradigm for understanding the research question or hypothesis.
15: The information provided is outstanding, comprehensive, and sophisticated, making a major breakthrough in the field and opening up new avenues for research.
16: The information provided is outstanding, comprehensive, and sophisticated, providing a new framework for understanding the research question or hypothesis.
17: The information provided is outstanding, comprehensive, and sophisticated, making a significant impact on the field and setting a new standard for excellence.
18: The information provided is exceptional in every aspect, setting a new standard of excellence and making a paradigm shift in the field.
19: The information provided is exceptional in every aspect, making a transformative impact on the field and opening up new opportunities for research and innovation.
20: The information provided is exceptional in every aspect, representing the highest level of quality and excellence in research and scholarship.

Based on Criteria and Likert Scale above, give me score for next question and answer

question="${question}"
answer="${answer}"
`;
