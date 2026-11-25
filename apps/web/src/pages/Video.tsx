import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, Lightbulb, Network, ShieldCheck, Sparkles, Video } from 'lucide-react';
import { pipelineA, projects, type Stage } from '@/data/mock';
import { useApp } from '@/state';
import { StageAgentRow } from '@/components/ui';

function TopBar({ crumb, title, right }: { crumb: string; title: string; right?: React.ReactNode }) {
  const nav = useNavigate();
  return (
    <div className="row" style={{ height: 60, padding: '0 20px', background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-default)', gap: 12, position: 'sticky', top: 0, zIndex: 5 }}>
      <button className="btn btn-ghost" style={{ padding: 4 }} onClick={() => nav(-1)}><ChevronLeft size={18} color="#fff" /></button>
      <div><div className="faint" style={{ fontSize: 11 }}>{crumb}</div><b style={{ fontSize: 14 }}>{title}</b></div>
      <span className="grow" />{right}
    </div>
  );
}

const modes = [
  { id: 'idea', pipe: '管线 A', title: '只有一个想法', icon: Lightbulb, desc: '输入一句话，AI 按平台内置规范自动完成：整理想法 → 角色图 → 剧情脚本 → 生成视频 → 字幕', who: '适合：不懂视频制作的同事', tags: ['约 5 分钟出片', '全自动'], to: '/video/idea', rec: true },
  { id: 'remake', pipe: '管线 B', title: '复刻一条视频', icon: Video, desc: '上传爆款参考视频，AI 拆解它的结构、节奏和镜头，换成你的产品和演员重新生成', who: '适合：看到好素材想快速跟进', tags: ['保留结构', '替换产品'] },
  { id: 'script', pipe: '管线 C', title: '已经有脚本', icon: FileText, desc: '按 设定 → 提示词 → 生成视频 → 字幕 → 后期 五步精细控制，每一步都能改', who: '适合：编导、剪辑、投手', tags: ['逐步可控', '提示词可编辑'] },
  { id: 'canvas', pipe: '', title: '自由画布', icon: Network, desc: '不走固定流程。在无限画布上拖入文本、图片、视频节点，自由连接 GPT、GPT Image 2、Seedance 2.5 等模型', who: '适合：专业创作者 · 做实验和复杂项目', tags: ['节点自由连接', '多模型'] },
];

export function VideoModes() {
  const nav = useNavigate();
  const { toast, industry } = useApp();
  return (
    <div>
      <TopBar crumb={`首页 · ${industry === 'game' ? '游戏' : '金融'}`} title="视频广告" />
      <div className="page" style={{ alignItems: 'center', paddingTop: 64 }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 32 }}>你手上有什么？</h1>
          <div className="muted" style={{ marginTop: 10, fontSize: 15 }}>三条自动管线 + 一块自由画布，越往右控制越精细</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 20, width: '100%' }}>
          {modes.map(m => (
            <button key={m.id} className={'card mode' + (m.rec ? ' sel' : '')} onClick={() => (m.to ? nav(m.to) : toast(`${m.title} 开发中`))}>
              <div className="row"><span className="mode-icon"><m.icon size={26} strokeWidth={1.7} /></span><span className="grow" />{m.rec && <span className="tag solid">推荐</span>}</div>
              <b style={{ fontSize: 22 }}>{m.title}</b>
              <div className="muted" style={{ fontSize: 14, lineHeight: 1.6 }}>{m.desc}</div>
              <div className="faint" style={{ fontSize: 12 }}>{m.pipe && `${m.pipe} · `}{m.who}</div>
              <div className="row" style={{ gap: 6 }}>{m.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
              <span className="grow" />
              <span className={'btn ' + (m.rec ? 'btn-primary' : 'btn-secondary')} style={{ alignSelf: 'flex-start' }}>开始 →</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const ideas = [
  ['打电话借钱', '月底交不起房租，给朋友打电话借钱，朋友推荐了 App'],
  ['夫妻误会', '老公偷笑看手机，老婆起疑，原来是借款惊喜'],
  ['街头偶遇', '路人被问“急用钱怎么办”，现场演示 5 分钟到账'],
  ['撕纸对比', '手拿高利息借条一把撕掉，换成低息 App'],
];

export function IdeaInput() {
  const { projectId, toast } = useApp();
  const project = projects.find(p => p.id === projectId) ?? projects[0];
  const [idea, setIdea] = useState('');
  const [stages, setStages] = useState<Stage[]>(pipelineA);
  const [openPanel, setOpenPanel] = useState(true);
  const cost = stages.filter(s => s.credits).length ? 50 : 0;

  return (
    <div>
      <TopBar crumb={`${project.industry === 'game' ? '游戏' : '金融'} · 视频广告`} title="只有一个想法" right={<button className="btn btn-ghost">切换到专业模式</button>} />
      <div style={{ width: 820, margin: '0 auto', padding: '72px 0 48px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 32 }}>说说你的想法</h1>
          <div className="muted" style={{ marginTop: 10, fontSize: 15 }}>一句话就够，剩下的交给 AI 按规范完成</div>
        </div>

        <div className="card" style={{ padding: '20px 16px 14px 22px', borderColor: 'var(--border-strong)', borderRadius: 8, display: 'grid', gap: 16 }}>
          <textarea value={idea} onChange={e => setIdea(e.target.value)} rows={3}
            placeholder="例如：老公看着手机偷笑，老婆以为他有别的女人，结果发现他用 QuickLoan 借到钱准备给她惊喜"
            style={{ background: 'none', border: 0, outline: 0, fontSize: 17, lineHeight: 1.6, resize: 'none' }} />
          <div className="row">
            {[`产品  ${project.name}`, `市场  ${project.market.split(' · ')[0]}`, '时长  30s', `语言  ${project.market.split(' · ')[1]}`].map(t => <span key={t} className="chip">{t} ▾</span>)}
            <span className="grow" />
            <button className="btn btn-primary btn-lg" disabled={!idea.trim()} onClick={() => toast(`已提交，消耗 ${cost} 积分（生成进度页开发中）`)}>
              <Sparkles size={15} />一键生成 · {cost} 积分
            </button>
          </div>
        </div>

        <div className="row" style={{ justifyContent: 'center', fontSize: 12 }}>
          <ShieldCheck size={15} color="var(--success)" />
          <span className="muted">将按平台规范「{project.industry === 'game' ? '游戏' : '金融广告'} · {project.market.split(' · ')[0]} · 剧情类」生成，台词、合规、画面要求已内置</span>
        </div>

        <div className="panel" style={{ padding: '16px 20px', display: 'grid', gap: 10 }}>
          <div className="row">
            <b style={{ fontSize: 14 }}>管线 A · 各环节智能体</b><span className="faint" style={{ fontSize: 12 }}>可替换为你连接的其他智能体</span>
            <span className="grow" /><button className="btn btn-ghost" style={{ padding: 0, fontSize: 12 }} onClick={() => setOpenPanel(!openPanel)}>{openPanel ? '收起 ▴' : '展开 ▾'}</button>
          </div>
          {openPanel && stages.map((s, i) => (
            <StageAgentRow key={s.stage} s={s} onChange={agent => setStages(stages.map((x, j) => (j === i ? { ...x, agent, initial: agent.split(' ').map(w => w[0]).join('').slice(0, 2) } : x)))} />
          ))}
          <div className="row" style={{ borderTop: '1px solid var(--border-default)', paddingTop: 8, fontSize: 12 }}>
            <span className="faint">预计消耗</span><span className="grow" />
            <b style={{ color: 'var(--accent)', fontSize: 13 }}>平台积分 {cost}</b><span className="faint">+ 各智能体账号自身额度</span>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <div className="row"><b style={{ fontSize: 14 }}>没创意？试试这些</b><span className="grow" /><span className="muted" style={{ fontSize: 12 }}>换一批 ↻</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {ideas.map(([t, d]) => (
              <button key={t} className="card" style={{ padding: 12, textAlign: 'left', color: 'inherit' }} onClick={() => setIdea(d)}>
                <b>{t}</b><div className="faint" style={{ fontSize: 12, marginTop: 4 }}>{d}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
