import "~/setup-dom";
import { test, expect, describe, beforeEach, mock } from "bun:test";
import { render } from "@testing-library/react";
import { TestWrapper } from "~/components/test-utils";

beforeEach(() => {
  mock.module("@tanstack/react-router", () => ({
    Link: ({ children, to, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  }));
});

describe("ErrorComponent", () => {
  test("エラーメッセージが表示される", async () => {
    const { ErrorComponent: ErrorComponentTest } = await import("~/components/error");
    const error = new Error("テストエラー");
    const { container } = render(
      <TestWrapper>
        <ErrorComponentTest error={error} />
      </TestWrapper>,
    );

    const text = container.textContent;
    expect(text).toContain("テストエラー");
  });

  test("エラーメッセージがない場合、デフォルトメッセージが表示される", async () => {
    const { ErrorComponent: ErrorComponentTest } = await import("~/components/error");
    const error = new Error();
    const { container } = render(
      <TestWrapper>
        <ErrorComponentTest error={error} />
      </TestWrapper>,
    );

    const text = container.textContent;
    expect(text).toContain("予期しないエラーが発生しました");
  });

  test("エラータイトルが表示される", async () => {
    const { ErrorComponent: ErrorComponentTest } = await import("~/components/error");
    const error = new Error("テストエラー");
    const { container } = render(
      <TestWrapper>
        <ErrorComponentTest error={error} />
      </TestWrapper>,
    );

    const text = container.textContent;
    expect(text).toContain("エラーが発生しました");
  });

  test("再読み込みボタンが表示される", async () => {
    const { ErrorComponent: ErrorComponentTest } = await import("~/components/error");
    const error = new Error("テストエラー");
    const { container } = render(
      <TestWrapper>
        <ErrorComponentTest error={error} />
      </TestWrapper>,
    );

    const text = container.textContent;
    expect(text).toContain("再読み込み");
  });

  test("ホームに戻るボタンが表示される", async () => {
    const { ErrorComponent: ErrorComponentTest } = await import("~/components/error");
    const error = new Error("テストエラー");
    const { container } = render(
      <TestWrapper>
        <ErrorComponentTest error={error} />
      </TestWrapper>,
    );

    const text = container.textContent;
    expect(text).toContain("ホームに戻る");
  });

  test("再読み込みボタンをクリックすると window.location.reload が呼ばれる", async () => {
    const { ErrorComponent: ErrorComponentTest } = await import("~/components/error");
    const error = new Error("テストエラー");
    const originalReload = window.location.reload;
    let reloadCalled = false;

    window.location.reload = () => {
      reloadCalled = true;
    };

    const { container } = render(
      <TestWrapper>
        <ErrorComponentTest error={error} />
      </TestWrapper>,
    );

    const buttons = container.querySelectorAll("button");
    const reloadButton = Array.from(buttons).find((btn) => btn.textContent?.includes("再読み込み"));

    if (reloadButton) {
      reloadButton.click();
      expect(reloadCalled).toBe(true);
    }

    window.location.reload = originalReload;
  });
});
