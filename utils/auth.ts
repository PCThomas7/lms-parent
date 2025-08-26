// utils/auth.ts

// Create a global event system to notify about auth changes
const authListeners = new Set<() => void>();

export function notifyAuthChange() {
  authListeners.forEach(listener => listener());
}

export function addAuthListener(listener: () => void) {
  authListeners.add(listener);
}

export function removeAuthListener(listener: () => void) {
  authListeners.delete(listener);
}