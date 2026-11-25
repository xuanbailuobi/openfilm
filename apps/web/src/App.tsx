import { HashRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from './state';
import { Sidebar } from './components/Sidebar';
import { Placeholder } from './components/ui';
import { Home } from './pages/Home';
import { NewProject } from './pages/NewProject';
import { IdeaInput, VideoModes } from './pages/Video';

const todo: [string, string, string?][] = [
  ['/projects', '我的项目', '团队空间 · 共同项目（Figma：通用 04）'],
  ['/templates', '模板库'],
  ['/scripts', '脚本文案', '按脚本分类：直接讲产品 / 剧情 / 街头偶遇 / 采访 / 电话客服 / 撕纸，以及绿幕版本'],
  ['/bgm', 'BGM 音乐'], ['/sfx', '音效库'], ['/actors', 'AI 演员库'], ['/assets', '我的资产'],
  ['/agents', '智能体', 'Figma：通用 03'], ['/plugins', '插件'], ['/skills', 'Skill'],
  ['/report', '素材报告', 'Figma：金融 F08'], ['/exports', '导出记录'], ['/me', '个人中心'],
  ['/terms', '用户协议'], ['/privacy', '隐私政策'],
];

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <div className="app">
          <Sidebar />
          <main className="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects/new" element={<NewProject />} />
              <Route path="/video" element={<VideoModes />} />
              <Route path="/video/idea" element={<IdeaInput />} />
              {todo.map(([p, t, n]) => <Route key={p} path={p} element={<Placeholder title={t} note={n} />} />)}
              <Route path="*" element={<Placeholder title="页面不存在" />} />
            </Routes>
          </main>
        </div>
      </AppProvider>
    </HashRouter>
  );
}
