# AutoParts CL Frontend

Grupo 8 · DSY1104 · Evaluación 3

Tienda React y Bootstrap. Las pantallas usan servicios con `fetch` y `async/await` para consultar la API REST de AutoParts.

## Ejecutar

1. Inicia el backend con las instrucciones de su README.
2. En la raíz del frontend instala dependencias con `npm ci` y ejecuta `npm start`.
3. Abre http://localhost:3000. La URL de la API predeterminada es `http://localhost:8080/api/v1`. Puedes configurarla con `REACT_APP_API_URL` en `.env.local`. Para usar otro origen del frontend, ajusta la configuración CORS del backend.

## Roles

- **Cliente**. Registro público, tienda, carrito, checkout y consulta de su boleta simulada.
- **Vendedor**. Panel de lectura con el listado y detalle de los productos y las órdenes.
- **Administrador**. Panel con inventario, categorías, usuarios, órdenes, reportes y perfil.

La sesión guarda el JWT en `sessionStorage` y recupera el perfil con `GET /auth/me`. El carrito sigue guardado en el navegador. La base MySQL empieza con el catálogo original. Los usuarios, órdenes y cambios de inventario guardados en navegadores con la versión anterior requieren volver a registrarse o ingresarse en esta versión.

## Verificación

- `npm run build` genera la compilación de producción.
- `npm test -- --watchAll=false --runInBand` ejecuta la suite de Jest.
- `npm run test:karma` ejecuta Jasmine en Chrome y escribe cobertura en `coverage/`.

Repositorio frontend indicado en la entrega anterior: https://github.com/WilliamsTapia/autoparts-react
