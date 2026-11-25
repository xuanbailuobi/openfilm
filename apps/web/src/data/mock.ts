/* 第一版用的示例数据。接入后端后替换成真实接口，字段名保持不变。 */

export type IndustryId = 'finance' | 'game' | 'ecommerce' | 'tool' | 'social' | 'drama';

export interface Industry {
  id: IndustryId;
  name: string;
  types: string;
  status: '已开放' | '规划中';
  hint: string;
}

export const industries: Industry[] = [
  { id: 'finance', name: '金融', types: '图片 · 视频 · UI 设计', status: '已开放', hint: '贷款、理财、支付类 App 投放素材' },
  { id: 'game', name: '游戏', types: '图片 · 视频 · AI 试玩', status: '已开放', hint: '卡牌、休闲、中重度游戏投放素材' },
  { id: 'ecommerce', name: '电商', types: '图片 · 视频', status: '规划中', hint: '' },
  { id: 'tool', name: '工具', types: '图片 · 视频', status: '规划中', hint: '' },
  { id: 'social', name: '社交', types: '图片 · 视频', status: '规划中', hint: '' },
  { id: 'drama', name: '短剧剪辑', types: '剪辑 · 字幕 · 投流素材', status: '规划中', hint: '' },
];

export interface Asset { name: string; ok: boolean; color?: string; }

export interface Project {
  id: string;
  industry: IndustryId;
  name: string;
  market: string;
  color: string;
  assets: Asset[];
}

const financeAssets = (done: number): Asset[] =>
  [
    { name: 'Logo', color: '#0E4D36' },
    { name: '尾板', color: '#141414' },
    { name: 'App 图标', color: '#F5C542' },
    { name: '品牌色', color: '#0E4D36' },
    { name: '产品截图', color: '#1B2E4A' },
    { name: '免责声明', color: '#404040' },
  ].map((a, i) => ({ ...a, ok: i < done }));

const gameAssets = (done: number): Asset[] =>
  [
    { name: 'Logo', color: '#0F5132' },
    { name: '尾板', color: '#141414' },
    { name: 'App 图标', color: '#F5C542' },
    { name: '游戏截图', color: '#1E3A3A' },
    { name: '角色立绘', color: '#8C1C22' },
    { name: '商店链接' },
  ].map((a, i) => ({ ...a, ok: i < done }));

export const projects: Project[] = [
  { id: 'mirakash', industry: 'finance', name: 'Mirakash', market: '赞比亚 · EN', color: '#0E4D36', assets: financeAssets(6) },
  { id: 'impiya', industry: 'finance', name: 'Impiya', market: '赞比亚 · EN', color: '#1B2E4A', assets: financeAssets(5) },
  { id: 'quickloan', industry: 'finance', name: 'QuickLoan', market: '尼日利亚 · EN', color: '#8C1C22', assets: financeAssets(3) },
  { id: 'truco', industry: 'game', name: 'Golden Truco', market: '巴西 · PT-BR', color: '#0F5132', assets: gameAssets(5) },
  { id: 'domino', industry: 'game', name: 'Golden Dominó', market: '巴西 · PT-BR', color: '#2A2F14', assets: gameAssets(4) },
  { id: 'royale', industry: 'game', name: 'Truco Royale', market: '阿根廷 · ES', color: '#2B1E3F', assets: gameAssets(2) },
];

export interface CreateType {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  pending?: boolean;
  to?: string;
}

export const createTypes: Record<'finance' | 'game', CreateType[]> = {
  finance: [
    { id: 'image', title: '图片广告', desc: '静态投放图。上传参考图或填写文案，一次生成多尺寸、多语言版本，图层可编辑。', tags: ['1:1', '4:5', '9:16', '1200×628', '多语言'] },
    { id: 'video', title: '视频广告', desc: 'AI 写分镜脚本，自动配音和字幕，在时间线里精修，一键导出全部画幅和语言。', tags: ['分镜脚本', 'AI 配音', '多语言字幕', '批量导出'], to: '/video' },
    { id: 'ui', title: 'UI 设计', desc: '类 Figma 的 AI 设计工具：一句话生成贷款 App 界面、应用商店截图、Logo 与设计规范。', tags: ['界面生成', '商店截图', 'Logo', '设计规范'], pending: true },
  ],
  game: [
    { id: 'image', title: '图片广告', desc: '游戏截图 + 卖点文案，一次生成多尺寸、多语言投放图，图层可编辑。', tags: ['1:1', '4:5', '9:16', '游戏截图'] },
    { id: 'video', title: '视频广告', desc: '玩法实录、真人解说、剧情喜剧、逆转局。设计牌面和出牌顺序，配解说口播与字幕。', tags: ['牌面设计', '出牌顺序', '解说口播', '逆转局'], to: '/video' },
    { id: 'play', title: 'AI 试玩采集', desc: '安装游戏 APK，在云端模拟器里让 AI 自动试玩，学习玩法，录制高光片段、截取物料。', tags: ['安装 APK', '模拟器', 'AI 试玩', '物料采集'], pending: true },
  ],
};

export interface Stage { stage: string; agent: string; initial: string; cost: string; credits: boolean; }

export const pipelineA: Stage[] = [
  { stage: '整理想法', agent: 'Codex', initial: 'C', cost: '你的 Codex 账号', credits: false },
  { stage: '角色图', agent: 'GPT Image 2', initial: 'G', cost: '平台积分 ×10/张', credits: true },
  { stage: '剧情脚本', agent: 'Claude Code', initial: 'CC', cost: '你的 Claude 账号', credits: false },
  { stage: '生成视频', agent: 'Seedance 2.5', initial: 'S', cost: '平台积分 ×30/条', credits: true },
  { stage: '添加字幕', agent: 'Codex', initial: 'C', cost: '你的 Codex 账号', credits: false },
  { stage: '后期输出', agent: 'OpenFilm', initial: 'F', cost: '你的 OpenFilm 账号', credits: false },
];

export const agentOptions = ['Codex', 'Claude Code', 'GPT Image 2', 'Seedance 2.5', 'OpenFilm', 'DeepSeek Harness'];

export interface ProductInfo {
  key: string;
  label: string;
  token: string;
  value: string;
  manual: boolean;
}

/* Google Play 贷款类 App 需要在商店页披露的信息：平台据此提取，脚本只引用这里的值 */
export const productInfoFromStore = (): ProductInfo[] => [
  { key: 'name', label: '产品名', token: '{产品名}', value: 'QuickLoan', manual: false },
  { key: 'region', label: '语言 / 地区', token: '{地区}', value: 'English · 尼日利亚', manual: false },
  { key: 'amount', label: '贷款区间', token: '{额度}', value: 'NGN 10,000 – 500,000', manual: false },
  { key: 'term', label: '贷款周期', token: '{周期}', value: '91 – 365 天', manual: false },
  { key: 'apr', label: '利率', token: '{利率}', value: '年化 18% – 36%（APR）', manual: false },
  { key: 'interest', label: '利息计算方式', token: '{计息}', value: '按实际借款天数计息', manual: false },
  { key: 'repay', label: '还款方式', token: '{还款}', value: '按月分期 · 支持提前还款', manual: false },
];
