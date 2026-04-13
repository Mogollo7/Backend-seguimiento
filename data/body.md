# Guia de rutas y body

## Auth

| Tipo | Ruta                                  | Body                                                                             | Función                                             |
| ---- | ------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------- |
| POST | `http://localhost:3000/auth/signup` | `{"username": "ronald123", "email": "ronald@email.com", "password": "123456"}` | Registrar usuario                                    |
| POST | `http://localhost:3000/auth/signin` | `{"username": "ronald123", "password": "123456"}`                              | Iniciar sesión, devuelve accessToken y refreshToken |

## Home

| Tipo | Ruta                                         | Body                                                                                                                                         | Notas                                                        |
| ---- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| POST | `http://localhost:3000/home/AnadirIngreso` | `{"categoria": "Activo", "descripcion": "Salario mensual", "valor": 2500000, "fecha": "2026-04-13"}` (fecha opcional)                      | `<span style="color:blue">`Requiere token. Fecha opcional. |
| POST | `http://localhost:3000/home/AnadirGasto`   | `{"categoria": "Compras", "subcategoria": "Hogar", "descripcion": "Compra hogar", "valor": 50000, "fecha": "2026-04-13"}` (fecha opcional) | `<span style="color:blue">`Requiere token. Fecha opcional. |

| Tipo | Ruta                                       | Respuesta                                                | Notas                                        |
| ---- | ------------------------------------------ | -------------------------------------------------------- | -------------------------------------------- |
| GET  | `http://localhost:3000/home/VerSaldo`    | `{totalIngresos, totalGastos, saldo}` (requiere token) | `<span style="color:blue">`Requiere token. |
| GET  | `http://localhost:3000/home/VerIngresos` | Array de todos los ingresos del usuario (requiere token) | `<span style="color:blue">`Requiere token. |
| GET  | `http://localhost:3000/home/VerGastos`   | Array de todos los gastos del usuario (requiere token)   | `<span style="color:blue">`Requiere token. |
| GET  | `http://localhost:3000/home/VerTodo`     | `{ingresos: [], gastos: []}` (requiere token)          | `<span style="color:blue">`Requiere token. |

## Informe

| Tipo | Ruta                                                       | Respuesta                                                                                                     | Notas                                                          |
| ---- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| GET  | `http://localhost:3000/home/informe/mes/4`                | `{year, month, ingresos: [], gastos: [], totalIngresos, totalGastos, saldo}` (requiere token)                | Requiere token. Mes de 1 a 12. Año opcional en `?year=`.       |
| GET  | `http://localhost:3000/home/informe/semana/15`            | `{week, year, start, end, ingresos: [], gastos: [], totalIngresos, totalGastos, saldo}` (requiere token)     | Requiere token. Semana de 1 a 53. Año opcional en `?year=`.    |
| GET  | `http://localhost:3000/home/informe/anio/2026`            | `{year, ingresos: [], gastos: [], totalIngresos, totalGastos, saldo}` (requiere token)                       | Requiere token.                                               |
| GET  | `http://localhost:3000/home/informe/categoria`            | `{ingresosPorCategoria, gastosPorCategoria}` (requiere token)                                                | Requiere token.                                               |
| GET  | `http://localhost:3000/home/informe/patrimonio`           | `{activos, pasivos, totalActivo, totalPasivo, patrimonio}` (requiere token)                                 | Requiere token.                                               |

## Profile

| Tipo | Ruta                               | Body     | Notas                                                                               |
| ---- | ---------------------------------- | -------- | ----------------------------------------------------------------------------------- |
| GET  | `http://localhost:3000/profile/` | Sin body | `<span style="color:blue">`Requiere token. Retorna datos del usuario autenticado. |

### User

```javascript
{
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}
```

### Ingreso

```javascript
{
  categoria: { type: String, required: true, enum: ['Pasivo', 'Activo'] },
  descripcion: { type: String, required: true },
  valor: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}
```

### RefreshToken

```javascript
{
  token: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
}
```

## Notas importantes

- Para rutas que requieren autenticación, incluir access token en header: `Authorization: Bearer <accessToken>`
- El access token expira en 1 hora, usar refresh token para obtener uno nuevo vía POST /auth/refresh
- El refresh token expira en 7 días y se guarda en DB para invalidación en logout
- Los valores de categorías permitidas:
  - **Ingreso**: "Pasivo", "Activo"
  - **Gasto**: "Compras", "Alimentos", "Telefono", "Educacion", "Salud"
  - **Subcategoría de Gasto** (opcional): "Hogar", "Mercado", "Otros"
- El campo `id_user` se obtiene automáticamente del token, no se incluye en el body de POST
- El campo `fecha` es opcional en POST; si no se proporciona, usa la fecha actual
- Las rutas de informe filtran por el usuario autenticado
- Los informes de mes/semana usan el año actual si no se especifica
