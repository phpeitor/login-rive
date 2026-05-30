# Contexto de trabajo con Rive

## Qué ya quedó resuelto en este proyecto

- El login usa `index.html` como entrada principal.
- El runtime de Rive se carga desde `js/rive.js` y el WASM desde `resources/rive.wasm`.
- El personaje base se reproduce desde `resources/marty_purple_loop.riv`.
- El estado `success` usa `resources/animate-success.riv` y se deja vivir sin volver al loop base.
- El estado `error` mantiene feedback visual separado del flujo de éxito.
- La validación de inputs vacíos no dispara alertas ni animación de error.
- Se usa Alertify para notificaciones `success` y `error`.

## Lección importante

No basta con descargar un archivo `.riv` y mostrarlo. Un asset de Rive puede incluir:

- artboards;
- animaciones;
- state machines;
- inputs como triggers, booleans o números.

Para que un archivo se mueva como en el preview de Rive, hay que identificar la estructura correcta y reproducirla en el runtime.

## Qué aprendimos con `animate-success.riv`

- El archivo no era una simple animación estática.
- Exponía un state machine llamado `Reload`.
- El comportamiento visible dependía de activar ese state machine y sus inputs.
- Cambiar solo el `src` no era suficiente para obtener el mismo movimiento.

## Flujo recomendado para futuros assets Rive

1. Descargar el archivo `.riv` y guardarlo en `resources/`.
2. Inspeccionar qué expone el archivo:
   - artboard;
   - animation;
   - state machine;
   - inputs.
3. Probar primero en el navegador local con la instancia real del proyecto.
4. Reproducir el asset con la configuración correcta:
   - `artboard` si el preview depende de una vista concreta;
   - `animations` si es una animación lineal;
   - `stateMachines` si la interacción depende de inputs.
5. Solo después ajustar escala, zoom o timing visual en CSS/JS.

## Pasos a seguir para nuevos logins o webs con Rive

- Mantener una estructura clara:
  - `index.html` para el markup;
  - `css/` para estilos;
  - `js/` para la lógica;
  - `resources/` para assets.
- Separar estados de UI:
  - `idle`;
  - `error`;
  - `success`.
- Probar cada asset Rive en local antes de asumir que el preview web va a coincidir.
- Evitar sobre-escalar el canvas; primero privilegiar nitidez.
- Si un archivo se ve estático, revisar en este orden:
  1. artboard activo;
  2. animation name;
  3. state machine name;
  4. inputs del state machine;
  5. fit/alignment del canvas.

## Convenciones para próximos proyectos

- Usar nombres descriptivos para los recursos Rive.
- Documentar en cada proyecto qué archivo controla cada estado.
- Guardar una nota del nombre del artboard y del state machine si el asset depende de interacción.
- No mezclar demasiadas transformaciones CSS con la animación si priorizamos nitidez.

## Estado actual del demo

- El login ya tiene base de UX moderna.
- La animación del personaje está conectada a estados reales.
- El flujo visual ya está preparado para seguir iterando en más páginas y más logins.

## ¿Rive sigue siendo moderno?

Sí. Rive sigue siendo una opción moderna y vigente para motion UI, personajes, loaders y estados interactivos.

Es especialmente útil cuando quieres:

- animaciones ligeras en frontend;
- control por estados;
- assets reutilizables en distintas pantallas;
- una experiencia más viva que un GIF o SVG animado simple.

No es la única herramienta de motion UI, pero sí sigue siendo una muy buena elección cuando necesitas interacción real, respuesta visual y control desde código.

## Siguiente paso recomendado

Antes de crear otro login o web con Rive:

- definir estados UX;
- listar assets necesarios;
- revisar si cada `.riv` usa animación o state machine;
- validar la escala visual en local;
- documentar el nombre exacto del artboard o inputs si existen.
