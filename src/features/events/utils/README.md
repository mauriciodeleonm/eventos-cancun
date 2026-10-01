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

## `buildMapsUrl(event)`

Devuelve el link de Google Maps para el venue de un evento.

- Si el evento ya trae `mapsUrl`, lo regresa tal cual.
- Si no, genera un link de búsqueda con el nombre del venue + "Cancún", codificado con `encodeURIComponent`.

## Dependencia compartida: `@/lib/timezone`

Estas utilidades (sobre todo `getComputedStatus` y `groupByDay`) dependen de `parseCancunDate`/`nowInCancun` en `src/lib/timezone.ts` para que todas las fechas se interpreten en `America/Cancun`, sin importar la zona horaria del navegador o del servidor donde corra la app.
