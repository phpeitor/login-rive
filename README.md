# Login Rive ®️
[![forthebadge](https://forthebadge.com/badges/made-with-javascript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/badges/built-with-love.svg)](https://www.linkedin.com/in/drphp/)

<a href="https://www.instagram.com/amvsoft.tech/" target="_blank">
  <img src="https://www.nepaltraveladventure.com/blog/wp-content/uploads/2020/12/download-1.png" alt="Instagram" width="600">
</a>

Demo local de login UI animado con Rive y autenticación Google, enfocado en estados visuales y experiencia de usuario.

## Qué incluye

- Animación principal con Rive.
- Botón nativo de Google Identity Services.
- Botón personalizado que usa flujo OAuth server-side.
- Manejo de sesión con contador visible.
- Validación demo del formulario local.

## Requisitos

- PHP 8.0 o superior.
- Composer.
- Apache, Nginx o cualquier servidor capaz de ejecutar PHP.
- Un OAuth Client ID de Google configurado para navegador web.

## Levantar el proyecto

1. Clona o copia el proyecto en tu servidor local.
2. Instala dependencias PHP:

```bash
composer install
```

3. Configura el archivo `.env` en la raíz del proyecto:

```env
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_SECRET_KEY=tu_client_secret
SESSION_LIFETIME=60
```

4. En Google Cloud Console agrega:
- Authorized JavaScript origins: `http://127.0.0.1` y/o `http://localhost`
- Authorized redirect URIs: `http://127.0.0.1/login-rive/php/oauth-callback.php` y/o `http://localhost/login-rive/php/oauth-callback.php`

5. Abre el proyecto en el navegador:

```text
http://127.0.0.1/login-rive/
```

## Flujo de uso

1. `index.html` carga el runtime de Rive, Alertify y la configuración PHP de Google.
2. `php/google-config.php` expone `GOOGLE_CLIENT_ID` al frontend.
3. `js/app.js` inicializa el botón nativo y el botón personalizado.
4. El flujo nativo valida el token en frontend y crea sesión vía backend.
5. El flujo personalizado redirige a `php/oauth-start.php` y vuelve por `php/oauth-callback.php`.
6. `php/session.php` devuelve el estado actual de la sesión y el tiempo restante.
7. `php/logout.php` destruye la sesión al expirar el tiempo configurado.

## Estructura principal

- `index.html`: entrada principal.
- `css/styles.css`: estilos y estados visuales.
- `js/app.js`: lógica de UI, Google auth y sesión.
- `js/rive.js`: runtime de Rive.
- `php/bootstrap.php`: bootstrap común para Composer y `.env`.
- `php/google-config.php`: expone `GOOGLE_CLIENT_ID` al navegador.
- `php/oauth-start.php`: inicia OAuth server-side.
- `php/oauth-callback.php`: procesa el callback y crea sesión.
- `php/validate-google.php`: valida el token del flujo nativo.
- `php/session.php`: consulta la sesión activa.
- `php/logout.php`: destruye la sesión.
- `resources/`: animaciones y assets.

## Archivos PHP actuales

- `php/bootstrap.php`
- `php/google-config.php`
- `php/oauth-start.php`
- `php/oauth-callback.php`
- `php/validate-google.php`
- `php/session.php`
- `php/logout.php`

## Notas

- El `.env` ahora se carga con Composer usando `vlucas/phpdotenv`.
- Si cambias la duración de sesión, ajusta `SESSION_LIFETIME`.
- Si el contador no coincide con tu login, cierra sesión y vuelve a entrar para regenerar `expires_at`.
- Mantén sincronizados `resources/rive.wasm` y `js/rive.js`.

## Comandos útiles

```bash
php -S 127.0.0.1:8000
```

Si usas Apache local, basta con abrir el proyecto desde `http://127.0.0.1/login-rive/`.