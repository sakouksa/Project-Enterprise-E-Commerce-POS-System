import { useEffect } from 'react';

/**
 * useKeyPress Hook
 * Listen for specific key combos (e.g. Escape, Cmd+K, Ctrl+K)
 */
export function useKeyPress(
  targetKey: string,
  onPress: (e: KeyboardEvent) => void,
  options: { ctrl?: boolean; meta?: boolean; alt?: boolean; shift?: boolean } = {}
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const matchKey = event.key.toLowerCase() === targetKey.toLowerCase();
      const matchCtrl = options.ctrl ? event.ctrlKey : true;
      const matchMeta = options.meta ? event.metaKey || event.ctrlKey : true;
      const matchAlt = options.alt ? event.altKey : true;
      const matchShift = options.shift ? event.shiftKey : true;

      if (matchKey && matchCtrl && matchMeta && matchAlt && matchShift) {
        onPress(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [targetKey, onPress, options]);
}
