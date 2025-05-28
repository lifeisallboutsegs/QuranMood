export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  verse: {
    byMood: (mood: string) => `${API_URL}/api/verse?mood=${mood}`,
    all: (page: number, limit: number) => `${API_URL}/api/verse/all?page=${page}&limit=${limit}`,
    searchByTag: (tag: string) => `${API_URL}/api/verse/search/tag?tag=${encodeURIComponent(tag)}`,
    byId: (id: string) => `${API_URL}/api/verse/${id}`,
    moods: `${API_URL}/api/verse/moods`,
  }
}; 