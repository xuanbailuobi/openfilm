import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  AudioLines, BookMarked, Bot, Box, ChartLine, ChevronDown, CircleUser, Download, FileText,
  Folder, House, LayoutGrid, Music, Plus, Puzzle, UserRound, Check,
} from 'lucide-react';
import { useApp, workspaces } from '@/state';

type Item = { to: string; label: string; icon: typeof House; badge?: string; isNew?: boolean };

export function Sidebar() {
  const { workspace, setWorkspace, credits } = useApp();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  const groups: { title: string; items: Item[] }[] = [
    { title: '创作', items: [
      { to: '/', label: '首页', icon: House },
      { to: '/projects', label: workspace.team ? '团队项目' : '我的项目', icon: Folder },
      { to: '/templates', label: '模板库', icon: LayoutGrid },
    ] },
    { title: '资源库', items: [
      { to: '/scripts', label: '脚本文案', icon: FileText },
      { to: '/bgm', label: 'BGM 音乐', icon: Music },
      { to: '/sfx', label: '音效库', icon: AudioLines },
      { to: '/actors', label: 'AI 演员库', icon: UserRound },
      { to: '/assets', label: '我的资产', icon: Box },
    ] },
    { title: 'AI 能力', items: [
      { to: '/agents', label: '智能体', icon: Bot, badge: '3 个运行中' },
      { to: '/plugins', label: '插件', icon: Puzzle },
      { to: '/skills', label: 'Skill', icon: BookMarked },
    ] },
    { title: '数据', items: [{ to: '/report', label: '素材报告', icon: ChartLine, isNew: true }] },
    { title: '账户', items: [
      { to: '/exports', label: '导出记录', icon: Download },
      { to: '/me', label: '个人中心', icon: CircleUser },
    ] },
  ];

  const used = workspace.team ? 4380 : 620;

  return (
    <aside className="sidebar">
      <div style={{ position: 'relative' }}>
        <button className="ws-switch" onClick={() => setOpen(!open)}>
          <span className="ws-avatar" style={{ background: workspace.color }}>{workspace.initial}</span>
          <span className="grow" style={{ minWidth: 0 }}>
            <div className="nowrap" style={{ fontWeight: 700, fontSize: 14 }}>{workspace.name}</div>
            <div className="faint" style={{ fontSize: 11 }}>{workspace.sub}</div>
          </span>
          <ChevronDown size={14} className="muted" />
        </button>
        {open && (
          <div className="ws-menu" onMouseLeave={() => setOpen(false)}>
            <div className="nav-group">个人</div>
            {workspaces.filter(w => !w.team).concat([]).map(w => wsItem(w))}
            <div className="nav-group">团队</div>
            {workspaces.filter(w => w.team).map(w => wsItem(w))}
            <div style={{ height: 1, background: 'var(--border-default)', margin: '6px 0' }} />
            <div className="ws-menu-item muted"><Plus size={14} />创建团队</div>
            <div className="ws-menu-item muted">加入团队（邀请码）</div>
          </div>
        )}
      </div>

      <button className="btn btn-primary btn-block" style={{ margin: '10px 0 2px', padding: '9px' }} onClick={() => nav('/')}>
        <Plus size={15} />新建广告
      </button>

      {groups.map(g => (
        <div key={g.title}>
          <div className="nav-group">{g.title}</div>
          {g.items.map(it => (
            <NavLink key={it.to} to={it.to} end className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
              <it.icon size={18} strokeWidth={1.8} />
              {it.label}
              {it.badge && <span className="nav-badge">{it.badge}</span>}
              {it.isNew && <span className="nav-badge new">NEW</span>}
            </NavLink>
          ))}
        </div>
      ))}

      <div className="credits" style={{ marginTop: 'auto' }}>
        <div className="row"><span className="muted" style={{ fontSize: 12 }}>{workspace.team ? '团队积分' : '我的积分'}</span><span className="grow" /><span className="faint" style={{ fontSize: 11 }}>明细 →</span></div>
        <div className="row">
          <b style={{ fontSize: 22 }}>{credits.toLocaleString()}</b><span className="faint" style={{ fontSize: 12, flexShrink: 0 }}>积分</span>
          <span className="grow" /><button className="btn btn-primary" style={{ padding: "6px 12px" }}>充值</button>
        </div>
        <div className="bar"><i style={{ width: `${Math.min(100, (used / (credits + used)) * 100)}%` }} /></div>
        <div className="faint" style={{ fontSize: 11 }}>{workspace.team ? '团队' : ''}本月已用 {used.toLocaleString()}</div>
      </div>
      <div className="legal"><a href="#/terms">用户协议</a>·<a href="#/privacy">隐私政策</a></div>
    </aside>
  );

  function wsItem(w: (typeof workspaces)[number]) {
    const on = w.id === workspace.id;
    return (
      <div key={w.id} className={'ws-menu-item' + (on ? ' on' : '')} onClick={() => { setWorkspace(w); setOpen(false); }}>
        <span className="ws-avatar" style={{ background: w.color, width: 26, height: 26, fontSize: 11, borderRadius: 13 }}>{w.initial}</span>
        <span className="grow"><div style={{ fontWeight: 500 }}>{w.name}</div><div className="faint" style={{ fontSize: 10 }}>{w.sub}</div></span>
        {on && <Check size={14} color="var(--accent)" />}
      </div>
    );
  }
}
