import { Enums, EnumType } from './index.js';

export interface CommandInfo {
  command: string;
  description: string;
}

export interface QuestionFilter {
  difficulty?: EnumType<typeof Enums.QUESTION_DIFFICULTY>;
  listId?: string;
  tags?: string[];
}

export interface Question {
  titleSlug: string;
  isPaidOnly: boolean;
  url?: string;
}

export interface ReactionInfo {
  reaction: string;
  description: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}
