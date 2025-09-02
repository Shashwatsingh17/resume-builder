<template>
  <div class="homepage" ref="homepage">
    <div class="hero-section" ref="heroSection">
      <div class="hero-content">
        <div class="hero-text" ref="heroText">
          <h1 class="hero-title">
            <span class="title-line">Build Your</span>
            <span class="title-line gradient-text">Perfect Resume</span>
          </h1>
          <p class="hero-description">
            Create a professional, ATS-optimized resume in minutes with our intelligent builder. 
            Choose from premium templates, get AI-powered insights, and export to PDF.
          </p>
          <div class="hero-features" ref="heroFeatures">
            <div class="feature-item">
              <svg class="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>ATS-Optimized</span>
            </div>
            <div class="feature-item">
              <svg class="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>AI-Powered</span>
            </div>
            <div class="feature-item">
              <svg class="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Premium Templates</span>
            </div>
          </div>
          <div class="hero-actions" ref="heroActions">
            <CustomButton @click="startBuilding" btn-type="primary" class="cta-button">
              Start Building Your Resume
            </CustomButton>
            <button @click="scrollToFeatures" class="secondary-button">
              Learn More
            </button>
          </div>
        </div>
        <div class="hero-visual" ref="heroVisual">
          <div class="resume-mockup">
            <div class="mockup-header"></div>
            <div class="mockup-content">
              <div class="mockup-left">
                <div class="mockup-avatar"></div>
                <div class="mockup-section"></div>
                <div class="mockup-section"></div>
              </div>
              <div class="mockup-right">
                <div class="mockup-title"></div>
                <div class="mockup-line"></div>
                <div class="mockup-line short"></div>
                <div class="mockup-section-title"></div>
                <div class="mockup-line"></div>
                <div class="mockup-line medium"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="features-section" ref="featuresSection">
      <div class="features-container">
        <h2 class="features-title">Why Choose Our Resume Builder?</h2>
        <div class="features-grid" ref="featuresGrid">
          <div class="feature-card" v-for="feature in features" :key="feature.id">
            <div class="feature-icon-wrapper">
              <component :is="feature.icon" class="feature-card-icon" />
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="cta-section" ref="ctaSection">
      <div class="cta-content">
        <h2>Ready to Create Your Professional Resume?</h2>
        <p>Join thousands of professionals who have landed their dream jobs with our resume builder.</p>
        <CustomButton @click="startBuilding" btn-type="primary" class="cta-button-large">
          Get Started Now - It's Free
        </CustomButton>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap';
import CustomButton from './CustomButton.vue';

export default {
  name: 'HomePage',
  components: {
    CustomButton
  },
  mounted() {
    try {
      this.initHomeAnimations();
    } catch (error) {
      console.error('HomePage component mount error:', error);
    }
  },
  data() {
    return {
      features: [
        {
          id: 1,
          title: 'Privacy First',
          description: 'All your data stays in your browser. No servers, no tracking, complete privacy.',
          icon: 'ShieldIcon'
        },
        {
          id: 2,
          title: 'AI Analysis',
          description: 'Get intelligent feedback on your resume with our built-in AI analysis tools.',
          icon: 'BrainIcon'
        },
        {
          id: 3,
          title: 'Multiple Templates',
          description: 'Choose from 15+ professional templates designed for different industries.',
          icon: 'TemplateIcon'
        },
        {
          id: 4,
          title: 'Export Options',
          description: 'Export to PDF in A4 or US Letter format, or save your data as JSON.',
          icon: 'DownloadIcon'
        },
        {
          id: 5,
          title: 'Real-time Preview',
          description: 'See your changes instantly with our live preview and editing system.',
          icon: 'EyeIcon'
        },
        {
          id: 6,
          title: 'Mobile Friendly',
          description: 'Build and edit your resume on any device with our responsive design.',
          icon: 'DeviceIcon'
        }
      ]
    };
  },
  methods: {
    initHomeAnimations() {
      const timeline = gsap.timeline();
      
      // Hero animations
      timeline.fromTo(this.$refs.heroText,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
      );
      
      timeline.fromTo(this.$refs.heroVisual,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power2.out" },
        "-=0.5"
      );

      // Features animation on scroll
      gsap.set(this.$refs.featuresGrid, { y: 50, opacity: 0 });
      
      // Floating animation for mockup
      gsap.to('.resume-mockup', {
        y: -10,
        duration: 3,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
      });
    },
    startBuilding() {
      this.$emit('start-building');
    },
    scrollToFeatures() {
      this.$refs.featuresSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Animate features when scrolled to
      gsap.to(this.$refs.featuresGrid, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      });
    }
  },
  components: {
    ShieldIcon: {
      template: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `
    },
    BrainIcon: {
      template: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `
    },
    TemplateIcon: {
      template: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `
    },
    DownloadIcon: {
      template: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `
    },
    EyeIcon: {
      template: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
        </svg>
      `
    },
    DeviceIcon: {
      template: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
          <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2"/>
          <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2"/>
        </svg>
      `
    }
  }
};
</script>

<style scoped>
.homepage {
  min-height: 100vh;
  background: var(--dark-bg-primary);
  position: relative;
  overflow-x: hidden;
}

.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 80px 40px;
  position: relative;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 32px 0;
  letter-spacing: -2px;
}

.title-line {
  display: block;
  color: var(--dark-text-primary);
}

.gradient-text {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.7;
  color: var(--dark-text-secondary);
  margin: 0 0 40px 0;
  max-width: 500px;
}

.hero-features {
  display: flex;
  gap: 32px;
  margin-bottom: 48px;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--dark-text-secondary);
  font-size: 14px;
  font-weight: 600;
}

.feature-icon {
  width: 20px;
  height: 20px;
  color: var(--dark-accent);
}

.hero-actions {
  display: flex;
  gap: 20px;
  align-items: center;
}

.cta-button {
  padding: 18px 36px !important;
  font-size: 16px !important;
  font-weight: 700 !important;
  border-radius: 14px !important;
  box-shadow: 0 8px 30px rgba(99, 102, 241, 0.3) !important;
}

.secondary-button {
  padding: 18px 36px;
  background: transparent;
  color: var(--dark-text-secondary);
  border: 2px solid var(--dark-border);
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
}

.secondary-button:hover {
  color: var(--dark-text-primary);
  border-color: var(--dark-accent);
  background: rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.15);
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.resume-mockup {
  width: 300px;
  height: 400px;
  background: white;
  border-radius: 16px;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  overflow: hidden;
  position: relative;
  transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
}

.mockup-header {
  height: 80px;
  background: var(--gradient-primary);
  position: relative;
}

.mockup-content {
  padding: 24px;
  display: flex;
  gap: 20px;
  height: calc(100% - 80px);
}

.mockup-left {
  width: 100px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mockup-avatar {
  width: 60px;
  height: 60px;
  background: var(--dark-accent);
  border-radius: 50%;
  margin: 0 auto;
  opacity: 0.8;
}

.mockup-section {
  height: 40px;
  background: #f1f5f9;
  border-radius: 4px;
  opacity: 0.6;
}

.mockup-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mockup-title {
  height: 24px;
  background: #1e293b;
  border-radius: 4px;
  width: 80%;
}

.mockup-line {
  height: 8px;
  background: #cbd5e1;
  border-radius: 2px;
  width: 100%;
}

.mockup-line.short {
  width: 60%;
}

.mockup-line.medium {
  width: 80%;
}

.mockup-section-title {
  height: 16px;
  background: var(--dark-accent);
  border-radius: 3px;
  width: 70%;
  margin-top: 8px;
  opacity: 0.8;
}

.features-section {
  padding: 120px 40px;
  background: var(--dark-bg-secondary);
  position: relative;
}

.features-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
}

.features-container {
  max-width: 1200px;
  margin: 0 auto;
}

.features-title {
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin: 0 0 80px 0;
  color: var(--dark-text-primary);
  letter-spacing: -1px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
}

.feature-card {
  background: var(--gradient-secondary);
  border: 1px solid var(--dark-border-light);
  border-radius: 20px;
  padding: 40px 32px;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.3);
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-icon-wrapper {
  width: 80px;
  height: 80px;
  background: var(--gradient-primary);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px auto;
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
}

.feature-card-icon {
  width: 36px;
  height: 36px;
  color: white;
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: var(--dark-text-primary);
}

.feature-card p {
  color: var(--dark-text-secondary);
  line-height: 1.7;
  margin: 0;
  font-size: 15px;
}

.cta-section {
  padding: 120px 40px;
  background: var(--dark-bg-primary);
  text-align: center;
  position: relative;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 24px 0;
  color: var(--dark-text-primary);
  letter-spacing: -1px;
}

.cta-content p {
  font-size: 1.25rem;
  color: var(--dark-text-secondary);
  margin: 0 0 40px 0;
  line-height: 1.6;
}

.cta-button-large {
  padding: 20px 48px !important;
  font-size: 18px !important;
  font-weight: 700 !important;
  border-radius: 16px !important;
  box-shadow: 0 12px 35px rgba(99, 102, 241, 0.4) !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 60px;
    text-align: center;
  }
  
  .hero-title {
    font-size: 3rem;
  }
  
  .hero-features {
    justify-content: center;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .features-title {
    font-size: 2.5rem;
  }
  
  .cta-content h2 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .hero-section,
  .features-section,
  .cta-section {
    padding-left: 20px;
    padding-right: 20px;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-actions {
    flex-direction: column;
    gap: 16px;
  }
  
  .cta-button,
  .secondary-button {
    width: 100%;
  }
}
</style>