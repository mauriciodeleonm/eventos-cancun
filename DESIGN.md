# DESIGN.md — Eventos Cancún

Referencia visual del sistema de diseño **Nocturne**: los valores reales (colores, radios,
tipografía, layout). Si un valor cambia en el código, se actualiza primero aquí.

Tema único: oscuro. No hay modo claro ni variante `.dark` — Nocturne es la única apariencia de la
app.

## Paleta base

Definida en `src/index.css` (`:root`).

| Token                | Valor                                          | Uso                                    |
| -------------------- | ---------------------------------------------- | -------------------------------------- |
| `--background`       | `#161826`                                      | Fondo de página                        |
| `--foreground`       | `#e9e9ed`                                      | Texto principal                        |
| `--card`             | `#232532`                                      | Fondo de tarjetas, popovers            |
| `--primary`          | `#9184d9`                                      | Acciones principales, focus ring       |
| `--secondary`        | `#3f424d`                                      | Superficies secundarias                |
| `--muted-foreground` | `#9397ab`                                      | Texto secundario (ver contraste abajo) |
| `--accent`           | `#423a6a`                                      | Superficies sutiles de énfasis         |
| `--destructive`      | `oklch(0.55 0.12 25)`                          | Acciones/estados destructivos          |
| `--border`           | `color-mix(in srgb, #e9e9ed 16%, transparent)` | Bordes                                 |

## Rampas `neutral` y `brand`

Definidas en `src/index.css` (bloque `@theme`, no `:root` — así Tailwind genera utilidades reales
como `bg-neutral-700` o `text-brand-300`, no solo variables CSS).

| Paso | `neutral` | `brand`   |
| ---- | --------- | --------- |
| 100  | `#f3f5fe` | `#f5f4ff` |
| 200  | `#e4e7f5` | `#e7e5fe` |
| 300  | `#cfd3e5` | `#d2cefd` |
| 400  | `#b2b6ca` | `#b5abfc` |
| 500  | `#9397ab` | `#968ae0` |
| 600  | `#75798c` | `#796cbf` |
| 700  | `#595d6c` | `#5d5294` |
| 800  | `#3f424d` | `#423a6a` |
| 900  | `#292b31` | `#2b2741` |

`brand` es el equivalente a la rampa "accent" del diseño original; se renombró para no chocar con
`--accent`, el token semántico de shadcn.

## Color por categoría

Definido en `src/features/events/constants.ts` como un único mapa de hues (`CATEGORY_HUE`); todo
lo demás (ícono, fondo con tinte, color de texto) se deriva de ese hue con funciones puras — nunca
se escribe un color por categoría a mano en un componente.

| Categoría   | Ícono (Lucide)    | Hue                                                          |
| ----------- | ----------------- | ------------------------------------------------------------ |
| Deportes    | `Trophy`          | 155                                                          |
| Cultura     | `BookOpen`        | 70                                                           |
| Música      | `Music`           | 300                                                          |
| Gastronomía | `UtensilsCrossed` | 35                                                           |
| Familiar    | `Users`           | 235                                                          |
| Otro        | `Shapes`          | — (sin tinte, usa `neutral-400`/`neutral-600`/`neutral-800`) |

- `categoryColor`: `oklch(0.78 0.08 <hue>)` — color del ícono/acento.
- `categoryIconTint`: `oklch(0.66 0.06 <hue>)` — ícono sobre fondo con tinte (fallback de imagen).
- `categoryBackgroundTint`: gradiente radial `oklch(0.36 0.05 <hue>)` → transparente, sobre
  `neutral-900`.

## Estados capturados (badges)

`EventStatusBadge` no renderiza nada para `programado` (es el estado por defecto, sin badge).

| Estado         | Fondo                  | Texto                  |
| -------------- | ---------------------- | ---------------------- |
| `cancelado`    | `oklch(0.35 0.08 25)`  | `oklch(0.89 0.06 25)`  |
| `pospuesto`    | `oklch(0.35 0.05 75)`  | `oklch(0.9 0.06 85)`   |
| `reprogramado` | `oklch(0.34 0.05 240)` | `oklch(0.88 0.05 240)` |
| `agotado`      | `neutral-800`          | `neutral-200`          |

Tamaños: `sm` (12px, `11px` de texto) para listado, `md` (14px, `12px` de texto) para detalle.

## Tipografía

**Geist Variable** (`@fontsource-variable/geist`), única fuente de la app — sin fuente de
respaldo adicional más allá del `sans-serif` genérico. No se usa Inter (fuente del export
original de claude.ai/design que se portó a mano).

## Radios

| Token         | Valor | Uso                         |
| ------------- | ----- | --------------------------- |
| `--radius-sm` | 4px   | Elementos pequeños (badges) |
| `--radius-md` | 8px   | Botones, inputs             |
| `--radius-lg` | 14px  | Tarjetas                    |

`xl`/`2xl`/`3xl`/`4xl` son múltiplos de `--radius-lg` (1.4×, 1.8×, 2.2×, 2.6×), generados por
Tailwind a partir de ese valor base — no se definen a mano.

## Layout

- `PageContainer`: ancho máximo `max-w-5xl` (1024px) por defecto; variante `narrow` en
  `max-w-190` (760px) para la página de detalle (filas sueltas, sin card).
- Grid de eventos (`EventDayGroup`): `auto-fill, minmax(280px, 1fr)` — mobile-first, sin
  breakpoints manuales.
- Padding horizontal de página: `px-5` (20px) en todos los tamaños.

## Imágenes

- Proporción fija `aspect-4/3` (evita saltos de layout; antes era `aspect-video`/16:9, se hizo
  más alta porque el `object-cover` recortaba demasiado la mayoría de los flyers reales).
- Sin `imageUrl` o si falla la carga: `EventImage` muestra el ícono de categoría sobre
  `categoryBackgroundTint`, no una imagen de respaldo externa.
- `loading="lazy"` en todas las tarjetas.
- En `EventCard` (listado), la imagen hace un zoom sutil al hover (`hover:scale-110`,
  `transition-transform duration-300`) dentro de un contenedor `overflow-hidden` que recorta el
  zoom al tamaño original de la tarjeta.

## Accesibilidad

- Foco visible: anillo con `--ring` (`#9184d9`), incluyendo controles con `sr-only` + técnica
  `has-[:focus-visible]:outline` en el elemento visible que los envuelve (segmented control de
  rango de fechas).
- `prefers-reduced-motion`: animaciones de skeleton con `motion-safe:animate-pulse`.
- Contraste de texto secundario verificado con la fórmula WCAG: peor caso 5.25:1 (mínimo
  requerido 4.5:1 para texto normal).
- Confirmado con Lighthouse: Accesibilidad 100/100.
