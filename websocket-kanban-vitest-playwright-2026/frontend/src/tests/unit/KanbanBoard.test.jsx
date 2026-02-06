import { render, screen } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import KanbanBoard from "../../components/KanbanBoard";

// mock socket
vi.mock("socket.io-client", () => ({
  io: () => ({
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  }),
}));

test("renders Kanban board title", () => {
  render(<KanbanBoard />);
  expect(
    screen.getByText("Real-Time Kanban Board")
  ).toBeInTheDocument();
});
