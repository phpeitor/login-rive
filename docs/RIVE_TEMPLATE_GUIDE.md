# Guía de plantilla para personajes Rive

## Objetivo

Esta guía sirve para preparar un personaje base en Rive que luego puedas reutilizar en distintos logins o sitios cambiando solo el logo, colores y algunos estados visuales por cliente.

## Qué conviene editar en la app de Rive

Si quieres que el personaje sea reutilizable por cliente, lo ideal es preparar el archivo `.riv` como plantilla:

- separar la camiseta o prenda principal en una capa independiente;
- dejar el logo como un elemento reemplazable;
- usar colores controlados por inputs o estados;
- mantener un artboard base común;
- definir animaciones o state machines para `idle`, `error` y `success`.

## Flujo recomendado en Rive

1. Abrir el personaje en la app de Rive.
2. Organizar los elementos que quieras cambiar por cliente:
   - camiseta;
   - logo;
   - colores secundarios;
   - fondos o accesorios.
3. Revisar si esos elementos pueden exponerse como:
   - imágenes reemplazables;
   - artboards separados;
   - state machines con inputs;
   - animaciones independientes.
4. Exportar el `.riv` ya preparado para que desde código solo cambies datos por cliente.

## Qué se cambia por código y qué no

### Se puede cambiar desde código

- qué archivo `.riv` se carga;
- qué artboard se usa, si el asset lo soporta;
- qué animation/state machine se reproduce;
- valores de inputs del state machine, si fueron preparados en Rive;
- imágenes externas al `.riv`, como logos en el layout HTML.

### Normalmente se cambia en la app de Rive

- la estructura interna del personaje;
- partes dibujadas que no fueron separadas como capas o assets;
- reemplazo real de elementos internos que no fueron definidos como editables.

## Sobre el archivo `.wasm`

El archivo `.wasm` es el runtime compilado que el navegador usa para ejecutar las animaciones de Rive.

En este proyecto sirve para:

- interpretar el archivo `.riv`;
- ejecutar artboards, animaciones y state machines;
- renderizar el personaje en el canvas;
- mantener el comportamiento del asset en el navegador.

### Importante

El `.wasm` no es el archivo que diseñas visualmente. Es el motor que corre la animación.

No se suele editar a mano.

## ¿Hay extensión para verlo en VS Code?

Sí, pero con una limitación clara: una extensión de VS Code puede ayudarte a **inspeccionar el archivo binario**, no a editarlo como diseño.

Extensión útil para ver el archivo de forma binaria:

- `qiaojie.binary-viewer`

Eso te permite abrir el `.wasm` o cualquier binario en formato hexadecimal, pero no te mostrará una vista editable del contenido de Rive.

## Extensión para `.riv`

Para revisar un `.riv` dentro de VS Code, la extensión más útil es:

- `ronba.vscode-rive-viewer`

Sirve para previsualizar archivos `.riv`, pero la edición real sigue haciéndose en la app de Rive.

## Recomendación práctica para próximos proyectos

- Usa Rive para preparar el personaje template.
- Usa HTML/CSS/JS para logo, textos, colores del layout y cliente activo.
- Guarda logos por cliente en `resources/` o en una carpeta de assets.
- Mantén una convención clara de nombres:
  - `client-a-logo.png`
  - `client-b-logo.png`
  - `client-c-logo.png`
- Documenta en cada proyecto qué parte se cambia en Rive y qué parte se cambia por código.

## Siguiente paso

Si quieres, el siguiente documento que puedo crear es un `RIVE_CLIENT_TEMPLATE.md` con una propuesta concreta de estructura para que tengas una base reutilizable por cliente.
