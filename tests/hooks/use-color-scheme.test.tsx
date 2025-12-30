import "~/setup-dom";
import { test, expect, describe } from "bun:test";
import { render } from "@testing-library/react";
import React, { createElement, useEffect } from "react";
import { ColorSchemeContext, useColorScheme } from "~/hooks/use-color-scheme";
import type { MantineColorScheme } from "@mantine/core";

describe("useColorScheme", () => {
  test("Context が提供されている場合、colorScheme と setColorScheme を返す", () => {
    const mockColorScheme: MantineColorScheme = "light";
    const mockSetColorScheme = () => {};

    const TestComponent = () => {
      const { colorScheme, setColorScheme } = useColorScheme();
      return createElement("div", {
        "data-testid": "test-component",
        "data-color-scheme": colorScheme,
        "data-has-setter": typeof setColorScheme === "function",
      });
    };

    const Wrapper = ({ children }: { children: React.ReactNode }) => {
      return createElement(
        ColorSchemeContext.Provider,
        {
          value: {
            colorScheme: mockColorScheme,
            setColorScheme: mockSetColorScheme,
          },
        },
        children,
      );
    };

    const { container } = render(createElement(Wrapper, null, createElement(TestComponent)));

    const component = container.querySelector('[data-testid="test-component"]');
    expect(component).not.toBeNull();
    expect(component?.getAttribute("data-color-scheme")).toBe("light");
    expect(component?.getAttribute("data-has-setter")).toBe("true");
  });

  test("Context が提供されていない場合、エラーをスローする", () => {
    const TestComponent = () => {
      try {
        useColorScheme();
        return createElement("div", { "data-testid": "no-error" });
      } catch (error) {
        return createElement("div", {
          "data-testid": "error",
          "data-error-message": error instanceof Error ? error.message : String(error),
        });
      }
    };

    const { container } = render(createElement(TestComponent));

    const errorComponent = container.querySelector('[data-testid="error"]');
    expect(errorComponent).not.toBeNull();
    expect(errorComponent?.getAttribute("data-error-message")).toBe(
      "useColorScheme must be used within ColorSchemeContext.Provider",
    );
  });

  test("setColorScheme が関数として呼び出せる", () => {
    let calledWith: MantineColorScheme | undefined;
    const mockSetColorScheme = (
      value: MantineColorScheme | ((current: MantineColorScheme) => MantineColorScheme),
    ) => {
      if (typeof value === "function") {
        calledWith = value("light");
      } else {
        calledWith = value;
      }
    };

    const TestComponent = () => {
      const { setColorScheme } = useColorScheme();
      useEffect(() => {
        setColorScheme("dark");
      }, [setColorScheme]);
      return createElement("div", { "data-testid": "test-component" });
    };

    const Wrapper = ({ children }: { children: React.ReactNode }) => {
      return createElement(
        ColorSchemeContext.Provider,
        {
          value: {
            colorScheme: "light",
            setColorScheme: mockSetColorScheme,
          },
        },
        children,
      );
    };

    render(createElement(Wrapper, null, createElement(TestComponent)));

    expect(calledWith).toBe("dark");
  });

  test("setColorScheme が関数を受け取れる", () => {
    let calledWith: MantineColorScheme | undefined;
    const mockSetColorScheme = (
      value: MantineColorScheme | ((current: MantineColorScheme) => MantineColorScheme),
    ) => {
      if (typeof value === "function") {
        calledWith = value("light");
      } else {
        calledWith = value;
      }
    };

    const TestComponent = () => {
      const { setColorScheme } = useColorScheme();
      useEffect(() => {
        setColorScheme((current) => (current === "light" ? "dark" : "light"));
      }, [setColorScheme]);
      return createElement("div", { "data-testid": "test-component" });
    };

    const Wrapper = ({ children }: { children: React.ReactNode }) => {
      return createElement(
        ColorSchemeContext.Provider,
        {
          value: {
            colorScheme: "light",
            setColorScheme: mockSetColorScheme,
          },
        },
        children,
      );
    };

    render(createElement(Wrapper, null, createElement(TestComponent)));

    expect(calledWith).toBe("dark");
  });

  test("異なる colorScheme 値で動作する", () => {
    const colorSchemes: MantineColorScheme[] = ["light", "dark", "auto"];

    colorSchemes.forEach((scheme) => {
      const TestComponent = () => {
        const { colorScheme } = useColorScheme();
        return createElement("div", {
          "data-testid": `test-component-${scheme}`,
          "data-color-scheme": colorScheme,
        });
      };

      const Wrapper = ({ children }: { children: React.ReactNode }) => {
        return createElement(
          ColorSchemeContext.Provider,
          {
            value: {
              colorScheme: scheme,
              setColorScheme: () => {},
            },
          },
          children,
        );
      };

      const { container, unmount } = render(
        createElement(Wrapper, null, createElement(TestComponent)),
      );

      const component = container.querySelector(`[data-testid="test-component-${scheme}"]`);
      expect(component).not.toBeNull();
      expect(component?.getAttribute("data-color-scheme")).toBe(scheme);
      unmount();
    });
  });
});
