<template>
  <div class="ai-analysis" ref="analysisContainer">
    <div class="analysis-header">
      <h3 class="section-title">
        <svg class="ai-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
          <path d="M19 11L19.74 13.09L22 14L19.74 14.91L19 17L18.26 14.91L16 14L18.26 13.09L19 11Z" fill="currentColor"/>
          <path d="M5 11L5.74 13.09L8 14L5.74 14.91L5 17L4.26 14.91L2 14L4.26 13.09L5 11Z" fill="currentColor"/>
        </svg>
        AI Resume Analysis
      </h3>
      <CustomButton 
        @click="analyzeResume" 
        ref="analyzeButton"
        :class="{ 'btn-disabled': isAnalyzing }"
        btn-type="primary">
        {{ isAnalyzing ? 'Analyzing...' : 'Analyze Resume' }}
      </CustomButton>
    </div>

    <div v-if="isAnalyzing" class="loading-state" ref="loadingState">
      <div class="loading-spinner"></div>
      <p>AI is analyzing your resume...</p>
    </div>

    <div v-if="error" class="error-state" ref="errorState">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <CustomButton @click="analyzeResume" btn-type="secondary">
        Try Again
      </CustomButton>
    </div>

    <div v-if="analysis && !isAnalyzing" class="analysis-results" ref="analysisResults">
      <!-- ATS Score -->
      <div class="score-card" ref="scoreCard">
        <div class="score-header">
          <h4>ATS Compatibility Score</h4>
          <div class="score-circle" :class="getScoreClass(analysis.atsScore)">
            <span class="score-number">{{ analysis.atsScore }}</span>
            <span class="score-total">/100</span>
          </div>
        </div>
        <p class="score-description">{{ getScoreDescription(analysis.atsScore) }}</p>
      </div>

      <!-- Overall Feedback -->
      <div class="feedback-card" ref="feedbackCard">
        <h4>Overall Assessment</h4>
        <p>{{ analysis.overallFeedback }}</p>
      </div>

      <!-- Detailed Scores -->
      <div class="detailed-scores" ref="detailedScores">
        <div class="score-item">
          <div class="score-label">
            <span>Formatting</span>
            <span class="score-value">{{ analysis.formatting?.score || 'N/A' }}/100</span>
          </div>
          <div class="score-bar">
            <div 
              class="score-fill" 
              :style="{ width: (analysis.formatting?.score || 0) + '%' }"
              :class="getScoreClass(analysis.formatting?.score || 0)">
            </div>
          </div>
          <p class="score-feedback">{{ analysis.formatting?.feedback || '' }}</p>
        </div>

        <div class="score-item">
          <div class="score-label">
            <span>Content Quality</span>
            <span class="score-value">{{ analysis.content?.score || 'N/A' }}/100</span>
          </div>
          <div class="score-bar">
            <div 
              class="score-fill" 
              :style="{ width: (analysis.content?.score || 0) + '%' }"
              :class="getScoreClass(analysis.content?.score || 0)">
            </div>
          </div>
          <p class="score-feedback">{{ analysis.content?.feedback || '' }}</p>
        </div>
      </div>

      <!-- Strengths -->
      <div class="feedback-section" v-if="analysis.strengths && analysis.strengths.length > 0">
        <h4 class="feedback-title success">
          <svg class="feedback-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          Strengths
        </h4>
        <ul class="feedback-list">
          <li v-for="strength in analysis.strengths" :key="strength">
            {{ strength }}
          </li>
        </ul>
      </div>

      <!-- Improvements -->
      <div class="feedback-section" v-if="analysis.improvements && analysis.improvements.length > 0">
        <h4 class="feedback-title warning">
          <svg class="feedback-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          Areas for Improvement
        </h4>
        <ul class="feedback-list">
          <li v-for="improvement in analysis.improvements" :key="improvement">
            {{ improvement }}
          </li>
        </ul>
      </div>

      <!-- Keyword Suggestions -->
      <div class="feedback-section" v-if="analysis.keywordSuggestions && analysis.keywordSuggestions.length > 0">
        <h4 class="feedback-title info">
          <svg class="feedback-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          Keyword Suggestions
        </h4>
        <div class="keyword-tags">
          <span 
            v-for="keyword in analysis.keywordSuggestions" 
            :key="keyword"
            class="keyword-tag">
            {{ keyword }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { AIService } from '../services/aiService.js';
import CustomButton from './CustomButton.vue';

export default {
  mounted() {
    this.initAnalysisAnimations();
  },
  components: {
    CustomButton
  },
  props: {
    resumeData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      analysis: null,
      isAnalyzing: false,
      error: null
    };
  },
  watch: {
    isAnalyzing(newVal) {
      if (newVal) {
        this.animateLoadingState();
      }
    },
    analysis(newVal) {
      if (newVal && !this.isAnalyzing) {
        this.$nextTick(() => {
          this.animateResults();
        });
      }
    },
    error(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.animateErrorState();
        });
      }
    }
  },
  methods: {
    initAnalysisAnimations() {
      // Animate container entrance
      gsap.fromTo(this.$refs.analysisContainer,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );
    },
    animateLoadingState() {
      if (this.$refs.loadingState) {
        gsap.fromTo(this.$refs.loadingState,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
      }
    },
    animateResults() {
      const timeline = gsap.timeline();
      
      // Animate score card
      if (this.$refs.scoreCard) {
        timeline.fromTo(this.$refs.scoreCard,
          { scale: 0.8, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }
        );
      }

      // Animate feedback card
      if (this.$refs.feedbackCard) {
        timeline.fromTo(this.$refs.feedbackCard,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          "-=0.3"
        );
      }

      // Animate detailed scores
      if (this.$refs.detailedScores) {
        timeline.fromTo(this.$refs.detailedScores,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          "-=0.2"
        );
      }

      // Animate score bars
      const scoreBars = this.$refs.analysisContainer.querySelectorAll('.score-fill');
      scoreBars.forEach((bar, index) => {
        const width = bar.style.width;
        gsap.fromTo(bar,
          { width: '0%' },
          { 
            width: width, 
            duration: 1, 
            delay: 0.5 + (index * 0.2), 
            ease: "power2.out" 
          }
        );
      });
    },
    animateErrorState() {
      if (this.$refs.errorState) {
        gsap.fromTo(this.$refs.errorState,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
      }
    },
    async analyzeResume() {
      this.isAnalyzing = true;
      this.error = null;
      
      try {
        this.analysis = await AIService.analyzeResume(this.resumeData);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.isAnalyzing = false;
      }
    },
    getScoreClass(score) {
      if (score >= 80) return 'score-excellent';
      if (score >= 60) return 'score-good';
      if (score >= 40) return 'score-fair';
      return 'score-poor';
    },
    getScoreDescription(score) {
      if (score >= 80) return 'Excellent! Your resume is highly ATS-compatible.';
      if (score >= 60) return 'Good ATS compatibility with room for improvement.';
      if (score >= 40) return 'Fair compatibility. Consider implementing the suggestions below.';
      return 'Needs improvement for better ATS compatibility.';
    }
  }
};
</script>

<style scoped>
.ai-analysis {
  background: var(--gradient-secondary);
  border: 1px solid var(--dark-border-light);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  backdrop-filter: var(--blur-backdrop);
  position: relative;
  overflow: hidden;
}

.ai-analysis::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.ai-icon {
  width: 22px;
  height: 22px;
  margin-right: 12px;
  color: var(--dark-accent);
  filter: drop-shadow(0 2px 4px rgba(99, 102, 241, 0.3));
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px;
  color: var(--dark-text-secondary);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--dark-border);
  border-top: 4px solid var(--dark-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  text-align: center;
  padding: 32px;
  color: var(--dark-error);
}

.error-icon {
  font-size: 40px;
  margin-bottom: 16px;
  filter: drop-shadow(0 2px 8px rgba(239, 68, 68, 0.3));
}

.analysis-results {
  space-y: 24px;
}

.score-card {
  background: var(--gradient-secondary);
  border: 1px solid var(--dark-border-light);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}

.score-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.score-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.score-header h4 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--dark-text-primary);
  letter-spacing: -0.3px;
}

.score-circle {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 5px solid;
  position: relative;
  backdrop-filter: blur(10px);
}

.score-circle::before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, currentColor 0%, transparent 100%);
  opacity: 0.2;
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.score-number {
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
  position: relative;
  z-index: 2;
}

.score-total {
  font-size: 14px;
  opacity: 0.8;
  position: relative;
  z-index: 2;
}

.score-excellent {
  border-color: var(--dark-success);
  color: var(--dark-success);
  background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%);
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.2);
}

.score-good {
  border-color: #3b82f6;
  color: #3b82f6;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%);
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.2);
}

.score-fair {
  border-color: var(--dark-warning);
  color: var(--dark-warning);
  background: radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%);
  box-shadow: 0 0 30px rgba(245, 158, 11, 0.2);
}

.score-poor {
  border-color: var(--dark-error);
  color: var(--dark-error);
  background: radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%);
  box-shadow: 0 0 30px rgba(239, 68, 68, 0.2);
}

.score-description {
  color: var(--dark-text-secondary);
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
}

.feedback-card {
  background: var(--gradient-secondary);
  border: 1px solid var(--dark-border-light);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
}

.feedback-card h4 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--dark-text-primary);
}

.feedback-card p {
  margin: 0;
  color: var(--dark-text-secondary);
  line-height: 1.7;
  font-size: 15px;
}

.detailed-scores {
  margin-bottom: 24px;
}

.score-item {
  background: var(--gradient-secondary);
  border: 1px solid var(--dark-border-light);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.score-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.score-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 600;
  color: var(--dark-text-primary);
}

.score-value {
  color: var(--dark-accent);
  font-weight: 700;
}

.score-bar {
  width: 100%;
  height: 8px;
  background: var(--dark-border);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.score-fill {
  height: 100%;
  border-radius: 4px;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.score-fill::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.score-feedback {
  font-size: 13px;
  color: var(--dark-text-muted);
  margin: 0;
  line-height: 1.5;
}

.feedback-section {
  background: var(--gradient-secondary);
  border: 1px solid var(--dark-border-light);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.feedback-section:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.feedback-title {
  display: flex;
  align-items: center;
  margin: 0 0 20px 0;
  font-size: 17px;
  font-weight: 600;
}

.feedback-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
}

.feedback-title.success {
  color: var(--dark-success);
  text-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
}

.feedback-title.warning {
  color: var(--dark-warning);
  text-shadow: 0 2px 4px rgba(245, 158, 11, 0.2);
}

.feedback-title.info {
  color: #3b82f6;
  text-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.feedback-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feedback-list li {
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: var(--dark-text-secondary);
  font-size: 15px;
  line-height: 1.6;
  transition: all 0.2s ease;
}

.feedback-list li:hover {
  color: var(--dark-text-primary);
  padding-left: 8px;
}

.feedback-list li:last-child {
  border-bottom: none;
}

.feedback-list li:before {
  content: "•";
  color: var(--dark-accent);
  margin-right: 12px;
  font-weight: 700;
  font-size: 16px;
}

.keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.keyword-tag {
  background: var(--dark-accent-light);
  color: var(--dark-accent);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid rgba(99, 102, 241, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.keyword-tag::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.keyword-tag:hover {
  background: rgba(99, 102, 241, 0.2);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.25);
  border-color: var(--dark-accent);
}

.keyword-tag:hover::before {
  left: 100%;
}
</style>