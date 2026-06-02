/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Teacher, Evaluation, StudentComment, EducationalLevel } from './types';

// Utility to format dates consistently
export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return isoString;
  }
}

// Generate self-contained downloadable HTML report with premium design
export function generateHTMLReport(
  teacher: Teacher,
  evaluations: Evaluation[],
  comments: StudentComment[],
  averageRating: number,
  criteriaStats: { name: string; score: number; desc: string }[]
): string {
  const commentRows = comments
    .map(
      (c) => `
    <div class="comment-card ${c.sentiment}">
      <div class="comment-meta">
        <span class="sentiment-badge ${c.sentiment}">${c.sentiment.toUpperCase()}</span>
        <span class="comment-date">${formatDate(c.timestamp)}</span>
      </div>
      <p class="comment-text">"${c.comment}"</p>
      <div class="comment-academic">${c.grade} • ${c.subject}</div>
    </div>
  `
    )
    .join('');

  const criteriaRows = criteriaStats
    .map(
      (stat) => `
    <tr class="criteria-row">
      <td class="criteria-name">
        <div class="font-bold">${stat.name}</div>
        <div class="text-sm text-gray shadow-none" style="color: #64748b; font-size: 13px;">${stat.desc}</div>
      </td>
      <td class="criteria-score">
        <div class="score-badge">${stat.score.toFixed(1)} / 5.0</div>
        <div class="bar-container">
          <div class="bar-fill" style="width: ${(stat.score / 5.0) * 100}%"></div>
        </div>
      </td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte de Evaluación - ${teacher.name}</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #1e293b;
      background-color: #f8fafc;
      margin: 0;
      padding: 40px 20px;
      line-height: 1.5;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      padding: 40px;
      border: 1px solid #e2e8f0;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 24px;
      margin-bottom: 30px;
    }
    .teacher-info {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #3b82f6;
    }
    .title-area h1 {
      margin: 0 0 6px 0;
      font-size: 24px;
      color: #0f172a;
    }
    .meta-badges {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .badge {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: bold;
      padding: 3px 8px;
      border-radius: 4px;
      background: #eff6ff;
      color: #1d4ed8;
    }
    .rating-box {
      text-align: right;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 15px 20px;
      border-radius: 8px;
    }
    .rating-num {
      font-size: 32px;
      font-weight: 800;
      color: #3b82f6;
      line-height: 1;
    }
    .rating-label {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      margin-top: 4px;
    }
    .section-title {
      font-size: 18px;
      color: #0f172a;
      border-left: 4px solid #3b82f6;
      padding-left: 10px;
      margin: 35px 0 20px 0;
      font-weight: 700;
    }
    .bio {
      color: #475569;
      font-style: italic;
      background: #f8fafc;
      padding: 16px;
      border-radius: 8px;
      border-left: 3px solid #cbd5e1;
      margin-bottom: 24px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th {
      text-align: left;
      padding: 12px;
      background-color: #f1f5f9;
      color: #475569;
      font-weight: 600;
      font-size: 13px;
    }
    td {
      padding: 16px 12px;
      border-bottom: 1px solid #f1f5f9;
    }
    .criteria-name {
      max-width: 60%;
    }
    .criteria-score {
      text-align: right;
    }
    .score-badge {
      font-weight: Bold;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .bar-container {
      width: 120px;
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      margin-left: auto;
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      background: #3b82f6;
      border-radius: 3px;
    }
    .comments-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .comment-card {
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      position: relative;
    }
    .comment-card.positivo {
      border-left: 4px solid #10b981;
      background: #f0fdf4;
    }
    .comment-card.neutro {
      border-left: 4px solid #6b7280;
      background: #f9fafb;
    }
    .comment-card.constructivo {
      border-left: 4px solid #f59e0b;
      background: #fffbeb;
    }
    .comment-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .sentiment-badge {
      font-size: 9px;
      font-weight: bold;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .sentiment-badge.positivo { background: #dcfce7; color: #15803d; }
    .sentiment-badge.neutro { background: #f3f4f6; color: #374151; }
    .sentiment-badge.constructivo { background: #fef3c7; color: #b45309; }
    .comment-date {
      font-size: 11px;
      color: #94a3b8;
    }
    .comment-text {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #334155;
    }
    .comment-academic {
      font-size: 11px;
      color: #64748b;
      font-weight: 500;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      border-top: 1px solid #e2e8f0;
      padding-top: 20px;
      font-size: 12px;
      color: #94a3b8;
    }
    .print-btn {
      display: block;
      width: fit-content;
      margin: 20px auto 0 auto;
      padding: 10px 20px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      text-decoration: none;
    }
    @media print {
      body { background: white; padding: 0; }
      .container { border: none; box-shadow: none; padding: 0; }
      .print-btn { display: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="teacher-info">
        <div class="title-area">
          <h1>${teacher.name}</h1>
          <div class="meta-badges">
            <span class="badge" style="background:#f1f5f9; color:#475569;">${teacher.level}</span>
            <span class="badge" style="background:#e0f2fe; color:#0369a1;">${teacher.grade}</span>
            <span class="badge" style="background:#fef3c7; color:#b45309;">${teacher.subject}</span>
          </div>
          <div style="font-size: 13px; color: #64748b; margin-top: 6px;">Email: ${teacher.email}</div>
        </div>
      </div>
      <div class="rating-box">
        <div class="rating-num">${averageRating.toFixed(1)}</div>
        <div class="rating-label">Promedio de Rúbrica</div>
      </div>
    </div>

    <div class="bio">
      <strong>Perfil Profesional:</strong> ${teacher.bio}
    </div>

    <div class="section-title">Análisis de Desempeño por Rúbrica</div>
    <table>
      <thead>
        <tr>
          <th>Criterios Evaluados</th>
          <th style="text-align: right;">Evaluación Promedio (1.0 - 5.0)</th>
        </tr>
      </thead>
      <tbody>
        ${criteriaRows}
      </tbody>
    </table>

    <div class="section-title">Comentarios de los Alumnos (Anónimos)</div>
    <div class="comments-grid">
      ${comments.length > 0 ? commentRows : '<p style="color:#64748b; font-style:italic;">No hay comentarios registrados actualmente para este docente.</p>'}
    </div>

    <div class="footer">
      Reporte generado el ${formatDate(new Date().toISOString())} | Sistema de Calificación y Rúbricas Docente
    </div>

    <button onclick="window.print()" class="print-btn">Imprimir o Guardar como PDF</button>
  </div>
</body>
</html>
  `;
}

// Download utility
export function downloadFile(content: string, filename: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
