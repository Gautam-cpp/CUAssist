import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
const { StructuredOutputParser } = require ("@langchain/core/output_parsers");
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0.2,
  maxOutputTokens: 1000,
});

const responseSchema = z.object({
    moderation: z.enum(["safe", "unsafe"]).describe("The moderation status of the message"),
});

const outputParser = StructuredOutputParser.fromZodSchema(responseSchema);

const prompt = PromptTemplate.fromTemplate(
  `You are a moderation bot for an academic platform. Analyze the following message and determine if it is safe or unsafe.
  
  A message is considered SAFE only if it meets ALL of the following criteria:
  1. Contains no harmful, offensive, or inappropriate content
  2. Is not random or meaningless text
  3. Is related to academic topics such as:
     - Doubts or questions about skills and studies
     - Educational guidance and advice
     - College-related inquiries
     - Academic subjects and learning
     - Career guidance related to education
     - Study methods and techniques
  
  A message is considered UNSAFE if it:
  - Contains harmful, offensive, or inappropriate language
  - Is random, meaningless, or spam-like content
  - Is completely unrelated to academic/educational topics
  
  {format_instructions}
  
  Message: {message}`
);

export async function moderateMessage(message: string) {
    const chain = prompt.pipe(model).pipe(outputParser);
    const result = await chain.invoke({
        message: message,
        format_instructions: outputParser.getFormatInstructions(),
    });
    return result;
}
