# Proyecto Final ISW-1013 - Aplicación Web Segura

Proyecto 2 del curso Calidad del Software - Universidad Técnica Nacional  
Carrera de Ingeniería del Software | I Cuatrimestre 2026

## Equipo

| Nombre | Rol |
|--------|-----|
| Andrea Benavides Zúñiga | Coordinadora |
| María José Jiménez Morales | Integrante |
| Irella León Vargas | Integrante |

---

## Descripción del proyecto

Este proyecto consiste en el desarrollo de una **aplicación web segura** con base de datos relacional, autenticación mediante **JWT**, control de acceso por roles (**RBAC**), auditoría de eventos y controles de seguridad orientados a reducir vulnerabilidades comunes en aplicaciones web.

La solución implementada incluye:

- Autenticación de usuarios
- CRUD de productos
- CRUD de usuarios
- Registro de eventos en log de auditoría
- Restricción de acceso por roles
- Hash seguro de contraseñas con bcrypt
- JWT almacenado en cookie HttpOnly
- Rate limiting en login
- Protección CSRF mediante validación de `Origin/Referer`
- Frontend básico para login y gestión de productos

---

## Stack Tecnológico

- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL
- **ORM:** Sequelize
- **Autenticación:** JWT + bcrypt
- **Seguridad:** Helmet.js, express-rate-limit
- **Frontend:** HTML, CSS y JavaScript vanilla
- **Contenedores:** Docker + Docker Compose

---

## Requisitos previos

- Docker Desktop instalado y corriendo
- Git

---

## Cómo ejecutar el proyecto

1. Clonar el repositorio:

```bash
git clone https://github.com/abenavides01/ProyectoFinal-ISW1013.git
cd ProyectoFinal-ISW1013
```

2. Levantar el proyecto con Docker:

```bash
docker-compose up --build
```

3. El servidor estará disponible en:

```text
http://localhost:3000
```

---

## Estructura general del proyecto

```text
ProyectoFinal-ISW1013/
│── public/
│   ├── login.html
│   ├── productos.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── login.js
│       └── productos.js
│
│── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── csrfProtection.js
│   │   ├── rateLimiter.js
│   │   ├── roles.js
│   │   └── sessionTimeout.js
│   ├── models/
│   │   ├── index.js
│   │   ├── logAudit.js
│   │   ├── product.js
│   │   └── user.js
│   ├── routes/
│   │   ├── authRoute.js
│   │   ├── auditoriaRoute.js
│   │   ├── productRoute.js
│   │   ├── userRoute.js
│   │   └── index.js
│   └── utils/
│       └── logger.js
│
│── server.js
│── package.json
│── Dockerfile
│── docker-compose.yml
│── README.md
```

---

## Roles del sistema

| Rol | Permisos |
|-----|----------|
| SuperAdmin | Acceso total, CRUD de usuarios, CRUD de productos y acceso a logs de auditoría |
| Auditor | Solo lectura de usuarios y productos |
| Registrador | CRUD de productos y lectura de usuarios |

---

## Seguridad implementada

### Hash seguro de contraseñas
Las contraseñas se almacenan usando **bcrypt** con factor de costo 12.

### JWT seguro
El sistema genera un JWT al iniciar sesión y lo almacena en una **cookie HttpOnly** llamada `token`.

### Validación de roles
El acceso a endpoints protegidos se controla en backend mediante middleware de autenticación y autorización.

### Protección contra SQL Injection
Se utiliza **Sequelize ORM**, evitando concatenar consultas SQL manualmente.

### Rate limiting en login
El endpoint de login limita intentos fallidos para reducir ataques de fuerza bruta.

### Protección CSRF
Las operaciones de escritura (`POST`, `PUT`, `DELETE`) validan `Origin` o `Referer` para confirmar que la petición proviene del mismo origen del sistema.

### Auditoría
Se registran eventos relevantes como:
- login exitoso
- login fallido
- creación, edición y eliminación de usuarios
- creación, edición y eliminación de productos
- bloqueos por rate limiting
- bloqueos por política CSRF

---

## Frontend disponible

El proyecto incluye un frontend básico servido desde la carpeta `public`.

### Pantallas disponibles

#### Login
```text
http://localhost:3000/login.html
```

#### Gestión de productos
```text
http://localhost:3000/productos.html
```

### Funcionalidades visuales implementadas

- Inicio de sesión
- Redirección a la pantalla de productos
- Listado de productos
- Creación de productos
- Edición de productos
- Eliminación de productos
- Cierre de sesión

---

## Endpoints principales

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/registro | Registrar nuevo usuario |
| POST | /api/auth/login | Iniciar sesión |
| POST | /api/auth/logout | Cerrar sesión |

### Auditoría (solo SuperAdmin)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/auditoria | Ver logs de auditoría |

---

## Endpoints de Productos

### Listar productos
**GET** `/api/productos`  
**Roles permitidos:** SuperAdmin, Auditor, Registrador

### Ver producto por id
**GET** `/api/productos/:id`  
**Roles permitidos:** SuperAdmin, Auditor, Registrador

### Crear producto
**POST** `/api/productos`  
**Roles permitidos:** SuperAdmin, Registrador

**Body de ejemplo:**
```json
{
  "codigo": "P001",
  "nombre": "Teclado Mecánico",
  "descripcion": "Teclado mecánico RGB",
  "cantidad": 10,
  "precio": 25000
}
```

### Actualizar producto
**PUT** `/api/productos/:id`  
**Roles permitidos:** SuperAdmin, Registrador

**Body de ejemplo:**
```json
{
  "codigo": "P001",
  "nombre": "Teclado Mecánico Pro",
  "descripcion": "Versión actualizada del teclado",
  "cantidad": 8,
  "precio": 30000
}
```

### Eliminar producto
**DELETE** `/api/productos/:id`  
**Roles permitidos:** SuperAdmin, Registrador

---

## Endpoints de Usuarios

### Listar usuarios
**GET** `/api/usuarios`  
**Roles permitidos:** SuperAdmin, Auditor, Registrador

### Ver usuario por id
**GET** `/api/usuarios/:id`  
**Roles permitidos:** SuperAdmin, Auditor, Registrador

### Crear usuario
**POST** `/api/usuarios`  
**Roles permitidos:** SuperAdmin

**Body de ejemplo:**
```json
{
  "username": "auditor1",
  "email": "auditor1@correo.com",
  "password": "Auditor1234!",
  "rol": "Auditor"
}
```

### Actualizar usuario
**PUT** `/api/usuarios/:id`  
**Roles permitidos:** SuperAdmin

**Body de ejemplo:**
```json
{
  "username": "auditor1edit",
  "email": "auditor1edit@correo.com",
  "password": "NuevaClave123!",
  "rol": "Auditor"
}
```

### Eliminar usuario
**DELETE** `/api/usuarios/:id`  
**Roles permitidos:** SuperAdmin

---

## Autenticación de la API

La autenticación se realiza mediante **JWT**.

### Flujo de autenticación
1. El usuario hace login.
2. El servidor valida las credenciales.
3. Si son correctas, genera un token JWT.
4. El token se guarda en una cookie HttpOnly llamada `token`.
5. Las rutas protegidas leen esa cookie y validan el token antes de permitir acceso.

---

## Cómo probar la API en Postman

### Paso 1. Hacer login
Realizar primero:

**POST** `http://localhost:3000/api/auth/login`

**Header requerido:**
```text
Origin: http://localhost:3000
```

**Body de ejemplo:**
```json
{
  "username": "andrea",
  "password": "Admin1234!"
}
```

### Paso 2. Verificar cookies
Después del login, Postman debe guardar cookies como:
- `token`
- `ultima_actividad`

### Paso 3. Probar endpoints protegidos
Para peticiones `POST`, `PUT` y `DELETE`, agregar este header:

```text
Origin: http://localhost:3000
```

Esto es necesario por la validación CSRF implementada en backend.

---

## Validaciones importantes

### Productos
- `codigo` obligatorio y alfanumérico
- `nombre` obligatorio
- `cantidad` mayor o igual a 0
- `precio` mayor o igual a 0

### Usuarios
- `username` obligatorio
- `email` obligatorio y con formato válido
- `password` mínima de 8 caracteres
- `rol` debe ser válido dentro de los roles definidos

---

## Información mostrada en usuarios

El módulo de usuarios permite consultar información como:
- username
- email
- rol
- último login
- IP del último login

Esto facilita la trazabilidad y el control administrativo del sistema.

---

## Documentación de la API

La documentación de la API puede entregarse mediante una **colección de Postman exportada en formato JSON**, organizada por módulos:

- Auth
- Productos
- Usuarios
- Auditoría

---

## Estado actual del proyecto

Actualmente el sistema cuenta con:

- autenticación funcional
- CRUD de productos
- CRUD de usuarios
- control de acceso por roles
- logs de auditoría
- frontend básico para login y productos
- protección CSRF
- pruebas funcionales realizadas desde Postman y desde interfaz web

---

## Notas importantes

- El sistema utiliza cookies HttpOnly para mayor seguridad en el manejo del JWT.
- Las rutas protegidas no pueden consumirse sin autenticación válida.
- Las operaciones de escritura requieren validación de origen como protección CSRF.
- El proyecto está preparado para correr localmente mediante Docker Compose.

---

## Usuarios de prueba

| Username | Password | Rol |
|----------|----------|-----|
| admin | Admin1234! | SuperAdmin |
| auditor | Auditor1234! | Auditor |
| registrador | Registrador1234! | Registrador |

> Nota: si estos usuarios no existen en la base de datos local, pueden crearse manualmente mediante el endpoint de registro o desde el módulo de usuarios con un SuperAdmin.

---

## Autores

Proyecto desarrollado por el equipo del curso **ISW-1013 Calidad del Software**  
Universidad Técnica Nacional - I Cuatrimestre 2026
