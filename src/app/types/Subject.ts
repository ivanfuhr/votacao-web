import { SubjectCategory } from './SubjectCategory';
import { SubjectVoted } from './SubjectVoted';

export type Subject = {
  id: string;
  title: string;
  description: string;
  category: SubjectCategory;
  votes: SubjectVoted[];
  timeToEnd: number;
  startAt: Date;
  createdAt: Date;
};
