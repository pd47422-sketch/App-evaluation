/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, FormEvent } from 'react';
import { Teacher, EducationalLevel } from '../types';
import { Search, Plus, Filter, Mail, Award, BookOpen, GraduationCap, Grid, UserRound } from 'lucide-react';

interface TeacherDashboardProps {
  teachers: Teacher[];
  selectedTeacherId: string;
  onSelectTeacher: (id: string) => void;
  onAddTeacher: (teacher: Teacher) => void;
}

export default function TeacherDashboard({
  teachers,
  selectedTeacherId,
  onSelectTeacher,
  onAddTeacher,
}: TeacherDashboardProps) {
  // Filters state
  const [levelFilter, setLevelFilter] = useState<'Todos' | EducationalLevel>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('Todos');

  // Form state to add new teacher
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherLevel, setNewTeacherLevel] = useState<EducationalLevel>(EducationalLevel.PRIMARIA);
  const [newTeacherGrade, setNewTeacherGrade] = useState('');
  const [newTeacherSubject, setNewTeacherSubject] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherBio, setNewTeacherBio] = useState('');

  // Extract unique subjects for filtering based on current teachers list
  const distinctSubjects = ['Todos', ...Array.from(new Set(teachers.map((t) => t.subject)))];

  // Filtering Logic
  const filteredTeachers = teachers.filter((teacher) => {
    const hitsLevel = levelFilter === 'Todos' || teacher.level === levelFilter;
    const hitsSubject = selectedSubject === 'Todos' || teacher.subject === selectedSubject;
    const hitsSearch =
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.grade.toLowerCase().includes(searchQuery.toLowerCase());
    return hitsLevel && hitsSubject && hitsSearch;
  });

  const handleCreateTeacher = (e: FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim() || !newTeacherSubject.trim() || !newTeacherEmail.trim()) {
      return;
    }

    const newTeacher: Teacher = {
      id: 't_' + Math.random().toString(36).substr(2, 9),
      name: newTeacherName,
      level: newTeacherLevel,
      grade: newTeacherGrade || 'Gral.',
      subject: newTeacherSubject,
      email: newTeacherEmail,
      bio: newTeacherBio || 'Docente dedicado al crecimiento integral de sus estudiantes.',
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?auto=format&fit=crop&w=150&h=150&q=80`, // randomized avatar or standard avatar placeholder
    };

    onAddTeacher(newTeacher);

    // Reset states
    setNewTeacherName('');
    setNewTeacherGrade('');
    setNewTeacherSubject('');
    setNewTeacherEmail('');
    setNewTeacherBio('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6" id="teacher-dashboard-panel">
      
      {/* Search and Filters Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        
        {/* Tab-like Filters according to Educational Levels */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto overflow-x-auto select-none">
            {(['Todos', EducationalLevel.PRIMARIA, EducationalLevel.SECUNDARIA, EducationalLevel.PREPARATORIA] as const).map((level) => (
              <button
                key={level}
                onClick={() => {
                  setLevelFilter(level);
                  setSelectedSubject('Todos'); // reset subject filter on change tabs
                }}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  levelFilter === level
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {level === 'Todos' ? (
                  <Grid className="w-3.5 h-3.5" />
                ) : level === EducationalLevel.PRIMARIA ? (
                  <BookOpen className="w-3.5 h-3.5" />
                ) : level === EducationalLevel.SECUNDARIA ? (
                  <GraduationCap className="w-3.5 h-3.5" />
                ) : (
                  <Award className="w-3.5 h-3.5" />
                )}
                <span>{level}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 self-stretch sm:self-auto transition shadow-sm shadow-indigo-100 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Docente</span>
          </button>
        </div>

        {/* Dynamic Add Teacher Mini Form */}
        {showAddForm && (
          <form onSubmit={handleCreateTeacher} className="border-t pt-5 mt-4 space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-100 animate-fade-in animate-duration-150">
            <h4 className="text-xs font-bold tracking-wider uppercase text-slate-700 mb-2">Dar de Alta Nuevo Académico</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Dra. Yolanda Ramos"
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nivel Educativo</label>
                <select
                  value={newTeacherLevel}
                  onChange={(e) => setNewTeacherLevel(e.target.value as EducationalLevel)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                >
                  <option value={EducationalLevel.PRIMARIA}>Primaria</option>
                  <option value={EducationalLevel.SECUNDARIA}>Secundaria</option>
                  <option value={EducationalLevel.PREPARATORIA}>Preparatoria</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Grado o Ciclo</label>
                <input
                  type="text"
                  placeholder="ej. 5º Grado o 1º Semestre"
                  value={newTeacherGrade}
                  onChange={(e) => setNewTeacherGrade(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Materia Impartida</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Matemáticas / Física"
                  value={newTeacherSubject}
                  onChange={(e) => setNewTeacherSubject(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Correo Institucional</label>
                <input
                  type="email"
                  required
                  placeholder="ej. yolanda@escuela.edu.mx"
                  value={newTeacherEmail}
                  onChange={(e) => setNewTeacherEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Perfil Biográfico Breve</label>
                <input
                  type="text"
                  placeholder="ej. 8 años impartiendo literatura y coordinando debates..."
                  value={newTeacherBio}
                  onChange={(e) => setNewTeacherBio(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
              >
                Registrar Docente
              </button>
            </div>
          </form>
        )}

        {/* Search Input and Subject Filters */}
        <div className="flex flex-col md:flex-row gap-3 pt-2">
          
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Buscar docente por nombre, grado o materia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-slate-50 border border-slate-200/80 text-xs text-slate-600 rounded-xl py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition cursor-pointer"
            >
              <option value="Todos">Todas las Materias</option>
              {distinctSubjects
                .filter((sub) => sub !== 'Todos')
                .map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
            </select>
          </div>

        </div>

      </div>

      {/* Teachers Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeachers.map((teacher) => {
          const isSelected = selectedTeacherId === teacher.id;
          return (
            <div
              key={teacher.id}
              onClick={() => onSelectTeacher(teacher.id)}
              className={`p-5 rounded-2xl border transition duration-150 flex flex-col justify-between cursor-pointer group ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/10 shadow-sm'
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start gap-3.5">
                  {teacher.avatarUrl ? (
                    <img
                      src={teacher.avatarUrl}
                      alt={teacher.name}
                      className="w-12 h-12 rounded-full object-cover group-hover:scale-105 transition duration-150"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                      {teacher.name[0]}
                    </div>
                  )}
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      {teacher.level} • {teacher.grade}
                    </span>
                    <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition duration-150 leading-tight block mt-0.5">
                      {teacher.name}
                    </h3>
                    <p className="text-xs text-indigo-900 mt-1 font-medium">{teacher.subject}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mt-4 leading-normal leading-relaxed">
                  {teacher.bio}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 font-mono">
                  <Mail className="w-3.5 h-3.5 text-slate-300" />
                  {teacher.email.split('@')[0]}
                </span>
                <span className="font-bold text-indigo-500 group-hover:translate-x-1 transition duration-150 text-right">
                  Ver Análisis &rarr;
                </span>
              </div>
            </div>
          );
        })}

        {filteredTeachers.length === 0 && (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-10 bg-white border rounded-2xl border-dashed">
            <UserRound className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">No se encontraron docentes con los filtros actuales.</p>
          </div>
        )}
      </div>

    </div>
  );
}
