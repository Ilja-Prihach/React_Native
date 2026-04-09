import type { Card } from './types';

export const COLORS = ['#dc0c0c', '#16e7d8', '#154af5', '#31e316', '#FFEAA7'];
export const CARD_TITLES = ['Первая', 'Вторая', 'Третья', 'Четвёртая', 'Пятая'];

export const VISIBLE_CARDS = 4;
export const CARD_STACK_OFFSET = 14;
export const SWIPE_X_THRESHOLD = 90;

export function createInitialCards(): Card[] {
    return CARD_TITLES.map((title, index) => ({
        id: Date.now() + index,
        title,
        color: COLORS[index % COLORS.length],
    }));
}

export function createCard(index: number): Card {
    return {
        id: Date.now() + index,
        title: CARD_TITLES[index % CARD_TITLES.length],
        color: COLORS[index % COLORS.length],
    };
}
