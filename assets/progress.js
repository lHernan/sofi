/**
 * Sofi Learning Platform — Progress Manager
 * Persists completed levels and unlocked categories via localStorage.
 *
 * API:
 *   Progress.isUnlocked('variables')   → true / false
 *   Progress.unlock('variables')
 *   Progress.getLevel('algoritmos')    → 0-3
 *   Progress.setLevel('algoritmos', 2)
 *   Progress.getTotalLevels()          → sum of all completed levels
 *   Progress.reset()                   → wipe all data (debug)
 */
const Progress = (() => {
  const KEY_UNLOCKED = 'sofi_unlocked';
  const KEY_LEVELS   = 'sofi_levels';

  function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  }

  return {
    isUnlocked(id) {
      if (id === 'algoritmos') return true; // Always open
      return load(KEY_UNLOCKED, []).includes(id);
    },

    unlock(id) {
      const arr = load(KEY_UNLOCKED, []);
      if (!arr.includes(id)) {
        arr.push(id);
        localStorage.setItem(KEY_UNLOCKED, JSON.stringify(arr));
      }
    },

    /** Returns highest level completed (0 = none started) */
    getLevel(id) {
      return load(KEY_LEVELS, {})[id] || 0;
    },

    /** Only advances (never resets progress backwards) */
    setLevel(id, n) {
      const obj = load(KEY_LEVELS, {});
      if ((obj[id] || 0) < n) {
        obj[id] = n;
        localStorage.setItem(KEY_LEVELS, JSON.stringify(obj));
      }
    },

    getTotalLevels() {
      return Object.values(load(KEY_LEVELS, {})).reduce((s, v) => s + v, 0);
    },

    reset() {
      localStorage.removeItem(KEY_UNLOCKED);
      localStorage.removeItem(KEY_LEVELS);
    }
  };
})();
