import "~/setup-dom";
import { test, expect, describe, beforeEach, mock } from "bun:test";
import { render } from "@testing-library/react";
import { TestWrapper } from "./test-utils";

const mockUseAuth = mock(() => ({
  user: {
    id: "user-123",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    profilePictureUrl: null,
  } as ReturnType<typeof import("@workos/authkit-tanstack-react-start/client").useAuth>["user"],
}));

beforeEach(() => {
  mock.module("@workos/authkit-tanstack-react-start/client", () => ({
    useAuth: mockUseAuth,
  }));

  mock.module("@tanstack/react-router", () => ({
    Link: ({ children, to, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  }));
});

describe("Header", () => {
  test("コンポーネントが正しくレンダリングされる", async () => {
    const { Header: HeaderComponent } = await import("~/components/header");

    const { container } = render(
      <TestWrapper withAppShell>
        <HeaderComponent />
      </TestWrapper>,
    );

    expect(container).toBeTruthy();
  });

  test("ロゴとタイトルが表示される", async () => {
    const { Header: HeaderComponent } = await import("~/components/header");

    const { container } = render(
      <TestWrapper withAppShell>
        <HeaderComponent />
      </TestWrapper>,
    );

    const text = container.textContent;
    expect(text).toContain("読書メンタルモデル");
  });

  test("ユーザーが存在する場合、UserMenu が表示される", async () => {
    const { Header: HeaderComponent } = await import("~/components/header");

    const { container } = render(
      <TestWrapper withAppShell>
        <HeaderComponent />
      </TestWrapper>,
    );

    const avatar = container.querySelector('[class*="Avatar"]');
    expect(avatar).toBeTruthy();
  });

  test("ユーザーが存在しない場合、UserMenu は表示されない", async () => {
    mockUseAuth.mockReturnValueOnce({
      user: null,
    } as ReturnType<typeof import("@workos/authkit-tanstack-react-start/client").useAuth>);

    const { Header: HeaderComponent } = await import("~/components/header");

    const { container } = render(
      <TestWrapper withAppShell>
        <HeaderComponent />
      </TestWrapper>,
    );

    const avatar = container.querySelector('[class*="Avatar"]');
    expect(avatar).toBeFalsy();
  });
});
