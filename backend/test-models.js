import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
  });

  const result = await model.generateContent("Say hello");
  const response = await result.response;

  console.log(response.text());
}

test();