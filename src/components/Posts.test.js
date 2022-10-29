import {
  render,
  screen,
  waitForElementToBeRemoved,
  logRoles,
} from '@testing-library/react';
import Posts from './Posts.js';
// msw
import { rest } from 'msw';
import { setupServer } from 'msw/node';

/* ==========================================
 Show message on page load
 =====================================*/
test('should display loading message', () => {
  render(<Posts />);
  // screen.debug();
  const loadingMessage = screen.getByText('A moment please...');
  expect(loadingMessage).toBeInTheDocument();
});

/* ==========================================
 Fetch and display posts:
 =====================================*/
/*** without msw */

// test('should fetch and display asynchronous posts: no msw', async () => {
//   render(<Posts />);
//   const postItemNode = await screen.findByText('qui est esse');
//   expect(postItemNode).toBeInTheDocument();
// });

/*** with msw */
const server = setupServer(
  rest.get(
    'https://jsonplaceholder.typicode.com/posts',
    (req, res, ctx) => res(ctx.json([{ id: 1, title: 'title 1' }]))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('should fetch and display asynchronous posts', async () => {
  render(<Posts />);
  const postItemNode = await screen.findByText('title 1');
  expect(postItemNode).toBeInTheDocument();
});

/*** error handling with msw */
test('should handle server error', async () => {
  server.use(
    // override the initial "GET /url" request handler
    // to return a 500 Server Error
    rest.get(
      'https://jsonplaceholder.typicode.com/posts',
      (req, res, ctx) => res(ctx.status(500))
    )
  );
  render(<Posts />);
  // screen.debug(); //error message initially not present
  const erroMessageNode = await screen.findByText(
    /problem fetching the post data/i
  );
  // screen.debug(); //error message is present
  expect(erroMessageNode).toBeInTheDocument();
});

/* ==========================================
  Test for disappearance
 =====================================*/

test('Should display loading message and disappear when posts arrive', async () => {
  render(<Posts />);
  // screen.debug(); //message initially present
  await waitForElementToBeRemoved(() =>
    screen.getByText('A moment please...')
  );
  // screen.debug(); //loading message not present
});

/* ==========================================
 View implicit roles with logRoles
 =====================================*/
test('should view implicit roles with logRoles', async () => {
  const view = render(<Posts />);
  const postItemNode = await screen.findByRole('heading', {
    name: 'title 1',
  });
  expect(postItemNode).toBeInTheDocument();
});

/* ==========================================
 Show list item
 =====================================*/
//  findByRole example

test('should list item visible in the DOM', async () => {
  render(<Posts />);
  const postItemNode = await screen.findByRole('listitem');
  expect(postItemNode).toBeVisible();
});
