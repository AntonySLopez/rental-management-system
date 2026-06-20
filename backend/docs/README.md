# Documentación - Sistema de Gestión de Alquileres

Esta carpeta contiene la documentación completa del sistema de gestión de alquileres.

## Estructura

```
docs/
└── backend/          # Documentación del backend
    ├── README.md                    # Índice y guía rápida
    ├── leccion-1-vision-general.md  # Objetivo, actores, entidades y reglas de negocio
    ├── leccion-2-arquitectura-backend.md  # Flujo Route → Controller → DTO → Service → Repository → Database
    ├── leccion-3-estructura-carpetas.md    # Estructura de carpetas y módulos
    ├── leccion-4-casos-uso-crud.md         # Casos de uso CRUD principales
    ├── leccion-5-flujo-interno.md          # Flujo interno de cada caso de uso
    └── leccion-6-middlewares-config.md     # Middlewares, configuración e infraestructura
```

## Stack Tecnológico

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.2.1
- **Lenguaje**: TypeScript 6.0.3
- **Base de Datos**: PostgreSQL 8.21.0
- **Validación**: Zod 4.4.3
- **Package Manager**: pnpm 10.7.1

### Frontend
- **Framework**: Astro (en desarrollo)

## Inicio Rápido

### Backend
```bash
cd backend
pnpm install
pnpm dev
```

### Variables de Entorno
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=rental_management
```

## Documentación por Lección

### Lección 1: Visión General del Sistema
- Objetivo del sistema
- Actores involucrados
- Entidades principales (Core, Financieras, Configuración)
- Reglas de negocio inferidas
- Diagrama entidad-relación simplificado
- Estados del sistema

### Lección 2: Arquitectura Backend
- Flujo de datos completo
- Componentes por capa (Routes, Controllers, DTOs, Services, Repositories, Database)
- Flujo completo de ejemplo (Crear Contrato)
- Patrón de transacciones
- Separación de responsabilidades
- Beneficios de la arquitectura

### Lección 3: Estructura de Carpetas y Módulos
- Estructura actual del proyecto
- Módulos sugeridos por entidad
- Convenciones de nomenclatura
- Dependencias entre módulos
- Módulos de infraestructura

### Lección 4: Casos de Uso CRUD Principales
- Casos de uso por módulo (Inquilinos, Propiedades, Contratos, Pagos, Garantías, Deudas, Consumo Luz)
- DTOs de entrada
- Efectos secundarios
- Matriz de componentes por caso de uso
- Códigos de estado HTTP
- Errores comunes

### Lección 5: Flujo Interno de Casos de Uso
- Flujo detallado paso a paso:
  - Crear Contrato
  - Registrar Pago
  - Consultar Deuda
  - Gestionar Garantía
  - Registrar Consumo de Luz
- Resumen de patrones (Creación, Lectura, Actualización)

### Lección 6: Middlewares, Configuración e Infraestructura
- Middlewares (Global de errores, Parsing JSON)
- Configuración (Variables de entorno, Base de datos)
- Infraestructura (Stack tecnológico, Scripts, TypeScript)
- Ciclo de vida de request
- Manejo de transacciones
- Monitoreo y logging
- Seguridad
- Despliegue

## Endpoints Implementados

- `POST /inquilino/registrar` - Registrar inquilino
- `POST /propiedad/registrar` - Registrar propiedad
- `POST /local/registrar` - Registrar local
- `POST /contrato/crear` - Crear contrato
- `POST /contrato/renovar` - Renovar contrato
- `POST /contrato/cerrar` - Cerrar contrato
- `POST /deuda/consultar` - Consultar deudas
- `POST /pago/registrar` - Registrar pago
- `POST /luz/registrar/consumo` - Registrar consumo luz
- `POST /garantia/devolver` - Devolver garantía
- `POST /garantia/aplicar` - Aplicar garantía a deuda

**Nota**: Actualmente todos los endpoints implementados son POST. Los endpoints GET, PUT, DELETE están pendientes de implementación.

## Estado del Proyecto

### Backend
✅ Completado y funcional
- Todos los módulos implementados
- Arquitectura definida
- Validación de datos implementada
- Gestión de transacciones activa

### Frontend
🚧 En desarrollo
- Framework seleccionado: Astro
- Por definir: componentes, estado, integración con API

## Recursos Adicionales

- [Esquema de Base de Datos](../backend/src/database/CONTROL_ALQUILER.sql)
- [Package.json Backend](../backend/package.json)
- [TypeScript Config](../backend/tsconfig.json)
