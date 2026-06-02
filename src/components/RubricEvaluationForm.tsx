/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, FormEvent } from 'react';
import { RUBRIC_CRITERIA } from '../mockData';
import { Teacher, RubricScore, Evaluation, StudentComment } from '../types';
import { Star, MessageSquare, Send, CheckCircle2, UserCheck, Sparkles } from 'lucide-react';

interface RubricEvaluationFormProps {
  teachers: Teacher[];
  selectedTeacherId?: string;
  onAddEvaluation: (evaluation: Evaluation) => void;
  onAddComment: (comment: StudentComment) => void;
  appsScriptUrl: string;
}

const SCORE_LABELS = [
  { val: 1, text: 'Deficiente', color: 'bg-red-50 text-red-700 border-red-200' },
  { val: 2, text: 'Regular', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { val: 3, text: 'Bueno', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { val: 4, text: 'Muy Bueno', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { val: 5, text: 'Excelente', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
];

export default function RubricEvaluationForm({
  teachers,
  selectedTeacherId = '',
  onAddEvaluation,
  onAddComment,
  appsScriptUrl,
}: RubricEvaluationFormProps) {
  const [teacherId, setTeacherId] = useState(selectedTeacherId);
  const [evaluatorType, setEvaluatorType] = useState<'alumno' | 'coordinador' | 'autoevaluacion'>('alumno');
  
  // Scoring state
  const [scores, setScores] = useState<Record<string, number>>({
    planeacion: 4,
    dominio_tema: 4,
    empatia_relacion: 4,
    metodologia: 4,
    evaluacion_retro: 4,
  });

  // Comments state
  const [generalComment, setGeneralComment] = useState('');
  const [studentSentiment, setStudentSentiment] = useState<'positivo' | 'neutro' | 'constructivo'>('positivo');
  const [academicYear, setAcademicYear] = useState('2025-2026');
  
  // UI indicators
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const targetTeacher = teachers.find((t) => t.id === teacherId);

  const handleScoreChange = (criterionId: string, val: number) => {
    setScores((prev) => ({ ...prev, [criterionId]: val }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!teacherId) {
      setErrorMsg('Debes seleccionar un docente para evaluar.');
      return;
    }
    if (!generalComment.trim()) {
      setErrorMsg('Por favor escribe un breve comentario o retroalimentación.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    // Prepare structure
    const totalScoreArray: RubricScore[] = Object.entries(scores).map(([k, v]) => ({
      criterionId: k,
      score: Number(v),
    }));
    
    const scoreSum = totalScoreArray.reduce((acc, curr) => acc + curr.score, 0);
    const average = scoreSum / totalScoreArray.length;

    const evaluationId = 'eval_' + Math.random().toString(36).substr(2, 9);
    const timestamp = new Date().toISOString();

    const newEvaluation: Evaluation = {
      id: evaluationId,
      teacherId,
      evaluatorType,
      scores: totalScoreArray,
      generalComment,
      academicYear,
      timestamp,
      ratingAverage: average,
    };

    // If evaluator is student, also record a student comment representation
    const newComment: StudentComment = {
      id: 'comm_' + Math.random().toString(36).substr(2, 9),
      teacherId,
      comment: generalComment,
      sentiment: evaluatorType === 'alumno' ? studentSentiment : 'positivo',
      timestamp,
      grade: targetTeacher?.grade || 'N/A',
      subject: targetTeacher?.subject || 'Clase General',
    };

    try {
      // 1. Send evaluation if Apps Script linked
      if (appsScriptUrl.trim()) {
        const response = await fetch(appsScriptUrl, {
          method: 'POST',
          mode: 'no-cors', // standard bypass for Google Apps Script redirect issues in sandboxes
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'addEvaluation',
            payload: newEvaluation,
          }),
        });

        // Send comment if student
        if (evaluatorType === 'alumno') {
          await fetch(appsScriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'addComment',
              payload: newComment,
            }),
          });
        }
      }

      // 2. Trigger local state updating
      onAddEvaluation(newEvaluation);
      if (evaluatorType === 'alumno') {
        onAddComment(newComment);
      }

      setSubmitSuccess(true);
      setGeneralComment('');
      // reset scores
      setScores({
        planeacion: 4,
        dominio_tema: 4,
        empatia_relacion: 4,
        metodologia: 4,
        evaluacion_retro: 4,
      });

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);

    } catch (err: any) {
      setErrorMsg('Ocurrió un error al guardar: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:p-8" id="evaluation-form-container">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold font-sans text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Nueva Evaluación por Rúbrica
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Asigna un nivel de desempeño según los estándares institucionales.
          </p>
        </div>
        <div className="hidden sm:block text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full font-medium">
          Año Escolar: {academicYear}
        </div>
      </div>

      {submitSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-start gap-3 mb-6 animate-fade-in animate-duration-150">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-emerald-950 text-sm">¡Evaluación registrada exitosamente!</h4>
            <p className="text-xs text-emerald-700 mt-1">
              Los puntajes y comentarios han sido guardados localmente {appsScriptUrl ? 'y sincronizados con tu Google Sheet' : ''}. El panel analítico se actualizará en tiempo real.
            </p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 mb-6 text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Core Settings: Teacher & Who evaluates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Docente a Evaluar</label>
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            >
              <option value="">-- Selecciona el Profesor/a --</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} ({teacher.level} - {teacher.subject})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Tipo de Evaluador</label>
            <div className="grid grid-cols-3 gap-2">
              {(['alumno', 'coordinador', 'autoevaluacion'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setEvaluatorType(type)}
                  className={`py-2 px-1 text-xs font-bold rounded-xl border transition text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    evaluatorType === type
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span className="capitalize">{type === 'autoevaluacion' ? 'Docente' : type}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Teacher Summary Banner */}
        {targetTeacher && (
          <div className="bg-slate-55 border border-slate-100 bg-slate-50 rounded-xl p-4 flex gap-4 items-center">
            {targetTeacher.avatarUrl ? (
              <img src={targetTeacher.avatarUrl} alt={targetTeacher.name} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">{targetTeacher.name[0]}</div>
            )}
            <div>
              <h4 className="text-sm font-semibold text-slate-800">{targetTeacher.name}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{targetTeacher.level} • {targetTeacher.grade} • <span className="text-slate-600 font-medium">{targetTeacher.subject}</span></p>
            </div>
          </div>
        )}

        {/* Rubrics Criteria Scopes */}
        <div className="space-y-6 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5 mb-4">
            <Star className="w-4 h-4 text-indigo-500 fill-indigo-100" />
            Rúbricas Interactivas de Desempeño
          </h3>

          <div className="space-y-6">
            {RUBRIC_CRITERIA.map((criterion) => {
              const currentScore = scores[criterion.id] || 4;
              return (
                <div key={criterion.id} className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition bg-slate-50/50">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="inline-block text-[9px] font-bold uppercase px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md mb-1">{criterion.category}</span>
                      <h4 className="font-semibold text-slate-800 text-sm leading-tight">{criterion.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-xl">{criterion.description}</p>
                    </div>
                    {/* Current Score Pill */}
                    <div className="flex-shrink-0">
                      {SCORE_LABELS.map((sl) => 
                        sl.val === currentScore ? (
                          <span key={sl.val} className={`inline-block py-1 px-3 text-xs font-bold rounded-full border ${sl.color}`}>
                            {sl.val}.0 - {sl.text}
                          </span>
                        ) : null
                      )}
                    </div>
                  </div>

                  {/* 1 - 5 Rating Slider & Star Row */}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex gap-1.5 select-none">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleScoreChange(criterion.id, num)}
                          className="p-1 hover:scale-110 transition group focus:outline-none cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              num <= currentScore
                                ? 'text-amber-500 fill-amber-400'
                                : 'text-slate-200'
                            } transition`}
                          />
                        </button>
                      ))}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">Hacer click para calificar</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Written Comment Area */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              {evaluatorType === 'alumno' ? 'Comentario Anónimo del Alumno' : 'Observaciones Generales y Retroalimentación'}
            </label>
            {evaluatorType === 'alumno' && (
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 font-bold uppercase rounded-md">
                🔒 Anónimo
              </span>
            )}
          </div>

          <textarea
            value={generalComment}
            onChange={(e) => setGeneralComment(e.target.value)}
            placeholder={
              evaluatorType === 'alumno'
                ? 'Escribe tu comentario sincero sobre la clase (ej. ¿Qué te gusta?, ¿Qué puede mejorar?) Tu opinión es 100% anónima...'
                : 'Escribe las observaciones correspondientes al plan de mejora o felicitaciones del docente...'
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition h-28 resize-none"
            required
          />

          {/* Student Sentiment Selector */}
          {evaluatorType === 'alumno' && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                ¿Qué tipo de opinión estás compartiendo?
              </span>
              <div className="flex gap-2">
                {([
                  { key: 'positivo', val: 'Positiva / Felicitación', color: 'bg-emerald-100 text-emerald-800' },
                  { key: 'neutro', val: 'Sugerencia / Neutra', color: 'bg-slate-100 text-slate-800' },
                  { key: 'constructivo', val: 'Crítica Constructiva', color: 'bg-amber-100 text-amber-900 border-amber-300' },
                ] as const).map((sent) => (
                  <button
                    key={sent.key}
                    type="button"
                    onClick={() => setStudentSentiment(sent.key)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                      studentSentiment === sent.key
                        ? 'border-indigo-600 bg-indigo-100 text-indigo-900'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {sent.val}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit action */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-sm shadow-indigo-100 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Procesando envío...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Registrar Evaluación Docente</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
