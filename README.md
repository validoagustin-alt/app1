# JCL Explainer

App estática para pegar un JCL de z/OS y obtener una explicación línea por línea en español.

## Cómo usarla

Abre `index.html` en el navegador, pega un JCL y pulsa **Explicar JCL**.

La app funciona sin servidor y sin dependencias externas. El análisis es local y basado en reglas, por lo que conviene usarlo como ayuda de lectura y no como validador formal de sintaxis JCL.

## Qué reconoce

- Selector con 15 ejemplos de JCL: SORT, copia de miembros PDS, copia secuencial, borrado de dataset, creación VSAM KSDS, renombrado de dataset, creación de PDS, GDG, TWS/OPC y Endevor batch.
- Sentencias `JOB`, `EXEC`, `DD`, `PROC`, `PEND`, `SET`, `IF`, `THEN`, `ELSE` y `ENDIF`.
- Comentarios `//*`.
- Directivas de tailoring `//*%OPC` usadas por IBM Z Workload Scheduler/TWS.
- Controles inline básicos de `IDCAMS` y SCL de Endevor.
- Datos inline iniciados con `DD *` o `DD DATA` y cerrados con `/*`.
- Continuaciones y parámetros comunes como `PGM`, `DSN`, `DISP`, `SYSOUT`, `SPACE`, `DCB`, `UNIT`, `COND`, `CLASS`, `MSGCLASS` y `NOTIFY`.
- Avisos útiles para casos como `DISP=OLD`, `DELETE`, datasets temporales `&&` y comas de continuación.
- Ayuda contextual para `DISP`, con formato de sintaxis y valores habituales como `NEW`, `OLD`, `SHR`, `MOD`, `KEEP`, `CATLG`, `DELETE`, `PASS` y `UNCATLG`.
- Ayuda contextual para `DCB`, incluyendo subparámetros como `RECFM`, `LRECL`, `BLKSIZE`, `DSORG` y `BUFNO`.
- Ayuda contextual para `SPACE`, incluyendo unidad, espacio primario/secundario, directorio y `RLSE`.
- Ayuda contextual para `SORT FIELDS` dentro de datos inline, incluyendo posición, longitud, formato y orden.
- Los submenús de sintaxis en “Analizar línea por línea” se abren y cierran con expansión suave.

## Navegación táctil

- Las pantallas **Resumen simplificado** y **Analizar línea por línea** vuelven siempre al menú.
- El gesto de izquierda a derecha conserva la última posición de scroll del menú al volver.
- Al soltar el dedo tras arrastrar horizontalmente, el regreso al menú se completa de forma consistente.
- Los archivos usan cache-busting por versión para reducir mezclas de recursos del navegador.

## Verificación

Si tienes Node.js disponible:

```powershell
node --check app.js
node smoke-test.js
```


## Cambios v73

- Versión incrementada a `v73`.
- Cache-busting actualizado a `app-version-73`.
- Los submenús de sintaxis en la pantalla **Analizar línea por línea** ahora usan animación por `height` medido en vez de `max-height`.
- Se agregó easing más fluido, `translate3d`, `will-change` temporal y `contain: layout paint` para reducir saltos visuales en móviles.

## Corrección v70

- El gesto de regreso se activa únicamente desde los primeros 36 px del borde izquierdo.
- Durante el arrastre, la pantalla activa se fija y se desplaza horizontalmente con el dedo.
- El fondo visible durante el gesto es una copia temporal del menú/pantalla destino, no el panel real.
- Al completar el gesto, se navega al menú y se restaura `savedMenuScrollY`.
- Al cancelar el gesto, se elimina la copia temporal y se restaura la pantalla original.


## Cambios v73

- Versión incrementada a `v73`.
- Cache-busting actualizado a `app-version-73`.
- La expansión de submenús de sintaxis ahora usa animación frame-by-frame con `requestAnimationFrame`, medición de altura y `translate3d` para una sensación más cercana a 60 fps.
- Se aumentó la duración de la transición para reducir la percepción de saltos entre cuadros en móviles.
