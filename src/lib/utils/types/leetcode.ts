import { Enums } from './index.js';

export interface CommandInfo {
  command: string;
  description: string;
}

export interface QuestionFilter {
  difficulty?: Enums.QuestionDifficulty;
  listId?: string;
  tags?: string[];
}

export interface Question {
  titleSlug: string;
  isPaidOnly: boolean;
  url?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}
