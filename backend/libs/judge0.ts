import axios from "axios";
import { sleep } from "bun";

type LanguageMap = {
  [key: string]: number;
};

type Submissions = {
  source_code: string;
  language_id: string;
  stdin: string;
  expected_output?: string;
};

type Token = {
  token: string;
};

export const getLanguageId = (language: string) => {
  const languageMap: LanguageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };

  return languageMap[language.toUpperCase()] || null;
};

export const submitBatch = async (submissions: Submissions[]) => {
  const { data } = await axios.post(
    `${process.env.JUDGE0_URL}/submissions/batch?base64_encoded=false`,
    {
      submissions,
    },
  );
  return data;
};

export const pollBatchResults = async (tokens: Token[]) => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_URL}/submissions/batch`,
      {
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        },
      },
    );

    const results = data.submissions;
    const isAllDone = results.every(
      (r) => r.status.id !== 1 && r.status.id !== 2,
    );

    if (isAllDone) return results;
    await sleep(1000);
  }
};

export function getLanguageName(languageId: Number) {
  const LANGUAGE_NAMES = {
    74: "TypeScript",
    63: "JavaScript",
    71: "Python",
    62: "Java",
  };

  return LANGUAGE_NAMES[languageId] || "Unknown";
}
