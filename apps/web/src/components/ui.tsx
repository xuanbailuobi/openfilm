import type { ReactNode } from 'react';
import type { Stage } from '@/data/mock';
import { agentOptions } from '@/data/mock';

export function SectionHead({ no, title, hint, right }: { no?: number; title: string; hint?: string; right?: ReactNode }) {
  return (
    <div className="sec-h">
      {no !== undefined && <span className="step-no">{no}</span>}
      <h2>{title}</h2>
      {hint && <span className="faint" style={{ fontSize: 12 }}>{hint}</span>}
      <span className="grow" />
      {right}
    </div>
  );
}

export function Seg<T extends string>({ items, value, onChange }: { items: T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="seg">
      {items.map(i => (
        <button key={i} className={'chip' + (i === value ? ' on' : '')} onClick={() => onChange(i)}>{i}</button>
      ))}
    </div>
  );
}

/* 管线环节 · 智能体 · 计费（对应 Figma 组件 Stage Agent Row） */
export function StageAgentRow({ s, onChange }: { s: Stage; onChange: (agent: string) => void }) {
  return (
    <div className="stage-row">
      <span className="stage">{s.stage}</span>
      <label className="agent-select">
        <span className="agent-logo">{s.initial}</span>
        <select value={s.agent} onChange={e => onChange(e.target.value)}
          style={{ flex: 1, background: 'none', border: 0, color: 'inherit', fontSize: 13, fontWeight: 500, outline: 0 }}>
          {agentOptions.map(a => <option key={a} value={a} style={{ background: '#232323' }}>{a}</option>)}
        </select>
      </label>
      <span className={'billing' + (s.credits ? ' credits' : '')}>{s.cost}</span>
    </div>
  );
}

export function Placeholder({ title, note }: { title: string; note?: string }) {
  return (
    <div className="page">
      <h1>{title}</h1>
      <div className="panel" style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>页面开发中</div>
        <div className="muted" style={{ marginTop: 8 }}>{note ?? '按 Figma 设计稿逐步实现，先完成主流程。'}</div>
      </div>
    </div>
  );
}
