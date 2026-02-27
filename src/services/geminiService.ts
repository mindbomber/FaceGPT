import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ChatResponse {
  emoji: string;
  text: string;
}

const EMOJI_DATA = [
  { emoji: "😀", desc: "grinning face", group: "face-smiling" },
  { emoji: "😃", desc: "grinning face with big eyes", group: "face-smiling" },
  { emoji: "😄", desc: "grinning face with smiling eyes", group: "face-smiling" },
  { emoji: "😁", desc: "beaming face with smiling eyes", group: "face-smiling" },
  { emoji: "😆", desc: "grinning squinting face", group: "face-smiling" },
  { emoji: "😅", desc: "grinning face with sweat", group: "face-smiling" },
  { emoji: "🤣", desc: "rolling on the floor laughing", group: "face-smiling" },
  { emoji: "😂", desc: "face with tears of joy", group: "face-smiling" },
  { emoji: "🙂", desc: "slightly smiling face", group: "face-smiling" },
  { emoji: "🙃", desc: "upside-down face", group: "face-smiling" },
  { emoji: "🫠", desc: "melting face", group: "face-smiling" },
  { emoji: "😉", desc: "winking face", group: "face-smiling" },
  { emoji: "😊", desc: "smiling face with smiling eyes", group: "face-smiling" },
  { emoji: "😇", desc: "smiling face with halo", group: "face-smiling" },
  { emoji: "🥰", desc: "smiling face with hearts", group: "face-affection" },
  { emoji: "😍", desc: "smiling face with heart-eyes", group: "face-affection" },
  { emoji: "🤩", desc: "star-struck", group: "face-affection" },
  { emoji: "😘", desc: "face blowing a kiss", group: "face-affection" },
  { emoji: "😗", desc: "kissing face", group: "face-affection" },
  { emoji: "☺️", desc: "smiling face", group: "face-affection" },
  { emoji: "😚", desc: "kissing face with closed eyes", group: "face-affection" },
  { emoji: "😙", desc: "kissing face with smiling eyes", group: "face-affection" },
  { emoji: "🥲", desc: "smiling face with tear", group: "face-affection" },
  { emoji: "😋", desc: "face savoring food", group: "face-tongue" },
  { emoji: "😛", desc: "face with tongue", group: "face-tongue" },
  { emoji: "😜", desc: "winking face with tongue", group: "face-tongue" },
  { emoji: "🤪", desc: "zany face", group: "face-tongue" },
  { emoji: "😝", desc: "squinting face with tongue", group: "face-tongue" },
  { emoji: "🤑", desc: "money-mouth face", group: "face-tongue" },
  { emoji: "🤗", desc: "smiling face with open hands", group: "face-hand" },
  { emoji: "🤭", desc: "face with hand over mouth", group: "face-hand" },
  { emoji: "🫢", desc: "face with open eyes and hand over mouth", group: "face-hand" },
  { emoji: "🫣", desc: "face with peeking eye", group: "face-hand" },
  { emoji: "🤫", desc: "shushing face", group: "face-hand" },
  { emoji: "🤔", desc: "thinking face", group: "face-hand" },
  { emoji: "🫡", desc: "saluting face", group: "face-hand" },
  { emoji: "🤐", desc: "zipper-mouth face", group: "face-neutral-skeptical" },
  { emoji: "🤨", desc: "face with raised eyebrow", group: "face-neutral-skeptical" },
  { emoji: "😐", desc: "neutral face", group: "face-neutral-skeptical" },
  { emoji: "😑", desc: "expressionless face", group: "face-neutral-skeptical" },
  { emoji: "😶", desc: "face without mouth", group: "face-neutral-skeptical" },
  { emoji: "🫥", desc: "dotted line face", group: "face-neutral-skeptical" },
  { emoji: "😶‍🌫️", desc: "face in clouds", group: "face-neutral-skeptical" },
  { emoji: "😏", desc: "smirking face", group: "face-neutral-skeptical" },
  { emoji: "😒", desc: "unamused face", group: "face-neutral-skeptical" },
  { emoji: "🙄", desc: "face with rolling eyes", group: "face-neutral-skeptical" },
  { emoji: "😬", desc: "grimacing face", group: "face-neutral-skeptical" },
  { emoji: "😮‍💨", desc: "face exhaling", group: "face-neutral-skeptical" },
  { emoji: "🤥", desc: "lying face", group: "face-neutral-skeptical" },
  { emoji: "🫨", desc: "shaking face", group: "face-neutral-skeptical" },
  { emoji: "🙂‍↔️", desc: "head shaking horizontally", group: "face-neutral-skeptical" },
  { emoji: "🙂‍↕️", desc: "head shaking vertically", group: "face-neutral-skeptical" },
  { emoji: "😌", desc: "relieved face", group: "face-sleepy" },
  { emoji: "😔", desc: "pensive face", group: "face-sleepy" },
  { emoji: "😪", desc: "sleepy face", group: "face-sleepy" },
  { emoji: "🤤", desc: "drooling face", group: "face-sleepy" },
  { emoji: "😴", desc: "sleeping face", group: "face-sleepy" },
  { emoji: "🫩", desc: "face with bags under eyes", group: "face-sleepy" },
  { emoji: "😷", desc: "face with medical mask", group: "face-unwell" },
  { emoji: "🤒", desc: "face with thermometer", group: "face-unwell" },
  { emoji: "🤕", desc: "face with head-bandage", group: "face-unwell" },
  { emoji: "🤢", desc: "nauseated face", group: "face-unwell" },
  { emoji: "🤮", desc: "face vomiting", group: "face-unwell" },
  { emoji: "🤧", desc: "sneezing face", group: "face-unwell" },
  { emoji: "🥵", desc: "hot face", group: "face-unwell" },
  { emoji: "🥶", desc: "cold face", group: "face-unwell" },
  { emoji: "🥴", desc: "woozy face", group: "face-unwell" },
  { emoji: "😵", desc: "face with crossed-out eyes", group: "face-unwell" },
  { emoji: "😵‍💫", desc: "face with spiral eyes", group: "face-unwell" },
  { emoji: "🤯", desc: "exploding head", group: "face-unwell" },
  { emoji: "🤠", desc: "cowboy hat face", group: "face-hat" },
  { emoji: "🥳", desc: "partying face", group: "face-hat" },
  { emoji: "🥸", desc: "disguised face", group: "face-hat" },
  { emoji: "😎", desc: "smiling face with sunglasses", group: "face-glasses" },
  { emoji: "🤓", desc: "nerd face", group: "face-glasses" },
  { emoji: "🧐", desc: "face with monocle", group: "face-glasses" },
  { emoji: "😕", desc: "confused face", group: "face-concerned" },
  { emoji: "🫤", desc: "face with diagonal mouth", group: "face-concerned" },
  { emoji: "😟", desc: "worried face", group: "face-concerned" },
  { emoji: "🙁", desc: "slightly frowning face", group: "face-concerned" },
  { emoji: "☹️", desc: "frowning face", group: "face-concerned" },
  { emoji: "😮", desc: "face with open mouth", group: "face-concerned" },
  { emoji: "😯", desc: "hushed face", group: "face-concerned" },
  { emoji: "😲", desc: "astonished face", group: "face-concerned" },
  { emoji: "😳", desc: "flushed face", group: "face-concerned" },
  { emoji: "🫪", desc: "distorted face", group: "face-concerned" },
  { emoji: "🥺", desc: "pleading face", group: "face-concerned" },
  { emoji: "🥹", desc: "face holding back tears", group: "face-concerned" },
  { emoji: "😦", desc: "frowning face with open mouth", group: "face-concerned" },
  { emoji: "😧", desc: "anguished face", group: "face-concerned" },
  { emoji: "😨", desc: "fearful face", group: "face-concerned" },
  { emoji: "😰", desc: "anxious face with sweat", group: "face-concerned" },
  { emoji: "😥", desc: "sad but relieved face", group: "face-concerned" },
  { emoji: "😢", desc: "crying face", group: "face-concerned" },
  { emoji: "😭", desc: "loudly crying face", group: "face-concerned" },
  { emoji: "😱", desc: "face screaming in fear", group: "face-concerned" },
  { emoji: "😖", desc: "confounded face", group: "face-concerned" },
  { emoji: "😣", desc: "persevering face", group: "face-concerned" },
  { emoji: "😞", desc: "disappointed face", group: "face-concerned" },
  { emoji: "😓", desc: "downcast face with sweat", group: "face-concerned" },
  { emoji: "😩", desc: "weary face", group: "face-concerned" },
  { emoji: "😫", desc: "tired face", group: "face-concerned" },
  { emoji: "🥱", desc: "yawning face", group: "face-concerned" },
  { emoji: "😤", desc: "face with steam from nose", group: "face-negative" },
  { emoji: "😡", desc: "enraged face", group: "face-negative" },
  { emoji: "😠", desc: "angry face", group: "face-negative" },
  { emoji: "🤬", desc: "face with symbols on mouth", group: "face-negative" },
  { emoji: "😈", desc: "smiling face with horns", group: "face-negative" },
  { emoji: "👿", desc: "angry face with horns", group: "face-negative" },
  { emoji: "💀", desc: "skull", group: "face-negative" },
  { emoji: "☠️", desc: "skull and crossbones", group: "face-negative" }
];

const ALLOWED_EMOJIS = EMOJI_DATA.map(d => d.emoji);

export async function getFaceGPTResponse(message: string): Promise<ChatResponse> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: message,
    config: {
      systemInstruction: `You are FaceGPT, a helpful chatbot. 
      For every user message, you must:
      1. Analyze the sentiment and intent.
      2. Choose a single emoji from the allowed list that best represents the mood.
      
      Here is the list of allowed emojis with their descriptions and categories for context:
      ${EMOJI_DATA.map(d => `${d.emoji} (${d.desc}) [Category: ${d.group}]`).join("\n")}
      
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
