# AutoParts CL Backend

Grupo 8 · DSY1104 · Evaluación 3

API REST de la tienda en Spring Boot y MySQL. La organización sigue el ejemplo de Libros: `model`, `repository`, `service`, `controller`, `dto` y `config`.

## Demostración local desde VS Code

Abre la carpeta del backend en VS Code y ejecuta en su terminal:

```powershell
.\iniciar-local.cmd
```

El perfil `local` usa H2 y crea `db/autoparts.mv.db` dentro del backend. Los productos, usuarios y órdenes quedan guardados al cerrar y volver a iniciar. Hibernate administra las tablas y carga el catálogo original cuando la base está vacía.

El script crea la cuenta de demostración `admin@duoc.cl` con contraseña `AutoPartsDemo2026` al inicializar una base nueva. El servidor local escucha únicamente en este computador. En una segunda terminal, abre el frontend y ejecuta `npm.cmd ci` y `npm.cmd start`. Abre http://localhost:3000.

Para validar el requisito de base de datos de la pauta, ejecuta el proyecto con MySQL mediante las instrucciones siguientes.

## Inicio con MySQL en Windows

1. Instala Java 17 o superior y abre PowerShell en la raíz del backend. El wrapper descarga Maven en el primer uso.
2. Abre MySQL y crea un esquema vacío. Concede acceso al usuario que usarás en el backend.

   ```sql
   CREATE DATABASE autoparts CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. Configura la conexión, la cuenta inicial y la clave de firma. Usa tus propios valores.

   ```powershell
   $env:DB_URL = 'jdbc:mysql://localhost:3306/autoparts'
   $env:DB_USER = 'tu_usuario_mysql'
   $env:DB_PASSWORD = 'tu_clave_mysql'
   $env:ADMIN_USERNAME = 'admin@duoc.cl'
   $env:ADMIN_PASSWORD = 'tu_clave_admin_de_8_o_mas_caracteres'
   $bytes = New-Object byte[] 32
   $rng = [Security.Cryptography.RandomNumberGenerator]::Create()
   $rng.GetBytes($bytes)
   $rng.Dispose()
   $env:JWT_SECRET = [Convert]::ToBase64String($bytes)
   .\mvnw.cmd spring-boot:run
   ```

Hibernate crea las tablas y el inicializador carga los nueve repuestos originales si el esquema no tiene categorías. El administrador inicial se crea una vez. Una instalación ya inicializada conserva el catálogo y la contraseña del administrador. Usa un esquema nuevo para empezar una demostración desde cero.

- API: http://localhost:8080/api/v1
- Swagger: http://localhost:8080/swagger-ui/index.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

## Demostración

- Registra un cliente desde la tienda. El servidor asigna su rol.
- Inicia sesión con el administrador inicial. Crea al vendedor en Usuarios y selecciona su rol.
- En Swagger, ejecuta `POST /api/v1/auth/login` con `username` y `password`. Copia `accessToken` en **Authorize**. La API valida el JWT y los permisos en cada operación protegida.
- La orden de compra usa los precios y el stock del servidor. El estado Pagado representa la simulación académica. Las órdenes de un cliente solo están disponibles para ese cliente y los roles internos autorizados.

## Pruebas

```powershell
.\mvnw.cmd test
```

La prueba automatizada inicia Spring Boot con H2 y un puerto aleatorio. Comprueba el catálogo, la autenticación, los permisos, el registro, los totales y el descuento de stock. La ejecución local de la aplicación usa MySQL.
