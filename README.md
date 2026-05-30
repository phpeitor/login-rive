# Login Rive ®️
[![forthebadge](https://forthebadge.com/badges/made-with-javascript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/badges/built-with-love.svg)](https://www.linkedin.com/in/drphp/)

<a href="https://www.instagram.com/amvsoft.tech/" target="_blank">
  <img src="https://www.nepaltraveladventure.com/blog/wp-content/uploads/2020/12/download-1.png" alt="Instagram" width="600">
</a>

Demo local de login UI animado con Rive, enfocado en UX visual para estados de autenticación (`idle`, `error`, `success`).

## Objetivo

Este proyecto muestra cómo integrar una animación `.riv` con un formulario de login en frontend puro (HTML, CSS y JavaScript), incluyendo:

- validación visual de campos;
- feedback de error y éxito con animaciones del personaje;
- notificaciones con Alertify para mensajes de resultado.

## Estructura del proyecto

- `index.html`: entrada principal del demo.
- `css/styles.css`: estilos, layout y animaciones UX.
- `js/app.js`: lógica del login demo, validaciones y control de estados.
- `js/rive.js`: runtime JS de Rive.
- `resources/`: archivos de animación y assets visuales.

Contenido relevante actual en `resources/`:

- `marty_purple_loop.riv`
- `reactions_v3.riv`
- `popout.riv`
- `open-in-rive.riv`
- `rive.wasm`
- `rive_logo_black.svg`
- `signin-google.png`

## Cómo funciona

1. `index.html` carga estilos, runtime de Rive y `js/app.js`.
2. `js/app.js` configura la URL local del WASM (`resources/rive.wasm`).
3. Se inicializa una instancia de Rive con `marty_purple_loop.riv`.
4. Al interactuar con el formulario se aplican clases de estado en `.container`:
	 - `is-error`
	 - `is-success`
5. `css/styles.css` traduce esas clases a efectos visuales del personaje y del stage.

## Reglas de validación en el demo

- Si los campos están vacíos:
	- se marcan con borde de error;
	- no se dispara animación de error;
	- no se muestra notificación Alertify.
- Si los campos tienen datos pero no cumplen validación:
	- se dispara estado `error`;
	- se muestra notificación `error`.
- Si el login pasa validación demo:
	- se dispara estado `success` con animación reforzada;
	- se muestra notificación `success`.

Validación demo actual:

- email debe contener `@`
- password debe tener al menos 4 caracteres

## Ejecución local

Sirve el proyecto desde un servidor local (Apache, Nginx, `live-server`, etc.) y abre:

- `http://127.0.0.1/login-rive/`

También funciona con rutas equivalentes como:

- `http://localhost/login-rive/`

## Personalización rápida

### Cambiar animación principal

Edita en `js/app.js`:

```js
src: './resources/marty_purple_loop.riv'
```

### Ajustar intensidad visual de estados

Edita en `css/styles.css`:

- `@keyframes error...` para feedback de error.
- `@keyframes success...` para feedback de éxito.

## Notas técnicas

- Mantén compatibilidad entre `js/rive.js` y `resources/rive.wasm`.
- Usa una sola instancia de Rive por vista para mejor rendimiento.
- Si cambias tamaños de layout, mantén `resizeDrawingSurfaceToCanvas()` en `app.js`.