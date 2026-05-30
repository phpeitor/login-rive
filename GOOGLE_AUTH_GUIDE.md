# Guía de integración Google Sign-In

## Objetivo

Implementar el botón `Continue with Google` usando el flujo oficial de Google Identity Services.

## Importante

Para que esto funcione de verdad necesitas:

- un proyecto en Google Cloud Console;
- OAuth consent screen configurado;
- un `Web Client ID`;
- orígenes autorizados, por ejemplo `http://127.0.0.1` o `http://localhost`.

Sin eso, el botón solo puede quedar preparado a nivel de código.

Ten en cuenta también que en algunos navegadores, especialmente Firefox con restricciones de cookies o sin sesión activa de Google, el flujo puede no mostrar cuentas disponibles hasta que el usuario inicie sesión o permita el acceso necesario.

## Variables de entorno

El navegador no puede leer `.env` directamente. En este proyecto usamos un bridge PHP para leer el archivo `.env` y exponer solo el `GOOGLE_CLIENT_ID` al frontend.

La idea es:

- guardar tu valor real en `.env`;
- servir un archivo PHP que lea ese valor y lo convierta en configuración JavaScript;
- nunca dejar el `client_id` hardcodeado en el frontend.

Implementación actual:

- `php/google-config.php`

Nota sobre Composer:

- para este caso simple, `parse_ini_file()` es suficiente si tu `.env` es solo clave-valor;
- si el proyecto crece, lo recomendable es usar `vlucas/phpdotenv` con Composer.

Archivo de referencia incluido en el proyecto:

- `.env.example`

## Cómo funciona

La implementación recomendada hoy es Google Identity Services:

- carga una librería de Google en el frontend;
- inicializa el cliente con tu `client_id`;
- recibe un credential token en el navegador;
- envía ese token a tu backend para validar y crear sesión.

## Flujo correcto

1. El usuario hace clic en `Continue with Google`.
2. Google abre el selector de cuenta.
3. Google devuelve un `credential` JWT al frontend.
4. El frontend manda ese token a tu backend.
5. Tu backend valida el token con Google.
6. Si todo está bien, creas la sesión del usuario.

## Lo que debes editar en este proyecto

### 1) `index.html`

Agregar el script oficial de Google Identity Services:

```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

Y cargar la configuración antes de `app.js`:

```html
<script src="./php/google-config.php"></script>
```

En el markup puedes usar tu botón visual local como disparador del flujo:

```html
<button type="button" id="btnGoogleLocal" class="btn-google">Continue with Google</button>
```

### 2) `js/app.js`

Crear la inicialización de Google Identity Services y conectar tu botón local al `prompt()`.

Ejemplo base:

```js
function initializeGoogleSignIn() {
  if (!window.google || !window.google.accounts || !window.google.accounts.id) {
    console.warn('Google Identity Services no cargó');
    return;
  }

  window.google.accounts.id.initialize({
    client_id: 'TU_GOOGLE_CLIENT_ID',
    callback: handleGoogleCredentialResponse,
    ux_mode: 'popup',
  });

  document.getElementById('btnGoogleLocal').addEventListener('click', function() {
    window.google.accounts.id.prompt();
  });
}

function handleGoogleCredentialResponse(response) {
  // response.credential contiene el JWT
  console.log('Google credential:', response.credential);
  // en este demo lo decodificamos y mostramos el nombre en un alert
}
```

En este proyecto ya está implementado un callback demo que:

- inicializa Google Identity Services con `GOOGLE_CLIENT_ID`;
- abre el flujo con el botón `Continue with Google`;
- decodifica el JWT del credential;
- muestra un `alert` con el nombre de la cuenta.

## Cómo encajarlo con tu login actual

En este proyecto puedes conservar el botón visual local y usar GIS por detrás con `prompt()`. Si necesitas cumplimiento visual estricto de Google, cambia luego a `renderButton()`.

## Recomendación técnica

Para un proyecto serio usa esta arquitectura:

- frontend: solo captura el token;
- backend: valida el token;
- backend: crea la sesión del usuario;
- frontend: redirige al dashboard.

Nunca confíes solo en el token del frontend.

Si quieres comportamiento más consistente entre Chrome y Firefox, el botón oficial renderizado por Google suele ser más estable que depender solo de `prompt()`.

## En este proyecto

El botón actual `Continue with Google` puede ser el disparador visual, pero la lógica real debería vivir así:

- `index.html`: carga el script de Google;
- `js/app.js`: inicializa Google Sign-In y dispara `prompt()` desde tu botón local;
- `backend`: valida el JWT y autentica.

## Qué necesito para implementarlo completo

Si quieres que yo te lo deje listo dentro del proyecto, necesito:

- tu `GOOGLE_CLIENT_ID`;
- confirmar si quieres el botón oficial de Google o mantener el botón actual;
- decirme cuál será el backend:
  - Node.js;
  - PHP;
  - otro.

## Estado actual en este repo

Ya quedó un flujo de demo frontend con:

- `php/google-config.php` para el `client_id`;
- `index.html` cargando el script de Google;
- `js/app.js` inicializando GIS y mostrando el nombre de la cuenta en un `alert`.

## Siguiente paso sugerido

Si vas a seguir con este proyecto, lo ideal es que el próximo paso sea:

1. integrar Google Sign-In en frontend;
2. crear endpoint backend para validar el token;
3. conectar ese flujo con el login actual de Rive.
