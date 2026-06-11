# JCL Explainer

App estática para pegar un JCL de z/OS y obtener una explicación en español, ya sea como resumen simplificado o línea por línea.

## Cómo usarla

Abre `index.html` en el navegador, pega un JCL o elige un ejemplo, y usa:

- **Resumen simplificado** para una lectura funcional general.
- **Analizar línea por línea** para ver cada sentencia JCL con explicación y ayudas de sintaxis.

La app funciona sin servidor y sin dependencias externas. El análisis es local y basado en reglas, por lo que conviene usarlo como ayuda de lectura y no como validador formal de sintaxis JCL.

## Qué reconoce

- Selector con ejemplos de JCL: SORT, copia de miembros PDS, copia secuencial, borrado de dataset, creación VSAM KSDS, renombrado de dataset, creación de PDS, GDG, TWS/OPC y Endevor batch.
- Sentencias `JOB`, `EXEC`, `DD`, `PROC`, `PEND`, `SET`, `IF`, `THEN`, `ELSE` y `ENDIF`.
- Comentarios `//*`.
- Directivas de tailoring `//*%OPC` usadas por IBM Z Workload Scheduler/TWS.
- Controles inline básicos de `IDCAMS` y SCL de Endevor.
- Datos inline iniciados con `DD *` o `DD DATA` y cerrados con `/*`.
- Continuaciones y parámetros comunes como `PGM`, `DSN`, `DISP`, `SYSOUT`, `SPACE`, `DCB`, `UNIT`, `COND`, `CLASS`, `MSGCLASS` y `NOTIFY`.
- Ayuda contextual para `DISP`, `DCB`, `SPACE` y `SORT FIELDS`.

## Navegación táctil

- Las pantallas **Resumen simplificado** y **Analizar línea por línea** vuelven siempre al menú.
- El gesto de izquierda a derecha se activa desde el borde izquierdo.
- Durante el arrastre, la pantalla actual se mueve con el dedo y detrás aparece una copia temporal del menú.
- Al volver al menú, se restaura la última posición de scroll.

## Cambios v75

- Versión incrementada a `v75`.
- Cache-busting actualizado a `app-version-75`.
- En la pantalla **Menú**, el editor negro de JCL usa una fuente monoespaciada más pequeña en móvil para que entren aproximadamente 72 caracteres por línea en el ancho visible del cuadro.
- Se ajustó la lectura del editor: menor interlineado, ligaduras desactivadas y sin scroll horizontal innecesario.

## Cambios v74

- Prueba visual de ayuda de sintaxis como bottom sheet estilo iPhone.
- Los submenús de sintaxis ya no expanden la altura principal de las tarjetas: abren una hoja inferior animada con `transform`.

## Corrección v70

- El gesto de regreso se activa únicamente desde los primeros 36 px del borde izquierdo.
- El fondo visible durante el gesto es una copia temporal del menú/pantalla destino, no el panel real.
- Al completar el gesto, se navega al menú y se restaura `savedMenuScrollY`.

## Verificación

Si tienes Node.js disponible:

```powershell
node --check app.js
node --check smoke-test.js
node smoke-test.js
```
