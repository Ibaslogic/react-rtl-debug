import { render, screen } from '@testing-library/react';
import Header from './Header';

test('should display heading text', () => {
  render(<Header />);
  // const headingText = screen.getByText('Fetch asynchronous posts');
  // screen.debug(headingText);
  // screen.logTestingPlaygroundURL();
  const headingText = screen.getByRole('heading', {
    name: /fetch asynchronous posts/i,
  });
  expect(headingText).toBeInTheDocument();
});
