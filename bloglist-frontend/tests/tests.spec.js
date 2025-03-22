import { test, expect } from "@playwright/test";
async function blogCreation(page, title, author, url) {
  await page.goto("/");

  //NewBlog button click
  const newBlogBtn = page.getByRole("button", { name: "New Blog" });
  expect(newBlogBtn).toBeVisible();
  await newBlogBtn.click();

  //Filling the form
  const titleInput = page.getByPlaceholder("Title for the blog");
  const authorInput = page.getByPlaceholder("Author of the blog");
  const urlInput = page.getByPlaceholder("Url for the blog");

  await titleInput.fill(title);
  await authorInput.fill(author);
  await urlInput.fill(url);

  const createBtn = page.getByRole("button", { name: "Create" });
  await createBtn.click();

  await page.waitForSelector(".message");
  const successfullBlogCreation = page.getByText(
    `A new blog ${title} of ${author} has been added.`
  );
  await expect(successfullBlogCreation).toBeVisible();
}
async function login(page, username, password) {
  const usernameInput = page.getByPlaceholder("username");
  const passwordInput = page.getByPlaceholder("password");
  const loginButton = page.getByRole("button", { name: "Login" });

  await expect(usernameInput).toBeVisible();
  await expect(passwordInput).toBeVisible();
  await expect(loginButton).toBeVisible();

  await usernameInput.fill(username);
  await passwordInput.fill(password);
  await loginButton.click();

  const successfullLogin = page.getByText(`Logged in ${username}`);
  await expect(successfullLogin).toBeVisible();
}
test.describe("Blog App", () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "test",
        username: "testUserName",
        password: "testPassword",
      },
    });
  });
  test("Login Form is shown", async ({ page }) => {
    await page.goto("/");
    const title = page.getByText("Login Form");
    await expect(title).toBeVisible();
  });
  test("Failed Login to the form", async ({ page }) => {
    await page.goto("/");
    const usernameInput = page.getByPlaceholder("username");
    const passwordInput = page.getByPlaceholder("password");
    const loginButton = page.getByRole("button", { name: "Login" });

    await usernameInput.fill("wrongUsername");
    await passwordInput.fill("wrongPassword");
    await loginButton.click();
    const successfullLogin = page.getByText("Logged in testUserName");
    await expect(successfullLogin).not.toBeVisible();
  });
  test("Successful Login to the form", async ({ page }) => {
    await page.goto("/");
    await login(page, "testUserName", "testPassword");
  });
});
test.describe("When Logged In", () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "test",
        username: "testUserName",
        password: "testPassword",
      },
    });
    //Logging In
    await page.goto("/");
    await login(page, "testUserName", "testPassword");
  });

  test("A New Blog can be created.", async ({ page }) => {
    await blogCreation(
      page,
      "Testing with playwright",
      "Playwright Tester",
      "testUrl"
    );
  });
  test("Blog can be liked", async ({ page }) => {
    //creatingBlog
    await blogCreation(
      page,
      "Testing with playwright",
      "Playwright Tester",
      "testUrl"
    );
    //creatingBlog

    await page.reload();
    //Show Btn
    const showBtn = page.getByRole("button", { name: "Show" });
    await expect(showBtn).toBeVisible();
    await showBtn.click();

    //Getting amount of likes
    await expect(page.getByText("Likes: 0")).toBeVisible();

    //Like Btn
    const likeBtn = page.getByRole("button", { name: "Like" });
    await expect(likeBtn).toBeVisible();
    await likeBtn.click();

    //Like incremented by 1;
    await expect(page.getByText("Likes: 1")).toBeVisible();
  });
  test("Blog can be deleted", async ({ page }) => {
    await blogCreation(
      page,
      "Testing with playwright",
      "Playwright Tester",
      "testUrl"
    );

    expect(page.getByText("Testing with playwright")).toBeVisible();
    await page.reload();

    const showBtn = page.getByRole("button", { name: "Show" });
    await expect(showBtn).toBeVisible();
    await showBtn.click();

    //Remove Btn
    const removeBtn = page.getByRole("button", { name: "Remove" });
    await removeBtn.click();

    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });
    await page.reload();
    await expect(page.getByText("Testing with playwright")).not.toBeVisible();
  });
});
test.describe("Authorized user can delete the blog, and  blogs are sorted by likes.", () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "newTest",
        username: "newTestUser",
        password: "newTestPassword",
      },
    });
    await request.post("/api/users", {
      data: {
        name: "test",
        username: "testUserName",
        password: "testPassword",
      },
    });
  });
  test("Delete button is not available for unauthorized user.", async ({
    page,
  }) => {
    await page.goto("/");
    await login(page, "newTestUser", "newTestPassword");
    await blogCreation(
      page,
      "Blog by newTestUser",
      "newTestPassword",
      "newTestUrl"
    );

    const logoutBtn = page.getByRole("button", { name: "Logout" });
    expect(logoutBtn).toBeVisible();
    await logoutBtn.click();

    //Logining in with a different user.
    await login(page, "testUserName", "testPassword");
    const showBtn = page.getByRole("button", { name: "Show" });
    await expect(showBtn).toBeVisible();
    await showBtn.click();

    const removeBtn = page.getByRole("button", { name: "Remove" });
    await expect(removeBtn).not.toBeVisible();
  });
  test("Blogs are sorted by likes.", async ({ page }) => {
    await page.goto("/");
    await login(page, "newTestUser", "newTestPassword");
    await blogCreation(
      page,
      "First Blog by newTestUser",
      "newTestPassword",
      "newTestUrl"
    );
    await blogCreation(
      page,
      "Second Blog by newTestUser",
      "testPassword",
      "testUrl"
    );
    await blogCreation(
      page,
      "Third Blog by newTestUser",
      "testPassword",
      "testUrl"
    );
    await blogCreation(
      page,
      "Fourth Blog by newTestUser",
      "testPassword",
      "testUrl"
    );
    await page.reload();

    const firstBlog = page.getByText("First Blog by newTestUser");
    const secondBlog = page.getByText("Second Blog by newTestUser");
    const thirdBlog = page.getByText("Third Blog by newTestUser");
    const fourthBlog = page.getByText("Fourth Blog by newTestUser");
    await expect(firstBlog).toBeVisible();
    await expect(secondBlog).toBeVisible();
    await expect(thirdBlog).toBeVisible();
    await expect(fourthBlog).toBeVisible();

    await page.locator("button", { hasText: "Show" }).evaluateAll((btns) => {
      btns.forEach((button) => button.click());
    });
    const likeBtns = await page.locator("button", { hasText: "Like" }).all();
    for (let likeBtn of likeBtns) {
      await expect(likeBtn).toBeVisible();
      const randomClicks = Math.floor(Math.random() * 10 + 1);
      for (let i = 0; i < randomClicks; i++) {
        await likeBtn.click();
      }
    }
    await page.reload();
    await page.waitForTimeout(900);

    await page.locator("button", { hasText: "Show" }).evaluateAll((btns) => {
      btns.forEach((button) => button.click());
    });
    let likeNumbers = await page
      .locator(".Likes")
      .evaluateAll((nodes) =>
        nodes.map((node) => parseInt(node.textContent.trim()))
      );
    let sortedLikes = [...likeNumbers].sort((a, b) => b - a);
    console.log(likeNumbers, sortedLikes);
    expect(likeNumbers).toStrictEqual(sortedLikes);
  });
});
