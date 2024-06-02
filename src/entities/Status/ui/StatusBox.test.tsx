import { componentRender } from '@/shared/lib/tests/componentRender/componentRender';
import { screen } from '@testing-library/react';
import { StatusBox } from './StatusBox';

describe('StatusBox', () => {
  test('тест отрисовки группы радиокнопок', () => {
    componentRender(<StatusBox />);
    expect(screen.getByTestId('status-radio-group')).toBeInTheDocument();
  });
});
