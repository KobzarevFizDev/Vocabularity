import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker';
import type { WordDto } from '../api';

const WORD_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
type WordLevel = (typeof WORD_LEVELS)[number];

const randomNum = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const randomWordLevel = (): WordLevel => {
    return WORD_LEVELS[Math.floor(Math.random() * WORD_LEVELS.length)];
};

const randomWord = (): WordDto => {
    return {
        id: faker.string.uuid(),
        word: faker.word.sample(),
        transcription: `/${faker.string.alphanumeric(5)}/`,
        examples: Array.from({length: randomNum(2, 5)}, () => faker.lorem.sentence()),
        context_sentence: faker.lorem.sentence(),
        translation: faker.lorem.sentence(),
        level: randomWordLevel()
    }
} 

export const handlers = [
    http.get('/api/dictionary/words', ({request}) => {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get("page") || '0');
        const pageSize = parseInt(url.searchParams.get("page_size") || '20');
        const total = randomNum(50, 200);
        const words = Array.from({length: pageSize}, () => randomWord());

        return HttpResponse.json({
            words: words,
            total: total,
            page: page,
            page_size: pageSize
        });
    })
]