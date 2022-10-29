import { render, screen } from '@testing-library/react';
import Header from './Header';

test('should display heading text', () => {
  render(<Header />);
  const headingText = screen.getByText('Fetch asynchronous posts');
  expect(headingText).toBeInTheDocument();
});
