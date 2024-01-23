import { SubjectCategory } from './SubjectCategory';
import { SubjectVoted } from './SubjectVoted';

export type Subject = {
  id: string;
  title: string;
  description: string;
  category: SubjectCategory;
  votes: SubjectVoted[];
  timeToEnd: number;
  endAt: Date;
  startAt: Date;
  createdAt: Date;
};

export type SubjectCreate = {
  title: string;
  description: string;
  timeToEnd: number;
  startAt: Date;
  categoryId: string;
};
