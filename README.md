 
# AutoParts CL
### Tienda online de repuestos automotrices

**Proyecto  — Evaluación Parcial 2**  
**Asignatura:** DSY1104 — Desarrollo Fullstack II  
**Institución:** Duoc UC  
**Equipo:** Grupo 7

**Integrantes:**
- Francisco Ancamil
- Felipe Arce
- Williams Tapia

**Repositorio oficial:**  
https://github.com/WilliamsTapia/autoparts-react.git

---

## 1. Descripción del proyecto

AutoParts CL es una aplicación web de comercio electrónico orientada a la venta de repuestos, accesorios y productos para vehículos.

El proyecto nace como una propuesta de modernización de una tienda online desarrollada inicialmente con HTML, CSS y JavaScript. En su segunda etapa se implementa una arquitectura basada en React, mediante componentes reutilizables, navegación dinámica, gestión de estados y persistencia local.

La aplicación incorpora una tienda pública y un panel administrativo que permiten gestionar distintos procesos relacionados con la comercialización de productos automotrices.

El sistema constituye un prototipo funcional académico. No dispone de un backend productivo ni de una pasarela de pagos real.

## 2. Objetivos

### Objetivo general

Desarrollar una aplicación web de comercio electrónico utilizando React, integrando componentes reutilizables, gestión de estados, operaciones CRUD y pruebas unitarias que permitan verificar el comportamiento del frontend.

### Objetivos específicos

- Migrar la aplicación original a React.
- Implementar navegación mediante React Router.
- Desarrollar componentes independientes y reutilizables.
- Utilizar estados, propiedades y Context API.
- Incorporar un diseño adaptable mediante Bootstrap.
- Implementar operaciones CRUD para la gestión de información.
- Gestionar la persistencia local mediante `localStorage`.
- Desarrollar pruebas unitarias con Jasmine y Karma.
- Analizar la cobertura de código mediante Istanbul.

## 3. Tecnologías utilizadas

| Tecnología | Utilización |
|---|---|
| React 19 | Desarrollo de componentes y vistas |
| JavaScript | Lógica y funcionalidades |
| HTML5 y CSS3 | Estructura y estilos |
| Bootstrap 5 | Diseño responsivo |
| React Bootstrap | Componentes visuales |
| React Router 6 | Navegación entre páginas |
| Context API | Gestión de estados compartidos |
| useReducer | Gestión de operaciones del carrito |
| localStorage | Persistencia de información |
| Create React App 5 | Configuración y ejecución |
| Jasmine | Definición de pruebas unitarias |
| Karma | Ejecución automatizada de pruebas |
| Istanbul | Medición de cobertura de código |
| Jest y Testing Library | Pruebas complementarias |
| Git y GitHub | Control de versiones |

## 4. Funcionalidades principales

### 4.1 Tienda pública

La interfaz orientada a los clientes incorpora las siguientes funcionalidades:

- Página principal de la tienda.
- Catálogo de repuestos automotrices.
- Búsqueda, filtrado y ordenamiento de productos.
- Visualización del detalle de cada producto.
- Sección de productos en oferta.
- Carrito de compras con control de cantidades.
- Cálculo de subtotales y total de compra.
- Formulario de checkout y datos de entrega.
- Simulación de pagos aprobados y rechazados.
- Registro e inicio de sesión.
- Formulario de contacto.
- Secciones informativas, blog y detalle de artículos.
- Navegación adaptable a diferentes dispositivos.

### 4.2 Panel de administración

El proyecto incorpora un entorno administrativo con rutas y componentes propios.

Las funcionalidades contempladas incluyen:

| Módulo | Descripción |
|---|---|
| Dashboard | Resumen de información del sistema |
| Productos | Registro, consulta, edición y eliminación |
| Stock crítico | Identificación de productos con existencias bajas |
| Categorías | Administración de categorías |
| Órdenes | Consulta y gestión de órdenes |
| Reportes | Visualización de información administrativa |
| Usuarios | Administración de cuentas y tipos de usuario |
| Perfil | Consulta y gestión del perfil administrativo |

Estas pantallas se encuentran organizadas en rutas específicas del panel.

## 5. Arquitectura y organización

La aplicación utiliza componentes funcionales de React y separa las responsabilidades de presentación, lógica, estado y persistencia.

### Estructura principal

```text
autoparts-react/
│
├── public/
│   └── Recursos públicos
│
├── src/
│   ├── components/
│   │   ├── admin/
│   │   └── Componentes de la tienda
│   │
│   ├── context/
│   │   └── Gestión de estados
│   │
│   ├── data/
│   │   └── db.js
│   │
│   ├── services/
│   │   └── pago.js
│   │
│   ├── utils/
│   │   └── Funciones auxiliares
│   │
│   ├── App.js
│   └── index.js
│
├── test/
│   └── Pruebas unitarias
│
├── karma.conf.js
├── package.json
└── README.md
```

### Gestión de estados

La aplicación utiliza Context API para compartir información entre componentes, reduciendo la necesidad de transferir propiedades a través de múltiples niveles.

El carrito utiliza un reducer para centralizar operaciones como agregar, eliminar y actualizar cantidades.

### Persistencia de datos

La capa de datos permite trabajar con operaciones CRUD sin depender de un servidor externo.

La información se conserva en `localStorage`, por lo que permanece disponible al actualizar la página dentro del mismo navegador.

## 6. Requisitos de instalación

Para ejecutar la aplicación se necesita:

- Node.js 18 o superior.
- npm.
- Un navegador web actualizado.
- Google Chrome para la ejecución de Karma con Chrome Headless.
- Git para clonar el repositorio.

## 7. Instalación y ejecución

### Paso 1. Clonar el repositorio

```bash
git clone https://github.com/WilliamsTapia/autoparts-react.git
```

### Paso 2. Ingresar al directorio

```bash
cd autoparts-react
```

### Paso 3. Instalar las dependencias

```bash
npm install
```

### Paso 4. Iniciar la aplicación

```bash
npm start
```

La aplicación estará disponible en:

**http://localhost:3000**

Para generar una compilación de producción se utiliza:

```bash
npm run build
```

## 8. Acceso al sistema

### Tienda pública

Los visitantes pueden explorar el catálogo, consultar productos, utilizar el carrito y acceder a los formularios disponibles.

### Panel administrativo

Para acceder a la cuenta administrativa de demostración:

**Correo:** `admin@duoc.cl`

**Contraseña:** cualquier cadena de 4 a 10 caracteres, según la validación implementada en el prototipo.

**Importante:** la autenticación actual es una simulación académica y no debe utilizarse como sistema de seguridad en producción. La verificación real de credenciales deberá incorporarse junto con un backend.

## 9. Pruebas unitarias y control de calidad

El proyecto incorpora pruebas automatizadas destinadas a verificar la lógica de negocio y el comportamiento de sus componentes.

### Herramientas de testing

**Jasmine:** define las pruebas y sus expectativas.

**Karma:** ejecuta las pruebas mediante un navegador o un entorno simulado.

**Webpack y Babel:** procesan el código JavaScript y JSX para su ejecución.

**Istanbul:** instrumenta el código y genera los informes de cobertura.

### Resultados documentados

| Indicador | Resultado |
|---|---:|
| Pruebas unitarias ejecutadas | 57 |
| Pruebas aprobadas | 57 |
| Pruebas fallidas | 0 |
| Cobertura de sentencias | 92,3 % |
| Cobertura de ramas | 85,8 % |

*Resultados correspondientes a la ejecución documentada en el informe de cobertura de testing del proyecto.*

### Alcance de las pruebas

El proceso de testing contempla funcionalidades relacionadas con:

- Validación de datos y formularios.
- Operaciones CRUD.
- Búsqueda y filtrado de productos.
- Cálculos asociados al carrito.
- Gestión de estados.
- Renderizado de componentes.
- Interacciones y eventos.
- Flujos de la tienda y administración.

La cobertura de código permite identificar qué partes del programa han sido ejecutadas durante las pruebas. No sustituye las pruebas de seguridad, rendimiento, experiencia de usuario ni las pruebas completas de extremo a extremo.

## 10. Ejecución de pruebas

### Jasmine y Karma

```bash
npm run test:karma
```

Ejecuta la suite utilizando Chrome Headless y genera los resultados de cobertura.

### Jasmine y Karma con jsdom

```bash
npm run test:karma:jsdom
```

Permite ejecutar las pruebas utilizando un entorno DOM simulado, sin depender de una instalación local de Chrome.

### Jest y Testing Library

```bash
npm test
```

Ejecuta las pruebas complementarias configuradas mediante Create React App.

### Ejecución conjunta

```bash
npm run test:all
```

Ejecuta las pruebas de Jest y posteriormente las de Karma.

### Informes de cobertura

Una vez completada la ejecución de Karma, los informes se generan en:

```text
coverage/
├── html/
│   └── index.html
├── cobertura.txt
└── lcov.info
```

Para visualizar el reporte HTML, abrir `coverage/html/index.html` en un navegador.

## 11. Validaciones

La aplicación contempla validaciones para reducir errores al ingresar y gestionar información.

Entre las validaciones documentadas se encuentran:

- Verificación de RUN chileno mediante módulo 11.
- Validación de nombres y apellidos.
- Comprobación del formato y dominio del correo electrónico.
- Control de registros duplicados.
- Validación de campos obligatorios.
- Verificación de datos de productos.
- Validación de cantidades y valores.
- Control de información ingresada en formularios.

Estas verificaciones se desarrollan en el frontend y no sustituyen las validaciones que deberá implementar un futuro servidor.

## 12. Diseño responsivo

La interfaz emplea Bootstrap, React Bootstrap y estilos CSS para adaptarse a distintos tamaños de pantalla.

Se utilizan elementos como:

- Contenedores y grillas responsivas.
- Tarjetas de productos.
- Formularios adaptables.
- Menús de navegación.
- Tablas y componentes administrativos.
- Distribución flexible del contenido.

El propósito es facilitar la navegación desde computadores, tabletas y teléfonos móviles.

## 13. Limitaciones actuales

AutoParts CL corresponde a una solución frontend desarrollada para fines académicos.

Sus principales limitaciones son:

- No incorpora una API ni un backend productivo.
- La información se almacena localmente en el navegador.
- No existe una base de datos centralizada.
- La autenticación no verifica contraseñas mediante un servidor.
- La pasarela de pago es simulada.
- No existe procesamiento de transacciones bancarias reales.
- La información almacenada en distintos navegadores no se sincroniza automáticamente.
- Las pruebas unitarias no reemplazan una validación integral en producción.

## 14. Mejoras futuras

Para continuar con el desarrollo del sistema, se consideran las siguientes mejoras:

1. Incorporar una API REST.
2. Implementar una base de datos centralizada.
3. Desarrollar un mecanismo seguro de autenticación y autorización.
4. Integrar una pasarela de pagos real.
5. Incorporar notificaciones y comprobantes por correo.
6. Ampliar las pruebas de integración y extremo a extremo.
7. Fortalecer la seguridad y validación del lado del servidor.

## 15. Conclusión

El desarrollo de AutoParts CL permitió aplicar conocimientos de programación frontend utilizando React, navegación por componentes, gestión de estados, persistencia local y diseño responsivo.

La implementación de pruebas unitarias mediante Jasmine y Karma permitió verificar distintas funcionalidades del proyecto y generar indicadores de cobertura de código.

El resultado es un prototipo de tienda online con funcionalidades comerciales y administrativas que puede servir como base para integrar posteriormente servicios backend y una base de datos real.

## 16. Repositorio y equipo de desarrollo

**Repositorio GitHub:**  
https://github.com/WilliamsTapia/autoparts-react.git

**Asignatura:** Desarrollo Fullstack II — DSY1104  
**Institución:** Duoc UC  
**Evaluación:** Parcial 2

**Equipo de desarrollo — Grupo 7**

- Francisco Ancamil
- Felipe Arce
- Williams Tapia

---

**AutoParts CL — Proyecto académico de Desarrollo Fullstack II.**
