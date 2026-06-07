const input = document.querySelector("#jcl-input");
const inputPanel = document.querySelector(".input-panel");
const summaryButton = document.querySelector("#summary-button");
const analyzeButton = document.querySelector("#analyze-button");
const clearButton = document.querySelector("#clear-button");
const sampleButton = document.querySelector("#sample-button");
const exampleSelect = document.querySelector("#example-select");
const themeButton = document.querySelector("#theme-toggle");
const results = document.querySelector("#results");
const summary = document.querySelector("#summary");
const summaryPanel = document.querySelector("#summary-panel");
const resultsPanel = document.querySelector("#results-panel");
const dispPalettePanel = document.querySelector("#disp-palette-panel");
const dispPaletteBack = document.querySelector("#disp-palette-back");
const dispSwatches = document.querySelectorAll(".disp-swatch");
const backButtons = document.querySelectorAll("[data-back-menu]");
const lineCount = document.querySelector("#line-count");
let previousScreen = "explanation";
const defaultDispButtonColor = "#33e6a0";
const defaultDispButtonInk = "#06110d";

const exampleJcls = [
  {
    title: "SORT nomina",
    description: "Ordena un archivo de nomina y crea un dataset de salida.",
    jcl: `//PAYROLL JOB (ACCT),'NOMINA',CLASS=A,MSGCLASS=X,NOTIFY=&SYSUID
//* EJEMPLO SIMPLE DE JCL PARA PROCESAR NOMINA
//STEP01  EXEC PGM=SORT
//SYSOUT  DD SYSOUT=*
//SORTIN  DD DSN=PROD.PAYROLL.INPUT,DISP=SHR
//SORTOUT DD DSN=PROD.PAYROLL.SORTED,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(5,2),RLSE),
//            DCB=(RECFM=FB,LRECL=120,BLKSIZE=0)
//SYSIN   DD *
  SORT FIELDS=(1,10,CH,A)
/*
//STEP02  EXEC PGM=IEFBR14
//CLEANUP DD DSN=TEMP.PAYROLL.WORK,DISP=(OLD,DELETE,KEEP)`
  },
  {
    title: "Copiar miembro PDS",
    description: "Copia un miembro de una libreria particionada a otra con IEBCOPY.",
    jcl: `//CPYMBR  JOB (ACCT),'COPY MEMBER',CLASS=A,MSGCLASS=X
//* COPIA EL MIEMBRO COBPGM1 DESDE UNA PDS A OTRA
//COPY    EXEC PGM=IEBCOPY
//SYSPRINT DD SYSOUT=*
//SYSUT1   DD DSN=DEV.SOURCE.COBOL,DISP=SHR
//SYSUT2   DD DSN=QA.SOURCE.COBOL,DISP=SHR
//SYSIN    DD *
  COPY INDD=SYSUT1,OUTDD=SYSUT2
  SELECT MEMBER=COBPGM1
/*`
  },
  {
    title: "Copiar dataset secuencial",
    description: "Copia un archivo secuencial a otro nuevo con IEBGENER.",
    jcl: `//IEBGEN  JOB (ACCT),'COPY SEQ',CLASS=A,MSGCLASS=X
//* COPIA UN DATASET SECUENCIAL COMPLETO
//STEP01  EXEC PGM=IEBGENER
//SYSPRINT DD SYSOUT=*
//SYSUT1   DD DSN=PROD.CUSTOMER.INPUT,DISP=SHR
//SYSUT2   DD DSN=TEST.CUSTOMER.COPY,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(TRK,(10,5),RLSE),
//            DCB=(RECFM=FB,LRECL=100,BLKSIZE=0)
//SYSIN    DD DUMMY`
  },
  {
    title: "Borrar dataset",
    description: "Borra un dataset catalogado usando IDCAMS DELETE.",
    jcl: `//DELDATA JOB (ACCT),'DELETE DSN',CLASS=A,MSGCLASS=X
//* BORRA UN DATASET CATALOGADO
//DELETE  EXEC PGM=IDCAMS
//SYSPRINT DD SYSOUT=*
//SYSIN    DD *
  DELETE TEST.CUSTOMER.OLD PURGE
  SET MAXCC=0
/*`
  },
  {
    title: "Crear VSAM KSDS",
    description: "Define un cluster VSAM KSDS con DATA e INDEX.",
    jcl: `//DEFVSAM JOB (ACCT),'DEFINE VSAM',CLASS=A,MSGCLASS=X
//* CREA UN CLUSTER VSAM KSDS
//IDCAMS  EXEC PGM=IDCAMS
//SYSPRINT DD SYSOUT=*
//SYSIN    DD *
  DEFINE CLUSTER (NAME(TEST.CUST.KSDS) -
                  INDEXED -
                  KEYS(10 0) -
                  RECORDSIZE(80 80) -
                  TRACKS(5 2) -
                  CISZ(4096) -
                  FREESPACE(10 10)) -
         DATA  (NAME(TEST.CUST.KSDS.DATA)) -
         INDEX (NAME(TEST.CUST.KSDS.INDEX))
/*`
  },
  {
    title: "Renombrar dataset",
    description: "Renombra un dataset catalogado con IDCAMS ALTER NEWNAME.",
    jcl: `//RENDSN  JOB (ACCT),'RENAME DSN',CLASS=A,MSGCLASS=X
//* RENOMBRA UN DATASET CATALOGADO
//ALTER   EXEC PGM=IDCAMS
//SYSPRINT DD SYSOUT=*
//SYSIN    DD *
  ALTER TEST.CUSTOMER.COPY NEWNAME(TEST.CUSTOMER.COPY.BKUP)
/*`
  },
  {
    title: "Crear PDS",
    description: "Crea una libreria particionada con IEFBR14 y SPACE con directorio.",
    jcl: `//CRTPDS  JOB (ACCT),'CREATE PDS',CLASS=A,MSGCLASS=X
//* CREA UNA PDS PARA FUENTES COBOL
//STEP01  EXEC PGM=IEFBR14
//NEWPDS  DD DSN=DEV.SOURCE.COBOL,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(2,1,20),RLSE),
//            DCB=(DSORG=PO,RECFM=FB,LRECL=80,BLKSIZE=0)`
  },
  {
    title: "GDG nueva generacion",
    description: "Crea una nueva generacion de un GDG y copia datos hacia ella.",
    jcl: `//GDGNEW  JOB (ACCT),'NEW GDG',CLASS=A,MSGCLASS=X
//* CREA UNA NUEVA GENERACION DE UN GDG
//STEP01  EXEC PGM=IEBGENER
//SYSPRINT DD SYSOUT=*
//SYSUT1   DD DSN=PROD.DAILY.EXTRACT,DISP=SHR
//SYSUT2   DD DSN=PROD.DAILY.GDG(+1),
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(3,1),RLSE),
//            DCB=(RECFM=FB,LRECL=150,BLKSIZE=0)
//SYSIN    DD DUMMY`
  },
  {
    title: "TWS/OPC tailoring",
    description: "Ejemplo de JCL con directivas de IBM Z Workload Scheduler/TWS.",
    jcl: `//TWSJOB  JOB (ACCT),'TWS SAMPLE',CLASS=A,MSGCLASS=X
//* EJEMPLO DE DIRECTIVAS DE TWS/OPC PARA TAILORING
//*%OPC SCAN
//*%OPC SETVAR TBL=PAYROLL
//STEP01  EXEC PGM=IEFBR14
//REPORT  DD DSN=PAYROLL.REPORT.&OADATE,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(TRK,(5,2),RLSE),
//            DCB=(RECFM=FB,LRECL=133,BLKSIZE=0)
//* NOTA: &OADATE Y TABLAS OPC DEPENDEN DE LA CONFIGURACION DEL SCHEDULER`
  },
  {
    title: "Endevor batch SCL",
    description: "Ejecuta una accion Endevor batch leyendo SCL desde SYSIN.",
    jcl: `//ENDVOR  JOB (ACCT),'ENDEVOR',CLASS=A,MSGCLASS=X
//* EJEMPLO GENERICO DE ENDEVOR BATCH CON SCL
//ENDEVOR EXEC PGM=NDVRC1,PARM='C1BM3000'
//STEPLIB  DD DSN=ENDEVOR.AUTHLIB,DISP=SHR
//CONLIB   DD DSN=ENDEVOR.CONLIB,DISP=SHR
//C1MSGS1  DD SYSOUT=*
//C1MSGS2  DD SYSOUT=*
//C1PRINT  DD SYSOUT=*
//SYSUDUMP DD SYSOUT=*
//SYSIN    DD *
  SET FROM ENVIRONMENT 'DEV'
      SYSTEM 'PAYROLL'
      SUBSYSTEM 'BATCH'
      TYPE 'COBOL'
      STAGE NUMBER 1 .
  ADD ELEMENT 'PAYCALC'
      FROM DSNAME 'DEV.SOURCE.COBOL'
      OPTIONS CCID 'DEMO123'
              COMMENT 'EJEMPLO DESDE JCL EXPLAINER' .
/*`
  }
];

const sampleJcl = exampleJcls[0].jcl;

const operationDescriptions = {
  JOB: "Define el inicio de un job. Aquí se declaran datos de cuenta, nombre descriptivo y opciones de ejecución.",
  EXEC: "Define un paso de ejecución. Puede invocar un programa con PGM= o un procedimiento catalogado con PROC=.",
  DD: "Define un dataset o recurso que usará el paso actual. Las DD conectan nombres lógicos del programa con archivos, salida, entrada o datos inline.",
  PROC: "Inicia un procedimiento JCL reutilizable con parámetros propios.",
  PEND: "Marca el final de un procedimiento iniciado con PROC.",
  IF: "Inicia una condición JCL. Las sentencias dentro se ejecutan si la expresión se cumple.",
  THEN: "Forma parte de una condición IF/THEN.",
  ELSE: "Rama alternativa de una condición JCL.",
  ENDIF: "Cierra una condición JCL.",
  INCLUDE: "Incluye miembros o sentencias JCL almacenadas fuera de este job.",
  SET: "Define o sobrescribe una variable simbólica para usarla en el JCL."
};

function analyzeJcl(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const analyses = [];
  let currentStep = null;
  let currentDd = null;
  let currentProgram = "";
  let inInlineData = false;
  let previousJclStatement = null;

  lines.forEach((rawLine, index) => {
    const lineNumber = index + 1;
    const trimmed = rawLine.trimEnd();
    const compact = trimmed.trim();

    if (compact === "") {
      analyses.push(makeResult(lineNumber, rawLine, "Blanco", "Línea vacía", "No ejecuta nada. Solo separa visualmente el JCL.", [], []));
      return;
    }

    if (inInlineData && compact !== "/*") {
      const inlineAnalysis = analyzeInlineDataLine(rawLine, currentDd, currentProgram);
      analyses.push(makeResult(
        lineNumber,
        rawLine,
        inlineAnalysis.type,
        inlineAnalysis.title,
        inlineAnalysis.explanation,
        inlineAnalysis.details,
        inlineAnalysis.warnings,
        inlineAnalysis.helpItems
      ));
      return;
    }

    if (compact === "/*") {
      inInlineData = false;
      analyses.push(makeResult(lineNumber, rawLine, "Delimitador", "Fin de datos inline", "Cierra un bloque iniciado con DD * o DD DATA.", [], []));
      return;
    }

    if (trimmed.startsWith("//*%OPC")) {
      analyses.push(makeResult(lineNumber, rawLine, "TWS/OPC", "Directiva TWS/OPC", "Directiva de IBM Z Workload Scheduler/TWS para tailoring del JCL antes de la ejecución. Puede activar escaneo, variables o sustituciones del scheduler.", [trimmed.slice(5).trim()], []));
      return;
    }

    if (trimmed.startsWith("//*")) {
      analyses.push(makeResult(lineNumber, rawLine, "Comentario", "Comentario JCL", "El scheduler/JES ignora esta línea. Sirve para documentar el job.", [], []));
      return;
    }

    if (!trimmed.startsWith("//")) {
      const warning = "La línea no empieza con //. En JCL normal esto suele ser inválido, salvo que pertenezca a un bloque de datos inline.";
      analyses.push(makeResult(lineNumber, rawLine, "Texto", "Texto no JCL", "No se reconoce como sentencia JCL estándar.", [], [warning]));
      return;
    }

    const parsed = parseJclStatement(trimmed);
    const operation = parsed.operation.toUpperCase();
    const isKnownOperation = Boolean(operationDescriptions[operation]);
    const isContinuation = previousJclStatement && parsed.rawBody.startsWith(" ") && !isKnownOperation;

    if (!parsed.operation && previousJclStatement) {
      const continuationText = parsed.rawBody.trim();
      const continuationParams = extractParameters(continuationText);
      const details = continuationParams.map(formatParameter);
      const explanation = `Continúa la sentencia anterior (${previousJclStatement.operation}${previousJclStatement.name ? ` ${previousJclStatement.name}` : ""}) agregando parámetros.`;
      analyses.push(makeResult(lineNumber, rawLine, "Continuación", "Continuación de parámetros", explanation, details, continuationWarnings(continuationText), buildHelpItems(continuationParams)));
      return;
    }

    if (isContinuation) {
      const continuationText = parsed.rawBody.trim();
      const continuationParams = extractParameters(continuationText);
      const details = continuationParams.map(formatParameter);
      const explanation = `Continúa la sentencia anterior (${previousJclStatement.operation}${previousJclStatement.name ? ` ${previousJclStatement.name}` : ""}) agregando parámetros.`;
      analyses.push(makeResult(lineNumber, rawLine, "Continuación", "Continuación de parámetros", explanation, details, continuationWarnings(continuationText), buildHelpItems(continuationParams)));
      return;
    }

    if (!parsed.operation) {
      analyses.push(makeResult(lineNumber, rawLine, "JCL", "Sentencia no clasificada", "Empieza con //, pero no se pudo identificar una operación como JOB, EXEC o DD.", [], []));
      previousJclStatement = parsed;
      return;
    }

    const params = extractParameters(parsed.parameters);
    const details = params.map(formatParameter);
    const warnings = buildWarnings(operation, params, parsed.parameters);

    let title = `${operation}${parsed.name ? ` ${parsed.name}` : ""}`;
    let explanation = operationDescriptions[operation] || "Sentencia JCL reconocida. Revisa sus parámetros para ver su función concreta.";

    if (operation === "JOB") {
      currentStep = null;
      currentDd = null;
      currentProgram = "";
      explanation = explainJob(parsed, params);
    }

    if (operation === "EXEC") {
      const pgm = findParam(params, "PGM");
      const proc = findParam(params, "PROC") || ((params[0] && params[0].positional) ? params[0] : null);
      currentStep = parsed.name || currentStep;
      currentDd = null;
      currentProgram = pgm ? pgm.value : proc ? proc.value : "";
      explanation = explainExec(parsed, params);
    }

    if (operation === "DD") {
      currentDd = parsed.name || currentDd;
      explanation = explainDd(parsed, params, currentStep);
      if (isInlineDataDd(parsed.parameters)) {
        inInlineData = true;
      }
    }

    if (operation === "SET") {
      explanation = "Asigna valores a variables simbólicas. Esos símbolos pueden usarse después como &NOMBRE en el JCL.";
    }

    analyses.push(makeResult(lineNumber, rawLine, operation, title, explanation, details, warnings, buildHelpItems(params)));
    previousJclStatement = parsed;
  });

  return analyses;
}

function parseJclStatement(line) {
  const body = line.slice(2);
  const hasName = !body.startsWith(" ");
  const match = body.match(/^\s*(?:(\S+)\s+)?([A-Za-z]+)\b\s*(.*)$/);

  if (!match) {
    return { name: "", operation: "", parameters: body.trim(), rawBody: body };
  }

  let [, firstToken = "", secondToken = "", rest = ""] = match;

  if (!hasName) {
    firstToken = "";
  }

  const knownOperations = new Set(Object.keys(operationDescriptions));

  if (knownOperations.has(firstToken.toUpperCase()) && secondToken) {
    return { name: "", operation: firstToken, parameters: `${secondToken} ${rest}`.trim(), rawBody: body };
  }

  return {
    name: firstToken,
    operation: secondToken,
    parameters: rest.trim(),
    rawBody: body
  };
}

function extractParameters(parameterText) {
  const text = parameterText.trim().replace(/,$/, "");
  if (!text) {
    return [];
  }

  const parts = splitTopLevel(text, ",");
  const positional = [];

  return parts.filter(Boolean).map((part) => {
    const equalIndex = findTopLevelEqual(part);
    if (equalIndex === -1) {
      positional.push(part.trim());
      return { key: `posicional ${positional.length}`, value: part.trim(), positional: true };
    }

    return {
      key: part.slice(0, equalIndex).trim().toUpperCase(),
      value: part.slice(equalIndex + 1).trim(),
      positional: false
    };
  });
}

function splitTopLevel(text, separator) {
  const parts = [];
  let current = "";
  let depth = 0;
  let quote = "";

  for (const char of text) {
    if ((char === "'" || char === "\"") && !quote) {
      quote = char;
    } else if (char === quote) {
      quote = "";
    } else if (!quote && char === "(") {
      depth += 1;
    } else if (!quote && char === ")") {
      depth = Math.max(0, depth - 1);
    }

    if (!quote && depth === 0 && char === separator) {
      parts.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  parts.push(current.trim());
  return parts;
}

function findTopLevelEqual(text) {
  let depth = 0;
  let quote = "";

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if ((char === "'" || char === "\"") && !quote) {
      quote = char;
    } else if (char === quote) {
      quote = "";
    } else if (!quote && char === "(") {
      depth += 1;
    } else if (!quote && char === ")") {
      depth = Math.max(0, depth - 1);
    }

    if (!quote && depth === 0 && char === "=") {
      return index;
    }
  }

  return -1;
}

function explainJob(parsed, params) {
  const classParam = findParam(params, "CLASS");
  const msgClass = findParam(params, "MSGCLASS");
  const notify = findParam(params, "NOTIFY");
  const parts = [`Inicia el job ${parsed.name || "sin nombre explícito"}.`];

  if (classParam) {
    parts.push(`CLASS=${classParam.value} sugiere la cola o prioridad de ejecución.`);
  }

  if (msgClass) {
    parts.push(`MSGCLASS=${msgClass.value} controla dónde se enviará el log/listing del job.`);
  }

  if (notify) {
    parts.push(`NOTIFY=${notify.value} pide avisar a ese usuario al finalizar.`);
  }

  return parts.join(" ");
}

function explainExec(parsed, params) {
  const pgm = findParam(params, "PGM");
  const proc = findParam(params, "PROC") || (!(params[0] && params[0].positional) ? null : params[0]);
  const cond = findParam(params, "COND");
  const parts = [`Define el paso ${parsed.name || "sin nombre"}.`];

  if (pgm) {
    parts.push(`Ejecuta el programa ${pgm.value}.`);
  } else if (proc) {
    parts.push(`Invoca el procedimiento ${proc.value}.`);
  } else {
    parts.push("No se ve PGM= ni PROC=; puede depender de sintaxis posicional o de una continuación.");
  }

  if (cond) {
    parts.push(`COND=${cond.value} condiciona si este paso se salta según códigos de retorno previos.`);
  }

  return parts.join(" ");
}

function explainDd(parsed, params, currentStep) {
  const dsn = findParam(params, "DSN") || findParam(params, "DSNAME");
  const sysout = findParam(params, "SYSOUT");
  const disp = findParam(params, "DISP");
  const space = findParam(params, "SPACE");
  const unit = findParam(params, "UNIT");
  const dcb = findParam(params, "DCB");
  const parts = [`Define el DD ${parsed.name || "sin nombre"}${currentStep ? ` para el paso ${currentStep}` : ""}.`];

  if (isInlineDataDd(parsed.parameters)) {
    if (/^SYSIN$/i.test(parsed.name || "")) {
      parts.push("El contenido explicito de SYSIN viene en las lineas siguientes hasta /*; esas lineas son instrucciones de control para el programa del paso, no sentencias JCL.");
    } else {
      parts.push("Los datos de entrada vienen en las líneas siguientes hasta encontrar /*.");
    }
  } else if (sysout) {
    parts.push(`Envía la salida a SYSOUT=${sysout.value}, normalmente spool JES.`);
  } else if (dsn) {
    parts.push(`Conecta con el dataset ${dsn.value}.`);
  } else if (/DUMMY\b/i.test(parsed.parameters)) {
    parts.push("Usa DUMMY: el programa ve el DD, pero no lee ni escribe un dataset real.");
  } else {
    parts.push("No se detectó DSN= ni SYSOUT=; puede ser una referencia especial, una concatenación o una continuación.");
  }

  if (disp) {
    parts.push(`DISP=${disp.value} indica estado inicial y qué hacer al terminar normal o anormalmente.`);
  }

  if (space) {
    parts.push(`SPACE=${space.value} reserva espacio si se crea un dataset.`);
  }

  if (unit) {
    parts.push(`UNIT=${unit.value} selecciona tipo de unidad o grupo de dispositivos.`);
  }

  if (dcb) {
    parts.push(`DCB=${dcb.value} describe atributos como formato, longitud de registro o bloque.`);
  }

  return parts.join(" ");
}

function formatParameter(param) {
  if (param.positional) {
    return `${param.key}: ${param.value}`;
  }

  const known = {
    CLASS: "clase de ejecución",
    MSGCLASS: "clase de mensajes",
    NOTIFY: "usuario a notificar",
    PGM: "programa",
    PROC: "procedimiento",
    DSN: "dataset",
    DSNAME: "dataset",
    DISP: "disposición",
    SPACE: "espacio",
    DCB: "atributos de dataset",
    UNIT: "unidad",
    SYSOUT: "salida JES",
    COND: "condición",
    PARM: "parámetros al programa",
    REGION: "memoria",
    TIME: "límite de tiempo"
  };

  return `${param.key}${known[param.key] ? ` (${known[param.key]})` : ""}: ${param.value}`;
}

function buildHelpItems(params) {
  const helpItems = [];
  const disp = findParam(params, "DISP");
  const dcb = findParam(params, "DCB");
  const space = findParam(params, "SPACE");

  if (disp) {
    helpItems.push(buildDispHelp(disp.value));
  }

  if (dcb) {
    helpItems.push(buildDcbHelp(dcb.value));
  }

  if (space) {
    helpItems.push(buildSpaceHelp(space.value));
  }

  return helpItems;
}

function analyzeInlineDataLine(rawLine, currentDd, currentProgram = "") {
  const compact = rawLine.trim();
  const sortHelpItems = buildSortHelpItems(compact);
  const isSysin = /^SYSIN$/i.test(currentDd || "");

  if (sortHelpItems.length) {
    const sortParams = extractSortControlParameters(compact);
    return {
      type: "SORT",
      title: "Control SORT",
      explanation: isSysin
        ? "Contenido explicito de SYSIN para SORT. Esta sentencia define las claves por las que se ordenan los registros leidos por SORTIN."
        : `Esta linea es una sentencia de control para el programa SORT dentro del DD ${currentDd || "inline"}. Define como se ordenan los registros de entrada.`,
      details: sortParams.map(formatParameter),
      warnings: [],
      helpItems: sortHelpItems
    };
  }

  if (/^(DELETE|DEFINE|ALTER|SET)\b/i.test(compact)) {
    return {
      type: "IDCAMS",
      title: "Control IDCAMS",
      explanation: isSysin
        ? `Contenido explicito de SYSIN para IDCAMS. ${explainIdcamsControl(compact)}`
        : explainIdcamsControl(compact),
      details: [compact],
      warnings: /\bDELETE\b|\bPURGE\b/i.test(compact) ? ["Esta sentencia puede borrar o alterar catalogos/datasets. Revisa el nombre antes de ejecutarla."] : [],
      helpItems: []
    };
  }

  if (isSysin && /^(COPY|SELECT|EXCLUDE|INDD=|OUTDD=)\b/i.test(compact)) {
    return {
      type: "SYSIN",
      title: "Control IEBCOPY",
      explanation: explainIebcopySysin(compact),
      details: [compact],
      warnings: [],
      helpItems: []
    };
  }

  if (isSysin && /\b(NAME|INDEXED|KEYS|RECORDSIZE|TRACKS|CYLINDERS|DATA|INDEX|FREESPACE|CISZ)\b/i.test(compact)) {
    return {
      type: "SYSIN",
      title: "Detalle IDCAMS/VSAM",
      explanation: explainVsamSysinDetail(compact),
      details: [compact],
      warnings: [],
      helpItems: []
    };
  }

  if (/^(SET FROM|ADD ELEMENT|UPDATE ELEMENT|GENERATE ELEMENT|MOVE ELEMENT|RETRIEVE ELEMENT)\b/i.test(compact)) {
    return {
      type: "Endevor SCL",
      title: "Sentencia SCL",
      explanation: isSysin
        ? `Contenido explicito de SYSIN para Endevor batch. ${explainEndevorScl(compact)}`
        : explainEndevorScl(compact),
      details: [compact],
      warnings: [],
      helpItems: []
    };
  }

  if (isSysin) {
    return {
      type: "SYSIN",
      title: "Contenido SYSIN",
      explanation: explainGenericSysinContent(compact, currentProgram),
      details: compact ? [compact] : [],
      warnings: [],
      helpItems: []
    };
  }

  return {
    type: "Datos",
    title: "Dato inline",
    explanation: `Esta linea se entrega como contenido al DD ${currentDd || "inline"}; no se interpreta como sentencia JCL.`,
    details: [],
    warnings: [],
    helpItems: []
  };
}

function explainIebcopySysin(text) {
  if (/^COPY\b/i.test(text)) {
    return "Contenido explicito de SYSIN para IEBCOPY. COPY indica que se copiara contenido desde el DD de entrada indicado por INDD hacia el DD de salida indicado por OUTDD.";
  }

  if (/^SELECT\s+MEMBER=/i.test(text)) {
    return "Contenido explicito de SYSIN para IEBCOPY. SELECT MEMBER limita la copia al miembro indicado, en vez de copiar toda la libreria.";
  }

  if (/^EXCLUDE\s+MEMBER=/i.test(text)) {
    return "Contenido explicito de SYSIN para IEBCOPY. EXCLUDE MEMBER evita copiar el miembro indicado.";
  }

  return "Contenido explicito de SYSIN para IEBCOPY. Esta linea ajusta que miembros o librerias se copian.";
}

function explainVsamSysinDetail(text) {
  if (/\bINDEXED\b/i.test(text)) {
    return "Contenido explicito de SYSIN para IDCAMS. INDEXED indica que el cluster VSAM sera KSDS, es decir, organizado por clave.";
  }

  if (/\bKEYS\s*\(/i.test(text)) {
    return "Contenido explicito de SYSIN para IDCAMS. KEYS define longitud y posicion inicial de la clave del registro VSAM.";
  }

  if (/\bRECORDSIZE\s*\(/i.test(text)) {
    return "Contenido explicito de SYSIN para IDCAMS. RECORDSIZE define el tamano promedio y maximo de los registros.";
  }

  if (/\b(TRACKS|CYLINDERS)\s*\(/i.test(text)) {
    return "Contenido explicito de SYSIN para IDCAMS. Esta linea reserva espacio primario y secundario para el cluster VSAM.";
  }

  if (/^\s*DATA\b/i.test(text)) {
    return "Contenido explicito de SYSIN para IDCAMS. DATA nombra o configura el componente de datos del cluster VSAM.";
  }

  if (/^\s*INDEX\b/i.test(text)) {
    return "Contenido explicito de SYSIN para IDCAMS. INDEX nombra o configura el componente indice del cluster VSAM.";
  }

  if (/\bFREESPACE\s*\(/i.test(text)) {
    return "Contenido explicito de SYSIN para IDCAMS. FREESPACE deja espacio libre en control intervals/areas para futuras inserciones.";
  }

  if (/\bCISZ\s*\(/i.test(text)) {
    return "Contenido explicito de SYSIN para IDCAMS. CISZ define el tamano del control interval del VSAM.";
  }

  return "Contenido explicito de SYSIN para IDCAMS. Esta linea continua o completa la definicion del objeto VSAM.";
}

function explainGenericSysinContent(text, currentProgram) {
  const program = currentProgram ? ` para ${currentProgram}` : "";

  if (!text) {
    return `Linea vacia dentro de SYSIN${program}. No agrega una instruccion, solo separa visualmente el bloque.`;
  }

  return `Contenido explicito de SYSIN${program}. Esta linea no es JCL: se entrega como instruccion de control al programa que se esta ejecutando en el paso.`;
}

function explainIdcamsControl(text) {
  if (/^DELETE\b/i.test(text)) {
    return "Comando IDCAMS para borrar una entrada catalogada, dataset o cluster VSAM. PURGE fuerza el borrado aunque haya retencion.";
  }

  if (/^DEFINE\s+CLUSTER\b/i.test(text)) {
    return "Comando IDCAMS que inicia la definicion de un cluster VSAM, normalmente con atributos de clave, tamano de registro, espacio y componentes DATA/INDEX.";
  }

  if (/^ALTER\b/i.test(text)) {
    return "Comando IDCAMS para modificar atributos de un objeto catalogado. Con NEWNAME se usa para renombrar un dataset o cluster.";
  }

  if (/^SET\s+MAXCC\b/i.test(text)) {
    return "Ajusta el codigo de condicion maximo de IDCAMS. Suele usarse para controlar si un DELETE inexistente debe fallar el job.";
  }

  return "Sentencia de control para IDCAMS.";
}

function explainEndevorScl(text) {
  if (/^SET FROM\b/i.test(text)) {
    return "SCL de Endevor que fija el contexto de inventario: ambiente, sistema, subsistema, tipo y stage desde donde se ejecutara la accion.";
  }

  if (/^ADD ELEMENT\b/i.test(text)) {
    return "SCL de Endevor para agregar un elemento al inventario desde una libreria o dataset de entrada.";
  }

  if (/^UPDATE ELEMENT\b/i.test(text)) {
    return "SCL de Endevor para actualizar un elemento existente.";
  }

  if (/^GENERATE ELEMENT\b/i.test(text)) {
    return "SCL de Endevor para generar/procesar un elemento con sus procesadores.";
  }

  if (/^MOVE ELEMENT\b/i.test(text)) {
    return "SCL de Endevor para mover un elemento entre stages o ambientes.";
  }

  if (/^RETRIEVE ELEMENT\b/i.test(text)) {
    return "SCL de Endevor para recuperar un elemento desde Endevor hacia un dataset externo.";
  }

  return "Sentencia SCL usada por Endevor en ejecucion batch.";
}

function buildSortHelpItems(text) {
  if (!/^SORT\b/i.test(text)) {
    return [];
  }

  const fields = findParam(extractSortControlParameters(text), "FIELDS");
  return fields ? [buildSortFieldsHelp(fields.value)] : [];
}

function extractSortControlParameters(text) {
  return extractParameters(text.replace(/^SORT\b/i, "").trim());
}

function buildDispHelp(value) {
  const parts = parseDispValue(value);
  const status = parts[0] || "";
  const normal = parts[1] || "";
  const abnormal = parts[2] || "";
  const currentMeaning = [];

  if (status) {
    currentMeaning.push(`Estado inicial: ${describeDispStatus(status)}.`);
  }

  if (normal) {
    currentMeaning.push(`Si el paso termina bien: ${describeDispEnd(normal)}.`);
  }

  if (abnormal) {
    currentMeaning.push(`Si el paso falla: ${describeDispEnd(abnormal)}.`);
  }

  if (!normal && !abnormal) {
    currentMeaning.push("Solo se indicó el estado inicial; las acciones al terminar quedan por defecto de z/OS o de la instalación.");
  }

  return {
    key: "DISP",
    buttonLabel: "Ver sintaxis de DISP",
    title: `Sintaxis de DISP (${value})`,
    intro: "DISP indica el estado inicial de un dataset y qué debe hacer z/OS con él cuando el paso termina normal o anormalmente.",
    syntax: "DISP=estado o DISP=(estado,accion-normal,accion-anormal)",
    currentMeaning,
    groups: [
      {
        title: "Estado inicial",
        values: [
          "NEW: crear un dataset nuevo.",
          "OLD: usar un dataset existente con acceso exclusivo.",
          "SHR: usar un dataset existente compartido con otros jobs/usuarios.",
          "MOD: añadir al final si existe; si no existe, crearlo."
        ]
      },
      {
        title: "Acciones al terminar",
        values: [
          "KEEP: conservar el dataset.",
          "CATLG: catalogarlo para poder encontrarlo por nombre.",
          "UNCATLG: quitarlo del catálogo, sin borrar necesariamente los datos.",
          "DELETE: borrar el dataset.",
          "PASS: pasarlo a un paso posterior del mismo job."
        ]
      }
    ]
  };
}

function buildDcbHelp(value) {
  const subparams = parseKeywordSubparameters(value);
  const currentMeaning = subparams.length
    ? subparams.map((param) => `${param.key}: ${describeDcbSubparameter(param.key, param.value)}.`)
    : ["No se pudieron separar subparametros; revisa si DCB esta en una continuacion incompleta."];

  return {
    key: "DCB",
    buttonLabel: "Ver sintaxis de DCB",
    title: `Sintaxis de DCB (${value})`,
    intro: "DCB describe atributos fisicos/logicos del dataset: formato de registro, longitud, bloque y organizacion.",
    syntax: "DCB=(RECFM=formato,LRECL=longitud,BLKSIZE=bloque,DSORG=organizacion)",
    currentMeaning,
    groups: [
      {
        title: "Subparametros comunes",
        values: [
          "RECFM: formato de registro. Ejemplos: F fijo, FB fijo bloqueado, V variable, VB variable bloqueado, U indefinido.",
          "LRECL: longitud logica del registro. En FB suele ser la longitud fija de cada registro.",
          "BLKSIZE: tamano de bloque fisico. BLKSIZE=0 permite que el sistema calcule un valor eficiente.",
          "DSORG: organizacion del dataset, por ejemplo PS secuencial o PO particionado.",
          "BUFNO: numero de buffers de E/S que puede usar el acceso al dataset."
        ]
      },
      {
        title: "Lectura practica",
        values: [
          "DCB suele aparecer al crear datasets nuevos o cuando el programa necesita atributos concretos.",
          "Si el dataset ya existe y esta catalogado, muchos atributos pueden venir del catalogo.",
          "Valores incoherentes con el programa pueden causar errores de apertura o lectura."
        ]
      }
    ]
  };
}

function buildSpaceHelp(value) {
  const parts = parseParenthesizedList(value);
  const unit = parts[0] || "";
  const allocation = parts[1] || "";
  const directory = parts[2] || "";
  const release = parts.slice(2).find((part) => part.toUpperCase() === "RLSE");
  const currentMeaning = [];

  if (unit) {
    currentMeaning.push(`Unidad de asignacion: ${describeSpaceUnit(unit)}.`);
  }

  if (allocation) {
    currentMeaning.push(`Cantidad primaria/secundaria: ${describeSpaceAllocation(allocation)}.`);
  }

  if (directory && !release) {
    currentMeaning.push(`Tercer valor: ${directory}; en datasets particionados puede indicar bloques de directorio.`);
  }

  if (release) {
    currentMeaning.push("RLSE: libera espacio no utilizado al cerrar el dataset.");
  }

  return {
    key: "SPACE",
    buttonLabel: "Ver sintaxis de SPACE",
    title: `Sintaxis de SPACE (${value})`,
    intro: "SPACE reserva espacio cuando un DD crea un dataset nuevo. Define unidad de medida, cantidad primaria, cantidad secundaria y opciones.",
    syntax: "SPACE=(unidad,(primaria,secundaria[,directorio]),RLSE)",
    currentMeaning,
    groups: [
      {
        title: "Unidades habituales",
        values: [
          "TRK: reserva por pistas.",
          "CYL: reserva por cilindros.",
          "BLK: reserva por bloques.",
          "AVGREC=U/K/M: interpreta cantidades como registros, miles o millones de registros."
        ]
      },
      {
        title: "Subparametros",
        values: [
          "primaria: espacio inicial que se asigna al crear el dataset.",
          "secundaria: extensiones adicionales si el dataset crece.",
          "directorio: bloques de directorio para datasets particionados.",
          "RLSE: devuelve el espacio sobrante cuando se cierra el dataset."
        ]
      }
    ]
  };
}

function buildSortFieldsHelp(value) {
  const fields = parseSortFields(value);
  const currentMeaning = fields.length
    ? fields.map((field, index) => `Clave ${index + 1}: empieza en posicion ${field.position}, longitud ${field.length}, formato ${describeSortFormat(field.format)}, orden ${describeSortOrder(field.order)}.`)
    : ["No se pudieron separar las claves. En SORT FIELDS normalmente se agrupan como posicion,longitud,formato,orden."];

  return {
    key: "SORT_FIELDS",
    buttonLabel: "Ver sintaxis de SORT FIELDS",
    title: `Sintaxis de SORT FIELDS (${value})`,
    intro: "SORT FIELDS define las claves por las que DFSORT/Syncsort ordena los registros que recibe por SORTIN.",
    syntax: "SORT FIELDS=(posicion,longitud,formato,A|D[,posicion,longitud,formato,A|D]...)",
    currentMeaning,
    groups: [
      {
        title: "Subparametros de cada clave",
        values: [
          "posicion: columna inicial dentro del registro, empezando normalmente en 1.",
          "longitud: cantidad de bytes/caracteres que forman la clave.",
          "formato: tipo de dato de la clave, por ejemplo CH, BI, PD, ZD.",
          "A: orden ascendente.",
          "D: orden descendente."
        ]
      },
      {
        title: "Formatos frecuentes",
        values: [
          "CH: caracteres.",
          "BI: binario.",
          "PD: packed decimal.",
          "ZD: zoned decimal.",
          "FI: entero binario con signo."
        ]
      }
    ]
  };
}

function parseDispValue(value) {
  const trimmed = value.trim();
  const inner = trimmed.startsWith("(") && trimmed.endsWith(")")
    ? trimmed.slice(1, -1)
    : trimmed;

  return splitTopLevel(inner, ",").map((part) => part.trim().toUpperCase()).filter(Boolean);
}

function parseParenthesizedList(value) {
  const trimmed = value.trim();
  const inner = trimmed.startsWith("(") && trimmed.endsWith(")")
    ? trimmed.slice(1, -1)
    : trimmed;

  return splitTopLevel(inner, ",").map((part) => part.trim()).filter(Boolean);
}

function parseKeywordSubparameters(value) {
  return parseParenthesizedList(value).map((part) => {
    const equalIndex = findTopLevelEqual(part);

    if (equalIndex === -1) {
      return { key: part.toUpperCase(), value: "" };
    }

    return {
      key: part.slice(0, equalIndex).trim().toUpperCase(),
      value: part.slice(equalIndex + 1).trim()
    };
  });
}

function describeDcbSubparameter(key, value) {
  const normalized = key.toUpperCase();
  const descriptions = {
    RECFM: `formato de registro ${value}; ${describeRecfm(value)}`,
    LRECL: `longitud logica de registro ${value}`,
    BLKSIZE: value === "0" ? "bloque calculado por el sistema" : `tamano de bloque ${value}`,
    DSORG: `organizacion ${value}; ${describeDsorg(value)}`,
    BUFNO: `numero de buffers ${value}`
  };

  return descriptions[normalized] || (value ? `subparametro ${key} con valor ${value}` : `opcion ${key}`);
}

function describeRecfm(value) {
  const normalized = value.toUpperCase();
  const descriptions = {
    F: "registros fijos",
    FB: "registros fijos bloqueados",
    V: "registros variables",
    VB: "registros variables bloqueados",
    U: "registros indefinidos"
  };

  return descriptions[normalized] || "formato menos comun o dependiente de instalacion";
}

function describeDsorg(value) {
  const normalized = value.toUpperCase();
  const descriptions = {
    PS: "dataset secuencial",
    PO: "dataset particionado",
    DA: "dataset de acceso directo"
  };

  return descriptions[normalized] || "organizacion menos comun o dependiente de instalacion";
}

function describeSpaceUnit(value) {
  const normalized = value.toUpperCase();
  const descriptions = {
    TRK: "pistas",
    CYL: "cilindros",
    BLK: "bloques"
  };

  if (normalized.startsWith("AVGREC=")) {
    return `${value}, usando cantidad basada en registros`;
  }

  return descriptions[normalized] || value;
}

function describeSpaceAllocation(value) {
  const parts = parseParenthesizedList(value);

  if (parts.length >= 2) {
    return `${parts[0]} primaria y ${parts[1]} secundaria`;
  }

  return value;
}

function parseSortFields(value) {
  const parts = parseParenthesizedList(value);
  const fields = [];

  for (let index = 0; index + 3 < parts.length; index += 4) {
    fields.push({
      position: parts[index],
      length: parts[index + 1],
      format: parts[index + 2],
      order: parts[index + 3]
    });
  }

  return fields;
}

function describeSortFormat(value) {
  const normalized = value.toUpperCase();
  const descriptions = {
    CH: "caracteres",
    BI: "binario",
    PD: "packed decimal",
    ZD: "zoned decimal",
    FI: "entero binario con signo"
  };

  return descriptions[normalized] || value;
}

function describeSortOrder(value) {
  const normalized = value.toUpperCase();
  const descriptions = {
    A: "ascendente",
    D: "descendente"
  };

  return descriptions[normalized] || value;
}

function describeDispStatus(value) {
  const descriptions = {
    NEW: "crea un dataset nuevo",
    OLD: "usa un dataset existente con acceso exclusivo",
    SHR: "usa un dataset existente en modo compartido",
    MOD: "añade al final de un dataset existente o lo crea si no existe"
  };

  return descriptions[value.toUpperCase()] || `${value} no es un estado común de DISP`;
}

function describeDispEnd(value) {
  const descriptions = {
    KEEP: "conservar el dataset",
    CATLG: "catalogar el dataset",
    UNCATLG: "descatalogar el dataset",
    DELETE: "borrar el dataset",
    PASS: "dejarlo disponible para pasos posteriores del job"
  };

  return descriptions[value.toUpperCase()] || `${value} no es una acción común de finalización`;
}

function buildWarnings(operation, params, parameterText) {
  const warnings = [];
  const disp = findParam(params, "DISP");
  const dsn = findParam(params, "DSN") || findParam(params, "DSNAME");

  if (operation === "DD" && disp && /\bOLD\b/i.test(disp.value)) {
    warnings.push("DISP=OLD suele pedir acceso exclusivo al dataset. Si otro job lo usa, puede provocar espera o conflicto.");
  }

  if (operation === "DD" && disp && /\bDELETE\b/i.test(disp.value)) {
    warnings.push("Esta línea puede borrar el dataset según el resultado del paso. Conviene revisar la tupla DISP completa.");
  }

  if (operation === "DD" && dsn && /&&/.test(dsn.value)) {
    warnings.push("El DSN empieza con &&: es un dataset temporal, normalmente visible solo durante este job.");
  }

  if (parameterText.trim().endsWith(",")) {
    warnings.push("La coma final indica que la sentencia continúa en la siguiente línea.");
  }

  warnings.push(...continuationWarnings(parameterText));
  return [...new Set(warnings)];
}

function continuationWarnings(parameterText) {
  if (parameterText.trim().startsWith(",")) {
    return ["La línea parece una continuación. En JCL, la posición de la continuación puede ser importante según la instalación y el estándar usado."];
  }

  return [];
}

function isInlineDataDd(parameterText) {
  return /^(\*|DATA\b)/i.test(parameterText.trim());
}

function findParam(params, key) {
  return params.find((param) => param.key === key);
}

function makeResult(lineNumber, rawLine, type, title, explanation, details, warnings, helpItems = []) {
  return { lineNumber, rawLine, type, title, explanation, details, warnings, helpItems };
}

function updateLineCount(count) {
  if (lineCount) {
    lineCount.textContent = String(count);
  }
}

function renderAnalysis(analysis) {
  updateLineCount(analysis.length);

  if (!analysis.length) {
    results.className = "results empty-state";
    results.textContent = "El análisis aparecerá aquí.";
    renderSummary([]);
    return;
  }

  results.className = "results";
  results.innerHTML = "";
  analysis.forEach((item) => {
    results.appendChild(renderLineCard(item));
  });
  renderSummary(analysis);
}

function renderLineCard(item) {
  const card = document.createElement("article");
  card.className = "line-card";
  card.dataset.type = item.type.toLowerCase().replace(/\//g, "-").replace(/\s+/g, "-");

  const number = document.createElement("div");
  number.className = "line-number";
  number.textContent = item.lineNumber;

  const body = document.createElement("div");
  const code = document.createElement("pre");
  code.className = "line-code";
  code.textContent = item.rawLine || " ";

  const title = document.createElement("div");
  title.className = "line-title";
  title.innerHTML = `<strong>${escapeHtml(item.title)}</strong>`;

  const explanation = document.createElement("p");
  explanation.className = "line-explanation";
  explanation.textContent = item.explanation;

  body.append(code, title, explanation);

  if (item.details.length) {
    const details = document.createElement("div");
    details.className = "details";
    item.details.forEach((detail) => {
      const chip = document.createElement("span");
      chip.className = "detail-chip";
      chip.textContent = detail;
      details.appendChild(chip);
    });
    body.appendChild(details);
  }

  if (item.helpItems.length) {
    const helpActions = document.createElement("div");
    helpActions.className = "help-actions";
    item.helpItems.forEach((helpItem) => {
      helpActions.appendChild(renderHelpItem(helpItem));
    });
    body.appendChild(helpActions);
  }

  item.warnings.forEach((warning) => {
    const warningBox = document.createElement("div");
    warningBox.className = "warning";
    warningBox.textContent = warning;
    body.appendChild(warningBox);
  });

  card.append(number, body);
  return card;
}

function renderHelpItem(helpItem) {
  const details = document.createElement("details");
  details.className = helpItem.key === "DISP" ? "syntax-help syntax-help--disp" : "syntax-help";

  const summary = document.createElement("summary");
  summary.textContent = helpItem.buttonLabel;
  details.appendChild(summary);

  const content = document.createElement("div");
  content.className = "syntax-help-content";

  const title = document.createElement("strong");
  title.textContent = helpItem.title;

  const intro = document.createElement("p");
  intro.textContent = helpItem.intro;

  const syntax = document.createElement("code");
  syntax.textContent = helpItem.syntax;

  content.append(title, intro, syntax);

  if (helpItem.currentMeaning.length) {
    const currentList = document.createElement("ul");
    helpItem.currentMeaning.forEach((meaning) => {
      const item = document.createElement("li");
      item.textContent = meaning;
      currentList.appendChild(item);
    });
    content.appendChild(currentList);
  }

  helpItem.groups.forEach((group) => {
    const groupTitle = document.createElement("strong");
    groupTitle.textContent = group.title;
    const values = document.createElement("ul");
    group.values.forEach((value) => {
      const item = document.createElement("li");
      item.textContent = value;
      values.appendChild(item);
    });
    content.append(groupTitle, values);
  });

  details.appendChild(content);

  if (helpItem.key !== "DISP") {
    return details;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "disp-help-row";

  const paletteButton = document.createElement("button");
  paletteButton.className = "disp-mini-button";
  paletteButton.type = "button";
  paletteButton.textContent = "20";
  paletteButton.setAttribute("aria-label", "Abrir pantalla de opciones visuales DISP");
  paletteButton.addEventListener("click", showDispPaletteScreen);

  wrapper.append(details, paletteButton);
  return wrapper;
}

function renderSummary(analysis) {
  if (!analysis.length) {
    summary.className = "summary empty-state";
    summary.textContent = "Todavía no hay análisis. Pega un JCL y pulsa Analizar linea por linea.";
    return;
  }

  const functionalSummary = buildFunctionalSummary(analysis);
  summary.className = "summary";
  summary.innerHTML = "";
  summary.appendChild(renderFunctionalSummary(functionalSummary));
}

function buildFunctionalSummary(analysis) {
  const job = { name: "Job sin nombre", className: "", msgClass: "" };
  const steps = [];
  const datasets = [];
  const sortControls = [];
  let currentStep = null;
  let lastDataset = null;

  analysis.forEach((item) => {
    if (!item.rawLine.trim().startsWith("//") && item.type !== "SORT") {
      return;
    }

    if (item.type === "SORT") {
      const fields = item.helpItems.find((help) => help.key === "SORT_FIELDS");
      sortControls.push(fields ? fields.currentMeaning.join(" ") : "Ordena registros con SORT FIELDS.");
      return;
    }

    const parsed = parseJclStatement(item.rawLine.trimEnd());
    const operation = parsed.operation.toUpperCase();
    const params = extractParameters(parsed.parameters);

    if (operation === "JOB") {
      job.name = parsed.name || job.name;
      const classParam = findParam(params, "CLASS");
      const msgClassParam = findParam(params, "MSGCLASS");
      job.className = classParam ? classParam.value : "";
      job.msgClass = msgClassParam ? msgClassParam.value : "";
      return;
    }

    if (operation === "EXEC") {
      const pgm = findParam(params, "PGM");
      const proc = findParam(params, "PROC") || ((params[0] && params[0].positional) ? params[0] : null);
      currentStep = {
        name: parsed.name || `STEP${steps.length + 1}`,
        target: pgm ? `programa ${pgm.value}` : proc ? `procedimiento ${proc.value}` : "ejecución sin PGM/PROC visible",
        program: pgm ? pgm.value : "",
        notes: []
      };
      steps.push(currentStep);
      lastDataset = null;
      return;
    }

    if (operation === "DD") {
      const dataset = describeDatasetUse(parsed, params, currentStep);
      datasets.push(dataset);
      lastDataset = dataset;
      return;
    }

    if (item.type === "Continuación" && lastDataset) {
      params.forEach((param) => {
        lastDataset.params[param.key] = param.value;
      });
      lastDataset.description = buildDatasetDescription(lastDataset);
    }
  });

  steps.forEach((step) => {
    const stepDatasets = datasets.filter((dataset) => dataset.step === step.name);
    const inputs = stepDatasets.filter((dataset) => dataset.role === "input").map((dataset) => dataset.short);
    const outputs = stepDatasets.filter((dataset) => dataset.role === "output").map((dataset) => dataset.short);
    const sysouts = stepDatasets.filter((dataset) => dataset.role === "sysout").map((dataset) => dataset.short);
    const inline = stepDatasets.filter((dataset) => dataset.role === "inline").map((dataset) => dataset.short);

    if (inputs.length) {
      step.notes.push(`Lee ${inputs.join(", ")}.`);
    }

    if (inline.length) {
      step.notes.push(`Recibe instrucciones inline por ${inline.join(", ")}.`);
    }

    if (outputs.length) {
      step.notes.push(`Genera ${outputs.join(", ")}.`);
    }

    if (sysouts.length) {
      step.notes.push(`Envía mensajes/salida a ${sysouts.join(", ")}.`);
    }

    if (/IEFBR14/i.test(step.program)) {
      step.notes.push("IEFBR14 no procesa datos; se usa normalmente para crear, borrar o catalogar datasets mediante DD.");
    }
  });

  const warnings = analysis.reduce((total, item) => total + item.warnings.length, 0);
  const headlineParts = [`El JCL ${job.name} tiene ${steps.length || 0} paso(s)`];

  if (sortControls.length) {
    headlineParts.push("ordena registros con SORT");
  }

  if (datasets.some((dataset) => /DELETE/i.test(dataset.params.DISP || ""))) {
    headlineParts.push("contiene acciones de borrado de dataset");
  }

  return {
    job,
    steps,
    datasets,
    sortControls,
    warnings,
    headline: `${headlineParts.join(", ")}.`
  };
}

function describeDatasetUse(parsed, params, currentStep) {
  const paramMap = {};
  params.forEach((param) => {
    paramMap[param.key] = param.value;
  });

  const name = parsed.name || "DD sin nombre";
  const dsn = paramMap.DSN || paramMap.DSNAME || "";
  const sysout = paramMap.SYSOUT || "";
  const inline = isInlineDataDd(parsed.parameters);
  const role = inferDatasetRole(name, paramMap, inline);
  const dataset = {
    name,
    step: currentStep ? currentStep.name : "sin paso",
    params: paramMap,
    role,
    short: dsn || (sysout ? `${name} SYSOUT=${sysout}` : name),
    description: ""
  };

  dataset.description = buildDatasetDescription(dataset);
  return dataset;
}

function inferDatasetRole(name, params, inline) {
  if (inline) {
    return "inline";
  }

  if (params.SYSOUT) {
    return "sysout";
  }

  if (/OUT|SORTOUT|REPORT|PRINT/i.test(name) || /\bNEW\b/i.test(params.DISP || "")) {
    return "output";
  }

  return "input";
}

function buildDatasetDescription(dataset) {
  const disp = dataset.params.DISP ? ` con DISP=${dataset.params.DISP}` : "";
  const space = dataset.params.SPACE ? ` y SPACE=${dataset.params.SPACE}` : "";

  if (dataset.role === "inline") {
    return `${dataset.name}: instrucciones o datos inline para el paso ${dataset.step}.`;
  }

  if (dataset.role === "sysout") {
    return `${dataset.name}: salida JES/SYSOUT del paso ${dataset.step}.`;
  }

  return `${dataset.name}: ${dataset.role === "output" ? "salida" : "entrada"} ${dataset.short}${disp}${space}.`;
}

function renderFunctionalSummary(functionalSummary) {
  const fragment = document.createDocumentFragment();
  const lead = document.createElement("div");
  lead.className = "summary-lead";
  lead.innerHTML = `<strong>${escapeHtml(functionalSummary.headline)}</strong><span>${escapeHtml(buildJobSentence(functionalSummary.job))}</span>`;
  fragment.appendChild(lead);

  if (functionalSummary.steps.length) {
    const flow = document.createElement("div");
    flow.className = "summary-flow";
    functionalSummary.steps.forEach((step, index) => {
      const card = document.createElement("div");
      card.className = "flow-step";
      const notes = step.notes.length ? step.notes : ["No se detectaron DD asociados directamente a este paso."];
      card.innerHTML = `
        <div class="flow-step-title"><span class="badge">Paso ${index + 1}</span>${escapeHtml(step.name)} ejecuta ${escapeHtml(step.target)}</div>
        <ul class="summary-list">${notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>
      `;
      flow.appendChild(card);
    });
    fragment.appendChild(flow);
  }

  if (functionalSummary.sortControls.length) {
    fragment.appendChild(summaryCard("Ordenamiento detectado", functionalSummary.sortControls.join(" ")));
  }

  const datasetDescriptions = functionalSummary.datasets
    .filter((dataset) => dataset.description)
    .slice(0, 6)
    .map((dataset) => dataset.description);

  if (datasetDescriptions.length) {
    const datasets = document.createElement("div");
    datasets.className = "summary-card";
    datasets.innerHTML = `<strong>Datasets y recursos</strong><ul class="summary-list">${datasetDescriptions.map((description) => `<li>${escapeHtml(description)}</li>`).join("")}</ul>`;
    fragment.appendChild(datasets);
  }

  fragment.appendChild(summaryCard(
    "Avisos",
    functionalSummary.warnings ? `${functionalSummary.warnings} aviso(s) para revisar antes de ejecutar o modificar el job.` : "No se detectaron avisos especiales."
  ));

  return fragment;
}

function buildJobSentence(job) {
  const details = [];

  if (job.className) {
    details.push(`CLASS=${job.className}`);
  }

  if (job.msgClass) {
    details.push(`MSGCLASS=${job.msgClass}`);
  }

  return details.length
    ? `Configuración principal: ${details.join(", ")}.`
    : "No se detectaron parámetros principales de clase o salida del job.";
}

function summaryCard(title, copy) {
  const card = document.createElement("div");
  card.className = "summary-card";
  const strong = document.createElement("strong");
  strong.textContent = title;
  const span = document.createElement("span");
  span.textContent = copy;
  card.append(strong, span);
  return card;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function setTheme(theme) {
  const isDark = theme === "dark";
  applyThemeState(isDark);
  if (themeButton) {
    themeButton.textContent = isDark ? "Tema claro" : "Tema oscuro";
    themeButton.setAttribute("aria-pressed", String(isDark));
  }
  saveTheme(isDark ? "dark" : "light");
}

const themePalettes = {
  dark: {
    "--bg": "#07110f",
    "--panel": "#0d151b",
    "--panel-rgb": "13, 21, 27",
    "--panel-strong": "#111820",
    "--ink": "#f5f8ff",
    "--muted": "#9ca8b8",
    "--line": "#23313d",
    "--accent": "#33e6a0",
    "--accent-dark": "#7df7d0",
    "--accent-soft": "#102f29",
    "--warn": "#ff6b76",
    "--warn-bg": "#301819",
    "--code": "#090f14",
    "--code-ink": "#eaf7ff",
    "--field": "#081016",
    "--button-soft": "#0b1218",
    "--button-soft-hover": "#14212b",
    "--help-bg": "#0c1b22",
    "--help-line": "#244552",
    "--shadow": "0 22px 58px rgba(0, 0, 0, 0.35)",
    "--shadow-strong": "0 30px 90px rgba(0, 0, 0, 0.55)",
    "--glow": "rgba(142, 162, 255, 0.24)",
    "--grid-line": "rgba(142, 162, 255, 0.08)"
  },
  light: {
    "--bg": "#f3f0ea",
    "--panel": "#fffdf8",
    "--panel-rgb": "255, 253, 248",
    "--panel-strong": "#fbf8f1",
    "--ink": "#1f2933",
    "--muted": "#65707d",
    "--line": "#e2d8ca",
    "--accent": "#4b5bdc",
    "--accent-dark": "#2934a3",
    "--accent-soft": "#e8eaff",
    "--warn": "#9a5b00",
    "--warn-bg": "#fff4d7",
    "--code": "#111827",
    "--code-ink": "#f8fafc",
    "--field": "#fbf8f1",
    "--button-soft": "#ece6dc",
    "--button-soft-hover": "#dfd6c8",
    "--help-bg": "#f4f5ff",
    "--help-line": "#c9cffe",
    "--shadow": "0 18px 45px rgba(41, 52, 94, 0.12)",
    "--shadow-strong": "0 26px 80px rgba(31, 41, 55, 0.18)",
    "--glow": "rgba(75, 91, 220, 0.28)",
    "--grid-line": "rgba(75, 91, 220, 0.08)"
  }
};

function applyThemeState(isDark) {
  const theme = isDark ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
  document.body.setAttribute("data-theme", theme);
  toggleClass(document.documentElement, "theme-dark", isDark);
  toggleClass(document.documentElement, "theme-light", !isDark);
  toggleClass(document.body, "theme-dark", isDark);
  toggleClass(document.body, "theme-light", !isDark);
  applyThemePalette(theme);
}

function applyThemePalette(theme) {
  const palette = themePalettes[theme];
  Object.keys(palette).forEach((key) => {
    document.documentElement.style.setProperty(key, palette[key]);
  });

  document.body.style.background = theme === "dark"
    ? "radial-gradient(circle at 22% 0%, rgba(51, 230, 160, 0.16), transparent 28rem), radial-gradient(circle at 74% 4%, rgba(59, 130, 246, 0.16), transparent 30rem), linear-gradient(120deg, rgba(0, 55, 38, 0.72) 0%, rgba(5, 12, 18, 0.96) 42%, #07101a 100%)"
    : "radial-gradient(circle at top left, rgba(75, 91, 220, 0.22), transparent 34rem), radial-gradient(circle at 82% 12%, rgba(255, 189, 89, 0.16), transparent 24rem), linear-gradient(rgba(75, 91, 220, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(75, 91, 220, 0.08) 1px, transparent 1px), linear-gradient(135deg, #f7f3ec 0%, #f3f0ea 100%)";
  document.body.style.backgroundSize = "auto, auto, 42px 42px, 42px 42px, auto";
  document.body.style.color = theme === "dark" ? "#edf2ff" : "#1f2933";
}

function toggleClass(element, className, shouldHaveClass) {
  if (element.classList) {
    element.classList[shouldHaveClass ? "add" : "remove"](className);
    return;
  }

  const current = ` ${element.className || ""} `;
  const withoutClass = current.replace(` ${className} `, " ").replace(/^\s+|\s+$/g, "");
  element.className = shouldHaveClass ? `${withoutClass} ${className}`.replace(/^\s+|\s+$/g, "") : withoutClass;
}

function getSavedTheme() {
  try {
    return window.localStorage ? localStorage.getItem("jcl-explainer-theme") : null;
  } catch (error) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    if (window.localStorage) {
      localStorage.setItem("jcl-explainer-theme", theme);
    }
  } catch (error) {
    // iOS Safari can block localStorage for file:// pages; the theme still works for this session.
  }
}

function getSavedDispButtonStyle() {
  try {
    if (!window.localStorage) {
      return null;
    }

    const saved = JSON.parse(localStorage.getItem("jcl-explainer-disp-button") || "null");
    return saved && saved.color && saved.ink ? saved : null;
  } catch (error) {
    return null;
  }
}

function saveDispButtonStyle(style) {
  try {
    if (window.localStorage) {
      localStorage.setItem("jcl-explainer-disp-button", JSON.stringify(style));
    }
  } catch (error) {
    // iOS Safari can block localStorage for file:// pages; the selected style still works for this session.
  }
}

function applyDispButtonStyle(style = getSavedDispButtonStyle()) {
  const selectedStyle = style || { color: defaultDispButtonColor, ink: defaultDispButtonInk };
  document.documentElement.style.setProperty("--disp-button-bg", selectedStyle.color);
  document.documentElement.style.setProperty("--disp-button-ink", selectedStyle.ink);
  document.documentElement.style.setProperty("--disp-button-glow", selectedStyle.color);
}

function selectDispButtonStyle(button) {
  const style = {
    color: button.dataset.dispColor || defaultDispButtonColor,
    ink: button.dataset.dispInk || defaultDispButtonInk
  };
  applyDispButtonStyle(style);
  saveDispButtonStyle(style);
  showPreviousScreen();
}

function scrollToSummary() {
  try {
    summaryPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    summaryPanel.scrollIntoView();
  }

  try {
    summaryPanel.focus({ preventScroll: true });
  } catch (error) {
    summaryPanel.focus();
  }
}

function scrollToPanel(panel) {
  try {
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    panel.scrollIntoView();
  }

  try {
    panel.focus({ preventScroll: true });
  } catch (error) {
    panel.focus();
  }
}

function setVisibleScreen(screenName) {
  inputPanel.hidden = screenName !== "menu";
  summaryPanel.hidden = screenName !== "summary";
  resultsPanel.hidden = screenName !== "explanation";
  if (dispPalettePanel) {
    dispPalettePanel.hidden = screenName !== "disp-palette";
  }
  document.body.dataset.screen = screenName;
}

function showMenu() {
  setVisibleScreen("menu");
  try {
    inputPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    inputPanel.scrollIntoView();
  }

  applyStableEditorFrame();
}

function showSummaryScreen() {
  const analysis = analyzeJcl(input.value);
  updateLineCount(analysis.length);
  renderSummary(analysis);
  setVisibleScreen("summary");
  window.scrollTo({ top: 0, behavior: "smooth" });
  scrollToPanel(summaryPanel);
}

function showExplanationScreen() {
  const analysis = analyzeJcl(input.value);
  renderAnalysis(analysis);
  setVisibleScreen("explanation");
  window.scrollTo({ top: 0, behavior: "smooth" });
  scrollToPanel(resultsPanel);
}

function showDispPaletteScreen() {
  previousScreen = document.body.dataset.screen || "explanation";
  setVisibleScreen("disp-palette");
  window.scrollTo({ top: 0, behavior: "smooth" });
  scrollToPanel(dispPalettePanel);
}

function showPreviousScreen() {
  const targetScreen = previousScreen || "explanation";
  const panels = {
    menu: inputPanel,
    summary: summaryPanel,
    explanation: resultsPanel
  };
  setVisibleScreen(targetScreen);
  scrollToPanel(panels[targetScreen] || resultsPanel);
}

function resetOutputState() {
  updateLineCount(0);
  results.className = "results empty-state";
  results.textContent = "El analisis aparecera aqui.";
  summary.className = "summary empty-state";
  summary.textContent = "Todavia no hay analisis. Pega un JCL y elige Resumen simplificado o Analizar linea por linea.";
}

function populateExamples() {
  exampleSelect.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Elegir ejemplo...";
  placeholder.selected = true;
  placeholder.disabled = true;
  exampleSelect.appendChild(placeholder);

  exampleJcls.forEach((example, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `${index + 1}. ${example.title}`;
    option.title = example.description;
    exampleSelect.appendChild(option);
  });
}

function loadSelectedExample() {
  if (exampleSelect.value === "") {
    return;
  }

  const selected = exampleJcls[Number(exampleSelect.value)] || exampleJcls[0];
  input.value = selected.jcl;
  input.scrollTop = 0;
  updateLineCount(input.value.replace(/\r\n/g, "\n").split("\n").length);
  results.className = "results empty-state";
  results.textContent = "Ejemplo cargado. Pulsa Analizar linea por linea para revisarlo completo.";
  summary.className = "summary empty-state";
  summary.textContent = "Ejemplo cargado en el editor. Pulsa Resumen simplificado para ver una lectura rapida.";
  showMenu();
}

populateExamples();
setTheme("dark");
applyDispButtonStyle();
applyStableEditorFrame();
setVisibleScreen("menu");

summaryButton.addEventListener("click", () => {
  showSummaryScreen();
});

analyzeButton.addEventListener("click", () => {
  showExplanationScreen();
});

clearButton.addEventListener("click", () => {
  input.value = "";
  resetOutputState();
  showMenu();
  input.focus();
});

exampleSelect.addEventListener("change", () => {
  loadSelectedExample();
});

if (sampleButton) {
  sampleButton.addEventListener("click", () => {
    loadSelectedExample();
  });
}

if (themeButton) {
  themeButton.addEventListener("click", () => {
    setTheme(document.body.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });
}

backButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showMenu();
  });
});

if (dispPaletteBack) {
  dispPaletteBack.addEventListener("click", showPreviousScreen);
}

dispSwatches.forEach((button) => {
  button.addEventListener("click", () => {
    selectDispButtonStyle(button);
  });
});

function applyStableEditorFrame() {
  if (window.innerWidth > 920) {
    return;
  }

  input.style.width = "calc(100vw - 16px)";
  input.style.maxWidth = "calc(100vw - 16px)";
  input.style.height = "560px";
  input.style.minHeight = "560px";
  input.style.maxHeight = "none";
  input.style.margin = "38px 0 0 calc(50% - 50vw + 8px)";
  input.style.resize = "none";
  input.style.overflow = "auto";
  input.style.fontSize = "16px";
  input.style.lineHeight = "1.5";
  input.style.webkitTextSizeAdjust = "100%";
  input.style.backgroundColor = "#000";
  input.style.color = "#33ff99";
  input.style.caretColor = "#33ff99";
  input.style.borderColor = "#1f5c42";
}

input.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    showExplanationScreen();
  }
});

window.__JCL_APP_READY = true;
