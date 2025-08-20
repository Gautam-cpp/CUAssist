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
  `You are a moderation bot for an academic platform. Analyze the following message and determine if it is SAFE or UNSAFE.

  A message is considered SAFE if it meets ALL of the following conditions:
  1. Does not contain harmful, offensive, or inappropriate content (e.g., hate speech, slurs, harassment, explicit material).
  2. Is not random, meaningless, or spam-like text.
  3. Is related to academic or educational topics such as:
     - Doubts or questions about skills and studies
     - Educational guidance, advice, or opinions (including critical/negative advice if constructive)
     - College-related inquiries
     - Academic subjects and learning
     - Career guidance related to education
     - Study methods and techniques
  4. May include both positive and negative sentiments, as long as they are expressed in a constructive, academic, or advisory manner.

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
