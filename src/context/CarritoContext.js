import { createContext, useContext, useEffect, useReducer } from "react";
import { carritoReducer, totalCarrito, cantidadItems } from "./carritoReducer";
import { carritoDB } from "../data/db";

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const [carrito, dispatch] = useReducer(carritoReducer, undefined, carritoDB.leer);

  // Persistencia: cada cambio del estado se guarda en localStorage
  useEffect(() => carritoDB.guardar(carrito), [carrito]);

  const valor = {
    carrito,
    total: totalCarrito(carrito),
    cantidad: cantidadItems(carrito),
    agregar: (producto) => dispatch({ tipo: "agregar", producto }),
    quitar: (id) => dispatch({ tipo: "quitar", id }),
    cambiarCantidad: (id, cantidad) => dispatch({ tipo: "cambiar", id, cantidad }),
    vaciar: () => dispatch({ tipo: "vaciar" }),
  };
  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

export const useCarrito = () => useContext(CarritoContext);
