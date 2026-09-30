// CodeLens AI - Real Data Storage Service
// Zero fake data: starts empty and tracks only what the user actually submits and analyzes

const ANALYSES_STORAGE_KEY = 'codelens_user_analyses';

export const storage = {
  // Get all real analyses submitted by the user
  getAnalyses() {
    try {
      const stored = localStorage.getItem(ANALYSES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  // Save a new real analysis
  saveAnalysis(analysis) {
    try {
      const current = this.getAnalyses();
      const item = {
        id: analysis.id || 'ana_' + Date.now().toString(36),
        name: analysis.name || 'Untitled Problem',
        type: analysis.type || 'CODE_SNIPPET', // 'CODE_SNIPPET' or 'PROJECT_ARCHIVE'
        language: analysis.language || 'Java',
        platform: analysis.platform || 'LeetCode',
        code: analysis.code || '',
        testCase: analysis.testCase || '',
        result: analysis.result || {},
        createdAt: new Date().toISOString()
      };
      
      const updated = [item, ...current];
      localStorage.setItem(ANALYSES_STORAGE_KEY, JSON.stringify(updated));
      return item;
    } catch (e) {
      console.error('Failed to save analysis:', e);
      return analysis;
    }
  },

  // Get a single analysis by ID
  getAnalysisById(id) {
    const list = this.getAnalyses();
    return list.find(a => a.id === id) || null;
  },

  // Delete an analysis
  deleteAnalysis(id) {
    const list = this.getAnalyses();
    const updated = list.filter(a => a.id !== id);
    localStorage.setItem(ANALYSES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  // Clear all
  clearAll() {
    localStorage.removeItem(ANALYSES_STORAGE_KEY);
  }
};
