import { useState, useEffect } from 'react';
import type { SavedConnection } from '../components/ConnectionManager';

const STORAGE_KEY = 'timeseriesui_connections';
const ACTIVE_KEY = 'timeseriesui_active_connection';

function getActive(): SavedConnection | null {
  try {
    const activeId = localStorage.getItem(ACTIVE_KEY);
    if (!activeId) return null;
    const data = localStorage.getItem(STORAGE_KEY);
    const conns: SavedConnection[] = JSON.parse(data || '[]');
    return conns.find((c) => c.id === activeId) || null;
  } catch {
    return null;
  }
}

export function useActiveConnection() {
  const [conn, setConn] = useState<SavedConnection | null>(getActive);

  useEffect(() => {
    const handler = () => setConn(getActive());
    window.addEventListener('timeseriesui-connection-change', handler);
    return () => window.removeEventListener('timeseriesui-connection-change', handler);
  }, []);

  const auth = conn?.username
    ? { username: conn.username, password: conn.password || '' }
    : undefined;

  return { connection: conn, auth };
}
