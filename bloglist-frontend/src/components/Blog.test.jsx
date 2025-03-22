import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";
import { test, vi } from "vitest";

test("renders content", () => {
  const blog = {
    title: "This is a test blog.",
    author: "Test Author",
    url: "This is test url",
  };

  render(<Blog blog={blog} />);

  //Check if title and author exists
  expect(screen.getByText(/This is a test blog./i)).toBeInTheDocument();
  expect(screen.getByText(/Test Author/i)).toBeInTheDocument();

  //Url is hidden
  expect(screen.queryByText("This is test url")).not.toBeInTheDocument();
  expect(screen.queryByText("Likes")).not.toBeInTheDocument();
});

test("clicking the button calls the event handler once and the likes are rendred", async () => {
  const blog = {
    title: "This is a test blog.",
    author: "Test Author",
    url: "This is test url",
  };
  render(<Blog blog={blog} />);

  const user = userEvent.setup();
  const button = screen.getByText("Show");
  await user.click(button);

  const urlShown = screen.getByText("URL:");
  const Likes = screen.getByText("Likes:");

  expect(urlShown).toBeInTheDocument();
  expect(Likes).toBeInTheDocument();
});
test("Clicking the button twice cause the event handler to be called twice.", async () => {
  const blog = {
    title: "This is a test blog.",
    author: "Test Author",
    url: "This is test url",
  };
  const mockLike = vi.fn();
  render(<Blog blog={blog} incrementingLike={mockLike} />);
  const user = userEvent.setup();
  const button = screen.getByText("Show");
  await user.click(button);

  const LikeButton = screen.getByText("Like");
  await user.click(LikeButton);
  await user.click(LikeButton);
  expect(mockLike.mock.calls).toHaveLength(2);
});
