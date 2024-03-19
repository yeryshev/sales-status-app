import { classNames } from './classNames';

describe('Тест функции classNames', () => {
    test('Только с первым аргументом', () => {
        expect(classNames('class1')).toBe('class1');
    });
    test('С дополнительным классом', () => {
        const expected = 'class1 class2 class3';
        expect(classNames('class1', {}, ['class2', 'class3'])).toBe(expected);
    });
    test('С модами', () => {
        const expected = 'class1 class2 class3 hovered scrollable';
        expect(
            classNames('class1', { hovered: true, scrollable: true }, ['class2', 'class3']),
        ).toBe(expected);
    });
    test('С модами false', () => {
        const expected = 'class1 class2 class3 hovered';
        expect(
            classNames('class1', { hovered: true, scrollable: false }, ['class2', 'class3']),
        ).toBe(expected);
    });
});
