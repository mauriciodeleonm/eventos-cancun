# Contribuir a Eventos Cancún

Gracias por tu interés en contribuir. Este proyecto es chico a propósito — antes de implementar
algo grande, abre un issue para platicarlo primero.

¿Usas un asistente de IA (Cursor, Copilot, Claude Code, etc.)? Revisa [AGENTS.md](AGENTS.md) —
tiene las mismas convenciones de abajo en un formato más directo para agentes.

## Antes de empezar

1. Revisa los [issues abiertos](https://github.com/mauriciodeleonm/eventos-cancun/issues),
   especialmente los etiquetados [`good first issue`](https://github.com/mauriciodeleonm/eventos-cancun/labels/good%20first%20issue)
   si es tu primera contribución.
2. Si quieres proponer algo que no es un issue existente (una función nueva, un cambio de diseño),
   abre un issue describiéndolo antes de escribir código — evita trabajo que después no se pueda
   aceptar.
3. Comenta en el issue que vas a tomarlo, para que nadie más empiece lo mismo en paralelo.

## Entorno de desarrollo

Requisitos: [Node.js](https://nodejs.org/) 24 o superior y [Git](https://git-scm.com/).

```bash
git clone https://github.com/<tu-usuario>/eventos-cancun.git
cd eventos-cancun
npm install
npm run dev
```

Sin ninguna configuración adicional, el proyecto corre con datos de ejemplo (mock). No necesitas
una cuenta de Google Sheets ni de Cloudinary para contribuir.

## Flujo de trabajo

1. Haz un fork del repositorio y crea una rama a partir de `main` (ej. `feat/compartir-evento`).
2. Haz tus cambios siguiendo las convenciones de abajo.
3. Antes de abrir el PR, corre y verifica que todo pase:
   ```bash
   npm run format
   npm run lint
   npm run test:run
   npm run build
   ```
4. Abre el PR contra `main` describiendo el cambio y por qué (no solo el qué). Si resuelve un
   issue, enlázalo (`Closes #12`).
5. Un GitHub Action corre `lint`, `format:check`, `test:run` y `build` automáticamente en cada PR;
   deben pasar en verde antes de poder hacer merge.

## Convenciones del proyecto

- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) en inglés
  (`feat:`, `fix:`, `chore:`, `test:`, `docs:`, `refactor:`, `style:`). Ej.
  `fix: reset scroll position when navigating between routes`.
- **Código:** identificadores (variables, funciones, componentes) en inglés. Los textos que ve la
  persona usuaria van en español — es una app para Cancún, pensada para quien llega desde TikTok.
- **Datos del dominio:** los valores que se capturan en el Google Sheet (categorías, estados como
  `cancelado`/`agotado`) se mantienen en español para que coincidan con la hoja real.
- **TypeScript estricto, sin `any`.** Los tipos del dominio se infieren de los esquemas de Zod
  (`z.infer`); no dupliques una interfaz a mano si ya existe el esquema.
- **Lógica de negocio en funciones puras**, dentro de `src/features/events/utils/`, sin
  dependencias de React, cada una con su prueba (`*.test.ts`) y documentada en el
  [README de utilidades](src/features/events/utils/README.md).
- **Pruebas de componentes:** busca elementos por rol y texto (`getByRole`, `getByText`), no por
  clases ni etiquetas. Las descripciones (`describe`, `it`) van en inglés.
- **Sin dependencias nuevas sin discutirlas primero** en el issue o PR — el alcance del proyecto
  es intencionalmente pequeño.
- **Diseño visual:** antes de cualquier cambio de color, radio, tipografía o layout, revisa
  [DESIGN.md](DESIGN.md) — es la fuente de verdad del sistema de diseño Nocturne.
- **Saltos de línea LF** en todo el proyecto (ya configurado en `.gitattributes` y Prettier).

## Reportar bugs

Usa la plantilla de bug report al abrir el issue. Incluye pasos para reproducir y, si aplica,
capturas — ayuda mucho más que una descripción general.

## Código de conducta

Sé respetuoso. Los comentarios deben enfocarse en el código y las ideas, no en las personas.
