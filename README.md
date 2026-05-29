# Demo local de login con Rive

Pequeño proyecto demo que muestra un formulario de login con animaciones hechas en Rive. Está pensado para servirse desde un servidor local (por ejemplo Apache) y para desarrollo rápido.

## Estructura del proyecto

- `index.html` — página principal del demo.
- `css/` — hojas de estilo (p. ej. `css/styles.css`).
- `js/` — scripts de la app y runtime (p. ej. `js/app.js`, `js/rive.js`).
- `resources/` — archivos `.riv` y otros recursos de animación.

Ejemplo de archivos en esta copia:

- `index.html`
- `css/styles.css`
- `js/app.js`, `js/rive.js`
- `resources/marty_purple_loop.riv`, `resources/reactions_v3.riv`, `resources/popout.riv`

## Qué hace cada parte

- `login.html`: carga los estilos y los scripts desde `css/` y `js/`, y contiene el markup del formulario y el contenedor donde se renderiza Rive.
- `css/styles.css`: estilos del layout, clases de estado (`is-error`, `is-success`) y reglas responsivas.
- `js/app.js`: inicializa el runtime de Rive (desde `js/rive.js`), crea la instancia y controla los estados del login.
- `js/rive.js`: runtime JavaScript de Rive incluido en el repositorio.
- `resources/*.riv`: archivos de animación usados por la demo.

## Flujo de carga (resumen)

1. Abrir `index.html` mediante servidor local (p. ej. http://localhost/login-rive/index.html).
2. `login.html` carga `js/rive.js` y `js/app.js`.
3. `js/app.js` crea la instancia de Rive y carga un `.riv` desde `resources/`.
4. Las interacciones del formulario disparan cambios visuales (clases CSS o llamadas a la API de Rive).

## Cómo cambiar la animación

En `js/app.js` actualiza la ruta al `.riv` que quieras usar, por ejemplo:

```js
src: './resources/marty_purple_loop.riv'
```

Si agregas nuevos archivos a `resources/`, referencia la ruta relativa desde `login.html` o `js/app.js`.

## Buenas prácticas recomendadas

- Mantén una sola instancia de Rive por página y controla estados vía clases CSS o state machines.
- Separa responsabilidades: estilos en `css/`, lógica en `js/`, assets en `resources/`.
- Asegura que la versión del runtime (`js/rive.js`) sea compatible con los `.riv` que uses.

Para reglas y convenciones de frontend, consulta `REGLAS_FRONTEND.md`.

## Desarrollo local

1. Sirve el proyecto con tu servidor local (Apache, `live-server`, etc.).
2. Abre `http://localhost/.../index.html`.
3. Edita `css/styles.css` y `js/app.js` y recarga para ver cambios.

## Archivos relacionados

- [index.html](index.html)
- [js/app.js](js/app.js)
- [css/styles.css](css/styles.css)
- [js/rive.js](js/rive.js)
- [resources/](resources/)
