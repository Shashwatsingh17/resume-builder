<template>
  <div id="app" ref="app">
    <!-- Loading Screen -->
    <div v-if="isLoading" class="loading-screen" ref="loadingScreen">
      <div class="loading-content">
        <div class="loading-logo">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="10,9 9,9 8,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 class="loading-title">Resume Builder</h1>
        <div class="loading-bar">
          <div class="loading-progress" ref="loadingProgress"></div>
        </div>
        <p class="loading-text">Preparing your workspace...</p>
      </div>
    </div>

    <!-- Main Application -->
    <div v-if="!isLoading" class="main-app" ref="mainApp">
      <div class="container d-flex">
        <button class="sidebar-toggle" @click="sidebarCollapsed = !sidebarCollapsed" :aria-pressed="sidebarCollapsed" aria-label="Toggle sidebar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <Sidebar ref="sidebar" :collapsed="sidebarCollapsed">
          <div class="sidebar-header" ref="sidebarHeader">
            <h1 class="app-title">
              <svg class="title-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Resume Builder
            </h1>
            <p class="app-subtitle">Create your perfect resume</p>
          </div>

          <!-- Edit Mode Toggle -->
          <div class="sidebar-section" ref="editSection">
            <ToggleSwitch
              label="Edit Mode"
              off-label="Export Mode"
              :toggle-active="editing"
              @switch-toggled="toggleEditing"
            />
          </div>

          <!-- Export Options -->
          <div v-if="!editing" class="sidebar-section" ref="exportSection">
            <h3 class="section-title">Export Options</h3>
            
            <SelectInput
              label="Paper Format"
              :options="formatOptions"
              :default-option="resumeFormat"
              @update-selection="updateResumeFormat"
            />
            
            <ExportPdf :resume-format="resumeFormat" />
            
            <div class="export-actions">
              <CustomButton @click="downloadConfig" btn-type="secondary">
                Download Config
              </CustomButton>
              <CustomButton @click="triggerFileUpload" btn-type="secondary">
                Upload Config
              </CustomButton>
              <input
                ref="fileInput"
                type="file"
                accept=".json"
                @change="uploadConfig"
                style="display: none"
              />
            </div>
          </div>

          <!-- Edit Options -->
          <div v-if="editing" class="sidebar-section" ref="editOptionsSection">
            <h3 class="section-title">Customization</h3>
            
            <ToggleSwitch
              label="Show Profile Picture"
              :toggle-active="showImage"
              @switch-toggled="toggleImage"
            />

            <div v-if="showImage" class="image-controls" ref="imageControls">
              <ImgUpload @image-changed="updateImage" />
              
              <SelectInput
                label="Image Shape"
                :options="shapeOptions"
                :default-option="imageShape"
                @update-selection="updateImageShape"
              />
            </div>

            <TemplateSelector
              :current-template="currentTemplateId"
              @template-changed="changeTemplate"
            />

            <div class="layout-controls" ref="layoutControls">
              <SelectInput
                label="Layout"
                :options="[{ name: 'Two Column', value: 'two-column' }, { name: 'Single Column', value: 'single-column' }]"
                :default-option="layoutMode"
                @update-selection="updateLayoutMode"
              />
              <PercentageInput
                label="Left Column Width"
                :min="20"
                :max="60"
                :current-value="leftColWidthPercent"
                @percentage-changed="updateLeftWidth"
              />
              <PercentageInput
                label="Zoom"
                :min="75"
                :max="140"
                :current-value="zoomPercent"
                @percentage-changed="updateZoom"
              />
            </div>

            <div class="color-controls" ref="colorControls">
              <ColorInput
                label="Left Column Color"
                :default-color="colors.left.highlight"
                @color-changed="updateLeftColor"
              />
              
              <ColorInput
                label="Right Column Color"
                :default-color="colors.right.highlight"
                @color-changed="updateRightColor"
              />
            </div>
          </div>

          <!-- AI Features -->
          <div v-if="!editing" class="sidebar-section" ref="aiSection">
            <AIAnalysis :resume-data="resumeData" />
            <ResumeVariations 
              :resume-data="resumeData" 
              @apply-variation="applyVariation"
            />
          </div>
        </Sidebar>

        <!-- Resume Content -->
        <div class="resume-wrapper" :class="{ 'expanded-canvas': sidebarCollapsed }" ref="resumeWrapper">
          <div class="resume-container" ref="resumeContainer">
            <div
              id="resume"
              ref="resume"
              class="resume"
              :class="[currentTemplateId, layoutModeClass, { 'edit-mode': editing }]"
              :style="cssVars"
            >
              <div class="left-col" ref="leftCol">
                <ProfilePic
                  :url="imageUrl"
                  :show="showImage"
                  :shape="imageShape"
                />

                <ResumeSection>
                  <SectionHeadline
                    headline="Contact"
                    :editing="editing"
                    @headline-edited="updateHeadline('contact', $event)"
                  />
                  <Contact
                    :icon-color="colors.left.highlight"
                    :contact="contact"
                    :editing="editing"
                    @edit="updateContact"
                  />
                </ResumeSection>

                <ResumeSection>
                  <SectionHeadline
                    headline="Skills"
                    :editing="editing"
                    @headline-edited="updateHeadline('skills', $event)"
                  />
                  <ul class="skills-list" ref="skillsList">
                    <li
                      v-for="(skill, index) in skills"
                      :key="index"
                      class="skill-item"
                      :contenteditable="editing"
                      @blur="updateSkill(index, $event)"
                    >
                      {{ skill }}
                    </li>
                  </ul>
                  <EditButtons
                    v-if="editing"
                    @add-click="addSkill"
                    @remove-click="removeSkill"
                  />
                </ResumeSection>

                <ResumeSection>
                  <SectionHeadline
                    headline="Certifications"
                    :editing="editing"
                    @headline-edited="updateHeadline('certifications', $event)"
                  />
                  <ul class="highlights-list" ref="highlightsList">
                    <li
                      v-for="(highlight, index) in highlights"
                      :key="index"
                      class="highlight-item"
                      :contenteditable="editing"
                      @blur="updateHighlight(index, $event)"
                    >
                      {{ highlight }}
                    </li>
                  </ul>
                  <EditButtons
                    v-if="editing"
                    @add-click="addHighlight"
                    @remove-click="removeHighlight"
                  />
                </ResumeSection>
              </div>

              <div class="right-col" ref="rightCol">
                <div class="header-section" ref="headerSection">
                  <h1
                    class="name"
                    :contenteditable="editing"
                    @blur="updateName"
                    ref="nameElement"
                  >
                    {{ name }}
                  </h1>
                  <h2
                    class="title"
                    :contenteditable="editing"
                    @blur="updateTitle"
                    ref="titleElement"
                  >
                    {{ title }}
                  </h2>
                </div>

                <ResumeSection>
                  <div
                    class="intro-text"
                    :contenteditable="editing"
                    @blur="updateIntroText"
                    ref="introElement"
                  >
                    {{ introText }}
                  </div>
                </ResumeSection>

                <ResumeSection>
                  <SectionHeadline
                    headline="Experience"
                    :editing="editing"
                    @headline-edited="updateHeadline('experience', $event)"
                  />
                  <div class="experience-list" ref="experienceList">
                    <ResumeEntry
                      v-for="(exp, index) in experience"
                      :key="index"
                      :item="exp"
                      :editing="editing"
                      @edit="updateExperience(index, $event, $event.target.innerText)"
                      @edit-desc="updateExperienceDesc(index, $event, $event.target.innerText)"
                    />
                  </div>
                  <EditButtons
                    v-if="editing"
                    @add-click="addExperience"
                    @remove-click="removeExperience"
                  />
                </ResumeSection>

                <ResumeSection>
                  <SectionHeadline
                    headline="Education"
                    :editing="editing"
                    @headline-edited="updateHeadline('education', $event)"
                  />
                  <div class="education-list" ref="educationList">
                    <ResumeEntry
                      v-for="(edu, index) in education"
                      :key="index"
                      :item="edu"
                      :editing="editing"
                      @edit="updateEducation(index, $event, $event.target.innerText)"
                      @edit-desc="updateEducationDesc(index, $event, $event.target.innerText)"
                    />
                  </div>
                  <EditButtons
                    v-if="editing"
                    @add-click="addEducation"
                    @remove-click="removeEducation"
                  />
                </ResumeSection>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap';
import Sidebar from './components/Sidebar.vue';
import Contact from './components/Contact.vue';
import ProfilePic from './components/ProfilePic.vue';
import ResumeSection from './components/ResumeSection.vue';
import SectionHeadline from './components/SectionHeadline.vue';
import ResumeEntry from './components/ResumeEntry.vue';
import EditButtons from './components/EditButtons.vue';
import ToggleSwitch from './components/ToggleSwitch.vue';
import SelectInput from './components/SelectInput.vue';
import PercentageInput from './components/PercentageInput.vue';
import ColorInput from './components/ColorInput.vue';
import ImgUpload from './components/ImgUpload.vue';
import ExportPdf from './components/ExportPdf.vue';
import CustomButton from './components/CustomButton.vue';
import AIAnalysis from './components/AIAnalysis.vue';
import ResumeVariations from './components/ResumeVariations.vue';
import TemplateSelector from './components/TemplateSelector.vue';

export default {
  name: 'App',
  components: {
    Sidebar,
    Contact,
    ProfilePic,
    ResumeSection,
    SectionHeadline,
    ResumeEntry,
    EditButtons,
    ToggleSwitch,
    SelectInput,
    ColorInput,
    ImgUpload,
    ExportPdf,
    CustomButton,
    AIAnalysis,
    ResumeVariations,
    TemplateSelector,
    PercentageInput
  },
  data() {
    return {
      isLoading: true,
      editing: true,
      showImage: true,
      imageShape: 'round',
      imageUrl: '/profile_pic.jpg',
      resumeFormat: 'a4',
      name: 'Jane Smith',
      title: 'Senior Data Scientist',
      introText: 'Experienced data scientist with a passion for transforming complex datasets into actionable business insights. Proven track record in machine learning, statistical analysis, and data visualization.',
      contact: {
        phone: '+1 (555) 123-4567',
        email: 'jane.smith@email.com',
        address: 'San Francisco, CA'
      },
      skills: [
        'Python',
        'R',
        'SQL',
        'Machine Learning',
        'Data Visualization',
        'Statistical Analysis',
        'TensorFlow',
        'Pandas',
        'Scikit-learn',
        'Tableau'
      ],
      highlights: [
        'AWS Certified Data Analytics',
        'Google Cloud Professional Data Engineer',
        'Certified Analytics Professional (CAP)',
        'Published researcher in Nature Machine Intelligence'
      ],
      experience: [
        {
          title: 'Senior Data Scientist',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA',
          date: '2021 - Present',
          description: [
            'Led a team of 5 data scientists in developing predictive models that increased revenue by 20%',
            'Developed and deployed machine learning models for fraud detection, reducing false positives by 35%',
            'Collaborated with cross-functional teams to implement data-driven solutions across multiple business units'
          ]
        },
        {
          title: 'Data Scientist',
          company: 'DataFlow Solutions',
          location: 'Palo Alto, CA',
          date: '2019 - 2021',
          description: [
            'Built recommendation system that boosted cross-selling by 25%',
            'Conducted statistical analysis on customer behavior data to identify key growth opportunities',
            'Presented findings to C-level executives, influencing strategic business decisions'
          ]
        }
      ],
      education: [
        {
          title: 'M.S. in Data Science',
          university: 'Stanford University',
          location: 'Stanford, CA',
          date: '2017 - 2019',
          description: [
            'Specialized in Machine Learning and Statistical Computing',
            'Thesis: "Deep Learning Applications in Financial Forecasting"',
            'GPA: 3.9/4.0'
          ]
        },
        {
          title: 'B.S. in Computer Science',
          university: 'UC Berkeley',
          location: 'Berkeley, CA',
          date: '2013 - 2017',
          description: [
            'Magna Cum Laude',
            'Relevant Coursework: Algorithms, Data Structures, Statistics',
            'President of Data Science Club'
          ]
        }
      ],
      colors: {
        left: {
          highlight: '#3feee6'
        },
        right: {
          highlight: '#6366f1'
        }
      },
      headlines: {
        contact: 'Contact',
        skills: 'Skills',
        certifications: 'Certifications',
        experience: 'Experience',
        education: 'Education'
      },
      formatOptions: [
        { name: 'A4', value: 'a4' },
        { name: 'US Letter', value: 'letter' }
      ],
      shapeOptions: [
        { name: 'Round', value: 'round' },
        { name: 'Square', value: 'square' }
      ],
      currentTemplateId: 'modern-minimal',
      sidebarCollapsed: false,
      layoutMode: 'two-column',
      leftColWidthPercent: 35,
      zoomPercent: 100
    };
  },
  computed: {
    layoutModeClass() {
      return this.layoutMode === 'single-column' ? 'single-column' : 'two-column';
    },
    cssVars() {
      const left = Math.max(20, Math.min(60, Number(this.leftColWidthPercent)));
      const right = 100 - left;
      const zoom = Math.max(75, Math.min(140, Number(this.zoomPercent)));
      return {
        '--highlight-color-left': this.colors.left.highlight,
        '--highlight-color-right': this.colors.right.highlight,
        '--headline-weight': this.editing ? '600' : '700',
        '--left-col-width': left + '%',
        '--right-col-width': right + '%',
        '--resume-zoom-scale': (zoom / 100).toString()
      };
    },
    resumeData() {
      return {
        name: this.name,
        title: this.title,
        introText: this.introText,
        contact: this.contact,
        skills: this.skills,
        highlights: this.highlights,
        experience: this.experience,
        education: this.education,
        showImage: this.showImage,
        imageUrl: this.imageUrl,
        colors: this.colors,
        currentTemplateId: this.currentTemplateId,
        layoutMode: this.layoutMode,
        leftColWidthPercent: this.leftColWidthPercent,
        zoomPercent: this.zoomPercent
      };
    }
  },
  mounted() {
    this.initApp();
  },
  methods: {
    async initApp() {
      // Load saved data
      this.loadFromLocalStorage();
      
      // Simulate loading time for smooth UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Start loading animation
      this.animateLoading();
      
      // Hide loading screen after animation
      setTimeout(() => {
        this.isLoading = false;
        this.$nextTick(() => {
          this.initMainAppAnimations();
        });
      }, 2000);
    },
    animateLoading() {
      const tl = gsap.timeline();
      
      // Animate loading progress
      tl.to(this.$refs.loadingProgress, {
        width: '100%',
        duration: 1.5,
        ease: "power2.inOut"
      });
      
      // Fade out loading screen
      tl.to(this.$refs.loadingScreen, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut"
      }, "+=0.3");
    },
    initMainAppAnimations() {
      try {
        const tl = gsap.timeline();
        
        // Set initial states with null checks
        if (this.$refs.sidebar?.$el) {
          gsap.set(this.$refs.sidebar.$el, { opacity: 0, y: 30 });
        }
        if (this.$refs.resumeWrapper) {
          gsap.set(this.$refs.resumeWrapper, { opacity: 0, y: 30 });
        }
        
        // Animate main app entrance
        if (this.$refs.mainApp) {
          tl.to(this.$refs.mainApp, {
            opacity: 1,
            duration: 0.5
          });
        }
        
        // Animate sidebar
        if (this.$refs.sidebar?.$el) {
          tl.to(this.$refs.sidebar.$el, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
          }, "-=0.3");
        }
        
        // Animate resume wrapper
        if (this.$refs.resumeWrapper) {
          tl.to(this.$refs.resumeWrapper, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
          }, "-=0.6");
        }
        
        // Animate resume sections with stagger
        if (this.$refs.resume) {
          const resumeSections = this.$refs.resume.querySelectorAll('.resume-section');
          if (resumeSections && resumeSections.length > 0) {
            gsap.fromTo(resumeSections,
              { x: 20, opacity: 0 },
              { 
                x: 0, 
                opacity: 1, 
                duration: 0.6, 
                stagger: 0.1, 
                ease: "power2.out",
                delay: 0.5
              }
            );
          }
        }
      } catch (error) {
        console.error('Animation error:', error);
      }
    },
    toggleEditing(isEditing) {
      this.editing = isEditing;
      this.animateEditModeToggle();
      this.saveToLocalStorage();
    },
    animateEditModeToggle() {
      try {
        const resume = this.$refs.resume;
        if (!resume) return;
        
        gsap.to(resume, {
          scale: 0.98,
          duration: 0.2,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            try {
              // Animate edit indicators
              const editableElements = resume.querySelectorAll('[contenteditable="true"]');
              if (this.editing && editableElements.length > 0) {
                gsap.fromTo(editableElements,
                  { backgroundColor: 'transparent' },
                  { 
                    backgroundColor: 'rgba(99, 102, 241, 0.08)',
                    duration: 0.3,
                    stagger: 0.05,
                    ease: "power2.out"
                  }
                );
              }
            } catch (error) {
              console.error('Edit mode animation error:', error);
            }
          }
        });
      } catch (error) {
        console.error('Edit mode toggle animation error:', error);
      }
    },
    toggleImage(show) {
      this.showImage = show;
      this.saveToLocalStorage();
    },
    updateImage(imageData) {
      this.imageUrl = imageData;
      this.saveToLocalStorage();
    },
    updateImageShape(shape) {
      this.imageShape = shape;
      this.saveToLocalStorage();
    },
    updateResumeFormat(format) {
      this.resumeFormat = format;
      this.saveToLocalStorage();
    },
    updateLeftColor(color) {
      this.colors.left.highlight = color;
      this.saveToLocalStorage();
    },
    updateRightColor(color) {
      this.colors.right.highlight = color;
      this.saveToLocalStorage();
    },
    updateLayoutMode(val) {
      this.layoutMode = val;
      this.saveToLocalStorage();
    },
    updateLeftWidth(val) {
      this.leftColWidthPercent = Number(val);
      this.saveToLocalStorage();
    },
    updateZoom(val) {
      this.zoomPercent = Number(val);
      this.saveToLocalStorage();
    },
    updateName(event) {
      this.name = event.target.innerText;
      this.saveToLocalStorage();
    },
    updateTitle(event) {
      this.title = event.target.innerText;
      this.saveToLocalStorage();
    },
    updateIntroText(event) {
      this.introText = event.target.innerText;
      this.saveToLocalStorage();
    },
    updateContact(event, section, field) {
      this.contact[field] = event.target.innerText;
      this.saveToLocalStorage();
    },
    updateHeadline(section, newText) {
      this.headlines[section] = newText;
      this.saveToLocalStorage();
    },
    updateSkill(index, event) {
      this.skills[index] = event.target.innerText;
      this.saveToLocalStorage();
    },
    addSkill() {
      this.skills.push('New Skill');
      this.$nextTick(() => {
        this.animateNewItem('.skill-item:last-child');
      });
      this.saveToLocalStorage();
    },
    removeSkill() {
      if (this.skills.length > 0) {
        this.animateRemoveItem('.skill-item:last-child', () => {
          this.skills.pop();
          this.saveToLocalStorage();
        });
      }
    },
    updateHighlight(index, event) {
      this.highlights[index] = event.target.innerText;
      this.saveToLocalStorage();
    },
    addHighlight() {
      this.highlights.push('New Certification');
      this.$nextTick(() => {
        this.animateNewItem('.highlight-item:last-child');
      });
      this.saveToLocalStorage();
    },
    removeHighlight() {
      if (this.highlights.length > 0) {
        this.animateRemoveItem('.highlight-item:last-child', () => {
          this.highlights.pop();
          this.saveToLocalStorage();
        });
      }
    },
    updateExperience(index, event, newText) {
      const field = event.target.getAttribute('data-field') || this.getFieldFromEvent(event);
      this.experience[index][field] = newText;
      this.saveToLocalStorage();
    },
    updateExperienceDesc(index, event, newText) {
      const descIndex = parseInt(event.target.getAttribute('data-desc-index')) || 0;
      this.experience[index].description[descIndex] = newText;
      this.saveToLocalStorage();
    },
    addExperience() {
      const newExp = {
        title: 'Job Title',
        company: 'Company Name',
        location: 'Location',
        date: 'Start - End',
        description: ['Job description and achievements']
      };
      this.experience.push(newExp);
      this.$nextTick(() => {
        this.animateNewItem('.experience-list .inner-section:last-child');
      });
      this.saveToLocalStorage();
    },
    removeExperience() {
      if (this.experience.length > 0) {
        this.animateRemoveItem('.experience-list .inner-section:last-child', () => {
          this.experience.pop();
          this.saveToLocalStorage();
        });
      }
    },
    updateEducation(index, event, newText) {
      const field = event.target.getAttribute('data-field') || this.getFieldFromEvent(event);
      this.education[index][field] = newText;
      this.saveToLocalStorage();
    },
    updateEducationDesc(index, event, newText) {
      const descIndex = parseInt(event.target.getAttribute('data-desc-index')) || 0;
      this.education[index].description[descIndex] = newText;
      this.saveToLocalStorage();
    },
    addEducation() {
      const newEdu = {
        title: 'Degree',
        university: 'University Name',
        location: 'Location',
        date: 'Start - End',
        description: ['Relevant coursework and achievements']
      };
      this.education.push(newEdu);
      this.$nextTick(() => {
        this.animateNewItem('.education-list .inner-section:last-child');
      });
      this.saveToLocalStorage();
    },
    removeEducation() {
      if (this.education.length > 0) {
        this.animateRemoveItem('.education-list .inner-section:last-child', () => {
          this.education.pop();
          this.saveToLocalStorage();
        });
      }
    },
    getFieldFromEvent(event) {
      // Determine field based on element class or position
      const element = event.target;
      if (element.classList.contains('resumeentry-title')) return 'title';
      if (element.classList.contains('resumeentry-date')) return 'date';
      if (element.classList.contains('resumeentry-location')) {
        // Check if it's the first or second span in location
        const parent = element.parentElement;
        const spans = parent.querySelectorAll('span');
        return spans[0] === element ? 'company' : 'location';
      }
      return 'title'; // default fallback
    },
    animateNewItem(selector) {
      try {
        const element = document.querySelector(selector);
        if (element) {
          gsap.fromTo(element,
            { scale: 0, opacity: 0, y: -20 },
            { 
              scale: 1, 
              opacity: 1, 
              y: 0, 
              duration: 0.5, 
              ease: "back.out(1.7)" 
            }
          );
        }
      } catch (error) {
        console.error('New item animation error:', error);
      }
    },
    animateRemoveItem(selector, callback) {
      try {
        const element = document.querySelector(selector);
        if (element) {
          gsap.to(element, {
            scale: 0,
            opacity: 0,
            x: 20,
            duration: 0.3,
            ease: "power2.in",
            onComplete: callback
          });
        } else {
          callback();
        }
      } catch (error) {
        console.error('Remove item animation error:', error);
        callback();
      }
    },
    applyVariation(variationData) {
      try {
        // Animate the application of variation
        const resume = this.$refs.resume;
        if (resume) {
          gsap.to(resume, {
            scale: 0.95,
            opacity: 0.7,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
              try {
                // Apply the variation data
                Object.assign(this, variationData);
                this.saveToLocalStorage();
                
                // Animate back
                gsap.to(resume, {
                  scale: 1,
                  opacity: 1,
                  duration: 0.5,
                  ease: "back.out(1.7)"
                });
              } catch (error) {
                console.error('Variation application error:', error);
                // Reset resume appearance on error
                gsap.to(resume, {
                  scale: 1,
                  opacity: 1,
                  duration: 0.3,
                  ease: "power2.out"
                });
              }
            }
          });
        }
      } catch (error) {
        console.error('Variation animation error:', error);
      }
    },
    downloadConfig() {
      const config = {
        name: this.name,
        title: this.title,
        introText: this.introText,
        contact: this.contact,
        skills: this.skills,
        highlights: this.highlights,
        experience: this.experience,
        education: this.education,
        colors: this.colors,
        showImage: this.showImage,
        imageShape: this.imageShape,
        imageUrl: this.imageUrl,
        resumeFormat: this.resumeFormat,
        headlines: this.headlines,
        currentTemplateId: this.currentTemplateId,
        layoutMode: this.layoutMode,
        leftColWidthPercent: this.leftColWidthPercent,
        zoomPercent: this.zoomPercent
      };
      
      const dataStr = JSON.stringify(config, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'resume-config.json';
      link.click();
      
      URL.revokeObjectURL(url);
    },
    triggerFileUpload() {
      this.$refs.fileInput?.click();
    },
    uploadConfig(event) {
      try {
        const file = event.target.files[0];
        if (!file) {
          alert('Please select a file');
          return;
        }
        
        if (file.type !== 'application/json') {
          alert('Please select a valid JSON file');
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const config = JSON.parse(e.target.result);
            this.loadConfig(config);
          } catch (error) {
            console.error('Error parsing config file:', error);
            alert('Invalid configuration file. Please check the file format.');
          }
        };
        
        reader.onerror = () => {
          alert('Error reading file. Please try again.');
        };
        
        reader.readAsText(file);
      } catch (error) {
        console.error('File upload error:', error);
        alert('Error uploading file. Please try again.');
      }
    },
    loadConfig(config) {
      try {
        // Animate config loading
        const resume = this.$refs.resume;
        if (resume) {
          gsap.to(resume, {
            rotationY: 90,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
              try {
                // Apply config
                Object.assign(this, config);
                if (config.currentTemplateId) {
                  this.applyTemplate(config.currentTemplateId);
                }
                this.saveToLocalStorage();
                
                // Animate back
                gsap.fromTo(resume,
                  { rotationY: -90 },
                  { 
                    rotationY: 0, 
                    duration: 0.5, 
                    ease: "power2.out" 
                  }
                );
              } catch (error) {
                console.error('Config application error:', error);
                // Reset resume appearance on error
                gsap.to(resume, {
                  rotationY: 0,
                  duration: 0.3,
                  ease: "power2.out"
                });
              }
            }
          });
        }
      } catch (error) {
        console.error('Config loading animation error:', error);
      }
    },
    saveToLocalStorage() {
      try {
        const data = {
          name: this.name,
          title: this.title,
          introText: this.introText,
          contact: this.contact,
          skills: this.skills,
          highlights: this.highlights,
          experience: this.experience,
          education: this.education,
          colors: this.colors,
          showImage: this.showImage,
          imageShape: this.imageShape,
          imageUrl: this.imageUrl,
          resumeFormat: this.resumeFormat,
          headlines: this.headlines,
          currentTemplateId: this.currentTemplateId,
          layoutMode: this.layoutMode,
          leftColWidthPercent: this.leftColWidthPercent,
          zoomPercent: this.zoomPercent
        };
        localStorage.setItem('resumeData', JSON.stringify(data));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        // Try to save with a fallback approach
        try {
          const simpleData = {
            name: this.name || '',
            title: this.title || '',
            introText: this.introText || ''
          };
          localStorage.setItem('resumeData', JSON.stringify(simpleData));
        } catch (fallbackError) {
          console.error('Fallback save also failed:', fallbackError);
        }
      }
    },
    loadFromLocalStorage() {
      try {
        const saved = localStorage.getItem('resumeData');
        if (saved) {
          try {
            const data = JSON.parse(saved);
            // Validate the data structure before applying
            if (data && typeof data === 'object') {
              Object.assign(this, data);
              if (data.currentTemplateId) {
                this.applyTemplate(data.currentTemplateId);
              }
            }
          } catch (error) {
            console.error('Error parsing saved data:', error);
            // Clear corrupted data
            localStorage.removeItem('resumeData');
          }
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
    },
    changeTemplate(templateId) {
      this.currentTemplateId = templateId;
      this.saveToLocalStorage();
      
      // Apply template-specific styles and data
      this.applyTemplate(templateId);
    },
    
    applyTemplate(templateId) {
      switch(templateId) {
        case 'modern-minimal':
          this.colors.left.highlight = '#3feee6';
          this.colors.right.highlight = '#6366f1';
          this.showImage = true;
          this.imageShape = 'round';
          break;
        case 'classic-professional':
          this.colors.left.highlight = '#2c3e50';
          this.colors.right.highlight = '#34495e';
          this.showImage = true;
          this.imageShape = 'square';
          break;
        case 'creative-bold':
          this.colors.left.highlight = '#e74c3c';
          this.colors.right.highlight = '#f39c12';
          this.showImage = true;
          this.imageShape = 'round';
          break;
        case 'clean-minimal':
          this.colors.left.highlight = '#95a5a6';
          this.colors.right.highlight = '#7f8c8d';
          this.showImage = false;
          break;
        case 'overleaf-awesome-cv':
          this.colors.left.highlight = '#cc0000';
          this.colors.right.highlight = '#2b2b2b';
          this.showImage = false;
          this.imageShape = 'round';
          break;
        case 'overleaf-deedy':
          this.colors.left.highlight = '#1f6feb';
          this.colors.right.highlight = '#0d1117';
          this.showImage = true;
          this.imageShape = 'square';
          break;
        case 'overleaf-moderncv':
          this.colors.left.highlight = '#2c3e50';
          this.colors.right.highlight = '#18bc9c';
          this.showImage = true;
          this.imageShape = 'round';
          break;
        case 'overleaf-classic':
          this.colors.left.highlight = '#555555';
          this.colors.right.highlight = '#2c3e50';
          this.showImage = false;
          this.imageShape = 'square';
          break;
        case 'overleaf-compact':
          this.colors.left.highlight = '#7e57c2';
          this.colors.right.highlight = '#26a69a';
          this.showImage = false;
          this.imageShape = 'round';
          break;
        default:
          break;
      }
      
      // Save the updated colors
      this.saveToLocalStorage();
    }
  }
};
</script>

<style scoped>
/* Loading Screen */
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--dark-bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
  max-width: 400px;
  padding: 40px;
}

.loading-logo {
  margin-bottom: 32px;
}

.logo-icon {
  width: 64px;
  height: 64px;
  color: var(--dark-accent);
  filter: drop-shadow(0 4px 12px rgba(99, 102, 241, 0.3));
  animation: float 3s ease-in-out infinite;
}

.loading-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--dark-text-primary);
  margin: 0 0 32px 0;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.loading-bar {
  width: 100%;
  height: 4px;
  background: var(--dark-border);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.loading-progress {
  height: 100%;
  width: 0%;
  background: var(--gradient-primary);
  border-radius: 2px;
  position: relative;
}

.loading-progress::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 1.5s infinite;
}

.loading-text {
  color: var(--dark-text-secondary);
  font-size: 14px;
  margin: 0;
  animation: pulse 2s ease-in-out infinite;
}

/* Main App */
.main-app {
  opacity: 0;
  min-height: 100vh;
}

.container {
  min-height: 100vh;
  position: relative;
}

/* Sidebar toggle */
.sidebar-toggle {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 120;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  color: var(--dark-text-primary);
  background: var(--gradient-primary);
  border: 1px solid var(--dark-border-light);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  cursor: pointer;
}

.sidebar-toggle:hover {
  transform: translateY(-1px);
}

.sidebar-toggle:active {
  transform: translateY(0);
}

/* Sidebar Header */
.sidebar-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

.sidebar-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background: var(--gradient-primary);
  border-radius: 1px;
}

.app-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: var(--dark-text-primary);
  margin: 0 0 8px 0;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-icon {
  width: 28px;
  height: 28px;
  color: var(--dark-accent);
  filter: drop-shadow(0 2px 4px rgba(99, 102, 241, 0.3));
}

.app-subtitle {
  color: var(--dark-text-secondary);
  font-size: 14px;
  margin: 0;
  font-weight: 500;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--dark-text-primary);
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Export Actions */
.export-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.export-actions .btn {
  font-size: 12px;
  padding: 12px 20px;
}

/* Image Controls */
.image-controls {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.color-controls {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

/* Resume Wrapper */
.resume-wrapper {
  flex: 1;
  margin-left: 340px;
  padding: 40px;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  opacity: 0;
  transition: margin-left 0.3s ease;
}

.resume-wrapper.expanded-canvas {
  margin-left: 80px;
}

.resume-container {
  width: 100%;
  max-width: 900px;
  position: relative;
}

/* Resume Styles */
.resume {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  color: var(--color-black);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  backdrop-filter: blur(20px);
}

.resume::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
}

.resume.edit-mode {
  box-shadow: 
    0 30px 60px rgba(99, 102, 241, 0.2),
    0 0 0 2px rgba(99, 102, 241, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transform: scale(1.02);
}

.resume {
  display: flex;
  min-height: 800px;
}

.left-col {
  width: 35%;
  background: linear-gradient(180deg, var(--dark-bg-secondary) 0%, var(--dark-bg-tertiary) 100%);
  color: var(--dark-text-primary);
  padding: 48px 36px;
  position: relative;
  overflow: hidden;
}

.left-col::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 0% 100%, rgba(139, 92, 246, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

.right-col {
  width: 65%;
  padding: 48px 40px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  position: relative;
}

.right-col::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 100% 0%, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 0% 100%, rgba(139, 92, 246, 0.02) 0%, transparent 50%);
  pointer-events: none;
}

/* Header Section */
.header-section {
  margin-bottom: 40px;
  text-align: center;
  position: relative;
}

.name {
  font-size: 42px;
  font-weight: 800;
  color: var(--highlight-color-right);
  margin: 0 0 12px 0;
  letter-spacing: -1px;
  line-height: 1.1;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, var(--highlight-color-right) 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title {
  font-size: 20px;
  font-weight: 500;
  color: #64748b;
  margin: 0;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.intro-text {
  font-size: 16px;
  line-height: 1.7;
  color: #475569;
  text-align: justify;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

/* Skills and Highlights Lists */
.skills-list,
.highlights-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.skill-item,
.highlight-item {
  background: rgba(255, 255, 255, 0.1);
  color: var(--dark-text-primary);
  padding: 12px 16px;
  margin-bottom: 10px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.skill-item::before,
.highlight-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: var(--highlight-color-left);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.skill-item:hover,
.highlight-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.skill-item:hover::before,
.highlight-item:hover::before {
  opacity: 1;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .resume-wrapper {
    margin-left: 320px;
    padding: 30px 20px;
  }
  
  .sidebar {
    width: 320px;
  }
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
  
  .resume-wrapper {
    margin-left: 0;
    padding: 20px;
  }
  
  .sidebar {
    position: relative;
    width: 100%;
    height: auto;
  }
  
  .resume {
    flex-direction: column;
  }
  
  .left-col,
  .right-col {
    width: 100%;
  }
  
  .name {
    font-size: 32px;
  }
}

/* Animation Keyframes */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
</style>
