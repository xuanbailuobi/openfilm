import { createContext, useContext, useState, type ReactNode } from 'react';
import type { IndustryId } from './data/mock';

export type Workspace = { id: string; name: string; sub: string; initial: string; color: string; team: boolean };

export const workspaces: Workspace[] = [
  { id: 'personal', name: 'AdFilm', sub: '个人空间 · 个人版', initial: 'A', color: '#E50914', team: false },
  { id: 'sandwichlab', name: 'Sandwichlab 团队', sub: '团队版 · 8 位成员', initial: 'S', color: '#0071EB', team: true },
  { id: 'mirakash-ext', name: 'Mirakash 外包组', sub: '团队版 · 3 位成员', initial: 'M', color: '#24683A', team: true },
];

interface AppState {
  workspace: Workspace;
  setWorkspace: (w: Workspace) => void;
  industry: IndustryId;
  setIndustry: (i: IndustryId) => void;
  projectId: string | null;
  setProjectId: (p: string | null) => void;
  credits: number;
  toast: (msg: string) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [workspace, setWorkspace] = useState(workspaces[1]);
  const [industry, setIndustry] = useState<IndustryId>('finance');
  const [projectId, setProjectId] = useState<string | null>('mirakash');
  const [msg, setMsg] = useState<string | null>(null);
  const toast = (m: string) => {
    setMsg(m);
    window.setTimeout(() => setMsg(null), 2400);
  };
  const credits = workspace.team ? 12000 : 1280;
  return (
    <Ctx.Provider value={{ workspace, setWorkspace, industry, setIndustry, projectId, setProjectId, credits, toast }}>
      {children}
      {msg && <div className="toast">{msg}</div>}
    </Ctx.Provider>
  );
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be inside AppProvider');
  return v;
}
