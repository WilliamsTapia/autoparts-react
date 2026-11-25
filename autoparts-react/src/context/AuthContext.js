import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { autenticar, perfil } from "../services/AutoPartsService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(() => Boolean(sessionStorage.getItem("ap_token")));
  const cerrar = useCallback(() => {
    sessionStorage.removeItem("ap_token");
    setUsuario(null);
    setCargando(false);
  }, []);

  useEffect(() => {
    let activo = true;
    const token = sessionStorage.getItem("ap_token");
    window.addEventListener("autoparts:sesion-vencida", cerrar);
    if (token) {
      perfil(token)
        .then((datos) => { if (activo && sessionStorage.getItem("ap_token") === token) setUsuario(datos); })
        .catch(() => { if (activo && sessionStorage.getItem("ap_token") === token) cerrar(); })
        .finally(() => { if (activo) setCargando(false); });
    }
    return () => {
      activo = false;
      window.removeEventListener("autoparts:sesion-vencida", cerrar);
    };
  }, [cerrar]);

  const iniciar = async (credenciales) => {
    const { accessToken: token } = await autenticar(credenciales);
    const datos = await perfil(token);
    sessionStorage.setItem("ap_token", token);
    setUsuario(datos);
    return datos;
  };

  return (
    <AuthContext.Provider value={{
      usuario, iniciar, cerrar, cargando, actualizarPerfil: setUsuario,
      esAdmin: usuario?.role === "ADMIN", esVendedor: usuario?.role === "VENDEDOR",
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

