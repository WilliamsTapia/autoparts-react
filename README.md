# AutoParts CL (Evaluación Parcial 2, DSY1104 Desarrollo Fullstack II)

Tienda online de repuestos para vehículos, migrada de HTML, CSS y JavaScript a **React** con **React Bootstrap**,
con navegación (React Router), estado compartido (Context y `useReducer`), un archivo de datos con CRUD
persistido en `localStorage` y pruebas unitarias con **Jasmine y Karma**.

Integrantes: Francisco Ancamil, Felipe Arce y Williams Tapia.

## Requisitos
- Node.js 18 o superior y Google Chrome (para Karma).

## Instalación y ejecución
```
npm install
npm start
```
La aplicación queda en http://localhost:3000. Para entrar al panel de administración, usa el correo `admin@duoc.cl` con cualquier contraseña de 4 a 10 caracteres.

## Pruebas
| Comando | Qué ejecuta |
|---|---|
| `npm run test:karma` | Pruebas con Karma y Jasmine en Chrome Headless, con informe de cobertura |
| `npm run test:karma:jsdom` | Las mismas pruebas sin Chrome (usa jsdom) |
| `npm test` | Pruebas con Jest y Testing Library (`src/App.test.js`) |
| `npm run test:all` | Jest y luego Karma |

El informe de cobertura de Karma queda en `coverage/html/index.html` (resumen en `coverage/cobertura.txt`).

## Estructura (sigue los ejemplos del profesor)
```
public/                 index.html e imágenes
src/
  index.js              punto de entrada (BrowserRouter y proveedores de contexto)
  App.js                rutas de la tienda y del panel admin
  components/           todos los componentes y pantallas (un archivo por componente)
    admin/              pantallas del panel de administración
  context/              estado compartido (sesión y carrito)
  data/db.js            archivo de datos con CRUD (listar, obtener, crear, actualizar, eliminar)
  services/pago.js      pasarela de pago simulada
  utils/                validaciones, filtros y formato (lógica pura)
test/                   pruebas de Jasmine (*.spec.js) y entrada de Karma
karma.conf.js           configuración de Karma
```

## Notas técnicas
- `typescript` aparece en `devDependencies` solo para que Create React App 5 no instale una versión incompatible.
- Karma usa webpack y babel para poder probar componentes con JSX directamente.
