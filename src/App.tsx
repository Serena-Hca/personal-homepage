import Background from './components/Background';
import BentoHobbies from './components/BentoHobbies';
import CursorGlow from './components/CursorGlow';
import Feedback from './components/Feedback';
import Footer from './components/Footer';
import Hero from './components/Hero';
import NeuralCathedral from './components/NeuralCathedral';
import SocialLinks from './components/SocialLinks';
import { profile } from './data';

export default function App() {
  return (
    <div id="top" className="relative min-h-screen bg-[#F5F7FD] text-slate-900 antialiased">
      <Background />
      <NeuralCathedral />
      <CursorGlow />

      <main className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-16 pt-10 sm:px-8 md:pt-14">
        {/* 顶部小导航 */}
        <header className="mb-16 flex items-center justify-between md:mb-20">
          <a
            href="#top"
            className="font-mono text-sm text-slate-500 transition-colors hover:text-slate-900"
          >
            ~/<span className="text-indigo-400">主页</span>
          </a>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/60 px-3 py-1.5 backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[11px] text-slate-600">{profile.status}</span>
          </div>
        </header>

        <Hero />
        <BentoHobbies />
        <SocialLinks />
        <Feedback />
        <Footer />
      </main>
    </div>
  );
}
