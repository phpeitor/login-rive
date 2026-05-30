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

## Variables de entorno

En un frontend estático el navegador no puede leer un `.env` directamente. Por eso en este proyecto usamos `js/google-config.js` como puente de configuración.

La idea es:

- guardar tu valor real en `.env` durante desarrollo o en tu sistema de despliegue;
- inyectarlo después en `js/google-config.js` o generar ese archivo desde tu backend/build step;
- nunca dejar el `client_id` hardcodeado en código de producción si vas a automatizar el despliegue.

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
<script src="./js/google-config.js"></script>
```

### 2) `js/app.js`

Crear la inicialización del botón y el callback de credential.

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
  });

  window.google.accounts.id.renderButton(
    document.querySelector('.btn-google'),
    {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'pill',
      width: 380,
    }
  );
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

Tienes dos opciones:

### Opción A: usar el botón visual que ya tienes

- Mantienes tu botón actual.
- Al hacer clic, disparas `google.accounts.id.prompt()`.
- Es útil si quieres conservar la UI personalizada.

### Opción B: renderizar el botón oficial de Google

- Google dibuja el botón real.
- Es más seguro para cumplir branding/UI.
- Es lo más recomendado si vas a producción.

## Recomendación técnica

Para un proyecto serio usa esta arquitectura:

- frontend: solo captura el token;
- backend: valida el token;
- backend: crea la sesión del usuario;
- frontend: redirige al dashboard.

Nunca confíes solo en el token del frontend.

## En este proyecto

El botón actual `Continue with Google` puede ser el disparador visual, pero la lógica real debería vivir así:

- `index.html`: carga el script de Google;
- `js/app.js`: inicializa Google Sign-In;
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

- `js/google-config.js` para el `client_id`;
- `index.html` cargando el script de Google;
- `js/app.js` inicializando GIS y mostrando el nombre de la cuenta en un `alert`.

## Siguiente paso sugerido

Si vas a seguir con este proyecto, lo ideal es que el próximo paso sea:

1. integrar Google Sign-In en frontend;
2. crear endpoint backend para validar el token;
3. conectar ese flujo con el login actual de Rive.
