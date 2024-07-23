// @vitest-environment jsdom
import { ThemeSwitcher } from '../index';
import { render } from '@testing-library/react';

describe('ThemeSwitcher', () => {
  test('Должен отображаться', () => {
    const { getByTestId } = render(<ThemeSwitcher />);
    expect(getByTestId('theme-switcher')).toBeInTheDocument();
  });
});
