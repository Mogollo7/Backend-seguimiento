<div align="center">

# Seguimiento-Desarrollo-Web

![JavaScript](https://img.shields.io/badge/JavaScript-yellow?logo=javascript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)

</div>

## **Índice**

1. [**Descripción**](#descripción)
2. [**Instalación**](#instalación)
3. [**Herramientas utilizadas**](#herramientas-utilizadas)
4. [**Uso**](#uso)
   - [**Notas de seguridad**](#notas-de-seguridad)
   - [**Endpoints disponibles**](#endpoints-disponibles)
     - [**Auth**](#auth)
     - [**Home**](#home)
     - [**Informe**](#informe)
     - [**Profile**](#profile)
   - [**Importar datos de prueba**](#importar-datos-de-prueba)
5. [**Arquitectura**](#arquitectura)
6. [**Requisitos**](#requisitos)
7. [**Licencia**](#licencia)
8. [**Autores**](#autores)

## **Descripción**

Este proyecto es un **backend en Node.js** con **Express** y **MongoDB**, creado para la gestión de usuarios, ingresos y gastos. Utiliza **JWT** para proteger rutas y manejar la lógica de finanzas personales.

### Características principales

- **Autenticación con JWT**: El servidor emite un token que debe enviarse en el header `Authorization: Bearer <token>`.
- **Gestión de ingresos y gastos**: Permite crear y consultar ingresos, gastos, saldo y reportes de informe.
- **Protección de rutas**: Las rutas sensibles requieren token válido mediante middleware.
- **Datos de prueba**: Incluye ejemplos en `data/import/` para pruebas de API.

## **Instalación**

### Pasos

**1. Clona el repositorio**

```bash
git clone https://github.com/Mogollo7/Backend-seguimiento.git
```

**2. Entra a la carpeta del proyecto**

> [!IMPORTANT]
> Asegúrate de estar en la carpeta raíz del proyecto.

```bash
cd Backend-seguimiento
```

**3. Instala las dependencias**

```bash
npm install
```

**4. Configura las variables de entorno**

Crea un archivo `.env` en la raíz del proyecto y define al menos estas variables:

```env
MONGO_URI=mongodb://localhost:27017/miapp
JWT_SECRET=tu_secreto_super_seguro
```

**5. Inicia MongoDB**

Puedes usar MongoDB como servicio o iniciar `mongod` manualmente.

**6. Inicia el servidor**

```bash
node server.js
```

**7. Verifica que el servidor esté corriendo**

```
Servidor en puerto 3000
```

## **Herramientas utilizadas**

- **JavaScript**
- **Node.js**
- **Express**
- **MongoDB**
- **Mongoose**
- **jsonwebtoken**
- **bcryptjs**
- **dotenv**

## **Uso**

Para probar el backend, usa una herramienta como **Postman** o **Thunder Client**.

Los archivos de prueba están en `data/import/`:

- `miapp.users.json` — credenciales de prueba.
- `miapp.ingresos.json` — ingresos de ejemplo.
- `miapp.gastos.json` — gastos de ejemplo.

---

### Notas de seguridad

- El token JWT se envía en el header `Authorization: Bearer <token>`.
- Las contraseñas se guardan hasheadas en la base de datos.
- El campo `id_user` se asigna automáticamente desde el token.
- En `POST /home/AnadirGasto`, el body actual no usa `subcategoria`; sólo `categoria`, `descripcion`, `valor` y `fecha`.
- La fecha en POST es opcional; si no se envía, se usa la fecha actual.

---

### Endpoints disponibles

#### Auth

| Acción   | Método  | Endpoint         | Descripción                        |
| --------- | -------- | ---------------- | ----------------------------------- |
| Registrar | `POST` | `/auth/signup` | Registra un usuario y retorna token |
| Login     | `POST` | `/auth/signin` | Inicia sesión y retorna token      |

Ejemplo de registro:

```http
POST http://localhost:3000/auth/signup
Content-Type: application/json

{
  "username": "ronald123",
  "email": "ronald@email.com",
  "password": "123456"
}
```

Ejemplo de login:

```http
POST http://localhost:3000/auth/signin
Content-Type: application/json

{
  "username": "ronald123",
  "password": "123456"
}
```

#### Home

| Acción         | Método  | Endpoint                | Descripción                                |
| --------------- | -------- | ----------------------- | ------------------------------------------- |
| Agregar ingreso | `POST` | `/home/AnadirIngreso` | Crea un ingreso para el usuario autenticado |
| Agregar gasto   | `POST` | `/home/AnadirGasto`   | Crea un gasto para el usuario autenticado   |
| Ver saldo       | `GET`  | `/home/VerSaldo`      | Retorna total ingresos, gastos y saldo      |
| Ver ingresos    | `GET`  | `/home/VerIngresos`   | Lista ingresos del usuario                  |
| Ver gastos      | `GET`  | `/home/VerGastos`     | Lista gastos del usuario                    |
| Ver todo        | `GET`  | `/home/VerTodo`       | Lista ingresos y gastos del usuario         |

Ejemplo de `POST /home/AnadirIngreso`:

```http
POST http://localhost:3000/home/AnadirIngreso
Authorization: Bearer <token>
Content-Type: application/json

{
  "categoria": "Activo",
  "descripcion": "Salario mensual",
  "valor": 2500000,
  "fecha": "2026-04-13"
}
```

Ejemplo de `POST /home/AnadirGasto`:

```http
POST http://localhost:3000/home/AnadirGasto
Authorization: Bearer <token>
Content-Type: application/json

{
  "categoria": "Compras",
  "descripcion": "Compra hogar",
  "valor": 50000,
  "fecha": "2026-04-13"
}
```

#### Informe

| Acción                | Método | Endpoint                                 | Descripción                            |
| ---------------------- | ------- | ---------------------------------------- | --------------------------------------- |
| Informe mensual        | `GET` | `/informe/mes/:mes`                    | Informe de ingresos y gastos por mes    |
| Informe semanal        | `GET` | `/informe/semana/:semana`              | Informe de ingresos y gastos por semana |
| Informe anual          | `GET` | `/informe/anio/:anio`                  | Informe de ingresos y gastos por año   |
| Informe por categoría | `GET` | `/informe/InformeCategoria/:tipo`      | Totales agrupados por categoría (Ingreso o Gasto) |
| Patrimonio             | `GET` | `/informe/PatrimonioList`              | Lista de ingresos y total de ingresos |

#### Profile

| Acción    | Método | Endpoint      | Descripción                                             |
| ---------- | ------- | ------------- | -------------------------------------------------------- |
| Ver perfil | `GET` | `/profile/` | Retorna `username` y `email` del usuario autenticado |

---

### Importar datos de prueba

Los archivos de ejemplo están en `data/import/`. No hay importación automática en el servidor, pero puedes usar estos archivos para cargar datos en tu base de datos o probar solicitudes en Postman.

- `miapp.users.json` contiene usuarios con emails y contraseñas ya hasheadas.
- `users.txt` contiene las mismas credenciales en texto plano para facilidad de prueba sin clave hasheada.

## **Arquitectura**

La estructura del proyecto actual es:

```
Backend-seguimiento/
├── .env                         # Variables de entorno
├── README.md                    # Documentación del proyecto
├── package.json                 # Dependencias y scripts
├── server.js                    # Archivo principal que inicia el servidor
├── data/
│   └── import/
│       ├── miapp.gastos.json    # Gastos de ejemplo (JSON)
│       ├── miapp.ingresos.json  # Ingresos de ejemplo (JSON)
│       ├── miapp.users.json     # Usuarios de ejemplo (JSON)
│       └── users.txt            # Credenciales de prueba
├── middleware/
│   └── auth.js                  # Middleware de autenticación JWT
├── models/
│   ├── Gasto.js                 # Esquema de gastos
│   ├── Ingreso.js               # Esquema de ingresos
│   └── User.js                  # Esquema de usuarios
└── routes/
    ├── auth.js                  # Rutas de autenticación
    ├── home.js                  # Rutas de ingreso/gasto
    ├── informe.js               # Rutas de informes y estadísticas
    └── profile.js               # Ruta de perfil de usuario
```

## **Requisitos**

Asegúrate de tener instalado:

- [Node.js](https://nodejs.org/en)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Postman](https://www.postman.com/downloads/) o [Thunder Client](https://www.thunderclient.com/)

## **Licencia**

Este proyecto está licenciado bajo la **MIT License**.

## Autores

<img src="https://github.com/Mogollo7.png" width="100px;" style="border-radius:50%"><br>
<sub><b>Juan Sebastian Martínez Galeano</b></sub>
</a>

<img src="https://github.com/Brandsete.png" width="100px;" style="border-radius:50%"><br>
<sub><b>Samuel Usma Brand</b></sub>
</a>

<img src="https://github.com/Cesar-csr.png" width="100px;" style="border-radius:50%"><br>
<sub><b>Cesar Alberto Ocampo Raigosa</b></sub>
</a>
