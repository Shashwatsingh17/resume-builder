<template>
  <div class="resume-variations" ref="variationsContainer">
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
        ref="generateButton"
        :disabled="!selectedVariationType || isGenerating"
        btn-type="primary"
        >
        Generate Variation
      </CustomButton>
    </div>

    <div v-if="isGenerating" class="loading-state" ref="loadingState">
      <div class="loading-spinner"></div>
      <p>AI is generating your resume variation...</p>
      <p class="loading-detail">Optimizing content for {{ getSelectedTypeName() }}</p>
    </div>

    <div v-if="error" class="error-state" ref="errorState">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <CustomButton @click="generateVariation" btn-type="secondary">
        Try Again
      </CustomButton>
    </div>

    <div v-if="generatedVariation && !isGenerating" class="variation-results" ref="variationResults">
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
import { gsap } from 'gsap';
import { ResumeVariationService } from '../services/resumeVariationService.js';
import CustomButton from './CustomButton.vue';

export default {
  mounted() {
    this.initVariationsAnimations();
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
      selectedVariationType: '',
      generatedVariation: null,
      isGenerating: false,
      error: null,
      variationTypes: ResumeVariationService.getVariationTypes()
    };
  },
  watch: {
    isGenerating(newVal) {
      if (newVal) {
        this.animateLoadingState();
      }
    },
    generatedVariation(newVal) {
      if (newVal && !this.isGenerating) {
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
    initVariationsAnimations() {
      // Animate container entrance
      gsap.fromTo(this.$refs.variationsContainer,
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
      if (this.$refs.variationResults) {
        const timeline = gsap.timeline();
        
        timeline.fromTo(this.$refs.variationResults,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
        );

        // Animate preview sections
        const previewSections = this.$refs.variationResults.querySelectorAll('.preview-section');
        timeline.fromTo(previewSections,
          { x: -15, opacity: 0 },
          { 
            x: 0, 
            opacity: 1, 
            duration: 0.4, 
            stagger: 0.1, 
            ease: "power2.out" 
          },
          "-=0.3"
        );
      }
    },
    animateErrorState() {
      if (this.$refs.errorState) {
        gsap.fromTo(this.$refs.errorState,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
      }
    },
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
  background: var(--gradient-secondary);
  border: 1px solid var(--dark-border-light);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  backdrop-filter: var(--blur-backdrop);
  position: relative;
  overflow: hidden;
}

.resume-variations::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
}

.variations-header {
  margin-bottom: 32px;
}

.variation-icon {
  width: 22px;
  height: 22px;
  margin-right: 12px;
  color: var(--dark-accent);
  filter: drop-shadow(0 2px 4px rgba(99, 102, 241, 0.3));
}

.variations-description {
  color: var(--dark-text-secondary);
  font-size: 15px;
  line-height: 1.6;
  margin: 8px 0 0 0;
}

.variation-selector {
  margin-bottom: 24px;
}

.variation-label {
  display: block;
  margin-bottom: 20px;
}

.variation-select {
  width: 100%;
  margin-bottom: 16px;
}

.variation-description {
  background: var(--dark-accent-light);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
}

.variation-description p {
  margin: 0;
  color: var(--dark-text-secondary);
  font-size: 14px;
  line-height: 1.5;
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

.loading-detail {
  font-size: 13px;
  color: var(--dark-text-muted);
  margin-top: 12px;
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

.variation-results {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 24px;
}

.variation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.variation-header h4 {
  margin: 0;
  color: var(--dark-text-primary);
  font-size: 18px;
  font-weight: 600;
}

.variation-actions {
  display: flex;
  gap: 12px;
}

.variation-actions .btn {
  width: auto;
  padding: 10px 20px;
  font-size: 13px;
}

.variation-preview {
  space-y: 20px;
}

.preview-section {
  background: var(--gradient-secondary);
  border: 1px solid var(--dark-border-light);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.preview-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.preview-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.preview-section:hover::before {
  opacity: 1;
}

.preview-section h5 {
  margin: 0 0 16px 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--dark-accent);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.preview-text {
  margin: 0;
  color: var(--dark-text-secondary);
  font-size: 14px;
  line-height: 1.6;
  font-style: italic;
}

.title-preview {
  color: var(--dark-accent);
  font-weight: 700;
  font-style: normal;
  font-size: 16px;
}

.skills-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  background: var(--dark-accent-light);
  color: var(--dark-text-secondary);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(99, 102, 241, 0.2);
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.skill-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.skill-tag.new-skill {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.3);
  color: var(--dark-success);
  animation: pulse 2s ease-in-out infinite;
}

.new-badge {
  background: var(--dark-success);
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.color-preview {
  display: flex;
  align-items: center;
  gap: 16px;
}

.color-swatch {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 3px solid var(--dark-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.color-swatch:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.experience-preview {
  space-y: 16px;
}

.experience-item {
  margin-bottom: 20px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
}

.experience-item:hover {
  background: rgba(255, 255, 255, 0.04);
  transform: translateX(4px);
}

.experience-item h6 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--dark-text-primary);
}

.experience-item ul {
  margin: 0;
  padding-left: 20px;
}

.experience-item li {
  font-size: 13px;
  color: var(--dark-text-secondary);
  line-height: 1.5;
  margin-bottom: 6px;
  transition: all 0.2s ease;
}

.experience-item li:hover {
  color: var(--dark-text-primary);
  padding-left: 4px;
}
</style>