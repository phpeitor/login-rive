# Reglas y convenciones de Frontend

Documento breve con normas prácticas para trabajar en este proyecto frontend.

1. Organización de carpetas
   - `css/`: solo hojas de estilo (no HTML embebido).
   - `js/`: solo scripts (no CSS embebido). Mantén módulos separados cuando el proyecto crezca.
   - `resources/`: assets (archivos `.riv`, imágenes, fuentes). No mezclar lógica aquí.

2. CSS
   - Usar clases con nombres semánticos (BEM opcional): `.login__panel`, `.btn--primary`.
   - Evitar estilos inline. Todas las reglas deben ir en `css/styles.css` u otros archivos en `css/`.
   - Soporte responsive mínimo: mobile-first, breakpoints claros en `styles.css`.

3. JavaScript
   - Mantener la inicialización en `js/app.js`. Extraer utilidades a módulos si crece la base.
   - No manipular estilos directamente desde JS salvo para añadir/quitar clases de estado (`is-error`, `is-success`).
   - Manejar errores de carga de assets (.riv) con fallback visual accesible.

4. Rive y assets
   - Guardar los `.riv` en `resources/` y referenciarlos con rutas relativas desde `js/app.js`.
   - Mantener una sola instancia de Rive por vista; reutilizarla para evitar recargas pesadas.
   - Preload opcional para animaciones críticas; liberar recursos si el componente se desmonta.

5. Accesibilidad (a11y)
   - Formularios accesibles: usar `label` enlazados a `input`, atributos `aria-*` cuando sea necesario.
   - Las animaciones no deben impedir la lectura ni el uso del formulario; respetar `prefers-reduced-motion`.

6. Performance
   - Minimizar trabajo en el hilo principal: evitar reflows innecesarios.
   - Comprimir y optimizar assets cuando sea posible.

7. Formato y calidad
   - Usar linters y formateadores locales si están disponibles (ESLint/Prettier recomendado).
   - Mensajes de commit descriptivos: `feat:`, `fix:`, `chore:`.

8. Integración con backend
   - El frontend no debe leer secretos ni `.env` directamente.
   - La configuración pública puede exponerse desde PHP o backend, pero solo con valores no sensibles.
   - Las rutas de bridge o configuración no deben vivir dentro de `js/` si contienen lógica de servidor.

9. Integración con Google Sign-In
   - Se puede conservar un botón local visual, pero el flujo debe seguir dependiendo de Google Identity Services.
   - Si el navegador no tiene sesión activa o bloquea cookies, dejar que Google maneje el login y mostrar un mensaje claro con Alertify solo si falla la devolución del credential.
   - No depender de `alert()` nativo para el feedback de autenticación.

10. Pruebas manuales rápidas
   - Comprobar en mobile y desktop.
   - Verificar carga de recursos desde `resources/` y comportamiento al fallar la carga.

11. Notas finales
   - Estos son lineamientos mínimos. Para cambios mayores, crear una propuesta y documentarla en el repo.
