import { logRoles, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import SearchBar from "./SearchBar";
import userEvent from "@testing-library/user-event";
describe("SearchBar", () => {
  test("renders the input and search button", () => {
    const { container } = render(
      <SearchBar loading={false} onSearch={vi.fn()} />,
    );
    logRoles(container);
    expect(
      screen.getByRole("textbox", {
        name: /github username/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /search/i,
      }),
    ).toBeInTheDocument();
  });
  test("updates the input when the user types", async () => {
    const user = userEvent.setup();
    render(<SearchBar loading={false} onSearch={vi.fn()} />);
    await user.type(
      screen.getByRole("textbox", {
        name: /github username/i,
      }),
      "yuvraj",
    );
    expect(
      screen.getByRole("textbox", { name: /github username/i }),
    ).toHaveValue("yuvraj");
  });
  test("calls onSearch with the typed username when form is submitted", async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onSearch={onSearch} loading={false} />);

    await user.type(
      screen.getByRole("textbox", { name: /github username/i }),
      "yuvraj"
    );
    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(onSearch).toHaveBeenCalledWith("yuvraj");
    expect(onSearch).toHaveBeenCalledTimes(1);
  });
  test("shows a validation error and does not call onSearch when input is empty", async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onSearch={onSearch} loading={false} />);

    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(onSearch).not.toHaveBeenCalled();
  });

  test("shows clear button when input has value and clears the input when clicked",async ()=>{
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onSearch={onSearch} loading={false} />);

    const input = screen.getByRole("textbox",{name:/github username/i});
    expect(screen.queryByRole("button",{name:/clear input/i})).not.toBeInTheDocument();

    await user.type(input,"yuvraj");
    const clearBtn=screen.getByRole("button",{name:/clear input/i});
    expect(clearBtn).toBeInTheDocument();

    await user.click(clearBtn);
    expect(input).toHaveValue("");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  })
});
