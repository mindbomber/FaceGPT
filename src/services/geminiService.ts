import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ChatResponse {
  emoji: string;
  text: string;
}

const ALLOWED_EMOJIS = [
  "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "🫠", "😉", "😊", "😇",
  "🥰", "😍", "🤩", "😘", "😗", "☺️", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😝", "🤑",
  "🤗", "🤭", "🫢", "🫣", "🤫", "🤔", "🫡", "🤐", "🤨", "😐", "😑", "😶", "🫥", "😶‍🌫️", "😏",
  "😒", "🙄", "😬", "😮‍💨", "🤥", "🫨", "🙂‍↔️", "🙂‍↕️", "😌", "😔", "😪", "🤤", "😴", "🫩",
  "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "😵‍💫", "🤯", "🤠", "🥳", "🥸",
  "😎", "🤓", "🧐", "😕", "🫤", "😟", "🙁", "☹️", "😮", "😯", "😲", "😳", "🫪", "🥺", "🥹",
  "😦", "😧", "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫", "🥱",
  "😤", "😡", "😠", "🤬", "😈", "👿", "💀", "☠️"
];

export async function getFaceGPTResponse(message: string): Promise<ChatResponse> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: message,
    config: {
      systemInstruction: `You are FaceGPT, a helpful chatbot. 
      For every user message, you must:
      1. Analyze the sentiment and intent.
      2. Choose a single emoji from the following allowed list that best represents the mood:
         ${ALLOWED_EMOJIS.join(" ")}
      3. Provide a helpful text response.
      
      Return the result as a JSON object with two fields:
      - "emoji": The single emoji character from the allowed list.
      - "text": Your text response.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          emoji: {
            type: Type.STRING,
            description: "A single emoji from the allowed list representing the sentiment.",
            enum: ALLOWED_EMOJIS,
          },
          text: {
            type: Type.STRING,
            description: "The chatbot's response text.",
          },
        },
        required: ["emoji", "text"],
      },
    },
  });

  try {
    const result = JSON.parse(response.text || "{}");
    return {
      emoji: result.emoji || "🤔",
      text: result.text || "I'm sorry, I couldn't process that.",
    };
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return {
      emoji: "😕",
      text: "I had some trouble thinking of a response. Could you try again?",
    };
  }
}
