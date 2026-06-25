import { societies as initialData } from '../data/societies';

// In-memory store — swap the Promise bodies with fetch() calls for API integration
let _societies = [...initialData];

export const societyService = {
  getSocieties: () => Promise.resolve([..._societies]),

  getSocietyById: (id) => {
    const society = _societies.find((s) => s.id === id);
    if (!society) return Promise.reject(new Error('Society not found'));
    return Promise.resolve({ ...society });
  },

  createSociety: (data) => {
    const newSociety = {
      ...data,
      id: `soc_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    _societies = [newSociety, ..._societies];
    return Promise.resolve({ ...newSociety });
  },

  updateSociety: (id, data) => {
    const index = _societies.findIndex((s) => s.id === id);
    if (index === -1) return Promise.reject(new Error('Society not found'));
    _societies[index] = { ..._societies[index], ...data };
    return Promise.resolve({ ..._societies[index] });
  },

  deleteSociety: (id) => {
    const index = _societies.findIndex((s) => s.id === id);
    if (index === -1) return Promise.reject(new Error('Society not found'));
    _societies = _societies.filter((s) => s.id !== id);
    return Promise.resolve({ id });
  },
};
