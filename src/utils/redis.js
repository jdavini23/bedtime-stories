'use strict';

// Client-side mock implementation of Redis operations
const clientRedis = {
  async get(key) {
    if (typeof window === 'undefined') return null;
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },

  async set(key, value, options = {}) {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error setting localStorage:', error);
      return false;
    }
  },

  async hget(key, field) {
    if (typeof window === 'undefined') return null;
    const hash = localStorage.getItem(key);
    if (!hash) return null;
    try {
      const parsed = JSON.parse(hash);
      return parsed[field] || null;
    } catch (error) {
      console.error('Error getting hash field:', error);
      return null;
    }
  },

  async hset(key, fieldOrObject, value) {
    if (typeof window === 'undefined') return false;
    try {
      let hash = {};
      const existing = localStorage.getItem(key);
      if (existing) {
        hash = JSON.parse(existing);
      }

      if (typeof fieldOrObject === 'object') {
        Object.assign(hash, fieldOrObject);
      } else {
        hash[fieldOrObject] = value;
      }

      localStorage.setItem(key, JSON.stringify(hash));
      return true;
    } catch (error) {
      console.error('Error setting hash:', error);
      return false;
    }
  },

  async hgetall(key) {
    if (typeof window === 'undefined') return null;
    const hash = localStorage.getItem(key);
    if (!hash) return null;
    try {
      return JSON.parse(hash);
    } catch (error) {
      console.error('Error getting hash:', error);
      return null;
    }
  },
};

module.exports = clientRedis;
