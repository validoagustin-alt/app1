const fs = require("fs");
const path = require("path");

const appPath = path.join(__dirname, "app.js");
const htmlPath = path.join(__dirname, "index.html");
const source = fs.readFileSync(appPath, "utf8");
const html = fs.readFileSync(htmlPath, "utf8");
const start = source.indexOf("const exampleJcls");
const end = source.indexOf("function renderAnalysis");
const inlineScripts = [];
const scriptPattern = /<script[^>]*>([\s\S]*?)<\/script>/g;
let scriptMatch;

if (start === -1 || end === -1 || end <= start) {
  throw new Error("No se pudo aislar el analizador en app.js");
}

if (!source.includes("const backSwipeEdgeWidthPx = 36") || !source.includes("function isBackSwipeFromLeftEdge")) {
  throw new Error("El gesto back debe iniciar solo desde el borde izquierdo");
}

if (!source.includes("createBackSwipePreviewClone") || !source.includes("back-swipe-preview-clone") || !source.includes("removeBackSwipePreviewClone")) {
  throw new Error("El preview del menu debe usar una copia temporal, no el panel real");
}

if (!source.includes("restoreMenuScrollPosition") || !source.includes("savedMenuScrollY")) {
  throw new Error("La app debe conservar y restaurar el scroll del menu");
}

while ((scriptMatch = scriptPattern.exec(html))) {
  if (scriptMatch[1].trim()) {
    inlineScripts.push(scriptMatch[1]);
  }
}

inlineScripts.forEach((script) => {
  new Function(script);
});

const testCode = `
${source.slice(start, end)}
const analysis = analyzeJcl(sampleJcl);
const exampleAnalyses = exampleJcls.map((example) => analyzeJcl(example.jcl));
const hasInlineData = analysis.some((line) => line.type === "Datos" || line.type === "SORT");
const hasJob = analysis.some((line) => line.type === "JOB");
const hasExec = analysis.some((line) => line.type === "EXEC");
const hasDd = analysis.some((line) => line.type === "DD");
const hasDispHelp = analysis.some((line) =>
  line.helpItems && line.helpItems.some((help) => help.key === "DISP")
);
const hasDcbHelp = analysis.some((line) =>
  line.helpItems && line.helpItems.some((help) => help.key === "DCB")
);
const hasSpaceHelp = analysis.some((line) =>
  line.helpItems && line.helpItems.some((help) => help.key === "SPACE")
);
const hasSortFieldsHelp = analysis.some((line) =>
  line.helpItems && line.helpItems.some((help) => help.key === "SORT_FIELDS")
);

if (analysis.length !== sampleJcl.split("\\n").length) {
  throw new Error("El analisis no devolvio una entrada por cada linea");
}

if (exampleJcls.length < 10) {
  throw new Error("La app debe tener al menos 10 ejemplos de JCL");
}

if (exampleAnalyses.some((exampleAnalysis) => !exampleAnalysis.some((line) => line.type === "JOB"))) {
  throw new Error("Todos los ejemplos deben incluir una sentencia JOB reconocible");
}

if (!hasJob || !hasExec || !hasDd || !hasInlineData) {
  throw new Error(
    "El analisis no detecto JOB, EXEC, DD y datos inline. Tipos: " +
    [...new Set(analysis.map((line) => line.type))].join(", ")
  );
}

if (!hasDispHelp) {
  throw new Error("El analisis no genero ayuda contextual para DISP");
}

if (!hasDcbHelp || !hasSpaceHelp || !hasSortFieldsHelp) {
  throw new Error("El analisis no genero ayuda contextual para DCB, SPACE y SORT FIELDS");
}

JSON.stringify({
  lines: analysis.length,
  examples: exampleJcls.length,
  inlineScripts: inlineScripts.length,
  dispHelp: hasDispHelp,
  dcbHelp: hasDcbHelp,
  spaceHelp: hasSpaceHelp,
  sortFieldsHelp: hasSortFieldsHelp,
  warnings: analysis.reduce((count, line) => count + line.warnings.length, 0),
  firstExplanation: analysis[0].explanation
}, null, 2);
`;

console.log(eval(testCode));
