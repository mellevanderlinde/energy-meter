import Home from "@/app/page";
import Chart from "@/components/chart";
import { ThemeProvider } from "@/components/theme-provider";
import { render } from "@testing-library/react";
import { beforeAll, describe, expect, test, vi } from "vitest";

describe("Components", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      value: vi.fn().mockImplementation(() => ({
        addListener: vi.fn(),
      })),
    });

    const ResizeObserverMock = vi.fn(() => ({
      observe: vi.fn(),
    }));

    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    vi.stubEnv("MOCK_DATA", "true");
  });

  test("Match theme provider", () => {
    const { container } = render(<ThemeProvider />);
    expect(container).toMatchSnapshot();
  });

  test("Match chart", () => {
    const { container } = render(<Chart />);
    expect(container).toMatchSnapshot();
  });

  test("Match home", () => {
    const { container } = render(<Home />);
    expect(container).toMatchSnapshot();
  });
});
