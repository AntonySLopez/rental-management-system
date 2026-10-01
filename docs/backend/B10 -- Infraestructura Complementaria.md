
---

**Middlewares implementados:**

| Middleware | Propósito |
|---|---|
| Helmet | Headers de seguridad HTTP |
| CORS | Control de acceso por origen |
| Express JSON | Parsing de body a JSON |
| Rate Limiting | Prevenir abuso por IP |
| Verificar Token | Autenticación JWT |
| Autorización por Rol | Permisos por rol de usuario |
| Error Global | Manejo centralizado de errores |

**Orden de ejecución:**
```
1. Helmet
2. CORS
3. Express JSON
4. Rate Limiting
5. Verificar Token
6. Autorización por Rol
7. Routes
8. Error Global
```

**Variables de entorno requeridas:**
```
JWT_SECRET
JWT_EXPIRES_IN
FRONTEND_URL
RATE_LIMIT_WINDOW_MS
RATE_LIMIT_MAX_REQUESTS
LOG_LEVEL
```

---
