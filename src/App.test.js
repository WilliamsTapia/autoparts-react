import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CarritoProvider } from "./context/CarritoContext";

const renderizarApp = (ruta = "/") =>
  render(
    <MemoryRouter initialEntries={[ruta]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <CarritoProvider>
          <App />
        </CarritoProvider>
      </AuthProvider>
    </MemoryRouter>
  );

beforeEach(() => {
  localStorage.clear();
});

test("muestra el menú principal y los productos destacados en el inicio", () => {
  renderizarApp();

  expect(screen.getByRole("link", { name: "Productos" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Ofertas" })).toBeInTheDocument();
  expect(screen.getByText("Productos destacados")).toBeInTheDocument();
});

test("la ruta /ofertas muestra solo los productos con descuento", () => {
  renderizarApp("/ofertas");

  expect(screen.getByRole("heading", { name: /Ofertas/ })).toBeInTheDocument();
  expect(screen.getAllByText(/^-\d+%$/)).toHaveLength(4);
});

test("una ruta inexistente muestra la página 404", () => {
  renderizarApp("/ruta-que-no-existe");

  expect(screen.getByText("404")).toBeInTheDocument();
});
