function getKey(subject, accountId) {
  return `hl-progress-${subject}-${accountId}`;
}

// One-time migration: copy old history progress (hl-progress-{accountId})
// to new format (hl-progress-history-{accountId})
function migrateHistoryProgress(subject, accountId) {
  if (subject !== 'history' || !accountId) return;
  const oldKey = `hl-progress-${accountId}`;
  const newKey = `hl-progress-history-${accountId}`;
  const oldData = localStorage.getItem(oldKey);
  const newData = localStorage.getItem(newKey);
  if (oldData && !newData) {
    localStorage.setItem(newKey, oldData);
  }
}

function getData(subject, accountId) {
  if (!accountId) {
    return { completedLessons: [], quizHistory: [], weakPoints: [] };
  }
  migrateHistoryProgress(subject, accountId);
  const raw = localStorage.getItem(getKey(subject, accountId));
  if (!raw) {
    return { completedLessons: [], quizHistory: [], weakPoints: [] };
  }
  return JSON.parse(raw);
}

function saveData(subject, accountId, data) {
  if (!accountId) return;
  localStorage.setItem(getKey(subject, accountId), JSON.stringify(data));
}

export function markLessonCompleted(accountId, lessonId, subject = 'history') {
  const data = getData(subject, accountId);
  if (!data.completedLessons.includes(lessonId)) {
    data.completedLessons.push(lessonId);
    saveData(subject, accountId, data);
  }
}

export function isLessonCompleted(accountId, lessonId, subject = 'history') {
  const data = getData(subject, accountId);
  return data.completedLessons.includes(lessonId);
}

export function getCompletedLessons(accountId, subject = 'history') {
  return getData(subject, accountId).completedLessons;
}

export function saveQuizResult(accountId, result, subject = 'history') {
  const data = getData(subject, accountId);
  data.quizHistory.push({
    date: new Date().toISOString(),
    score: result.score,
    total: result.total,
    gradeId: result.gradeId,
    unitId: result.unitId,
    wrongLessonIds: result.wrongLessonIds || [],
  });

  if (result.wrongLessonIds) {
    result.wrongLessonIds.forEach((id) => {
      if (!data.weakPoints.includes(id)) {
        data.weakPoints.push(id);
      }
    });
  }

  saveData(subject, accountId, data);
}

export function getQuizHistory(accountId, subject = 'history') {
  return getData(subject, accountId).quizHistory;
}

export function getWeakPoints(accountId, subject = 'history') {
  return getData(subject, accountId).weakPoints;
}

export function getProgressStats(accountId, subject = 'history') {
  const data = getData(subject, accountId);
  return {
    completedLessons: data.completedLessons,
    quizHistory: data.quizHistory,
    weakPoints: data.weakPoints,
  };
}

export function resetProgress(accountId, subject = 'history') {
  if (!accountId) return;
  localStorage.removeItem(getKey(subject, accountId));
}
