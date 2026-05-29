const STORAGE_KEY = 'history-learning-progress';

function getData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { completedLessons: [], quizHistory: [], weakPoints: [] };
  }
  return JSON.parse(raw);
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function markLessonCompleted(lessonId) {
  const data = getData();
  if (!data.completedLessons.includes(lessonId)) {
    data.completedLessons.push(lessonId);
    saveData(data);
  }
}

export function isLessonCompleted(lessonId) {
  const data = getData();
  return data.completedLessons.includes(lessonId);
}

export function getCompletedLessons() {
  return getData().completedLessons;
}

export function saveQuizResult(result) {
  const data = getData();
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

  saveData(data);
}

export function getQuizHistory() {
  return getData().quizHistory;
}

export function getWeakPoints() {
  return getData().weakPoints;
}

export function getProgressStats() {
  return {
    completedLessons: getData().completedLessons,
    quizHistory: getData().quizHistory,
    weakPoints: getData().weakPoints,
  };
}

export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
}
