<template>
  <div class="ai-analysis">
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
        :class="{ 'btn-disabled': isAnalyzing }"
        btn-type="primary">
        {{ isAnalyzing ? 'Analyzing...' : 'Analyze Resume' }}
      </CustomButton>
    </div>

    <div v-if="isAnalyzing" class="loading-state">
      <div class="loading-spinner"></div>
      <p>AI is analyzing your resume...</p>
    </div>

    <div v-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <CustomButton @click="analyzeResume" btn-type="secondary">
        Try Again
      </CustomButton>
    </div>

    <div v-if="analysis && !isAnalyzing" class="analysis-results">
      <!-- ATS Score -->
      <div class="score-card">
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
      <div class="feedback-card">
        <h4>Overall Assessment</h4>
        <p>{{ analysis.overallFeedback }}</p>
      </div>

      <!-- Detailed Scores -->
      <div class="detailed-scores">
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
import { AIService } from '../services/aiService.js';
import CustomButton from './CustomButton.vue';

export default {
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
  methods: {
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
  background: var(--dark-bg-tertiary);
  border: 1px solid var(--dark-border);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.ai-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  color: var(--dark-accent);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  color: var(--dark-text-secondary);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--dark-border);
  border-top: 3px solid var(--dark-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  text-align: center;
  padding: 24px;
  color: var(--dark-error);
}

.error-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.analysis-results {
  space-y: 20px;
}

.score-card {
  background: linear-gradient(135deg, var(--dark-bg-secondary) 0%, var(--dark-bg-tertiary) 100%);
  border: 1px solid var(--dark-border);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
}

.score-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.score-header h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--dark-text-primary);
}

.score-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 4px solid;
  position: relative;
}

.score-number {
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
}

.score-total {
  font-size: 12px;
  opacity: 0.8;
}

.score-excellent {
  border-color: var(--dark-success);
  color: var(--dark-success);
  background: rgba(16, 185, 129, 0.1);
}

.score-good {
  border-color: #3b82f6;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.score-fair {
  border-color: var(--dark-warning);
  color: var(--dark-warning);
  background: rgba(245, 158, 11, 0.1);
}

.score-poor {
  border-color: var(--dark-error);
  color: var(--dark-error);
  background: rgba(239, 68, 68, 0.1);
}

.score-description {
  color: var(--dark-text-secondary);
  margin: 0;
  font-size: 14px;
}

.feedback-card {
  background: var(--dark-bg-secondary);
  border: 1px solid var(--dark-border);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.feedback-card h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--dark-text-primary);
}

.feedback-card p {
  margin: 0;
  color: var(--dark-text-secondary);
  line-height: 1.6;
}

.detailed-scores {
  margin-bottom: 20px;
}

.score-item {
  background: var(--dark-bg-secondary);
  border: 1px solid var(--dark-border);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.score-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--dark-text-primary);
}

.score-value {
  color: var(--dark-accent);
  font-weight: 600;
}

.score-bar {
  width: 100%;
  height: 6px;
  background: var(--dark-border);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.score-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s ease;
}

.score-feedback {
  font-size: 12px;
  color: var(--dark-text-muted);
  margin: 0;
  line-height: 1.4;
}

.feedback-section {
  background: var(--dark-bg-secondary);
  border: 1px solid var(--dark-border);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
}

.feedback-title {
  display: flex;
  align-items: center;
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
}

.feedback-icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
}

.feedback-title.success {
  color: var(--dark-success);
}

.feedback-title.warning {
  color: var(--dark-warning);
}

.feedback-title.info {
  color: #3b82f6;
}

.feedback-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feedback-list li {
  padding: 8px 0;
  border-bottom: 1px solid var(--dark-border);
  color: var(--dark-text-secondary);
  font-size: 14px;
  line-height: 1.5;
}

.feedback-list li:last-child {
  border-bottom: none;
}

.feedback-list li:before {
  content: "•";
  color: var(--dark-accent);
  margin-right: 8px;
  font-weight: bold;
}

.keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword-tag {
  background: rgba(99, 102, 241, 0.1);
  color: var(--dark-accent);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(99, 102, 241, 0.2);
  transition: all 0.2s ease;
}

.keyword-tag:hover {
  background: rgba(99, 102, 241, 0.2);
  transform: translateY(-1px);
}
</style>