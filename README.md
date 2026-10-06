# Eventos Cancún

## Cómo correr el proyecto

Requisitos: [Node.js](https://nodejs.org/) 24 o superior y [Git](https://git-scm.com/).

```bash
git clone https://github.com/mauriciodeleonm/eventos-cancun.git
cd eventos-cancun
npm install
npm run dev
```

Abre la URL que aparece en la terminal (normalmente `http://localhost:5173`).

## Fuente de datos

Por defecto el proyecto corre con datos de ejemplo (`mock`), sin configuración adicional. Si quieres usar tu propio Google Sheet como fuente:

1. Copia `.env.example` a `.env.local`.
2. Pon `VITE_DATA_SOURCE=sheet`.
3. Publica tu Sheet como CSV y pon esa URL en `VITE_EVENTS_CSV_URL`.

```bash
cp .env.example .env.local
```

### Estructura del Google Sheet

Una pestaña llamada **`Eventos`** (la única que se publica como CSV) con estos encabezados exactos en la fila 1, en este orden:

```
id	name	startDate	endDate	venueName	mapsUrl	price	priceNote	description	imageUrl	officialUrl	category	status
```

| Columna       | Obligatoria | Formato / valores válidos                                                         |
| ------------- | :---------: | --------------------------------------------------------------------------------- |
| `id`          |     Sí      | Texto único. Se genera solo (ver Apps Script abajo); no se edita a mano.          |
| `name`        |     Sí      | Texto libre.                                                                      |
| `startDate`   |     Sí      | `YYYY-MM-DDTHH:mm`, o `YYYY-MM-DD` si la hora no está confirmada.                 |
| `endDate`     |     No      | Mismo formato que `startDate`. Vacío si el evento es de un solo día.              |
| `venueName`   |     Sí      | Texto libre.                                                                      |
| `mapsUrl`     |     No      | URL de Google Maps. Si está vacía, se genera una a partir de `venueName`.         |
| `price`       |     No      | Número, `0` o `gratis` (= gratis), o vacío (costo desconocido). Nunca asumas `0`. |
| `priceNote`   |     No      | Texto libre, ej. "Preventa $350, taquilla $450".                                  |
| `description` |     Sí      | Texto libre.                                                                      |
| `imageUrl`    |     No      | URL de imagen. Si está vacía o no carga, se muestra un ícono de la categoría.     |
| `officialUrl` |     No      | URL del sitio oficial o venta de boletos.                                         |
| `category`    |     Sí      | Uno de: `deportes`, `cultura`, `musica`, `gastronomia`, `familiar`, `otro`.       |
| `status`      |     No      | Uno de: `cancelado`, `pospuesto`, `reprogramado`, `agotado`. Vacío = programado.  |

**Importante:** las columnas `startDate`/`endDate` deben estar formateadas como **texto sin formato** (Formato → Número → Texto sin formato) antes de escribir las fechas — si no, Google Sheets las reinterpreta como su propio tipo de fecha/hora y las exporta en un formato distinto al que espera la app.

Las filas inválidas (campo obligatorio vacío, categoría/estado que no están en la lista, id duplicado) se descartan al cargar, sin romper la app — se registra un aviso en la consola del navegador.

### Generar los ids automáticamente (opcional)

En **Extensiones → Apps Script** de tu Sheet, puedes agregar un disparador `onEdit` que genere el `id` solo cuando escribes un `name` sin `id` (slug del nombre + sufijo aleatorio de 4 caracteres). Pide el script en el proyecto si lo necesitas.

### Publicar como CSV

**Archivo → Compartir → Publicar en la web** → selecciona la pestaña `Eventos` → formato **CSV** → Publicar. Copia la URL resultante en `VITE_EVENTS_CSV_URL`. Ten en cuenta que esa URL hace público el contenido de esa pestaña.
