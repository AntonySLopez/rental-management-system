# Lección 1: Visión General del Sistema

## Objetivo del Sistema
Sistema de Gestión de Alquileres para propiedades comerciales que automatiza la administración de contratos, control de pagos (alquiler y servicios), gestión de garantías y seguimiento de deudas.

## Actores
- **Administrador**: Gestiona inquilinos, propiedades, contratos y pagos
- **Inquilino**: Persona que alquila un local comercial
- **Sistema**: Procesa automáticamente cuotas, estados y cálculos

## Entidades Principales

### Entidades Core
- **Inquilino**: Persona que alquila propiedades
- **Propiedad**: Inmueble principal que contiene locales
- **Local**: Unidad comercial dentro de una propiedad
- **Contrato**: Acuerdo de alquiler entre inquilino y local

### Entidades Financieras
- **Cuota Alquiler**: Pagos mensuales del alquiler
- **Consumo Luz**: Registro de consumo eléctrico
- **Movimiento**: Registro transaccional de pagos
- **Aplicación Pago Alquiler**: Distribución de pagos a cuotas
- **Aplicación Pago Luz**: Distribución de pagos a consumo
- **Garantía**: Depósito de seguridad del contrato

### Entidades de Configuración
- **Estado General**: Activo/Inactivo
- **Estado Contrato**: Activo, Finalizado, Cerrado, Renovado
- **Estado Deuda**: Pendiente, Parcial, Pagado, Atrasado, Activado
- **Estado Garantía**: Retenida, Devuelta, Aplicada a Deuda
- **Método Pago**: Efectivo, Yape, Depósito

## Reglas de Negocio Inferidas

1. **Gestión de Contratos**: Un contrato vincula un inquilino con un local específico por una duración definida
2. **Cuotas Automáticas**: Al crear un contrato, se generan automáticamente las cuotas mensuales
3. **Pagos Distribuibles**: Un pago puede aplicarse parcialmente a múltiples cuotas o consumos
4. **Control de Garantías**: Las garantías pueden ser retenidas, devueltas o aplicadas a deudas pendientes
5. **Estados de Deuda**: Las cuotas y consumos tienen estados que reflejan su situación de pago
6. **Servicios Independientes**: El consumo de luz se gestiona independientemente del alquiler
7. **Historial de Movimientos**: Todos los pagos se registran con su método y referencia
8. **Propiedades Jerárquicas**: Las propiedades contienen múltiples locales

## Estados del Sistema

### Estados de Contrato
- **activo**: Contrato vigente y en curso
- **finalizado**: Contrato completó su duración normal
- **cerrado**: Contrato terminado anticipadamente
- **renovado**: Contrato fue renovado (vinculado a nuevo contrato)

### Estados de Deuda
- **pendiente**: Deuda no pagada, vencimiento futuro
- **parcial**: Deuda pagada parcialmente
- **pagado**: Deuda completamente cancelada
- **atrasado**: Deuda vencida y no pagada
- **activado**: Deuda activada para cobro

### Estados de Garantía
- **retenida**: Garantía retenida por el propietario
- **devuelta**: Garantía devuelta al inquilino
- **aplicada_a_deuda**: Garantía aplicada para cubrir deudas pendientes
