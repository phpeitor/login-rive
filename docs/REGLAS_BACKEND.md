# Reglas y convenciones de Backend

Documento breve con normas prácticas para la parte server-side del proyecto.

1. Objetivo
   - Mantener fuera del frontend cualquier secreto, credencial o lógica de validación sensible.
   - Exponer al navegador solo datos públicos y necesarios para inicializar la UI.

2. Variables de entorno
   - Guardar credenciales en `.env` cuando el backend las necesite.
   - No subir secretos al repositorio.
   - Si el proyecto es simple, `parse_ini_file()` puede ser suficiente para leer un `.env` de pares clave-valor.
   - Si el backend crece, usar Composer con `vlucas/phpdotenv` para cargar variables de entorno de forma más robusta.

3. Seguridad
   - No enviar `client_secret` al frontend.
   - Validar tokens de Google en servidor antes de crear sesión o confiar en el usuario.
   - Evitar hardcodear orígenes, endpoints o credenciales dentro de archivos públicos.

4. Organización
   - Mantener scripts PHP en una carpeta dedicada como `php/`.
   - No mezclar lógica PHP con scripts del frontend dentro de `js/`.
   - Separar archivos de puente/configuración de endpoints reales si el proyecto crece.

5. Flujo recomendado para Google Sign-In
   - Frontend recibe el `credential`.
   - Backend valida el token con Google.
   - Backend crea sesión o responde con el perfil del usuario.
   - Frontend solo muestra el estado final.

6. Calidad
   - Validar sintaxis PHP antes de publicar cambios.
   - Mantener mensajes y respuestas del backend simples y predecibles.
   - Documentar cualquier variable nueva en el README o en una guía específica.