/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, FormEvent } from 'react';
import { Teacher, Evaluation, StudentComment, EducationalLevel } from './types';
import { INITIAL_TEACHERS, INITIAL_STUDENT_COMMENTS, INITIAL_ANALYTICS } from './mockData';

import TeacherDashboard from './components/TeacherDashboard';
import TeacherReportView from './components/TeacherReportView';
import RubricEvaluationForm from './components/RubricEvaluationForm';
import AppsScriptGuide from './components/AppsScriptGuide';

import {
  GraduationCap,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Link2,
  RefreshCw,
  Search,
  BookOpen,
  Info,
  CheckCircle2,
  AlertCircle,
  CodeXml,
} from 'lucide-react';

export default function App() {
  // Tabs: 'directorio', 'evaluar', 'guia'
  const [activeTab, setActiveTab] = useState<'directorio' | 'evaluar' | 'guia'>('directorio');

  // Load and preserve state via localStorage to handle off-line behavior gracefully
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('evaldocente_teachers');
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  });

  const [evaluations, setEvaluations] = useState<Evaluation[]>(() => {
    const saved = localStorage.getItem('evaldocente_evaluations');
    if (saved) return JSON.parse(saved);
    
    // Auto-generate some initial base evaluations to populate charts
    const initialEvals: Evaluation[] = [];
    INITIAL_TEACHERS.forEach((teacher) => {
      // Create a coordinator evaluation baseline
      initialEvals.push({
        id: `eval_init_${teacher.id}`,
        teacherId: teacher.id,
        evaluatorType: 'coordinador',
        scores: [
          { criterionId: 'planeacion', score: 4 },
          { criterionId: 'dominio_tema', score: 5 },
          { criterionId: 'empatia_relacion', score: 4 },
          { criterionId: 'metodologia', score: 4 },
          { criterionId: 'evaluacion_retro', score: 4 },
        ],
        generalComment: 'Muestra un excelente dominio en su clase y mantiene interesados a los estudiantes.',
        academicYear: '2025-2026',
        timestamp: new Date().toISOString(),
        ratingAverage: 4.2
      });
    });
    return initialEvals;
  });

  const [comments, setComments] = useState<StudentComment[]>(() => {
    const saved = localStorage.getItem('evaldocente_comments');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_COMMENTS;
  });

  // Settings
  const [appsScriptUrl, setAppsScriptUrl] = useState(() => {
    return localStorage.getItem('evaldocente_apps_script_url') || '';
  });
  const [showSettings, setShowSettings] = useState(false);
  const [newUrlInput, setNewUrlInput] = useState(appsScriptUrl);

  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');

  // Selected Teacher ID state
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('t1');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('evaldocente_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('evaldocente_evaluations', JSON.stringify(evaluations));
  }, [evaluations]);

  useEffect(() => {
    localStorage.setItem('evaldocente_comments', JSON.stringify(comments));
  }, [comments]);

  // Synchronize with Google Sheets Apps Script URL
  const handleSyncData = async (targetUrl = appsScriptUrl) => {
    if (!targetUrl.trim()) {
      setSyncStatus('error');
      setSyncMessage('Debes configurar una URL de Google Apps Script primero.');
      return;
    }

    setSyncStatus('syncing');
    setSyncMessage('Conectando con Google Sheets...');

    try {
      // Simple dynamic fetch parameters
      const response = await fetch(`${targetUrl}?action=getData`);
      if (!response.ok) {
        throw new Error('La respuesta de red no fue satisfactoria.');
      }
      const resData = await response.json();

      if (resData.status === 'success' && resData.data) {
        const { teachers: remoteTeachers, evaluations: remoteEvals, comments: remoteComments } = resData.data;
        
        // Merge or replace depending on what is stored in sheet
        if (remoteTeachers && remoteTeachers.length > 0) {
          setTeachers(remoteTeachers);
        }
        if (remoteEvals && remoteEvals.length > 0) {
          setEvaluations(remoteEvals);
        }
        if (remoteComments && remoteComments.length > 0) {
          setComments(remoteComments);
        }

        setSyncStatus('success');
        setSyncMessage('¡Servicios sincronizados con la hoja de Google Sheets!');
      } else {
        throw new Error(resData.message || 'Error en formato devuelto por Apps Script.');
      }
    } catch (err: any) {
      setSyncStatus('error');
      setSyncMessage(`Error de sincronización: Asegúrate de que tu Apps Script esté publicado con acceso para "Cualquiera" y soporte CORS.`);
    }

    setTimeout(() => {
      setSyncStatus('idle');
    }, 6000);
  };

  const handleSaveSettings = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem('evaldocente_apps_script_url', newUrlInput);
    setAppsScriptUrl(newUrlInput);
    setShowSettings(false);
    
    if (newUrlInput.trim()) {
      handleSyncData(newUrlInput);
    }
  };

  const selectedTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];
  const selectedTeacherEvals = evaluations.filter((ev) => ev.teacherId === selectedTeacher?.id);
  const selectedTeacherComments = comments.filter((c) => c.teacherId === selectedTeacher?.id);
  const selectedTeacherAnalytics = INITIAL_ANALYTICS[selectedTeacher?.id];

  // Callback to add evaluation
  const handleAddEvaluation = (newEval: Evaluation) => {
    setEvaluations((prev) => [newEval, ...prev]);
  };

  // Callback to add comment
  const handleAddComment = (newComment: StudentComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  // Callback to add teacher
  const handleAddTeacher = (newTeacher: Teacher) => {
    setTeachers((prev) => [...prev, newTeacher]);
    setSelectedTeacherId(newTeacher.id);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col antialiased selection:bg-indigo-100" id="main-app-container">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-100">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-slate-950 font-sans block">EvalDocente</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block -mt-1">Control del Profesorado</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex gap-1 bg-slate-100/80 p-1.5 rounded-xl text-xs font-bold" aria-label="Tabs Principales">
              <button
                onClick={() => setActiveTab('directorio')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'directorio' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Directorio y Métricas
              </button>
              <button
                onClick={() => setActiveTab('evaluar')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'evaluar' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Evaluar Docente
              </button>
              <button
                onClick={() => setActiveTab('guia')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'guia' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Conector Sheets & GitHub
              </button>
            </nav>

            {/* Settings & Sheets Sync Area */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`text-xs font-bold py-2.5 px-3.5 rounded-xl border flex items-center gap-1.5 cursor-pointer transition ${
                  appsScriptUrl
                    ? 'border-indigo-100 bg-indigo-50/50 text-indigo-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:text-slate-800'
                }`}
              >
                <Link2 className="w-4 h-4" />
                <span className="hidden sm:inline">{appsScriptUrl ? 'Excel Vinculado' : 'Vincular Google Sheets'}</span>
              </button>
              
              {appsScriptUrl && (
                <button
                  onClick={() => handleSyncData()}
                  disabled={syncStatus === 'syncing'}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition hover:rotate-180 duration-500 disabled:opacity-50 cursor-pointer"
                  title="Sincronizar datos"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Settings Drawer Modal */}
      {showSettings && (
        <div className="bg-white border-b border-slate-200 py-5 px-4 shadow-sm animate-fade-in animate-duration-100 select-none">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Configuración: Google Sheet Integración</h3>
            <form onSubmit={handleSaveSettings} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <FileSpreadsheet className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={newUrlInput}
                  onChange={(e) => setNewUrlInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Guardar y Vincular
                </button>
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="px-3 py-2.5 text-xs font-semibold text-slate-500 bg-white border rounded-xl hover:bg-slate-50 transition"
                >
                  Cerrar
                </button>
              </div>
            </form>
            <p className="text-[10px] text-slate-400 mt-2">
              ¿No tienes una URL? Ve a la pestaña <strong>"Conector Sheets & GitHub"</strong> para copiar el script gratuito de automatización y crear tu hoja en 3 minutos.
            </p>
          </div>
        </div>
      )}

      {/* Sync visual results alerts banner */}
      {syncMessage && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-4">
          <div className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs ${
            syncStatus === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
            syncStatus === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}>
            {syncStatus === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> :
             syncStatus === 'error' ? <AlertCircle className="w-4 h-4 text-red-600" /> : <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />}
            <span className="font-semibold">{syncMessage}</span>
          </div>
        </div>
      )}

      {/* Main Container Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mobile quick-switch bar */}
        <div className="flex md:hidden gap-1.5 p-1 bg-slate-100 rounded-xl mb-6 text-xs font-bold select-none">
          <button
            onClick={() => setActiveTab('directorio')}
            className={`flex-1 py-2 text-center rounded-lg ${
              activeTab === 'directorio' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
            }`}
          >
            Directorio / Reportes
          </button>
          <button
            onClick={() => setActiveTab('evaluar')}
            className={`flex-1 py-2 text-center rounded-lg ${
              activeTab === 'evaluar' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
            }`}
          >
            Evaluar
          </button>
          <button
            onClick={() => setActiveTab('guia')}
            className={`flex-1 py-2 text-center rounded-lg ${
              activeTab === 'guia' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
            }`}
          >
            Hojas / GitHub
          </button>
        </div>

        {/* Dynamic Route/View renders */}
        <div className="space-y-8">
          {activeTab === 'directorio' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Directory Sidebar list - Col 4 */}
              <div className="lg:col-span-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-500" />
                    Listado de Profesores
                  </h3>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2 py-0.5 rounded-full">
                    {teachers.length} registrados
                  </span>
                </div>

                <TeacherDashboard
                  teachers={teachers}
                  selectedTeacherId={selectedTeacherId}
                  onSelectTeacher={(id) => setSelectedTeacherId(id)}
                  onAddTeacher={handleAddTeacher}
                />
              </div>

              {/* Dynamic Assessment Report Panel - Col 8 */}
              <div className="lg:col-span-8">
                {selectedTeacher ? (
                  <TeacherReportView
                    teacher={selectedTeacher}
                    evaluations={selectedTeacherEvals}
                    comments={selectedTeacherComments}
                    analytics={selectedTeacherAnalytics}
                  />
                ) : (
                  <div className="text-center py-20 bg-white border border-dashed rounded-2xl">
                    <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-800">Ningún docente seleccionado</h3>
                    <p className="text-slate-500 text-xs mt-1">Selecciona un profesor en la lista izquierda para visualizar su reporte analítico.</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {activeTab === 'evaluar' && (
            <div className="max-w-4xl mx-auto">
              <RubricEvaluationForm
                teachers={teachers}
                selectedTeacherId={selectedTeacherId}
                onAddEvaluation={handleAddEvaluation}
                onAddComment={handleAddComment}
                appsScriptUrl={appsScriptUrl}
              />
            </div>
          )}

          {activeTab === 'guia' && (
            <div className="max-w-6xl mx-auto">
              <AppsScriptGuide />
            </div>
          )}
        </div>

      </main>

      {/* Page Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12 text-slate-400 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="text-indigo-600 font-bold">EvalDocente v1.2</span>
            <span>•</span>
            <span>Estándares de Evaluación Educativa</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Listo para exportar a GitHub Pages</span>
            <CodeXml className="w-3.5 h-3.5 text-indigo-600" />
          </div>
        </div>
      </footer>

    </div>
  );
}
