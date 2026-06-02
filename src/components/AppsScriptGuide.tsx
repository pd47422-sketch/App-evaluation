/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Copy, Check, FileSpreadsheet, Code2, Rocket, Github, Globe } from 'lucide-react';

export default function AppsScriptGuide() {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  const googleAppsScriptCode = `// Código para Google Apps Script - Colocar en Extensiones > Apps Script de tu Google Sheet
// Este script permite guardar y sincronizar evaluaciones y comentarios desde la React App

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var action = e.parameter.action;
  
  // Habilitar CORS
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    if (action === "getData") {
      var teachers = getSheetData(sheet, "Docentes");
      var evaluations = getSheetData(sheet, "Evaluaciones");
      var comments = getSheetData(sheet, "Comentarios");
      
      output.setContent(JSON.stringify({
        status: "success",
        data: {
          teachers: teachers,
          evaluations: evaluations,
          comments: comments
        }
      }));
    } else {
      output.setContent(JSON.stringify({
        status: "success",
        message: "Conexión exitosa con Apps Script. Usa action=getData para leer."
      }));
    }
  } catch (err) {
    output.setContent(JSON.stringify({ status: "error", message: err.toString() }));
  }
  
  return output.appendHeader("Access-Control-Allow-Origin", "*");
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    var postData = JSON.parse(e.postData.contents);
    var action = postData.action;
    
    if (action === "addEvaluation") {
      var evalSheet = getOrCreateSheet(sheet, "Evaluaciones");
      var ev = postData.payload;
      
      evalSheet.appendRow([
        ev.id || Utilities.getUuid(),
        ev.teacherId,
        ev.evaluatorType,
        JSON.stringify(ev.scores),
        ev.generalComment,
        ev.academicYear,
        ev.timestamp || new Date().toISOString(),
        ev.ratingAverage
      ]);
      
      output.setContent(JSON.stringify({ status: "success", message: "Evaluación guardada con éxito" }));
      
    } else if (action === "addComment") {
      var commSheet = getOrCreateSheet(sheet, "Comentarios");
      var c = postData.payload;
      
      commSheet.appendRow([
        c.id || Utilities.getUuid(),
        c.teacherId,
        c.comment,
        c.sentiment,
        c.timestamp || new Date().toISOString(),
        c.grade,
        c.subject
      ]);
      
      output.setContent(JSON.stringify({ status: "success", message: "Comentario anónimo guardado" }));
    } else {
      output.setContent(JSON.stringify({ status: "error", message: "Acción no reconocida" }));
    }
  } catch (err) {
    output.setContent(JSON.stringify({ status: "error", message: err.toString() }));
  }
  
  return output.appendHeader("Access-Control-Allow-Origin", "*");
}

// Funciones de soporte
function getSheetData(sheet, name) {
  var activeSheet = sheet.getSheetByName(name);
  if (!activeSheet) return [];
  
  var values = activeSheet.getDataRange().getValues();
  if (values.length <= 1) return []; // Solo cabecera o vacía
  
  var headers = values[0];
  var data = [];
  
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var val = row[j];
      // Detectar si es un valor JSON (como scores)
      if (typeof val === "string" && (val.indexOf("[") === 0 || val.indexOf("{") === 0)) {
        try {
          val = JSON.parse(val);
        } catch(e) {}
      }
      obj[headers[j]] = val;
    }
    data.push(obj);
  }
  return data;
}

function getOrCreateSheet(sheet, name) {
  var activeSheet = sheet.getSheetByName(name);
  if (!activeSheet) {
    activeSheet = sheet.insertSheet(name);
    // Añadir cabeceras básicas
    if (name === "Evaluaciones") {
      activeSheet.appendRow(["id", "teacherId", "evaluatorType", "scores", "generalComment", "academicYear", "timestamp", "ratingAverage"]);
    } else if (name === "Comentarios") {
      activeSheet.appendRow(["id", "teacherId", "comment", "sentiment", "timestamp", "grade", "subject"]);
    } else if (name === "Docentes") {
      activeSheet.appendRow(["id", "name", "level", "grade", "subject", "email", "bio", "avatarUrl"]);
    }
  }
  return activeSheet;
}`;

  const copyToClipboard = (text: string, isScript: boolean) => {
    navigator.clipboard.writeText(text);
    if (isScript) {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } else {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    }
  };

  return (
    <div className="space-y-8" id="guide-root-panel">
      {/* Introduction Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold font-sans text-indigo-950 flex items-center gap-2 mb-3">
          <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
          Guía de Conexión: Google Sheets + GitHub Pages
        </h2>
        <p className="text-sm text-indigo-900 leading-relaxed max-w-4xl">
          Esta aplicación está diseñada para funcionar de manare local inmediata en tu navegador guardando datos en <code className="bg-indigo-100 px-1 py-0.5 rounded font-mono text-xs text-indigo-800">localStorage</code>. 
          Si deseas que los datos se guarden de forma centralizada y segura en un solo Excel colaborativo en la nube, puedes conectarla gratis a 
          <strong> Google Sheets por medio de Apps Script</strong> y subirla en minutos a <strong>GitHub Pages</strong> de forma gratuita.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Step-by-Step Guide Panel */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold font-sans text-slate-800 flex items-center gap-2 border-b pb-2">
            <Rocket className="w-5 h-5 text-blue-600" />
            Paso a Paso del Proceso
          </h3>

          <div className="space-y-4">
            
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-extrabold flex-shrink-0">1</div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">Crear la Hoja de Cálculo en Google Drive</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Crea un nuevo Google Sheet. Crea tres hojas o pestañas en la parte de abajo de tu Sheet con los nombres exactos: 
                  <strong className="text-slate-700"> "Docentes"</strong>, <strong className="text-slate-700">"Evaluaciones"</strong>, y <strong className="text-slate-700">"Comentarios"</strong>.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-extrabold flex-shrink-0">2</div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">Abrir Apps Script e implementar el Código</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  En el menú superior de tu archivo de cálculo, ve a <strong>Extensiones &gt; Apps Script</strong>. Borra todo el código que te aparezca 
                  por defecto e inserta el script de la derecha en su totalidad. Guarda los cambios presionando el disquete.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-extrabold flex-shrink-0">3</div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">Implementar como Aplicación Web ("Web App")</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Haz clic arriba en <strong>"Implementar" &gt; "Nueva implementación"</strong>.<br />
                  - Selecciona el tipo: <strong>"Aplicación Web"</strong>.<br />
                  - Ejecutar como: <strong>"Yo (tu_correo@gmail.com)"</strong>.<br />
                  - Quién tiene acceso: <strong>"Cualquiera"</strong> (importante para que los alumnos puedan mandar evaluaciones sin que tengan que iniciar sesión en Google).<br />
                  - Dale en implementar, autoriza todos los permisos de Google que te pida, y <strong>copia la URL de Aplicación Web generada</strong>.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-extrabold flex-shrink-0">4</div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">Vincular URL en la Web App</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Pega la URL copiada en el panel de **"Conector de Google Sheets"** arriba a la derecha de esta aplicación. Presiona "Vincular".
                  ¡Listo! La aplicación comenzará a enviar las evaluaciones en tiempo real a tu Google Sheet para un control de archivo en vivo.
                </p>
              </div>
            </div>

            {/* Step 5 - GitHub Deploy */}
            <div className="flex gap-4 border-t pt-4 border-dashed border-slate-200">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-extrabold flex-shrink-0">
                <Github className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-indigo-950 text-sm">¿Cómo subirla gratis a Github Pages?</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  1. Descarga el código completo de este proyecto haciendo clic en la rueda de configuración superior derecha ⚙️ de AI Studio y seleccionando <strong>"Export to ZIP"</strong> o <strong>"Export to GitHub"</strong>.<br />
                  2. Crea un repositorio en tu perfil de GitHub de tipo público.<br />
                  3. Si usas ZIP, descomprime el archivo y sube los ficheros a tu repositorio remoto.<br />
                  4. En la configuración del repositorio (<strong className="text-indigo-900">Settings &gt; Pages</strong>), selecciona desplegar desde la rama <strong>main</strong> y selecciona la carpeta <strong>/root</strong> o actívalo con un GitHub Action de Vite básico.<br />
                  5. Tu página estará publicada de forma segura y totalmente gratis en <code className="bg-indigo-50 px-1 py-0.5 rounded font-mono text-xs text-indigo-600">https://usuario.github.io/repositorio</code>.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Script Code Panel */}
        <div className="bg-slate-900 rounded-xl p-5 text-slate-100 flex flex-col h-[550px] shadow-lg border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <span className="text-sm font-bold font-mono text-indigo-400 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-indigo-400" />
              google-sheets-script.js
            </span>
            <button
              onClick={() => copyToClipboard(googleAppsScriptCode, true)}
              className="px-3 py-1.5 text-xs rounded bg-slate-800 hover:bg-slate-700 hover:text-white transition flex items-center gap-1.5 select-none"
            >
              {copiedScript ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Script</span>
                </>
              )}
            </button>
          </div>
          
          <div className="flex-1 overflow-auto text-xs font-mono bg-slate-950 p-4 rounded-lg leading-relaxed text-slate-300 select-all border border-slate-900">
            <pre className="whitespace-pre-wrap">{googleAppsScriptCode}</pre>
          </div>
          
          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5 leading-snug">
            <Globe className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <span>Este script detecta automáticamente las cabeceras creadas. ¡Solo pégalo y corre el desplegado!</span>
          </div>
        </div>

      </div>
    </div>
  );
}
