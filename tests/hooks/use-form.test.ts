import "~/setup-dom";
import { test, expect, describe } from "bun:test";
import { render } from "@testing-library/react";
import React, { createElement, useEffect } from "react";
import { useAppForm, withForm } from "~/hooks/use-form";

describe("useAppForm", () => {
  test("useAppForm が正しくエクスポートされている", () => {
    expect(typeof useAppForm).toBe("function");
  });

  test("useAppForm がフォームインスタンスを返す", () => {
    const TestComponent = () => {
      const form = useAppForm({
        defaultValues: {
          name: "",
          email: "",
        },
      });

      return createElement("div", {
        "data-testid": "form-test",
        "data-has-form": !!form,
        "data-has-state": !!form.state,
        "data-has-fields": !!form.Field,
      });
    };

    const { container } = render(createElement(TestComponent));

    const component = container.querySelector('[data-testid="form-test"]');
    expect(component).not.toBeNull();
    expect(component?.getAttribute("data-has-form")).toBe("true");
    expect(component?.getAttribute("data-has-state")).toBe("true");
    expect(component?.getAttribute("data-has-fields")).toBe("true");
  });

  test("フォームの defaultValues が正しく設定される", () => {
    const TestComponent = () => {
      const form = useAppForm({
        defaultValues: {
          name: "Test User",
          email: "test@example.com",
        },
      });

      return createElement("div", {
        "data-testid": "form-values",
        "data-name": form.state.values.name,
        "data-email": form.state.values.email,
      });
    };

    const { container } = render(createElement(TestComponent));

    const component = container.querySelector('[data-testid="form-values"]');
    expect(component).not.toBeNull();
    expect(component?.getAttribute("data-name")).toBe("Test User");
    expect(component?.getAttribute("data-email")).toBe("test@example.com");
  });

  test("フォームの値が更新できる", async () => {
    const TestComponent = () => {
      const form = useAppForm({
        defaultValues: {
          name: "",
        },
      });

      const [name, setName] = React.useState(form.state.values.name);

      useEffect(() => {
        form.setFieldValue("name", "Updated Name");
        setName(form.state.values.name);
      }, [form]);

      useEffect(() => {
        const unsubscribe = form.store.subscribe(() => {
          setName(form.state.values.name);
        });
        return unsubscribe;
      }, [form]);

      return createElement("div", {
        "data-testid": "form-update",
        "data-name": name,
      });
    };

    const { container } = render(createElement(TestComponent));

    await new Promise((resolve) => setTimeout(resolve, 100));

    const component = container.querySelector('[data-testid="form-update"]');
    expect(component).not.toBeNull();
    expect(component?.getAttribute("data-name")).toBe("Updated Name");
  });
});

describe("withForm", () => {
  test("withForm が正しくエクスポートされている", () => {
    expect(typeof withForm).toBe("function");
  });

  test("withForm が HOC として機能する", () => {
    const WrappedComponent = withForm({
      defaultValues: {
        name: "",
      },
      render: ({ form }) => {
        return createElement("div", {
          "data-testid": "hoc-test",
          "data-has-form": !!form,
        });
      },
    });

    const TestWrapper = () => {
      const form = useAppForm({
        defaultValues: {
          name: "",
        },
      });

      return createElement(WrappedComponent, { form });
    };

    const { container } = render(createElement(TestWrapper));

    const component = container.querySelector('[data-testid="hoc-test"]');
    expect(component).not.toBeNull();
    expect(component?.getAttribute("data-has-form")).toBe("true");
  });
});
