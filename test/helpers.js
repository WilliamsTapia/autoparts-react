import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// jsdom no trae MessageChannel (Chrome sí). Solo se define si falta, para poder
// correr las mismas pruebas con el lanzador jsdom en entornos sin Chrome.
if (typeof MessageChannel === "undefined") {
  globalThis.MessageChannel = class {
    constructor() {
      this.port1 = {};
      this.port2 = { postMessage: () => setTimeout(() => this.port1.onmessage && this.port1.onmessage({ data: null }), 0) };
    }
  };
}

/** Monta un componente en un contenedor real del DOM (dentro de un MemoryRouter) */
export function montar(ui, { ruta = "/" } = {}) {
  const contenedor = document.createElement("div");
  document.body.appendChild(contenedor);
  const root = createRoot(contenedor);
  act(() => root.render(<MemoryRouter initialEntries={[ruta]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{ui}</MemoryRouter>));
  return {
    contenedor,
    desmontar() { act(() => root.unmount()); contenedor.remove(); },
  };
}

/** Simula que el usuario escribe/selecciona un valor en un input, select o textarea */
export function escribir(elemento, valor) {
  const proto = { SELECT: HTMLSelectElement, TEXTAREA: HTMLTextAreaElement }[elemento.tagName] ?? HTMLInputElement;
  Object.getOwnPropertyDescriptor(proto.prototype, "value").set.call(elemento, valor);
  act(() => {
    elemento.dispatchEvent(new Event("input", { bubbles: true }));
    elemento.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

export const clic = (el) => act(() => { el.dispatchEvent(new MouseEvent("click", { bubbles: true })); });
export const enviar = (form) => act(() => { form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); });
export const porTexto = (contenedor, selector, texto) =>
  [...contenedor.querySelectorAll(selector)].find((el) => el.textContent.includes(texto));
