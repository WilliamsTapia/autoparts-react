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

const fetchOriginal = global.fetch;
const productos = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1, nombre: "Repuesto " + (i + 1), precio: 1000, descuento: 10, stock: 5,
  imagen: "/img/filtro-aire.jpg", categoria: "Filtros",
}));

beforeEach(() => {
  sessionStorage.clear();
  global.fetch = jest.fn(async () => ({
    ok: true, headers: { get: () => null }, text: async () => JSON.stringify(productos),
  }));
  localStorage.clear();
});

afterEach(() => { global.fetch = fetchOriginal; });

test("muestra el menú principal y los productos destacados en el inicio", async () => {
  renderizarApp();

  expect(screen.getByRole("link", { name: "Productos" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Ofertas" })).toBeInTheDocument();
  await screen.findByText("Repuesto 1");
  expect(screen.getByText("Productos destacados")).toBeInTheDocument();
});

test("la ruta /ofertas muestra solo los productos con descuento", async () => {
  renderizarApp("/ofertas");

  expect(screen.getByRole("heading", { name: /Ofertas/ })).toBeInTheDocument();
  expect(await screen.findAllByText(/^-\d+%$/)).toHaveLength(4);
});

test("una ruta inexistente muestra la página 404", () => {
  renderizarApp("/ruta-que-no-existe");

  expect(screen.getByText("404")).toBeInTheDocument();
});
