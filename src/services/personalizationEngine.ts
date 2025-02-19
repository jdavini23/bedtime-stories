import { Story, StoryInput, StoryTheme } from "@/types/story";
import { logger } from "@/utils/logger";
import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";

// Comprehensive default user preferences
const DEFAULT_PREFERENCES = {
  preferredThemes: ["adventure", "friendship", "curiosity", "creativity"],
  mostLikedCharacterTypes: ["brave", "curious", "kind", "imaginative"],
  learningInterests: [
    "nature",
    "science",
    "friendship",
    "imagination",
    "problem-solving",
    "empathy",
  ],
  ageGroups: ["4-6", "7-9"],
  educationalGoals: ["emotional intelligence", "creativity", "curiosity"],
};

class StoryPersonalizationEngine {
  private openai: OpenAI | undefined;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true, // Only for client-side usage
    });

    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      logger.error(
        "OpenAI API key is missing. Please set NEXT_PUBLIC_OPENAI_API_KEY in your .env.local file."
      );
    } else {
      logger.info("OpenAI client initialized successfully");
    }
  }

  // Generate personalized story using OpenAI
  async generatePersonalizedStory(
    input: StoryInput,
    preferences: typeof DEFAULT_PREFERENCES = DEFAULT_PREFERENCES
  ): Promise<Story> {
    const { childName, interests, theme, gender } = input;

    const pronouns =
      gender === "boy" ? "he" : gender === "girl" ? "she" : "they";
    const possessivePronouns =
      gender === "boy" ? "his" : gender === "girl" ? "her" : "their";

    try {
      let storyContent: string;

      if (!this.openai) {
        logger.info(
          "Using fallback story generation due to missing OpenAI API key"
        );

        // Generate story content using fallback mechanism
        storyContent = this.generateFallbackStory(
          input,
          pronouns,
          possessivePronouns
        );
      } else {
        // Generate story using OpenAI (existing OpenAI implementation)
        storyContent = await this.generateOpenAIStory(
          input,
          pronouns,
          possessivePronouns
        );
      }

      // Create and return a proper Story object
      return {
        id: uuidv4(),
        content: storyContent,
        input,
        createdAt: new Date().toISOString(),
        // @ts-ignore
        readingTime: Math.ceil(storyContent.split(" ").length / 200), // Approximate reading time in minutes
        theme: input.theme,
        status: "completed",
      };
    } catch (error) {
      logger.error("Story generation failed", { error, input });
      throw new Error("Failed to generate story. Please try again.");
    }
  }

  private generateFallbackStory(
    input: StoryInput,
    pronouns: string,
    possessivePronouns: string
  ): string {
    const { childName, interests, theme } = input;

    // Enhanced fallback story generation based on theme
    const themeBasedIntros = {
      adventure: `In a world full of endless possibilities, ${childName} embarked on an incredible journey.`,
      fantasy: `In a magical realm where dreams come true, ${childName} discovered something extraordinary.`,
      science: `Curious about the wonders of science, ${childName} began an amazing experiment.`,
      nature: `On a beautiful day surrounded by nature, ${childName} made an incredible discovery.`,
      friendship: `${childName} learned the true meaning of friendship on a special day.`,
      family: `During a wonderful time with family, ${childName} experienced something magical.`,
    };

    const intro =
      themeBasedIntros[theme as keyof typeof themeBasedIntros] ||
      `Once upon a time, there was a wonderful child named ${childName} who loved ${interests.join(
        " and "
      )}.`;

    return `${intro}\n\n${this.generateStoryMiddle(
      input,
      pronouns,
      possessivePronouns
    )}\n\n${this.generateStoryEnding(input, pronouns)}`;
  }

  private generateStoryMiddle(
    input: StoryInput,
    pronouns: string,
    possessivePronouns: string
  ): string {
    const { childName, interests } = input;
    return `As ${pronouns} explored with excitement, ${childName} discovered that ${possessivePronouns} love for ${interests.join(
      " and "
    )} opened up amazing possibilities. Each step of the journey brought new wonders and learning experiences.`;
  }

  private generateStoryEnding(input: StoryInput, pronouns: string): string {
    const { childName } = input;
    return `At the end of this wonderful adventure, ${childName} realized that the greatest magic of all was believing in ${
      pronouns === "they"
        ? "themselves"
        : pronouns === "he"
        ? "himself"
        : "herself"
    }. The end.`;
  }

  private async generateOpenAIStory(
    input: StoryInput,
    pronouns: string,
    possessivePronouns: string
  ): Promise<string> {
    try {
      const response = await this.openai?.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a creative storyteller specializing in personalized children's stories. Create an engaging, age-appropriate story that:
            1. Features ${input.favoriteCharacters ? input.favoriteCharacters.join(', ') + ' and' : 'talking animals as main characters'} alongside ${input.childName}
            2. Incorporates ${input.childName}'s interests: ${input.interests.join(', ')}
            3. Is themed around ${input.theme}
            4. Matches the desired mood: ${input.mood || 'cheerful and uplifting'}
            5. Teaches a valuable life lesson while maintaining a sense of wonder
            6. Uses ${pronouns} and ${possessivePronouns} pronouns for ${input.childName}
            7. Includes magical elements and vivid descriptions
            8. Is structured with a clear beginning, middle, and end
            9. Is approximately 500-800 words long
            10. Uses child-friendly language and short paragraphs
            11. Ends with a positive, uplifting message that resonates with the chosen mood`
          },
          {
            role: "user",
            content: `Create a bedtime story for ${input.childName} about a magical adventure with talking animals that teaches a valuable lesson about ${input.theme}.`
          }
        ],
        temperature: 0.8,
        max_tokens: 1000
      });
      return (
        response?.choices[0]?.message?.content ||
        this.generateFallbackStory(input, pronouns, possessivePronouns)
      );
    } catch (error) {
      logger.error("OpenAI story generation failed", { error, input });
      return this.generateFallbackStory(input, pronouns, possessivePronouns);
    }
  }

  // Generate a unique story ID
  private generateUniqueId(): string {
    return uuidv4();
  }
}

// Singleton instance of the personalization engine
export const storyPersonalizationEngine = new StoryPersonalizationEngine();
