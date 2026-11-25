import { useNavigate } from 'react-router-dom';
import { Clapperboard, Gamepad2, MessageSquareText, Play, Plus, Search, ShoppingBag, Sparkles, Wallet, Wrench } from 'lucide-react';
import { createTypes, industries, projects, type IndustryId } from '@/data/mock';
import { useApp } from '@/state';
import { SectionHead } from '@/components/ui';

const icons: Record<IndustryId, typeof Wallet> = {
  finance: Wallet, game: Gamepad2, ecommerce: ShoppingBag, tool: Wrench, social: MessageSquareText, drama: Clapperboard,
};

export function Home() {
  const { industry, setIndustry, projectId, setProjectId, toast } = useApp();
  const nav = useNavigate();
  const ind = industries.find(i => i.id === industry)!;
  const open = ind.status === '已开放';
  const list = projects.filter(p => p.industry === industry);
  const project = list.find(p => p.id === projectId) ?? list[0];
  const types = open ? createTypes[industry as 'finance' | 'game'] : [];

  return (
    <div className="page">
      <div className="row" style={{ alignItems: 'flex-end' }}>
        <div>
          <h1>AIGC 广告制作创意平台</h1>
          <div className="muted" style={{ marginTop: 8, fontSize: 14 }}>选择行业 → 选择项目 → 选择创作类型 → AI 生成可编辑的广告素材</div>
        </div>
        <span className="grow" />
        <div className="input" style={{ width: 260 }}><Search size={16} color="#808080" /><input placeholder="搜索模板、项目" /></div>
      </div>

      {/* ① 行业 */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SectionHead no={1} title="选择行业" hint="6 个行业模块" />
        <div className="grid-6">
          {industries.map(i => {
            const Icon = icons[i.id];
            const sel = i.id === industry;
            return (
              <button key={i.id} className={'card ind' + (sel ? ' sel' : '')} onClick={() => {
                setIndustry(i.id);
                setProjectId(projects.find(p => p.industry === i.id)?.id ?? null);
              }}>
                <span className="ind-icon"><Icon size={26} strokeWidth={1.6} /></span>
                <span>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{i.name}</div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>{i.types}</div>
                  <div className="faint" style={{ fontSize: 11, marginTop: 4 }}>{i.status}</div>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {!open && (
        <div className="panel" style={{ padding: 32, textAlign: 'center' }}>
          <b>{ind.name}板块规划中</b><div className="muted" style={{ marginTop: 6 }}>先开放金融和游戏，其他行业陆续上线。</div>
        </div>
      )}

      {open && (
        <>
          {/* ② 项目 */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionHead no={2} title="选择项目" hint={`${ind.name} · 每个项目保存自己的品牌资产，生成时自动套用`}
              right={<span className="muted" style={{ fontSize: 12 }}>管理全部项目 →</span>} />
            <div className="grid-4">
              {list.map(p => {
                const done = p.assets.filter(a => a.ok).length;
                const sel = p.id === project?.id;
                return (
                  <button key={p.id} className={'card proj' + (sel ? ' sel' : '')} onClick={() => setProjectId(p.id)}>
                    <div className="row" style={{ gap: 10 }}>
                      <span className="logo-sq" style={{ background: p.color }}>{p.name[0]}</span>
                      <span><div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div><div className="faint" style={{ fontSize: 11 }}>{p.market}</div></span>
                    </div>
                    <div className="row" style={{ fontSize: 11 }}>
                      <span className="faint">项目资产</span><span className="grow" />
                      <span style={{ color: done === p.assets.length ? 'var(--success)' : 'var(--warning)', fontWeight: 500 }}>{done}/{p.assets.length}</span>
                    </div>
                    <div className="bar"><i style={{ width: `${(done / p.assets.length) * 100}%`, background: done === p.assets.length ? 'var(--success)' : 'var(--warning)' }} /></div>
                  </button>
                );
              })}
              <button className="card dashed proj" style={{ alignItems: 'center', justifyContent: 'center', color: 'inherit' }} onClick={() => nav('/projects/new')}>
                <Plus size={22} className="muted" /><b>新建项目</b><span className="faint" style={{ fontSize: 11 }}>Google Play 链接 · Logo · 尾板</span>
              </button>
            </div>
            {project && (
              <div className="panel row" style={{ padding: '12px 16px', gap: 12, flexWrap: 'wrap' }}>
                <b style={{ fontSize: 12 }}>{project.name} 的资产</b>
                {project.assets.map(a => (
                  <span key={a.name} className={'asset-pill' + (a.ok ? '' : ' miss')}>
                    <i style={{ width: 20, height: 20, borderRadius: 3, background: a.ok ? a.color : 'var(--bg-hover)', display: 'inline-block' }} />
                    {a.name}{!a.ok && ' ＋'}
                  </span>
                ))}
                <span className="grow" />
                <button className="btn btn-secondary" onClick={() => nav('/projects/new')}>管理资产</button>
              </div>
            )}
          </section>

          {/* ③ 创作类型 */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionHead no={3} title={`${ind.name} · 选择创作类型`} hint={ind.hint} />
            <div className="grid-3">
              {types.map(t => (
                <div key={t.id} className="card type-card">
                  <div className="type-prev"><Preview id={t.id} game={industry === 'game'} /></div>
                  <div className="type-body">
                    <div className="row"><b style={{ fontSize: 18 }}>{t.title}</b>{t.pending && <span className="tag warn">待开发</span>}</div>
                    <div className="muted" style={{ lineHeight: 1.6 }}>{t.desc}</div>
                    <div className="row" style={{ flexWrap: 'wrap', gap: 6 }}>{t.tags.map(x => <span key={x} className="tag">{x}</span>)}</div>
                    <div>
                      {t.pending
                        ? <button className="btn btn-secondary" disabled>敬请期待</button>
                        : <button className={'btn ' + (t.id === 'image' ? 'btn-primary' : 'btn-secondary')}
                            onClick={() => (t.to ? nav(t.to) : toast('图片广告流程开发中'))}>开始创作 →</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionHead title="或者，直接描述你的需求" />
            <div className="input" style={{ padding: '12px 12px 12px 18px', borderColor: 'var(--border-strong)' }}>
              <Sparkles size={18} color="var(--accent)" />
              <input placeholder={industry === 'game' ? '例如：25 秒 Truco 逆转局实录，9:16，巴西葡语解说 + 字幕' : '例如：15 秒赞比亚贷款视频广告，9:16，突出最快 5 分钟到账，英语配音 + 字幕'} />
              <button className="btn btn-primary" onClick={() => nav('/video/idea')}><Sparkles size={14} />生成</button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function Preview({ id, game }: { id: string; game: boolean }) {
  if (id === 'image') return <>{[[90, 90], [80, 100], [64, 114]].map(([w, h], i) => (
    <div key={i} style={{ width: w, height: h, background: game ? '#0F5132' : '#0E4D36', borderRadius: 3, display: 'grid', placeContent: 'center', gap: 6, justifyItems: 'center' }}>
      <b style={{ color: '#F5C542', fontSize: 13 }}>{game ? 'WIN!' : 'K 5,000'}</b><i style={{ width: 40, height: 10, borderRadius: 5, background: '#F5C542' }} />
    </div>))}</>;
  if (id === 'video') return <>
    <div style={{ width: 70, height: 124, background: '#0E4D36', borderRadius: 3, display: 'grid', placeItems: 'center' }}><Play size={22} fill="#fff" /></div>
    <div style={{ display: 'grid', gap: 6 }}>{[[150, 'var(--clip-video)'], [110, 'var(--clip-text)'], [130, 'var(--clip-subtitle)'], [160, 'var(--clip-audio)']].map(([w, c], i) => <i key={i} style={{ width: w as number, height: 12, borderRadius: 2, background: c as string }} />)}</div>
  </>;
  return <>
    {[0, 1].map(i => <div key={i} style={{ width: 76, height: 140, borderRadius: 8, background: i ? '#fff' : '#F4F6F8', padding: 8, display: 'grid', gap: 6, alignContent: 'start' }}>
      <i style={{ height: 26, borderRadius: 4, background: game ? '#0F5132' : '#0E4D36' }} />
      {[40, 56, 48].map(w => <i key={w} style={{ width: w, height: 6, borderRadius: 3, background: '#C9CED6' }} />)}
      <i style={{ height: 14, borderRadius: 7, background: '#F5C542' }} /></div>)}
    <span className="tag" style={{ padding: '4px 8px', fontSize: 11, border: '1px solid var(--border-strong)' }}>✦ {game ? 'AI 试玩中' : 'AI 生成中'}</span>
  </>;
}
