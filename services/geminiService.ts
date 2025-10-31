// FIX: Add GeneratedImage to imports and remove incorrect comment.
import { GoogleGenAI, Type } from "@google/genai";
import { BusinessCardData, GeneratedImage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const businessCardSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Full name of the person." },
    title: { type: Type.STRING, description: "Job title." },
    company: { type: Type.STRING, description: "Company, university, or institution name." },
    phone: { type: Type.STRING, description: "Phone number." },
    email: { type: Type.STRING, description: "Email address." },
    website: { type: Type.STRING, description: "Personal or company website URL." },
    slogan: { type: Type.STRING, description: "A catchy slogan or a brief professional summary." },
    imageUrl: { type: Type.STRING, description: "URL of the faculty member's main profile picture. It should be a direct link to an image file (e.g., .jpg, .png)." },
    socials: {
      type: Type.OBJECT,
      description: "Links to social media profiles.",
      properties: {
        linkedin: { type: Type.STRING, description: "URL to LinkedIn profile." },
        twitter: { type: Type.STRING, description: "URL to Twitter/X profile." },
        github: { type: Type.STRING, description: "URL to GitHub profile." },
      }
    }
  },
  required: ["name", "title", "company", "phone", "email", "website"],
};

export const fetchAndAnalyzeFacultyProfile = async (url: string): Promise<BusinessCardData> => {
  try {
    const prompt = `
      Analyze the HTML content of the provided URL to extract precise information for a business card. Do not guess or infer information from the URL structure itself.

      URL: ${url}

      Instructions:
      1.  **Full Name**: Find the full name of the faculty member, including any titles or salutations (e.g., Dr., Prof.). Be exact.
      2.  **Image URL**: Locate the primary profile picture of the person on the page. The URL must be an absolute URL pointing directly to an image file (e.g., https://.../photo.jpg). Do not provide a relative path. If no image is found, this field can be omitted.
      3.  **Title**: Extract their official job title (e.g., 'Associate Professor of Computer Science').
      4.  **Company**: Identify the university or institution name.
      5.  **Contact Info**: Find their professional phone number and email address.
      6.  **Website**: This is usually the provided URL or a personal portfolio link found on the page.
      7.  **Slogan**: Create a brief, professional slogan from their research interests or biography section.
      8.  **Socials**: Find direct links to their professional social media profiles (LinkedIn, Twitter/X, GitHub).

      Return the data as a single, clean JSON object without any markdown formatting or explanations.
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    const text = response.text.trim();
    const jsonStr = text.startsWith('```json') ? text.replace(/```json\n|```/g, '') : text;
    return JSON.parse(jsonStr) as BusinessCardData;
  } catch (error) {
    console.error("Error fetching and analyzing faculty profile:", error);
    throw new Error("Failed to fetch and analyze faculty profile from URL.");
  }
};


export const generateBusinessCardData = async (prompt: string): Promise<BusinessCardData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate business card details based on this prompt: ${prompt}. Do not generate an imageUrl.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: businessCardSchema,
      },
    });

    // The API returns a string, which might be wrapped in markdown. Clean it before parsing.
    const text = response.text.trim();
    const jsonStr = text.startsWith('```json') ? text.replace(/```json\n|```/g, '') : text;
    return JSON.parse(jsonStr) as BusinessCardData;
  } catch (error) {
    console.error("Error generating business card data:", error);
    throw new Error("Failed to generate business card data.");
  }
};

// FIX: Add and export the generateImage function for logo generation.
export const generateImage = async (prompt: string): Promise<GeneratedImage> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image) {
      const image = response.generatedImages[0];
      return {
        data: image.image.imageBytes,
        mimeType: image.image.mimeType,
      };
    } else {
      throw new Error("No image was generated.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image.");
  }
};