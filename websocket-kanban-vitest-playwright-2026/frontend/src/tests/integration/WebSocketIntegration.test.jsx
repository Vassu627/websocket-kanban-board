import { render, screen } from "@testing-library/react";
import { vi, test, expect } from "vitest";
import KanbanBoard from "../../components/KanbanBoard";

// mock socket.io-client
vi.mock("socket.io-client", () => ({
  io: () => ({
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  }),
}));

test("WebSocket integration renders board", () => {
  render(<KanbanBoard />);

  expect(
    screen.getByText("Real-Time Kanban Board")
  ).toBeInTheDocument();
});
