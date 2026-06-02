/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum EducationalLevel {
  PRIMARIA = 'Primaria',
  SECUNDARIA = 'Secundaria',
  PREPARATORIA = 'Preparatoria',
}

export interface Teacher {
  id: string;
  name: string;
  level: EducationalLevel;
  grade: string; // e.g., "4º", "1º", "3º"
  subject: string; // e.g., "Matemáticas", "Español", "Física"
  avatarUrl?: string;
  email: string;
  bio: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface RubricScore {
  criterionId: string;
  score: number; // 1 to 5
  feedback?: string;
}

export interface Evaluation {
  id: string;
  teacherId: string;
  evaluatorType: 'coordinador' | 'autoevaluacion' | 'alumno';
  scores: RubricScore[];
  generalComment: string;
  academicYear: string; // e.g., "2025-2026"
  timestamp: string;
  ratingAverage: number; // calculated
}

export interface StudentComment {
  id: string;
  teacherId: string;
  comment: string;
  sentiment: 'positivo' | 'neutro' | 'constructivo';
  timestamp: string;
  grade: string;
  subject: string;
}

export interface AnnualPerformance {
  year: string;
  promedioGeneral: number; // 1 to 5 or 0 to 100
  planeacion: number;
  dominioTema: number;
  empatia: number;
  metodologia: number;
  evaluacion: number;
}

export interface TeacherAnalytics {
  teacherId: string;
  annualHistory: AnnualPerformance[];
  currentAverage: number;
  totalEvaluations: number;
}
