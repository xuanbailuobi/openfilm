import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Pencil, Plus, RefreshCw } from 'lucide-react';
import { productInfoFromStore, type ProductInfo } from '@/data/mock';
import { useApp } from '@/state';

type AssetSlot = { key: string; title: string; spec: string; required: boolean; file?: string; done?: boolean };

const initialAssets: AssetSlot[] = [
  { key: 'logo', title: 'Logo', spec: 'PNG 透明底 · 横版 + 方形', required: true },
  { key: 'endcard', title: '尾板 End Card', spec: '3–5 秒 · 9:16 / 1:1 / 16:9 各一版，自动接在每条视频结尾', required: true },
  { key: 'icon', title: 'App 图标', spec: '1024×1024，用于下载引导和尾板', required: true },
  { key: 'colors', title: '品牌色', spec: '主色 / 按钮色 / 文字色', required: true },
  { key: 'screens', title: '产品界面截图', spec: '首页、额度页、到账页，替换视频里的绿幕手机屏', required: false },
  { key: 'actor', title: '固定演员 / 代言人', spec: '从 AI 演员库选，让系列广告人物一致', required: false },
  { key: 'font', title: '品牌字体', spec: '标题 / 正文字体文件', required: false },
  { key: 'sound', title: '品牌音 / BGM', spec: '片头片尾的品牌声音', required: false },
];

export function NewProject() {
  const nav = useNavigate();
  const { toast } = useApp();
  const [url, setUrl] = useState('https://play.google.com/store/apps/details?id=com.quickloan.ng');
  const [fetching, setFetching] = useState(false);
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null);
  const [info, setInfo] = useState<ProductInfo[]>([]);
  const [points, setPoints] = useState(['最快 5 分钟到账', '无抵押', '全程线上']);
  const [disclaimer, setDisclaimer] = useState('Loans subject to approval. T&Cs apply.');
  const [assets, setAssets] = useState(initialAssets);

  const fetchInfo = () => {
    if (!/play\.google\.com\/store\/apps\/details\?id=/.test(url)) { toast('请粘贴 Google Play 应用详情页链接'); return; }
    setFetching(true);
    /* TODO: 接后端抓取商店页（贷款类 App 的披露信息），这里先用示例数据 */
    window.setTimeout(() => { setInfo(productInfoFromStore()); setFetchedAt(new Date()); setFetching(false); }, 900);
  };
  const edit = (key: string, value: string) => setInfo(info.map(i => (i.key === key ? { ...i, value, manual: true } : i)));
  const v = (key: string) => info.find(i => i.key === key)?.value ?? `{${key}}`;
  const reqDone = assets.filter(a => a.required && a.done).length;
  const recDone = assets.filter(a => !a.required && a.done).length;
  const canCreate = info.length > 0 && reqDone === 4 && disclaimer.trim().length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div className="page" style={{ flex: 1, gap: 20 }}>
        <div>
          <div className="faint" style={{ fontSize: 12 }}>金融 · 我的项目 /</div>
          <h1 style={{ fontSize: 28, marginTop: 6 }}>新建项目</h1>
          <div className="muted" style={{ marginTop: 6 }}>填 Google Play 链接自动获取产品信息；项目资产只需上传一次，之后所有图片、视频都会自动套用</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '560px 1fr', gap: 24, alignItems: 'start' }}>
          {/* 左：Google Play + 固定格式卖点 */}
          <div className="panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="row"><b style={{ fontSize: 15 }}>Google Play 链接</b><span className="tag red">必填</span></div>
            <div className="row">
              <div className="input grow" style={{ borderColor: 'var(--border-strong)' }}><input value={url} onChange={e => setUrl(e.target.value)} /></div>
              <button className="btn btn-primary" onClick={fetchInfo} disabled={fetching}>{fetching ? '获取中…' : '获取信息'}</button>
            </div>
            {fetchedAt && (
              <div className="row" style={{ fontSize: 11 }}>
                <Check size={13} color="var(--success)" /><span className="muted">已从商店页获取 {info.length} 项 · 所有字段可手动修改</span>
                <span className="grow" /><button className="btn btn-ghost" style={{ padding: 0, fontSize: 11 }} onClick={fetchInfo}><RefreshCw size={11} />重新获取</button>
              </div>
            )}

            <div className="row" style={{ marginTop: 4 }}>
              <b style={{ fontSize: 15 }}>产品信息 · 固定格式核心卖点</b><span className="grow" />
              <span className="tag">自动</span><span className="faint" style={{ fontSize: 10 }}>来自商店</span>
              <span className="tag manual">手动</span><span className="faint" style={{ fontSize: 10 }}>已修改</span>
            </div>
            <div className="faint" style={{ fontSize: 11 }}>Google Play 要求贷款类 App 在商店页披露这些信息，平台据此自动提取；AI 写脚本时只引用这里的数值</div>

            {info.length === 0 ? (
              <div className="dashed" style={{ borderRadius: 4, padding: 24, textAlign: 'center' }}>
                <span className="muted">点击「获取信息」，自动填入产品名、地区、贷款区间、周期、利率、计息与还款方式</span>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {info.map(i => (
                  <div key={i.key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div className="row" style={{ gap: 6 }}>
                      <span className="label">{i.label}</span>
                      {i.manual ? <span className="tag manual">手动</span> : <span className="tag">自动</span>}
                      <span className="grow" /><span className="faint" style={{ fontSize: 10 }}>{i.token}</span>
                    </div>
                    <label className={'input' + (i.manual ? ' manual' : '')}>
                      <input value={i.value} onChange={e => edit(i.key, e.target.value)} style={{ fontWeight: 500 }} />
                      <Pencil size={12} color="#808080" />
                    </label>
                  </div>
                ))}
              </div>
            )}

            <div className="row"><span className="label">补充卖点</span><span className="tag manual">手动</span></div>
            <div className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
              {points.map(p => <span key={p} className="chip" onClick={() => setPoints(points.filter(x => x !== p))} title="点击移除">{p}</span>)}
              <button className="chip" onClick={() => { const p = window.prompt('添加卖点'); if (p) setPoints([...points, p]); }}>＋ 添加</button>
            </div>

            <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-default)', borderRadius: 4, padding: '10px 12px', display: 'grid', gap: 6 }}>
              <div className="row" style={{ fontSize: 11 }}><span className="muted" style={{ fontWeight: 500 }}>脚本中的展示（示例）</span><span className="grow" /><span className="faint" style={{ fontSize: 10 }}>字幕 / 台词自动替换</span></div>
              <div style={{ lineHeight: 1.6 }}>“Borrow {v('amount')} with {v('name')}, repay in {v('term')}. {v('apr')}.”</div>
              <div style={{ fontSize: 10, color: 'var(--warning)' }}>利率等数值与商店页不一致时会提示，避免广告和商店信息对不上</div>
            </div>

            <div className="row"><span className="label">免责声明</span><span className="tag red">必填</span></div>
            <div className="input"><input value={disclaimer} onChange={e => setDisclaimer(e.target.value)} /></div>
          </div>

          {/* 右：项目资产 */}
          <div className="panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="row">
              <b style={{ fontSize: 15 }}>项目资产</b>
              <span style={{ fontSize: 12, fontWeight: 500, color: reqDone === 4 ? 'var(--success)' : 'var(--warning)' }}>必填 {reqDone}/4 · 推荐 {recDone}/4</span>
              <span className="grow" /><span className="muted" style={{ fontSize: 12 }}>从已有项目复制 ▾</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 12 }}>
              {assets.map(a => <AssetCard key={a.key} a={a} onDone={file => setAssets(assets.map(x => (x.key === a.key ? { ...x, done: true, file } : x)))} />)}
            </div>
          </div>
        </div>
      </div>

      <div className="row" style={{ position: 'sticky', bottom: 0, padding: '14px 48px', background: 'var(--bg-panel)', borderTop: '1px solid var(--border-default)', gap: 12 }}>
        <span className="muted" style={{ fontSize: 12 }}>{canCreate ? '必填资产已齐，推荐资产可以之后再补' : '获取产品信息、上传 4 项必填资产后即可创建'}</span>
        <span className="grow" />
        <button className="btn btn-ghost" onClick={() => nav('/')}>取消</button>
        <button className="btn btn-secondary" onClick={() => toast('草稿已保存')}>保存草稿</button>
        <button className="btn btn-primary" disabled={!canCreate} onClick={() => { toast('项目已创建'); nav('/'); }}>创建项目，开始创作 →</button>
      </div>
    </div>
  );
}

function AssetCard({ a, onDone }: { a: AssetSlot; onDone: (file?: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const pick = () => (a.key === 'colors' || a.key === 'actor' ? onDone() : ref.current?.click());
  return (
    <div className={'card' + (a.done ? '' : ' dashed')} style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--bg-raised)' }}>
      <button onClick={pick} style={{ height: 96, borderRadius: 4, background: 'var(--bg-app)', border: 0, color: 'var(--text-secondary)', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
        {a.done
          ? a.file ? <img src={a.file} style={{ maxWidth: '100%', maxHeight: 96, objectFit: 'contain' }} /> : a.key === 'colors'
            ? <span className="row">{['#0E4D36', '#F5C542', '#FFFFFF'].map(c => <i key={c} style={{ width: 28, height: 28, borderRadius: 4, background: c }} />)}</span>
            : <Check color="var(--success)" />
          : <span className="row" style={{ fontWeight: 500 }}><Plus size={14} />{a.key === 'colors' ? '设置' : a.key === 'actor' ? '选择' : '上传'}</span>}
      </button>
      <input ref={ref} type="file" hidden accept={a.key === 'endcard' ? 'image/*,video/*' : a.key === 'sound' ? 'audio/*' : a.key === 'font' ? '.ttf,.otf,.woff,.woff2' : 'image/*'}
        onChange={e => { const f = e.target.files?.[0]; if (f) onDone(f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined); }} />
      <div className="row" style={{ gap: 6 }}>
        <b>{a.title}</b><span className={'tag' + (a.required ? ' red' : '')}>{a.required ? '必填' : '推荐'}</span>
        <span className="grow" />{a.done && <Check size={14} color="var(--success)" />}
      </div>
      <div className="faint" style={{ fontSize: 11, lineHeight: 1.5 }}>{a.spec}</div>
    </div>
  );
}
