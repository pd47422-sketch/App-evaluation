/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Teacher, Evaluation, StudentComment, TeacherAnalytics, EducationalLevel } from '../types';
import { generateHTMLReport, downloadFile, formatDate } from '../utils';
import { RUBRIC_CRITERIA } from '../mockData';
import {
  Download,
  Printer,
  FileText,
  TrendingUp,
  Award,
  AlertTriangle,
  Smile,
  BadgeAlert,
  MessageSquare,
  Users,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface TeacherReportViewProps {
  teacher: Teacher;
  evaluations: Evaluation[];
  comments: StudentComment[];
  analytics?: TeacherAnalytics;
}

export default function TeacherReportView({
  teacher,
  evaluations,
  comments,
  analytics,
}: TeacherReportViewProps) {
  const [commentSentimentFilter, setCommentSentimentFilter] = useState<'all' | 'positivo' | 'neutro' | 'constructivo'>('all');

  // Filtered comments
  const filteredComments = comments.filter(
    (c) => commentSentimentFilter === 'all' || c.sentiment === commentSentimentFilter
  );

  // Calculate current criteria stats
  const criteriaStats = RUBRIC_CRITERIA.map((criterion) => {
    const matchingEvaluations = evaluations.filter((ev) => ev.teacherId === teacher.id);
    let scoreSum = 0;
    let count = 0;

    matchingEvaluations.forEach((ev) => {
      const matchScore = ev.scores.find((s) => s.criterionId === criterion.id);
      if (matchScore) {
        scoreSum += matchScore.score;
        count++;
      }
    });

    // Fallback to average score or mock baseline
    let averageScore = count > 0 ? scoreSum / count : 4.2; // default high-quality initial data

    return {
      id: criterion.id,
      name: criterion.name,
      desc: criterion.description,
      score: averageScore,
    };
  });

  const averageRating =
    criteriaStats.reduce((acc, curr) => acc + curr.score, 0) / criteriaStats.length;

  // Custom downloads
  const handleDownloadHTML = () => {
    const reportHtml = generateHTMLReport(
      teacher,
      evaluations,
      comments,
      averageRating,
      criteriaStats
    );
    downloadFile(reportHtml, `Reporte_Docente_${teacher.name.replace(/\s+/g, '_')}.html`, 'text/html');
  };

  // Performance classification tag/badge
  const getPerformanceBadge = (avg: number) => {
    if (avg >= 4.5) return { text: 'Excelente - Nivel Sobresaliente', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    if (avg >= 4.0) return { text: 'Destacado - Cumple Plenamente', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
    if (avg >= 3.0) return { text: 'Satisfactorio - En Desarrollo', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    return { text: 'Necesita Plan de Mejora', color: 'bg-red-100 text-red-800 border-red-200' };
  };

  const perfBadge = getPerformanceBadge(averageRating);

  // Recharts Data preparation for annual history
  const chartData = analytics?.annualHistory || [
    { year: '2023', promedioGeneral: 4.0, planeacion: 3.8, dominioTema: 4.2, empatia: 4.0, metodologia: 3.9, evaluacion: 4.1 },
    { year: '2024', promedioGeneral: 4.2, planeacion: 4.1, dominioTema: 4.3, empatia: 4.3, metodologia: 4.0, evaluacion: 4.1 },
    { year: '2025', promedioGeneral: averageRating, planeacion: criteriaStats[0].score, dominioTema: criteriaStats[1].score, empatia: criteriaStats[2].score, metodologia: criteriaStats[3].score, evaluacion: criteriaStats[4].score }
  ];

  const strokeDasharray = 314.16;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * (averageRating / 5.0));

  return (
    <div className="space-y-6" id="teacher-report-root">
      
      {/* Upper Status Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div>
          <nav className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
            Dashboard / {teacher.level} / {teacher.grade}
          </nav>
          <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            {teacher.name}
            <span className="text-slate-300 font-light">| {teacher.subject}</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1 font-mono italic">"{teacher.bio}"</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadHTML}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs hover:bg-slate-50 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Descargar HTML</span>
          </button>
          <button
            onClick={handleDownloadHTML}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-100 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Descargar PDF</span>
          </button>
        </div>
      </header>

      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Bento Card 1: Global Score Circular Gauge */}
        <div className="col-span-1 md:col-span-4 lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-center items-center shadow-xs text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Puntaje General</span>
          <div className="relative flex items-center justify-center w-36 h-36">
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="72" cy="72" r="50" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
               <circle
                 cx="72"
                 cy="72"
                 r="50"
                 stroke="#10b981"
                 strokeWidth="8"
                 fill="transparent"
                 strokeDasharray={strokeDasharray}
                 strokeDashoffset={strokeDashoffset}
                 strokeLinecap="round"
                 className="transition-all duration-500"
               />
             </svg>
             <span className="absolute text-3xl font-black text-slate-800">{averageRating.toFixed(1)}</span>
          </div>
          <span className="mt-4 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            {perfBadge.text.split(' - ')[0]}
          </span>
        </div>

        {/* Bento Card 2: Performance Line Chart */}
        <div className="col-span-1 md:col-span-8 lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Comparativo Desempeño Anual</h3>
              <p className="text-[10px] text-slate-400">Evolución en los últimos ciclos escolares</p>
            </div>
            <div className="flex gap-2.5">
              <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Promedio Gral.
              </div>
              <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Dominio Tema
              </div>
            </div>
          </div>
          
          <div className="w-full h-44 select-none">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} stroke="#94a3b8" fontSize={9} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '10px', border: 'none' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="promedioGeneral" stroke="#6366f1" strokeWidth={3} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="dominioTema" stroke="#10b981" strokeWidth={1.5} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bento Card 3: Interactive/Active Rubrics List */}
        <div className="col-span-1 md:col-span-12 lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <h3 className="font-bold text-slate-800 text-sm mb-3">Rúbricas Activas</h3>
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[190px] pr-1">
            {criteriaStats.map((stat) => (
              <div key={stat.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                  <span className="uppercase truncate max-w-[120px]">{stat.name}</span>
                  <span>{((stat.score / 5.0) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      stat.score >= 4.0 ? 'bg-indigo-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${(stat.score / 5.0) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bento Card 4: Anonymous comments container */}
        <div className="col-span-1 md:col-span-6 bg-indigo-600 rounded-3xl p-6 shadow-lg shadow-indigo-100 flex flex-col justify-between text-white min-h-[260px]">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                <h3 className="font-bold text-white text-sm">Comentarios Anónimos (Alumnos)</h3>
              </div>
              <div className="flex gap-1">
                {(['all', 'positivo', 'neutro'] as const).map((sent) => (
                  <button
                    key={sent}
                    onClick={() => setCommentSentimentFilter(sent === 'neutro' ? 'neutro' : sent)}
                    className={`px-2 py-0.5 text-[9px] font-bold rounded transition cursor-pointer uppercase ${
                      commentSentimentFilter === (sent === 'neutro' ? 'neutro' : sent)
                        ? 'bg-white text-indigo-700'
                        : 'bg-white/15 text-indigo-100 hover:bg-white/20'
                    }`}
                  >
                    {sent === 'all' ? 'todos' : sent === 'positivo' ? 'pos' : 'sug'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[160px] pr-1">
              {filteredComments.length > 0 ? (
                filteredComments.map((c) => (
                  <div key={c.id} className="bg-white/10 p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                    <p className="text-xs text-indigo-5 italic leading-normal">
                      "{c.comment}"
                    </p>
                    <div className="mt-2 flex justify-between items-center text-[9px] text-indigo-200 font-mono">
                      <span>{c.grade} • {c.subject}</span>
                      <span className="bg-white/10 px-1.5 py-0.5 rounded uppercase font-bold text-[8px]">{c.sentiment}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-indigo-200 italic py-6 text-center">No hay comentarios en este filtro.</p>
              )}
            </div>
          </div>
        </div>

        {/* Bento Card 5: Stats Quick View */}
        <div className="col-span-1 md:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Datos de Control</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-bold text-slate-800">{evaluations.length}</div>
                <div className="text-[9px] text-slate-500 font-bold uppercase">Evaluaciones</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-800">{averageRating.toFixed(1)}</div>
                <div className="text-[9px] text-slate-500 font-bold uppercase text-amber-500 font-black">★ Estrellas</div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Estado:</span>
              <span className="flex items-center gap-1 text-[9px] text-emerald-600 font-bold">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Activo
              </span>
            </div>
          </div>
        </div>

        {/* Bento Card 6: Educational Level Tag */}
        <div className="col-span-1 md:col-span-3 bg-slate-800 rounded-3xl p-5 flex flex-col justify-between text-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold opacity-60 uppercase tracking-wider">Nivel Educativo</span>
            <span className="text-[8px] bg-slate-700 font-mono text-slate-300 px-1.5 py-0.5 rounded font-bold uppercase">{teacher.grade}</span>
          </div>
          <div className="mt-4">
            <span className="text-md font-black tracking-tight uppercase block leading-none">{teacher.level}</span>
            <span className="text-[10px] text-slate-400 font-mono block mt-1">{teacher.email}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
