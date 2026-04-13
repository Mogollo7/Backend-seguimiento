# Guia de rutas y body

## Auth

| Tipo | Ruta                                  | Body                                                                             | Función                        |
| ---- | ------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------- |
| POST | `http://localhost:3000/auth/signup` | `{"username": "ronald123", "email": "ronald@email.com", "password": "123456"}` | Registrar usuario               |
| POST | `http://localhost:3000/auth/signin` | `{"username": "ronald123", "password": "123456"}`                              | Iniciar sesión, devuelve Token |

## Home

| Tipo | Ruta                                         | Body                                                                                                                    | Notas                           |
| ---- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| POST | `http://localhost:3000/home/AnadirIngreso` | `{"categoria": "Activo", "descripcion": "Salario mensual", "valor": 2500000, "fecha": "2026-04-13"}` (fecha opcional) | Requiere token. Fecha opcional. |
| POST | `http://localhost:3000/home/AnadirGasto`   | `{"categoria": "Compras", "descripcion": "Compra hogar", "valor": 50000, "fecha": "2026-04-13"}` (fecha opcional)     | Requiere token. Fecha opcional. |

| Tipo | Ruta                                       | Respuesta                               | Notas           |
| ---- | ------------------------------------------ | --------------------------------------- | --------------- |
| GET  | `http://localhost:3000/home/VerSaldo`    | `{totalIngresos, totalGastos, saldo}` | Requiere token. |
| GET  | `http://localhost:3000/home/VerIngresos` | Array de todos los ingresos del usuario | Requiere token. |
| GET  | `http://localhost:3000/home/VerGastos`   | Array de todos los gastos del usuario   | Requiere token. |
| GET  | `http://localhost:3000/home/VerTodo`     | `{ingresos: [], gastos: []}`          | Requiere token. |

## Informe

| Tipo | Ruta                                                   | Respuesta                                                                                 | Notas                                                          |
| ---- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| GET  | `http://localhost:3000/home/informe/mes/1?year=2023` | `{year, month, ingresos: [], gastos: [], totalIngresos, totalGastos, saldo}`            | Requiere token. Mes de 1 a 12. Año opcional en `?year=`.    |
| GET  | `http://localhost:3000/home/informe/semana/15`       | `{week, year, start, end, ingresos: [], gastos: [], totalIngresos, totalGastos, saldo}` | Requiere token. Semana de 1 a 53. Año opcional en `?year=`. |
| GET  | `http://localhost:3000/home/informe/anio/2026`       | `{year, ingresos: [], gastos: [], totalIngresos, totalGastos, saldo}`                   | Requiere token.                                                |
| GET  | `http://localhost:3000/home/informe/categoria`       | `{ingresosPorCategoria, gastosPorCategoria}`                                            | Requiere token.                                                |

## Profile

| Tipo | Ruta                               | Body     | Notas                                                  |
| ---- | ---------------------------------- | -------- | ------------------------------------------------------ |
| GET  | `http://localhost:3000/profile/` | Sin body | Requiere token. Retorna datos del usuario autenticado. |

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

### Gasto

```javascript
{
  categoria: { type: String, required: true, enum: ['Compras', 'Alimentos', 'Telefono', 'Educacion', 'Salud'] },
  subcategoria: { type: String, enum: ['Hogar', 'Mercado', 'Otros'] },
  descripcion: { type: String, required: true },
  valor: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}
```

## Notas importantes

- Para rutas que requieren autenticación, incluir access token en header: `Authorization: Bearer <accessToken>`
- Los valores de categorías permitidas:
  - **Ingreso**: "Pasivo", "Activo"
  - **Gasto**: "Compras", "Alimentos", "Telefono", "Educacion", "Salud"
- El campo `id_user` se obtiene automáticamente del token, no se incluye en el body de POST
- El campo `fecha` es opcional en POST; si no se proporciona, usa la fecha actual
- La ruta `POST /home/AnadirGasto` no usa `subcategoria` en el body actualmente, solo `categoria`, `descripcion`, `valor` y `fecha`
- Las rutas de informe filtran por el usuario autenticado
- Los informes de mes/semana usan el año actual si no se especifica
