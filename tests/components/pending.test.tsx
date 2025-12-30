import "~/setup-dom";
import { test, expect, describe } from "bun:test";
import { render } from "@testing-library/react";
import React from "react";
import { PendingComponent } from "~/components/pending";
import { TestWrapper } from "~/components/test-utils";

describe("PendingComponent", () => {
  test("コンポーネントが正しくレンダリングされる", () => {
    const { container } = render(
      <TestWrapper>
        <PendingComponent />
      </TestWrapper>,
    );

    expect(container).toBeTruthy();
  });

  test("ローダーが表示される", () => {
    const { container } = render(
      <TestWrapper>
        <PendingComponent />
      </TestWrapper>,
    );

    const loader = container.querySelector('[class*="Loader"]');
    expect(loader).toBeTruthy();
  });

  test("読み込み中のテキストが表示される", () => {
    const { container } = render(
      <TestWrapper>
        <PendingComponent />
      </TestWrapper>,
    );

    const text = container.textContent;
    expect(text).toContain("読み込み中...");
  });

  test("Container コンポーネントが使用されている", () => {
    const { container } = render(
      <TestWrapper>
        <PendingComponent />
      </TestWrapper>,
    );

    const containerElement = container.querySelector('[class*="Container"]');
    expect(containerElement).toBeTruthy();
  });
});
