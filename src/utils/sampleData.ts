import { SentenceItem } from '../types';
import { tokenizeSentence } from './tokenization';

export const INITIAL_SENTENCES: SentenceItem[] = [
  {
    id: 'sample-1',
    originalSentence: 'She goes to school by bus every day.',
    tokens: tokenizeSentence('She goes to school by bus every day.'),
    category: 'Daily Routines',
    createdAt: Date.now() - 1200000,
  },
  {
    id: 'sample-2',
    originalSentence: 'My brother is playing football now.',
    tokens: tokenizeSentence('My brother is playing football now.'),
    category: 'Present Continuous',
    createdAt: Date.now() - 1100000,
  },
  {
    id: 'sample-3',
    originalSentence: 'They visited London last summer.',
    tokens: tokenizeSentence('They visited London last summer.'),
    category: 'Past Simple',
    createdAt: Date.now() - 1000000,
  },
  {
    id: 'sample-4',
    originalSentence: 'I have never eaten sushi.',
    tokens: tokenizeSentence('I have never eaten sushi.'),
    category: 'Present Perfect',
    createdAt: Date.now() - 900000,
  },
  {
    id: 'sample-5',
    originalSentence: 'What are you doing?',
    tokens: tokenizeSentence('What are you doing?'),
    category: 'Questions',
    createdAt: Date.now() - 800000,
  },
  {
    id: 'sample-6',
    originalSentence: 'We are going to the cinema tonight.',
    tokens: tokenizeSentence('We are going to the cinema tonight.'),
    category: 'Future Plans',
    createdAt: Date.now() - 700000,
  },
  {
    id: 'sample-7',
    originalSentence: "He doesn't like spicy food.",
    tokens: tokenizeSentence("He doesn't like spicy food."),
    category: 'Negatives & Contractions',
    createdAt: Date.now() - 600000,
  },
  {
    id: 'sample-8',
    originalSentence: 'Sarah can speak three languages.',
    tokens: tokenizeSentence('Sarah can speak three languages.'),
    category: 'Modal Verbs',
    createdAt: Date.now() - 500000,
  },
  {
    id: 'sample-9',
    originalSentence: 'The students are studying English in the classroom.',
    tokens: tokenizeSentence('The students are studying English in the classroom.'),
    category: 'School & Classroom',
    createdAt: Date.now() - 400000,
  },
  {
    id: 'sample-10',
    originalSentence: 'Where did you buy those beautiful shoes?',
    tokens: tokenizeSentence('Where did you buy those beautiful shoes?'),
    category: 'Questions',
    createdAt: Date.now() - 300000,
  },
];
