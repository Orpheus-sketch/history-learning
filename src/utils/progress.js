function getKey(accountId) {
  return `hl-progress-${accountId}`;
}

function getData(accountId) {
  const raw = localStorage.getItem(getKey(accountId));
  if (!raw) {
    return { completedLessons: [], quizHistory: [], weakPoints: [] };
  }
  return JSON.parse(raw);
}

function saveData(accountId, data) {
  localStorage.setItem(getKey(accountId), JSON.stringify(data));
}

export function markLessonCompleted(accountId, lessonId) {
  const data = getData(accountId);
  if (!data.completedLessons.includes(lessonId)) {
    data.completedLessons.push(lessonId);
    saveData(accountId, data);
  }
}

export function isLessonCompleted(accountId, lessonId) {
  const data = getData(accountId);
  return data.completedLessons.includes(lessonId);
}

export function getCompletedLessons(accountId) {
  return getData(accountId).completedLessons;
}

export function saveQuizResult(accountId, result) {
  const data = getData(accountId);
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

  saveData(accountId, data);
}

export function getQuizHistory(accountId) {
  return getData(accountId).quizHistory;
}

export function getWeakPoints(accountId) {
  return getData(accountId).weakPoints;
}

export function getProgressStats(accountId) {
  const data = getData(accountId);
  return {
    completedLessons: data.completedLessons,
    quizHistory: data.quizHistory,
    weakPoints: data.weakPoints,
  };
}

export function resetProgress(accountId) {
  localStorage.removeItem(getKey(accountId));
}
