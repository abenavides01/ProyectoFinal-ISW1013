# Proyecto Final ISW-1013 - Aplicación Web Segura

Proyecto 2 del curso Calidad del Software - Universidad Técnica Nacional  
Carrera de Ingeniería del Software | I Cuatrimestre 2026

## Equipo

| Nombre | Rol |
|--------|-----|
| Andrea Benavides Zúñiga | Coordinadora |
| María José Jiménez Morales | Integrante |
| Irella León Vargas | Integrante |

## Stack Tecnológico

- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL
- **ORM:** Sequelize
- **Autenticación:** JWT + bcrypt
- **Seguridad:** Helmet.js, express-rate-limit

## Requisitos previos

- Docker Desktop instalado y corriendo
- Git

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
```
http://localhost:3000
```

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

## Roles del sistema

| Rol | Permisos |
|-----|----------|
| SuperAdmin | Acceso total + logs de auditoría |
| Auditor | Solo lectura |
| Registrador | CRUD de productos |

## Usuarios de prueba

| Username | Password | Rol |
|----------|----------|-----|
| admin | Admin1234! | SuperAdmin |
| auditor | Auditor1234! | Auditor |
| registrador | Registrador1234! | Registrador |

## End Points de Productos y Usuarios

### Productos

## Listar productos
GET /api/productos
## Ver producto por id
GET /api/productos/:id
## Crear producto
POST /api/productos

Body:

{
  "codigo": "P001",
  "nombre": "Teclado Mecánico",
  "descripcion": "Teclado mecánico RGB",
  "cantidad": 10,
  "precio": 25000
}
## Actualizar producto
PUT /api/productos/:id

## Eliminar producto
DELETE /api/productos/:id

### Usuarios

## Listar usuarios
GET /api/usuarios
## Ver usuario por id
GET /api/usuarios/:id
## Crear usuario
POST /api/usuarios
## Actualizar usuario
PUT /api/usuarios/:id
## Eliminar usuario
DELETE /api/usuarios/:id