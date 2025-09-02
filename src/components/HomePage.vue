<template>
  <section class="landing" ref="landing">
    <header class="landing-header">
      <div class="brand">
        <svg class="brand-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="brand-name">Resume Builder</span>
      </div>
      <nav class="nav-actions">
        <button class="link muted" @click="openAbout">About</button>
        <button class="link muted" @click="openDocs">Docs</button>
      </nav>
    </header>

    <div class="hero">
      <div class="hero-content">
        <h1 class="hero-title gradient-text">Build a standout resume</h1>
        <p class="hero-subtitle">Design, customize, and export a professional resume in minutes with smart templates, AI suggestions, and beautiful themes.</p>
        <div class="cta-row">
          <CustomButton btn-type="primary" @click="start">
            Start Building
          </CustomButton>
          <label class="skip-toggle">
            <input type="checkbox" v-model="skipNext" />
            <span>Skip this page next time</span>
          </label>
        </div>
      </div>
      <div class="hero-visual">
        <div class="glow"></div>
        <div class="preview-card">
          <div class="preview-header"></div>
          <div class="preview-body">
            <div class="left"></div>
            <div class="right">
              <div class="line" v-for="n in 6" :key="n"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section class="features">
      <div class="feature">
        <div class="icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 5h16v14H4z" stroke="currentColor" stroke-width="2"/>
            <path d="M4 9h16" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <h3 class="feature-title">Smart Templates</h3>
        <p class="feature-text">Pick from modern, classic, and creative layouts tuned for readability.</p>
      </div>
      <div class="feature">
        <div class="icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 20a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" stroke-width="2"/>
            <path d="M9 12h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <h3 class="feature-title">AI Assistance</h3>
        <p class="feature-text">Get suggestions to polish summaries and accomplishments.</p>
      </div>
      <div class="feature">
        <div class="icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 2h9l5 5v15a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" stroke="currentColor" stroke-width="2"/>
            <path d="M14 2v6h6" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <h3 class="feature-title">Export Ready</h3>
        <p class="feature-text">Download pixel-perfect PDFs with a single click.</p>
      </div>
      <div class="feature">
        <div class="icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
            <path d="M12 3v18M3 12h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <h3 class="feature-title">Theme Control</h3>
        <p class="feature-text">Switch between neon dark, minimal light, and more.</p>
      </div>
    </section>
  </section>
</template>

<script>
import { gsap } from 'gsap';
import CustomButton from './CustomButton.vue';

export default {
  name: 'HomePage',
  components: { CustomButton },
  data() {
    return {
      skipNext: false
    };
  },
  mounted() {
    try {
      const tl = gsap.timeline();
      tl.fromTo(this.$refs.landing, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
      tl.from('.hero-title', { opacity: 0, y: 10, duration: 0.4 }, '-=0.2');
      tl.from('.hero-subtitle', { opacity: 0, y: 10, duration: 0.4 }, '-=0.2');
      tl.from('.cta-row', { opacity: 0, y: 10, duration: 0.4 }, '-=0.2');
      tl.from('.preview-card', { opacity: 0, scale: 0.95, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.2');
      tl.from('.feature', { opacity: 0, y: 12, stagger: 0.08, duration: 0.4 }, '-=0.1');
    } catch (e) {
      console.error('HomePage animation error:', e);
    }
  },
  methods: {
    start() {
      this.$emit('start', { skipNext: this.skipNext });
    },
    openAbout() {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    },
    openDocs() {
      window.open('https://www.builder.io/c/docs/projects', '_blank');
    }
  }
};
</script>

<style scoped>
.landing {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.landing-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--dark-text-primary);
}

.brand-icon { width: 28px; height: 28px; color: var(--dark-accent); filter: drop-shadow(0 2px 6px rgba(99,102,241,0.35)); }
.brand-name { font-weight: 700; letter-spacing: 0.3px; }

.nav-actions { display: flex; gap: 14px; }
.link { background: transparent; border: none; color: var(--dark-text-primary); cursor: pointer; font: inherit; }
.link.muted { color: var(--dark-text-secondary); }
.link:hover { color: var(--dark-text-primary); text-decoration: underline; }

.hero { display: grid; grid-template-columns: 1.2fr 1fr; align-items: center; gap: 40px; padding: 60px 28px 20px; }
.hero-content { max-width: 720px; }
.hero-title { margin: 0 0 12px 0; font-size: 56px; font-weight: 800; letter-spacing: -1px; }
.hero-subtitle { margin: 0 0 24px 0; color: var(--dark-text-secondary); font-size: 16px; }

.cta-row { display: flex; align-items: center; gap: 16px; }
.skip-toggle { display: inline-flex; align-items: center; gap: 8px; color: var(--dark-text-secondary); font-size: 13px; }
.skip-toggle input { width: 16px; height: 16px; accent-color: #6366f1; }

.hero-visual { position: relative; min-height: 320px; display: grid; place-items: center; }
.glow { position: absolute; inset: 0; background: radial-gradient(60% 60% at 70% 30%, rgba(99,102,241,0.25), transparent), radial-gradient(40% 40% at 20% 70%, rgba(63,238,230,0.18), transparent); filter: blur(30px); pointer-events: none; }
.preview-card { position: relative; width: 400px; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); box-shadow: 0 25px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.05); }
.preview-header { height: 10px; background: var(--gradient-primary); }
.preview-body { display: grid; grid-template-columns: 35% 65%; gap: 0; }
.preview-body .left { background: linear-gradient(180deg, var(--dark-bg-secondary), var(--dark-bg-tertiary)); height: 260px; }
.preview-body .right { padding: 16px 20px; }
.preview-body .right .line { height: 12px; margin: 10px 0; background: #e5e7eb; border-radius: 6px; }
.preview-body .right .line:nth-child(1) { width: 65%; background: linear-gradient(90deg, var(--dark-accent), #8b5cf6); -webkit-background-clip: text; }

.features { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; padding: 30px 28px 60px; }
.feature { background: rgba(255,255,255,0.04); border: 1px solid var(--dark-border); border-radius: 16px; padding: 18px; text-align: left; backdrop-filter: var(--blur-backdrop); }
.icon-wrap { width: 40px; height: 40px; display: grid; place-items: center; border-radius: 10px; background: var(--dark-accent-light); color: var(--dark-accent); margin-bottom: 10px; }
.feature-title { margin: 0 0 6px 0; font-size: 14px; color: var(--dark-text-primary); }
.feature-text { margin: 0; font-size: 13px; color: var(--dark-text-secondary); }

@media (max-width: 1024px) {
  .hero { grid-template-columns: 1fr; }
  .hero-visual { order: -1; }
  .features { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .hero-title { font-size: 38px; }
  .features { grid-template-columns: 1fr; }
}
</style>
