
# Features 

```ts
inquilinos/
  paginas/                   componentes con ruta (P#)
    registrar/               P1
    lista/                   P2
    detalle/                 P3
    editar/                  P4
  componentes/               piezas reutilizables dentro del feature
    formulario-inquilino/    lo usan P1 y P4
    tarjeta-inquilino/
  servicios/
  modelos/
  rutas
```

# Global

```ts
proyecto/
  src/
    app/
      core/
        config/              URL de la API, constantes
        guards/              F10
        interceptores/       F10 (token, errores)
        sesion/              F10
      shared/
        componentes/         tabla, confirmar, mensaje de error
        pipes/               formato de fechas y montos
        directivas/          si se necesitan
        modelos/             tipos comunes (paginación, error de la API)
      layout/                estructura fija: menú lateral, barra superior
      features/
        inquilinos/  locales/  contratos/
        garantia/  cuotas/  consumos/  dashboard/
      app.ts / .html / .css  componente raíz
      app.config             configuración general de la app
      app.routes             rutas globales
    environments/            URL de la API por entorno (F10/F11)
    index.html
    main.ts
    styles.css               estilos globales
  public/                    imágenes, íconos
  angular.json               configuración del proyecto
  package.json               dependencias
  tsconfig.json
```