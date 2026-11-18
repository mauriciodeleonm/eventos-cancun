# AGENTS.md — Eventos Cancún

Instrucciones para agentes de IA (y cualquier automatización) que trabajen en este código. Para
el flujo de contribución pensado para personas, ve [CONTRIBUTING.md](CONTRIBUTING.md); para el
sistema de diseño visual, [DESIGN.md](DESIGN.md).

## Qué es este proyecto

SPA de React + TypeScript que muestra eventos de la semana y del mes en Cancún. Sin backend
propio: los datos vienen de datos de ejemplo (mock) o de un Google Sheet publicado como CSV. Ver
[README.md](README.md) para la descripción completa y el stack.

## Entorno

Requiere Node.js 24+. Sin ninguna variable de entorno configurada, el proyecto corre con datos de
ejemplo — no se necesita una cuenta de Google ni de Cloudinary para desarrollar o probar cambios.

```bash
npm install
npm run dev          # servidor de desarrollo
```

## Comandos

```bash
npm run build        # build de producción (incluye verificación de tipos)
npm run test:run     # pruebas con Vitest (modo CI, una sola corrida)
npm run lint         # ESLint
npm run format       # Prettier: formatear todo
npm run format:check # Prettier: solo verificar (modo CI)
```

## Antes de proponer un cambio

Corre y verifica que todo pase:

```bash
npm run format && npm run lint && npm run test:run && npm run build
```

El workflow de CI (`.github/workflows/ci.yml`) corre exactamente estos pasos en cada PR.

- Commits en [Conventional Commits](https://www.conventionalcommits.org/), en inglés (`feat:`,
  `fix:`, `chore:`, `test:`, `docs:`, `refactor:`, `style:`).
- No agregues dependencias nuevas sin señalarlo explícitamente en la descripción del PR — el
  alcance del proyecto es intencionalmente pequeño.

## Convenciones de código

- TypeScript estricto, **prohibido `any`**. Los tipos del dominio se infieren de esquemas Zod
  (`z.infer`); no dupliques una interfaz a mano si ya existe el esquema.
- Componentes funcionales `.tsx` en PascalCase, hooks con prefijo `use`. Exportaciones con
  nombre (named exports), salvo donde una herramienta requiera `default`.
- Imports internos con el alias `@/` (resuelve a `src/`), no con rutas relativas largas.
- Identificadores del código en **inglés**. Textos de la UI en **español**. Los valores de
  dominio capturados en el Google Sheet (categorías, estados como `cancelado`/`agotado`) se
  mantienen en español para coincidir con la hoja real.
- Lógica de negocio en funciones puras dentro de `src/features/events/utils/`, sin dependencias
  de React, cada una con su prueba `*.test.ts` colocada junto al archivo y documentada en
  [src/features/events/utils/README.md](src/features/events/utils/README.md).
- Los componentes nunca leen datos directamente: solo usan hooks (`src/features/events/hooks/`),
  que a su vez usan la capa `api/`.
- Para combinar clases de Tailwind usa `cn()` de `@/lib/utils`.
- Pruebas de componentes: busca elementos por rol y texto (`getByRole`, `getByText`), no por
  clases ni etiquetas. Envuelve componentes con rutas en `MemoryRouter`. Descripciones
  (`describe`, `it`) en inglés.
- Todas las fechas se interpretan y muestran en `America/Cancun` vía `src/lib/timezone.ts` — nunca
  asumas la zona horaria del sistema donde corre el código (un string de fecha sin offset se
  parsea distinto según el entorno; usa `parseCancunDate`/`nowInCancun`, no `new Date(string)`
  directo).
- `src/components/ui/` son componentes generados por shadcn — no se lintean ni formatean,
  modifícalos solo cuando sea necesario.

## Estructura relevante

```
src/
  features/events/
    api/          → fetchEvents, fetchEventById (mock / sheet)
    components/   → componentes de UI del feature
    hooks/        → useEvents, useEvent, useEventFilters
    utils/        → lógica de negocio pura, con pruebas y README.md
    data/         → mock-events.ts
    schema.ts     → esquemas Zod y tipos inferidos
    constants.ts  → categorías, estados, íconos y colores
  components/     → componentes compartidos (layout, estados vacíos)
  pages/          → páginas de ruta
  lib/            → utilidades generales (incluye timezone.ts)
```
