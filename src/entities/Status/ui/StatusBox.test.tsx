import { screen } from '@testing-library/react';
import { StatusBox } from './StatusBox';
import { componentRender } from '@/shared/lib/tests/componentRender/componentRender';

describe('StatusBox', () => {
    test('тест отрисовки группы радиокнопок', () => {
        componentRender(<StatusBox />);
        expect(screen.getByTestId('status-radio-group')).toBeInTheDocument();
    });

    test('выбран вариант "Занят", если в стейте значение статуса равно 2', () => {
        componentRender(<StatusBox />, {
            initialState: { status: { value: 2 } },
        });
        expect(screen.getByTestId('status-radio-group')).toBeInTheDocument();
        const radioButtons = screen.getAllByRole('radio');
        expect(radioButtons[0]).not.toBeChecked();
        expect(radioButtons[1]).toBeChecked();
        expect(radioButtons[2]).not.toBeChecked();
    });
});
