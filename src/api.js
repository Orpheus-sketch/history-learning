// Dynamic per-subject database loading
const dbCache = {};

const subjectModules = {
  history: () => import('../db-history.json'),
  geography: () => import('../db-geography.json'),
  biology: () => import('../db-biology.json'),
};

async function loadDb(subject = 'history') {
  if (!dbCache[subject]) {
    const mod = await subjectModules[subject]();
    dbCache[subject] = mod.default;
  }
  return dbCache[subject];
}

function delay(ms = 50) {
  return new Promise((r) => setTimeout(r, ms));
}

// Simulate async API with local data (keeps async signature for compatibility)
export async function fetchGrades(subject = 'history') {
  await delay();
  const db = await loadDb(subject);
  return [...db.grades].sort((a, b) => a.order - b.order);
}

export async function fetchUnits(gradeId, subject = 'history') {
  await delay();
  const db = await loadDb(subject);
  const units = gradeId
    ? db.units.filter((u) => u.gradeId === gradeId)
    : [...db.units];
  return units.sort((a, b) => a.order - b.order);
}

export async function fetchLessons(unitId, subject = 'history') {
  await delay();
  const db = await loadDb(subject);
  return unitId
    ? db.lessons.filter((l) => l.unitId === unitId)
    : [...db.lessons];
}

export async function fetchLesson(id, subject = 'history') {
  await delay();
  const db = await loadDb(subject);
  return db.lessons.find((l) => l.id === Number(id)) || null;
}

export async function fetchQuestions({ gradeId, unitId, lessonId, type, difficulty } = {}, subject = 'history') {
  await delay();
  const db = await loadDb(subject);
  let questions = [...db.questions];

  if (lessonId) {
    questions = questions.filter((q) => q.lessonId === lessonId);
  }
  if (type) {
    questions = questions.filter((q) => q.type === type);
  }
  if (difficulty) {
    questions = questions.filter((q) => q.difficulty === difficulty);
  }
  if (unitId) {
    const lessonIds = db.lessons.filter((l) => l.unitId === unitId).map((l) => l.id);
    questions = questions.filter((q) => lessonIds.includes(q.lessonId));
  }
  if (gradeId) {
    const unitIds = db.units.filter((u) => u.gradeId === gradeId).map((u) => u.id);
    const lessonIds = db.lessons.filter((l) => unitIds.includes(l.unitId)).map((l) => l.id);
    questions = questions.filter((q) => lessonIds.includes(q.lessonId));
  }

  return questions;
}

export async function fetchAllGrades(subject = 'history') {
  await delay();
  const db = await loadDb(subject);
  return [...db.grades].sort((a, b) => a.order - b.order);
}
