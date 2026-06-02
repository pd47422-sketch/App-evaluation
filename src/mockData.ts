/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Teacher, EducationalLevel, RubricCriterion, Evaluation, StudentComment, TeacherAnalytics } from './types';

export const RUBRIC_CRITERIA: RubricCriterion[] = [
  {
    id: 'planeacion',
    name: 'Planeación de Clases',
    description: 'Organiza sus clases, comparte objetivos claros y cuenta con materiales adecuados para el aprendizaje.',
    category: 'Didáctica'
  },
  {
    id: 'dominio_tema',
    name: 'Dominio del Tema',
    description: 'Demuestra conocimiento profundo de la materia, resuelve dudas con claridad y se mantiene actualizado/a.',
    category: 'Académico'
  },
  {
    id: 'empatia_relacion',
    name: 'Empatía y Respeto',
    description: 'Muestra interés por el bienestar de los alumnos, fomenta un clima de inclusión y tolera diversas perspectivas.',
    category: 'Actitudinal'
  },
  {
    id: 'metodologia',
    name: 'Metodología Didáctica',
    description: 'Utiliza dinámicas atractivas, promueve el trabajo colaborativo e integra recursos interactivos o prácticos.',
    category: 'Didáctica'
  },
  {
    id: 'evaluacion_retro',
    name: 'Evaluación Justa',
    description: 'Evalúa de manera coherente con lo enseñado, ofrece retroalimentación puntual y ayuda a mejorar al estudiante.',
    category: 'Académico'
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  // Primaria
  {
    id: 't1',
    name: 'Profa. María Elena Gómez',
    level: EducationalLevel.PRIMARIA,
    grade: '4º Grado',
    subject: 'Español e Historia',
    email: 'maria.gomez@escuela.edu.mx',
    bio: 'Especialista en desarrollo infantil y animación a la lectura en nivel primaria con más de 12 años de trayectoria académica.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 't2',
    name: 'Prof. Juan Carlos Martínez',
    level: EducationalLevel.PRIMARIA,
    grade: '6º Grado',
    subject: 'Matemáticas y Ciencias',
    email: 'juan.martinez@escuela.edu.mx',
    bio: 'Comprometido con el aprendizaje basado en la experimentación y el fomento del pensamiento reflexivo en ciencias lógico-matemáticas.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 't3',
    name: 'Profa. Sofía Ramírez Ruiz',
    level: EducationalLevel.PRIMARIA,
    grade: '2º Grado',
    subject: 'Formación Cívica y Ética',
    email: 'sofia.ramirez@escuela.edu.mx',
    bio: 'Dedicada a la educación socioemocional inicial y la construcción de destrezas formativas en la infancia temprana.',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80'
  },
  // Secundaria
  {
    id: 't4',
    name: 'Prof. Roberto Hernández',
    level: EducationalLevel.SECUNDARIA,
    grade: '2º Año',
    subject: 'Física y Química',
    email: 'roberto.h@escuela.edu.mx',
    bio: 'Físico con vocación docente. Entusiasta de los experimentos interactivos de laboratorio y la robótica educativa escolar.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 't5',
    name: 'Profa. Diana Laura Castillo',
    level: EducationalLevel.SECUNDARIA,
    grade: '3º Año',
    subject: 'Geografía e Historia',
    email: 'diana.castillo@escuela.edu.mx',
    bio: 'Promotora activa del análisis crítico de los fenómenos socioambientales mundiales e historia patria en secundaria.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 't6',
    name: 'Prof. Ángel Gabriel Ortiz',
    level: EducationalLevel.SECUNDARIA,
    grade: '1º Año',
    subject: 'Inglés',
    email: 'angel.ortiz@escuela.edu.mx',
    bio: 'Facilitador del bilingüismo adaptativo en jóvenes mediante técnicas lúdicas de expresión verbal e inmersión cultural.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80'
  },
  // Preparatoria
  {
    id: 't7',
    name: 'Profa. Carmen Leticia Solís',
    level: EducationalLevel.PREPARATORIA,
    grade: '5º Semestre',
    subject: 'Cálculo Diferencial',
    email: 'carmen.solis@escuela.edu.mx',
    bio: 'Ingeniera civil con maestría en educación matemática. Especialista en preparar jóvenes para el ingreso a la universidad.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 't8',
    name: 'Prof. Ricardo Mendoza Leyva',
    level: EducationalLevel.PREPARATORIA,
    grade: '6º Semestre',
    subject: 'Literatura y Filosofía',
    email: 'ricardo.mendoza@escuela.edu.mx',
    bio: 'Filósofo y ensayista. Incita al pensamiento independiente, la oratoria constructivista y la redacción reflexiva.',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 't9',
    name: 'Profa. Beatriz Adriana Villa',
    level: EducationalLevel.PREPARATORIA,
    grade: '4º Semestre',
    subject: 'Biología Genética',
    email: 'beatriz.villa@escuela.edu.mx',
    bio: 'Investigadora y docente galardonada por proyectos de ecotecnologías y biotecnología aplicada a nivel bachillerato.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80'
  }
];

export const INITIAL_STUDENT_COMMENTS: StudentComment[] = [
  // t1: María Elena Gómez
  { id: 'sc1', teacherId: 't1', comment: 'Explica los libros de una manera súper entretenida, me encanta la clase de español.', sentiment: 'positivo', timestamp: '2026-05-15T10:30:00Z', grade: '4º Grado', subject: 'Español e Historia' },
  { id: 'sc2', teacherId: 't1', comment: 'Es muy amable pero a veces deja mucha tarea los fines de semana.', sentiment: 'constructivo', timestamp: '2026-05-18T14:22:00Z', grade: '4º Grado', subject: 'Español e Historia' },
  { id: 'sc3', teacherId: 't1', comment: 'Nos ayuda mucho cuando no entendemos cómo escribir las palabras difíciles.', sentiment: 'positivo', timestamp: '2026-05-20T09:12:00Z', grade: '4º Grado', subject: 'Español e Historia' },

  // t2: Juan Carlos Martínez
  { id: 'sc4', teacherId: 't2', comment: 'La forma en que enseña las fracciones es muy clara. Es paciente.', sentiment: 'positivo', timestamp: '2026-05-12T11:05:00Z', grade: '6º Grado', subject: 'Matemáticas y Ciencias' },
  { id: 'sc5', teacherId: 't2', comment: 'A veces el salón se distrae mucho y tarda en empezar el tema del pizarrón.', sentiment: 'constructivo', timestamp: '2026-05-19T13:40:00Z', grade: '6º Grado', subject: 'Matemáticas y Ciencias' },
  { id: 'sc6', teacherId: 't2', comment: 'El mejor maestro de la primaria. Sus experimentos de ciencias son lo máximo.', sentiment: 'positivo', timestamp: '2026-05-22T08:15:00Z', grade: '6º Grado', subject: 'Matemáticas y Ciencias' },

  // t4: Roberto Hernández
  { id: 'sc7', teacherId: 't4', comment: 'Física es difícil, pero con sus experimentos reales en clase se entiende todo perfectamente.', sentiment: 'positivo', timestamp: '2026-05-14T09:44:00Z', grade: '2º Año', subject: 'Física y Química' },
  { id: 'sc8', teacherId: 't4', comment: 'Los exámenes son un poco confusos y no se parecen tanto a lo visto en las prácticas.', sentiment: 'constructivo', timestamp: '2026-05-21T15:10:00Z', grade: '2º Año', subject: 'Física y Química' },
  { id: 'sc9', teacherId: 't4', comment: 'Siempre llega a tiempo y resuelve todas nuestras dudas con mucho respeto.', sentiment: 'positivo', timestamp: '2026-05-25T11:20:00Z', grade: '2º Año', subject: 'Física y Química' },

  // t7: Carmen Leticia Solís
  { id: 'sc10', teacherId: 't7', comment: 'Cálculo da miedo al inicio, pero la maestra Carmen nos explica paso a paso e incluso da asesorías extras.', sentiment: 'positivo', timestamp: '2026-05-11T12:01:00Z', grade: '5º Semestre', subject: 'Cálculo Diferencial' },
  { id: 'sc11', teacherId: 't7', comment: 'Es muy estricta con la hora de entrada. Si llegas un minuto tarde ya no te deja pasar.', sentiment: 'constructivo', timestamp: '2026-05-18T07:05:00Z', grade: '5º Semestre', subject: 'Cálculo Diferencial' },
  { id: 'sc12', teacherId: 't7', comment: 'Sus retroalimentaciones de los exámenes me sirvieron mucho para saber en qué fallaba con las derivadas.', sentiment: 'positivo', timestamp: '2026-05-23T16:50:00Z', grade: '5º Semestre', subject: 'Cálculo Diferencial' },

  // t8: Ricardo Mendoza Leyva
  { id: 'sc13', teacherId: 't8', comment: 'Su clase te hace pensar mucho de la vida. Te da flojera entrar pero sales inspirado.', sentiment: 'positivo', timestamp: '2026-05-15T11:40:00Z', grade: '6º Semestre', subject: 'Literatura y Filosofía' },
  { id: 'sc14', teacherId: 't8', comment: 'Utiliza libros difíciles, explica bien pero califica de manera súper estricta los ensayos.', sentiment: 'constructivo', timestamp: '2026-05-20T14:30:00Z', grade: '6º Semestre', subject: 'Literatura y Filosofía' },
  { id: 'sc15', teacherId: 't8', comment: 'Es un maestro con gran cultura, fomenta debates increíbles sobre temas actuales.', sentiment: 'positivo', timestamp: '2026-05-24T12:00:00Z', grade: '6º Semestre', subject: 'Literatura y Filosofía' }
];

// High-fidelity Mock Analytics for History comparison (Desempeño Anual)
export const INITIAL_ANALYTICS: Record<string, TeacherAnalytics> = {
  t1: {
    teacherId: 't1',
    currentAverage: 4.6,
    totalEvaluations: 45,
    annualHistory: [
      { year: '2023', promedioGeneral: 4.1, planeacion: 4.0, dominioTema: 4.3, empatia: 4.5, metodologia: 3.8, evaluacion: 3.9 },
      { year: '2024', promedioGeneral: 4.3, planeacion: 4.2, dominioTema: 4.4, empatia: 4.6, metodologia: 4.1, evaluacion: 4.2 },
      { year: '2025', promedioGeneral: 4.6, planeacion: 4.5, dominioTema: 4.7, empatia: 4.8, metodologia: 4.4, evaluacion: 4.6 }
    ]
  },
  t2: {
    teacherId: 't2',
    currentAverage: 4.4,
    totalEvaluations: 38,
    annualHistory: [
      { year: '2023', promedioGeneral: 4.0, planeacion: 3.9, dominioTema: 4.1, empatia: 4.2, metodologia: 3.8, evaluacion: 4.0 },
      { year: '2024', promedioGeneral: 4.2, planeacion: 4.1, dominioTema: 4.3, empatia: 4.3, metodologia: 4.0, evaluacion: 4.1 },
      { year: '2025', promedioGeneral: 4.4, planeacion: 4.3, dominioTema: 4.5, empatia: 4.5, metodologia: 4.2, evaluacion: 4.3 }
    ]
  },
  t3: {
    teacherId: 't3',
    currentAverage: 4.3,
    totalEvaluations: 20,
    annualHistory: [
      { year: '2023', promedioGeneral: 4.2, planeacion: 4.0, dominioTema: 4.1, empatia: 4.4, metodologia: 4.2, evaluacion: 4.3 },
      { year: '2024', promedioGeneral: 4.1, planeacion: 4.1, dominioTema: 4.0, empatia: 4.3, metodologia: 4.1, evaluacion: 4.1 },
      { year: '2025', promedioGeneral: 4.3, planeacion: 4.2, dominioTema: 4.2, empatia: 4.5, metodologia: 4.3, evaluacion: 4.3 }
    ]
  },
  t4: {
    teacherId: 't4',
    currentAverage: 4.5,
    totalEvaluations: 55,
    annualHistory: [
      { year: '2023', promedioGeneral: 4.1, planeacion: 4.0, dominioTema: 4.5, empatia: 4.1, metodologia: 4.0, evaluacion: 3.9 },
      { year: '2024', promedioGeneral: 4.3, planeacion: 4.2, dominioTema: 4.6, empatia: 4.2, metodologia: 4.3, evaluacion: 4.2 },
      { year: '2025', promedioGeneral: 4.5, planeacion: 4.4, dominioTema: 4.8, empatia: 4.5, metodologia: 4.5, evaluacion: 4.3 }
    ]
  },
  t5: {
    teacherId: 't5',
    currentAverage: 4.1,
    totalEvaluations: 30,
    annualHistory: [
      { year: '2023', promedioGeneral: 3.8, planeacion: 3.7, dominioTema: 4.0, empatia: 3.9, metodologia: 3.6, evaluacion: 3.8 },
      { year: '2024', promedioGeneral: 4.0, planeacion: 4.0, dominioTema: 4.1, empatia: 4.0, metodologia: 3.9, evaluacion: 4.0 },
      { year: '2025', promedioGeneral: 4.1, planeacion: 4.1, dominioTema: 4.2, empatia: 4.2, metodologia: 4.0, evaluacion: 4.1 }
    ]
  },
  t6: {
    teacherId: 't6',
    currentAverage: 4.2,
    totalEvaluations: 28,
    annualHistory: [
      { year: '2023', promedioGeneral: 3.9, planeacion: 3.8, dominioTema: 4.0, empatia: 4.1, metodologia: 3.7, evaluacion: 3.9 },
      { year: '2024', promedioGeneral: 4.1, planeacion: 4.0, dominioTema: 4.1, empatia: 4.3, metodologia: 4.0, evaluacion: 4.0 },
      { year: '2025', promedioGeneral: 4.2, planeacion: 4.1, dominioTema: 4.2, empatia: 4.4, metodologia: 4.1, evaluacion: 4.2 }
    ]
  },
  t7: {
    teacherId: 't7',
    currentAverage: 4.6,
    totalEvaluations: 62,
    annualHistory: [
      { year: '2023', promedioGeneral: 4.3, planeacion: 4.1, dominioTema: 4.7, empatia: 4.2, metodologia: 4.2, evaluacion: 4.3 },
      { year: '2024', promedioGeneral: 4.5, planeacion: 4.4, dominioTema: 4.8, empatia: 4.4, metodologia: 4.4, evaluacion: 4.5 },
      { year: '2025', promedioGeneral: 4.6, planeacion: 4.5, dominioTema: 4.9, empatia: 4.5, metodologia: 4.5, evaluacion: 4.6 }
    ]
  },
  t8: {
    teacherId: 't8',
    currentAverage: 4.7,
    totalEvaluations: 48,
    annualHistory: [
      { year: '2023', promedioGeneral: 4.4, planeacion: 4.3, dominioTema: 4.6, empatia: 4.5, metodologia: 4.4, evaluacion: 4.2 },
      { year: '2024', promedioGeneral: 4.5, planeacion: 4.5, dominioTema: 4.8, empatia: 4.5, metodologia: 4.5, evaluacion: 4.4 },
      { year: '2025', promedioGeneral: 4.7, planeacion: 4.6, dominioTema: 4.9, empatia: 4.7, metodologia: 4.7, evaluacion: 4.6 }
    ]
  },
  t9: {
    teacherId: 't9',
    currentAverage: 4.4,
    totalEvaluations: 34,
    annualHistory: [
      { year: '2023', promedioGeneral: 4.0, planeacion: 3.9, dominioTema: 4.2, empatia: 4.1, metodologia: 3.9, evaluacion: 3.9 },
      { year: '2024', promedioGeneral: 4.2, planeacion: 4.1, dominioTema: 4.4, empatia: 4.3, metodologia: 4.1, evaluacion: 4.1 },
      { year: '2025', promedioGeneral: 4.4, planeacion: 4.3, dominioTema: 4.6, empatia: 4.5, metodologia: 4.3, evaluacion: 4.3 }
    ]
  }
};
