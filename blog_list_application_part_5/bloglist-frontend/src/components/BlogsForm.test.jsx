import { vi, test, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import BlogsForm from "./BlogsForm";
import { render, screen } from "@testing-library/react";

test("Blog is created with the right details.", async () => {
  const blogCreator = {
    username: "TestBlogger",
  };
  const Blog = {
    title: "This is a test title",
    author: "This is a test author",
    url: "This is a test url.",
    id: "1",
  };
  const mockCreatingBlog = vi.fn();
  render(
    <BlogsForm
      title={Blog.title}
      author={Blog.author}
      url={Blog.url}
      handleCreatingBlog={mockCreatingBlog}
      user={blogCreator}
      blogs={[Blog]}
    />
  );
  const user = userEvent.setup();
  const createBtn = screen.getByText("Create");
  const titleInput = screen.getByPlaceholderText("Title for the blog");
  const authorInput = screen.getByPlaceholderText("Author of the blog");
  const urlInput = screen.getByPlaceholderText("Url for the blog");

  await userEvent.type(titleInput, "Testing a blog");
  await userEvent.type(authorInput, "Test author");
  await userEvent.type(urlInput, "Test Url");

  await user.click(createBtn);
  expect(mockCreatingBlog.mock.calls).toHaveLength(1);
  expect(mockCreatingBlog.mock.calls[0][1]).toBe("Testing a blog");
  expect(mockCreatingBlog.mock.calls[0][2]).toBe("Test Url");
  expect(mockCreatingBlog.mock.calls[0][3]).toBe("Test author");
});
