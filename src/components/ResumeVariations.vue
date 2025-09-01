<template>
  <div class="resume-variations">
    <div class="variations-header">
      <h3 class="section-title">
        <svg class="variation-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Generate Resume Variations
      </h3>
      <p class="variations-description">
        Create optimized versions of your resume tailored for specific roles and industries.
      </p>
    </div>

    <div class="variation-selector" v-if="!isGenerating && !generatedVariation">
      <label class="variation-label">
        <select 
          v-model="selectedVariationType" 
          class="custom-input variation-select">
          <option value="">Select variation type...</option>
          <option 
            v-for="type in variationTypes" 
            :key="type.value" 
            :value="type.value">
            {{ type.name }}
          </option>
        </select>
      </label>
      
      <div v-if="selectedVariationType" class="variation-description">
        <p>{{ getSelectedTypeDescription() }}</p>
      </div>

      <CustomButton 
        @click="generateVariation" 
        :class="{ 'btn-disabled': !selectedVariationType }"
        btn-type="primary"
        :disabled="!selectedVariationType">
        :disabled="isAnalyzing">
        Generate Variation
      </CustomButton>
    </div>

    <div v-if="isGenerating" class="loading-state">
      <div class="loading-spinner"></div>
      <p>AI is generating your resume variation...</p>
      <p class="loading-detail">Optimizing content for {{ getSelectedTypeName() }}</p>
    </div>

    <div v-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <CustomButton @click="generateVariation" btn-type="secondary">
        Try Again
      </CustomButton>
    </div>

    <div v-if="generatedVariation && !isGenerating" class="variation-results">
      <div class="variation-header">
        <h4>{{ getSelectedTypeName() }} Variation Generated</h4>
        <div class="variation-actions">
          <CustomButton @click="applyVariation" btn-type="primary">
            Apply This Variation
          </CustomButton>
          <CustomButton @click="resetVariation" btn-type="secondary">
            Generate Another
          </CustomButton>
        </div>
      </div>

      <div class="variation-preview">
        <div class="preview-section">
          <h5>Updated Job Title</h5>
          <p class="preview-text title-preview">{{ generatedVariation.title }}</p>
        </div>

        <div class="preview-section">
          <h5>Updated Introduction</h5>
          <p class="preview-text">{{ generatedVariation.introText }}</p>
        </div>

        <div class="preview-section" v-if="hasSkillChanges">
          <h5>Enhanced Skills</h5>
          <div class="skills-preview">
            <span 
              v-for="skill in getNewSkills()" 
              :key="skill"
              class="skill-tag new-skill">
              {{ skill }} <span class="new-badge">NEW</span>
            </span>
            <span 
              v-for="skill in getExistingSkills()" 
              :key="skill"
              class="skill-tag">
              {{ skill }}
            </span>
          </div>
        </div>

        <div class="preview-section">
          <h5>Color Scheme</h5>
          <div class="color-preview">
            <div class="color-swatch" :style="{ backgroundColor: generatedVariation.colors.left.highlight }"></div>
            <span>{{ getSelectedTypeName() }} Theme</span>
          </div>
        </div>

        <div class="preview-section" v-if="hasExperienceChanges">
          <h5>Enhanced Experience Descriptions</h5>
          <div class="experience-preview">
            <div 
              v-for="(exp, index) in generatedVariation.experience.slice(0, 2)" 
              :key="index"
              class="experience-item">
              <h6>{{ exp.title }} at {{ exp.company }}</h6>
              <ul>
                <li v-for="desc in exp.description.slice(0, 2)" :key="desc">
                  {{ desc }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ResumeVariationService } from '../services/resumeVariationService.js';
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
      selectedVariationType: '',
      generatedVariation: null,
      isGenerating: false,
      error: null,
      variationTypes: ResumeVariationService.getVariationTypes()
    };
  },
  computed: {
    hasSkillChanges() {
      if (!this.generatedVariation) return false;
      return this.generatedVariation.skills.length > this.resumeData.skills.length;
    },
    hasExperienceChanges() {
      if (!this.generatedVariation) return false;
      return JSON.stringify(this.generatedVariation.experience) !== JSON.stringify(this.resumeData.experience);
    }
  },
  methods: {
    async generateVariation() {
      if (!this.selectedVariationType) return;
      
      this.isGenerating = true;
      this.error = null;
      
      try {
        this.generatedVariation = await ResumeVariationService.generateVariation(
          this.resumeData, 
          this.selectedVariationType
        );
      } catch (error) {
        this.error = error.message;
      } finally {
        this.isGenerating = false;
      }
    },
    applyVariation() {
      this.$emit('apply-variation', this.generatedVariation);
      this.resetVariation();
    },
    resetVariation() {
      this.generatedVariation = null;
      this.selectedVariationType = '';
      this.error = null;
    },
    getSelectedTypeDescription() {
      const type = this.variationTypes.find(t => t.value === this.selectedVariationType);
      return type ? type.description : '';
    },
    getSelectedTypeName() {
      const type = this.variationTypes.find(t => t.value === this.selectedVariationType);
      return type ? type.name : '';
    },
    getVariationTypeName(value) {
      const type = this.variationTypes.find(t => t.value === value);
      return type ? type.name : '';
    },
    getNewSkills() {
      if (!this.generatedVariation) return [];
      return this.generatedVariation.skills.filter(skill => 
        !this.resumeData.skills.includes(skill)
      );
    },
    getExistingSkills() {
      if (!this.generatedVariation) return [];
      return this.generatedVariation.skills.filter(skill => 
        this.resumeData.skills.includes(skill)
      );
    }
  }
};
</script>

<style scoped>
.resume-variations {
  background: var(--dark-bg-tertiary);
  border: 1px solid var(--dark-border);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.variations-header {
  margin-bottom: 24px;
}

.variation-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  color: var(--dark-accent);
}

.variations-description {
  color: var(--dark-text-secondary);
  font-size: 14px;
  line-height: 1.5;
  margin: 8px 0 0 0;
}

.variation-selector {
  margin-bottom: 20px;
}

.variation-label {
  display: block;
  margin-bottom: 16px;
}

.variation-select {
  width: 100%;
  margin-bottom: 12px;
}

.variation-description {
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
}

.variation-description p {
  margin: 0;
  color: var(--dark-text-secondary);
  font-size: 13px;
  line-height: 1.4;
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

.loading-detail {
  font-size: 12px;
  color: var(--dark-text-muted);
  margin-top: 8px;
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

.variation-results {
  border-top: 1px solid var(--dark-border);
  padding-top: 20px;
}

.variation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.variation-header h4 {
  margin: 0;
  color: var(--dark-text-primary);
  font-size: 16px;
  font-weight: 600;
}

.variation-actions {
  display: flex;
  gap: 8px;
}

.variation-actions .btn {
  width: auto;
  padding: 8px 16px;
  font-size: 12px;
}

.variation-preview {
  space-y: 16px;
}

.preview-section {
  background: var(--dark-bg-secondary);
  border: 1px solid var(--dark-border);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.preview-section h5 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--dark-accent);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.preview-text {
  margin: 0;
  color: var(--dark-text-secondary);
  font-size: 13px;
  line-height: 1.5;
  font-style: italic;
}

.title-preview {
  color: var(--dark-accent);
  font-weight: 600;
  font-style: normal;
  font-size: 14px;
}

.skills-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-tag {
  background: rgba(99, 102, 241, 0.1);
  color: var(--dark-text-secondary);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid rgba(99, 102, 241, 0.2);
  display: flex;
  align-items: center;
  gap: 4px;
}

.skill-tag.new-skill {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
  color: var(--dark-success);
}

.new-badge {
  background: var(--dark-success);
  color: white;
  padding: 1px 4px;
  border-radius: 6px;
  font-size: 9px;
  font-weight: 600;
}

.color-preview {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 2px solid var(--dark-border);
}

.experience-preview {
  space-y: 12px;
}

.experience-item {
  margin-bottom: 16px;
}

.experience-item h6 {
  margin: 0 0 8px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--dark-text-primary);
}

.experience-item ul {
  margin: 0;
  padding-left: 16px;
}

.experience-item li {
  font-size: 12px;
  color: var(--dark-text-secondary);
  line-height: 1.4;
  margin-bottom: 4px;
}
</style>