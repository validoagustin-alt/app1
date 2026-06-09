# JCL Explainer

App estática para pegar un JCL de z/OS y obtener una explicación línea por línea en español.

## Cómo usarla

Abre `index.html` en el navegador, pega un JCL y elige **Resumen simplificado** o **Analizar línea por línea**.

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

## Navegación táctil

En las pantallas **Resumen simplificado** y **Analizar línea por línea**, el gesto horizontal de izquierda a derecha vuelve siempre al **menú**. La pantalla de fondo durante el gesto se genera como una copia temporal del menú, por lo que no depende de una pantalla previa guardada por el navegador ni de la caché de navegación.

La versión `v68` agrega cache-busting en `index.html` para `styles.css` y `app.js`, además de metadatos `no-cache` para reducir mezclas entre versiones al probar cambios.

## Verificación

Si tienes Node.js disponible:

```powershell
node --check app.js
node smoke-test.js
```
