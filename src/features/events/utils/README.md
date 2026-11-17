# Utilidades de eventos

Funciones puras (sin dependencias de React) usadas por los hooks y componentes de `features/events`. Todas tienen pruebas en su archivo `*.test.ts` junto al lado.

## `getComputedStatus(event, now?)`

Calcula el estado **calculado** de un evento a partir de sus fechas: `'proximo'`, `'en-curso'` o `'finalizado'`. No confundir con el campo `status` capturado en el Sheet (`cancelado`, `agotado`, etc.) — ese es independiente y se muestra aparte como badge.

- Sin `endDate` → el evento termina al final del día de `startDate` (`endOfDay`).
- Con `endDate` → termina exactamente ahí (soporta eventos de varios días).
- Recibe `now` opcional (por defecto `nowInCancun()`) para que las pruebas no dependan del reloj real.

## `groupByDay(events, now?)`

Agrupa una lista de eventos por día de calendario (zona Cancún) para el listado principal.

- Descarta los eventos `finalizado` (se ocultan del listado por defecto).
- Un evento `en-curso` —incluido uno de varios días que ya empezó— siempre cae en el grupo de **hoy**, sin importar su `startDate` original.
- Dentro de cada día, ordena por hora de inicio ascendente; empates por nombre; los eventos sin hora confirmada van al final del día.
- Etiqueta cada grupo como `"Hoy"`, `"Mañana"`, o `"Sábado 3 de octubre"` (con `date-fns/locale/es`) para los demás días.

## `parsePrice(rawValue)`

Convierte el valor crudo de una celda de precio (string) a `number | null`.

- `"0"` o `"gratis"` (sin importar mayúsculas o acentos) → `0`.
- Celda vacía → `null`.
- Quita `$`, comas y espacios antes de convertir a número.
- Cualquier texto no reconocido → `null`, **nunca** `0` — un costo desconocido no se asume gratis.

## `parseStatus(rawValue)`

Normaliza el valor crudo de la celda `status` a uno de `EVENT_STATUSES`, o `undefined`.

- Celda vacía o `undefined` → `undefined` (se trata como `programado`, el valor por defecto).
- Trim + minúsculas + sin acentos (reutiliza `stripAccents` de `parsePrice.ts`) antes de comparar, así "Cancelado", " CANCÉLADO " y "cancelado" dan el mismo resultado.
- Valor no reconocido (typo, columna mal llenada) → `undefined` con advertencia en consola, **nunca** rompe la fila completa — antes de esta función, `category`/`status` llegaban crudos a Zod y un valor con mayúsculas o espacios de más hacía que `eventSchema.safeParse` rechazara el evento entero.

## `buildMapsUrl(event)`

Devuelve el link de Google Maps para el venue de un evento.

- Si el evento ya trae `mapsUrl`, lo regresa tal cual.
- Si no, genera un link de búsqueda con el nombre del venue + "Cancún", codificado con `encodeURIComponent`.

## `parseSheetRow(row)`

Convierte una fila cruda del CSV del Google Sheet (todo strings, celdas vacías = `""`) en un objeto candidato listo para validar con `eventSchema`.

- Normaliza `"" → undefined` en todos los campos opcionales (si no, Zod rechazaría la fila completa por un `mapsUrl`/`endDate`/`status` vacío).
- Usa `parsePrice` para la columna `price`.
- No valida ni deduplica — eso lo hace `parseEvents` (en `api/events.ts`), reutilizado tanto para el mock como para las filas del Sheet.

## `parseImageUrls(raw)`

Convierte la celda cruda de la columna `imageUrl` (un solo string, posiblemente con varias URLs separadas por coma) en `string[] | undefined`.

- Celda vacía o `undefined` → `undefined`.
- Separa por coma, recorta espacios y descarta entradas vacías (comas de sobra al final no rompen el parseo).
- Usada por `parseSheetRow`; el mock define `imageUrls` directamente como arreglo.

## `filterEvents(events, filters, now?)`

Filtra una lista de eventos por `categoria` (arreglo), `gratis` (boolean) y `rango` (`'hoy' | 'fin-de-semana' | 'semana' | 'mes'`). Pensada para usarse antes de `groupByDay`.

- Siempre excluye eventos `finalizado`, sin importar el rango — un evento que ya terminó no cuenta como "parte del fin de semana" aunque su fecha caiga dentro de la ventana.
- `fin-de-semana` es sábado + domingo más próximos; si "hoy" ya es domingo, el fin de semana empezó ayer (sábado) y sigue contando.
- `semana` = próximos 7 días, `mes` = próximos 30 días, ambos medidos desde `now`.
- Recibe `now` opcional (por defecto `nowInCancun()`), igual que `getComputedStatus`/`groupByDay`.

## `formatWeekRangeLabel(now?)`

Arma el subtítulo del header ("Semana del 5 al 11 de octubre") con la semana de lunes a domingo que contiene a `now`.

- Encuentra el lunes de esa semana (sin importar qué día de la semana sea `now`) y le suma 6 días para el domingo.
- Si ambos extremos caen en el mismo mes, lo muestra una sola vez ("del 5 al 11 de octubre"); si la semana cruza de mes, muestra el mes en ambos extremos ("del 26 de octubre al 1 de noviembre").
- Recibe `now` opcional (por defecto `nowInCancun()`), igual que el resto de utilidades con reloj.

## `formatTimeLabel(event)` / `formatClockTime(date)`

Dan formato de hora en 12h ("4:00 p. m.") para `EventCard` y `EventDetailPage`.

- `formatClockTime(date)` formatea una `Date`/`TZDate` puntual: sin cero a la izquierda en la hora, minutos con dos dígitos, sufijo `a. m.`/`p. m.`.
- `formatTimeLabel(event)` decide qué mostrar: `"Hora por confirmar"` sin hora explícita; `"4:00 p. m. – 8:00 p. m."` si `endDate` es el mismo día que `startDate`; o solo la hora de inicio si `endDate` cae en otro día (ahí el rango de días se indica aparte, no en esta función).
- El campo sigue guardándose en 24h (`HH:mm`) — este formato es solo de presentación.

## `optimizeImageUrl(url)`

Inserta los parámetros de optimización de Cloudinary (`f_auto,q_auto,w_600`) en una URL de imagen, usada por `EventImage` y `EventGallery` (una vez por cada URL en `imageUrls`).

- Solo transforma URLs de Cloudinary (`https://res.cloudinary.com/<cloud>/image/upload/...`); cualquier otra URL (ej. `placehold.co` en el mock) se devuelve sin cambios.
- Inserta los parámetros justo después de `/upload/`, antes del segmento de versión si existe (`/upload/f_auto,q_auto,w_600/v123.../archivo.jpg`), que es sintaxis válida de Cloudinary.
- No requiere credenciales ni cuenta: la URL completa (con el cloud name) ya viene en `imageUrls` porque quien captura el evento sube la imagen a Cloudinary a mano y pega esa URL en el Sheet.

## Dependencia compartida: `@/lib/timezone`

Estas utilidades (sobre todo `getComputedStatus` y `groupByDay`) dependen de `parseCancunDate`/`nowInCancun` en `src/lib/timezone.ts` para que todas las fechas se interpreten en `America/Cancun`, sin importar la zona horaria del navegador o del servidor donde corra la app.
