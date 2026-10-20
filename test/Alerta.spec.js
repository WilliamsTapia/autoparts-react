import { render, screen } from "@testing-library/react";
import Alerta from "../src/components/Alerta";

describe("Alerta (renderizado condicional)", () => {
  it("10. muestra el mensaje cuando existe", () => {
    render(<Alerta tipo="success" mensaje="Todo salió bien" />);
    expect(screen.getByText("Todo salió bien")).toBeTruthy();
  });

  it("11. no muestra nada cuando el mensaje está vacío", () => {
    const { container } = render(<Alerta mensaje="" />);
    expect(container.innerHTML).toBe("");
  });
});