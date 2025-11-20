import Configuration from "openai";

export const configureOpenAI = () => {
  const config = new Configuration({
    apiKey: process.env.OPEN_AI_SECRET,
   
  });
  return config;
};