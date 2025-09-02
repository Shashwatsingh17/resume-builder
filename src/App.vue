<template>
  <div id="app" :class="currentTheme">
    <!-- Homepage -->
    <HomePage 
      v-if="showHomePage" 
      @start-building="showHomePage = false"
    />
    
    <!-- Resume Builder -->
    <div v-else class="app-container">
      <!-- Sidebar -->
      <Sidebar :collapsed="sidebarCollapsed">
        <div class="sidebar-header">
          <button @click="goHome" class="home-button">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Home
          </button>
          <button @click="toggleSidebar" class="collapse-button">
            <svg v-if="!sidebarCollapsed" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 19l-7-7 7-7m8 14l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 5l7 7-7 7M5 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div class="sidebar-section">
          <ToggleSwitch 
            label="Edit Mode" 
            :toggleActive="editing" 
            @switchToggled="editing = $event"
          />
        </div>

        <div class="sidebar-section">
          <ThemeSelector 
            :currentTheme="currentTheme" 
            @theme-changed="changeTheme"
          />
        </div>

        <div class="sidebar-section">
          <TemplateSelector 
            :currentTemplate="currentTemplate" 
            @template-changed="changeTemplate"
          />
        </div>

        <div class="sidebar-section">
          <h3 class="section-title">Profile Picture</h3>
          <ToggleSwitch 
            label="Show Image" 
            :toggleActive="showImage" 
            @switchToggled="showImage = $event"
          />
          <SelectInput 
            v-if="showImage"
            label="Image Shape" 
            :options="imageShapeOptions" 
            :defaultOption="imageShape" 
            @updateSelection="imageShape = $event"
          />
          <ImgUpload 
            v-if="showImage" 
            @imageChanged="imageUrl = $event"
          />
        </div>

        <div class="sidebar-section">
          <h3 class="section-title">Colors</h3>
          <ColorInput 
            label="Left Column Color" 
            :defaultColor="colors.left.highlight" 
            @colorChanged="colors.left.highlight = $event"
          />
          <ColorInput 
            label="Right Column Color" 
            :defaultColor="colors.right.highlight" 
            @colorChanged="colors.right.highlight = $event"
          />
        </div>

        <div class="sidebar-section">
          <h3 class="section-title">Export</h3>
          <SelectInput 
            label="Paper Format" 
            :options="paperFormatOptions" 
            :defaultOption="resumeFormat" 
            @updateSelection="resumeFormat = $event"
          />
          <ExportPdf :resumeFormat="resumeFormat" />
        </div>

        <div class="sidebar-section">
          <h3 class="section-title">Data Management</h3>
          <CustomButton @click="downloadData" btn-type="secondary">
            Download Data (JSON)
          </CustomButton>
          <label class="file-upload-wrapper">
            <CustomButton btn-type="secondary">
              Upload Data (JSON)
            </CustomButton>
            <input 
              type="file" 
              accept=".json" 
              @change="uploadData" 
              style="display: none;"
            />
          </label>
        </div>
      </Sidebar>

      <!-- Main Content -->
      <div class="main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
        <!-- AI Analysis Section -->
        <div v-if="!editing" class="ai-section">
          <AIAnalysis :resumeData="resumeData" />
          <ResumeVariations 
            :resumeData="resumeData" 
            @apply-variation="applyVariation"
          />
        </div>

        <!-- Resume Preview -->
        <div class="resume-container">
          <div 
            id="resume" 
            class="resume" 
            :class="{ 'edit-off': !editing }"
            :style="resumeStyles"
          >
            <!-- Left Column -->
            <div class="left-col">
              <ProfilePic 
                :url="imageUrl" 
                :show="showImage" 
                :shape="imageShape"
              />

              <ResumeSection>
                <SectionHeadline 
                  headline="Contact" 
                  :editing="editing"
                />
                <Contact 
                  :contact="contact" 
                  :iconColor="colors.left.highlight" 
                  :editing="editing" 
                  @edit="editField"
                />
              </ResumeSection>

              <ResumeSection>
                <SectionHeadline 
                  headline="Skills" 
                  :editing="editing" 
                  @headlineEdited="skillsHeadline = $event"
                />
                <ul class="skills">
                  <li v-for="(skill, index) in skills" :key="index">
                    <span 
                      :contenteditable="editing" 
                      @blur="editSkill($event, index)"
                    >
                      {{ skill }}
                    </span>
                  </li>
                </ul>
                <EditButtons 
                  v-if="editing" 
                  @addClick="addSkill" 
                  @removeClick="removeSkill"
                />
              </ResumeSection>

              <ResumeSection>
                <SectionHeadline 
                  headline="Certifications" 
                  :editing="editing" 
                  @headlineEdited="highlightsHeadline = $event"
                />
                <ul class="highlights">
                  <li v-for="(highlight, index) in highlights" :key="index">
                    <span 
                      :contenteditable="editing" 
                      @blur="editHighlight($event, index)"
                    >
                      {{ highlight }}
                    </span>
                  </li>
                </ul>
                <EditButtons 
                  v-if="editing" 
                  @addClick="addHighlight" 
                  @removeClick="removeHighlight"
                />
              </ResumeSection>
            </div>

            <!-- Right Column -->
            <div class="right-col">
              <!-- Header with Name and Title -->
              <div class="resume-header">
                <h1 
                  class="name" 
                  :contenteditable="editing" 
                  @blur="editField($event, 'name')"
                >
                  {{ name }}
                </h1>
                <h2 
                  class="title" 
                  :contenteditable="editing" 
                  @blur="editField($event, 'title')"
                >
                  {{ title }}
                </h2>
              </div>

              <!-- Introduction -->
              <ResumeSection>
                <SectionHeadline 
                  headline="About" 
                  :editing="editing" 
                  @headlineEdited="introHeadline = $event"
                />
                <p 
                  class="intro-text" 
                  :contenteditable="editing" 
                  @blur="editField($event, 'introText')"
                >
                  {{ introText }}
                </p>
              </ResumeSection>

              <!-- Experience -->
              <ResumeSection>
                <SectionHeadline 
                  headline="Experience" 
                  :editing="editing" 
                  @headlineEdited="experienceHeadline = $event"
                />
                <ResumeEntry 
                  v-for="(exp, index) in experience" 
                  :key="index" 
                  :item="exp" 
                  :editing="editing" 
                  @edit="editExperience($event, index, $event.target.dataset.field)" 
                  @editDesc="editExperienceDesc($event, index, $event.target.dataset.descIndex)"
                />
                <EditButtons 
                  v-if="editing" 
                  @addClick="addExperience" 
                  @removeClick="removeExperience"
                />
              </ResumeSection>

              <!-- Education -->
              <ResumeSection>
                <SectionHeadline 
                  headline="Education" 
                  :editing="editing" 
                  @headlineEdited="educationHeadline = $event"
                />
                <ResumeEntry 
                  v-for="(edu, index) in education" 
                  :key="index" 
                  :item="edu" 
                  :editing="editing" 
                  @edit="editEducation($event, index, $event.target.dataset.field)" 
                  @editDesc="editEducationDesc($event, index, $event.target.dataset.descIndex)"
                />
                <EditButtons 
                  v-if="editing" 
                  @addClick="addEducation" 
                  @removeClick="removeEducation"
                />
              </ResumeSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap';
import HomePage from './components/HomePage.vue';
import Sidebar from './components/Sidebar.vue';
import ToggleSwitch from './components/ToggleSwitch.vue';
import ThemeSelector from './components/ThemeSelector.vue';
import TemplateSelector from './components/TemplateSelector.vue';
import SelectInput from './components/SelectInput.vue';
import ImgUpload from './components/ImgUpload.vue';
import ColorInput from './components/ColorInput.vue';
import ExportPdf from './components/ExportPdf.vue';
import CustomButton from './components/CustomButton.vue';
import AIAnalysis from './components/AIAnalysis.vue';
import ResumeVariations from './components/ResumeVariations.vue';
import ProfilePic from './components/ProfilePic.vue';
import ResumeSection from './components/ResumeSection.vue';
import SectionHeadline from './components/SectionHeadline.vue';
import Contact from './components/Contact.vue';
import ResumeEntry from './components/ResumeEntry.vue';
import EditButtons from './components/EditButtons.vue';

export default {
  name: 'App',
  components: {
    HomePage,
    Sidebar,
    ToggleSwitch,
    ThemeSelector,
    TemplateSelector,
    SelectInput,
    ImgUpload,
    ColorInput,
    ExportPdf,
    CustomButton,
    AIAnalysis,
    ResumeVariations,
    ProfilePic,
    ResumeSection,
    SectionHeadline,
    Contact,
    ResumeEntry,
    EditButtons
  },
  mounted() {
    try {
      this.loadData();
      this.initAppAnimations();
    } catch (error) {
      console.error('App component mount error:', error);
    }
  },
  data() {
    return {
      showHomePage: true,
      sidebarCollapsed: false,
      currentTheme: 'theme-dark-neon',
      currentTemplate: 'modern-minimal',
      editing: true,
      showImage: true,
      imageShape: 'round',
      imageUrl: '/profile_pic.jpg',
      resumeFormat: 'a4',
      name: 'John Doe',
      title: 'Senior Data Scientist',
      introText: 'Experienced data scientist with a passion for turning complex data into actionable insights. Skilled in machine learning, statistical analysis, and data visualization.',
      contact: {
        phone: '+1 (555) 123-4567',
        email: 'john.doe@email.com',
        address: 'San Francisco, CA'
      },
      skills: [
        'Python', 'R', 'SQL', 'Machine Learning', 'Deep Learning', 
        'Data Visualization', 'Statistical Analysis', 'TensorFlow', 
        'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn'
      ],
      highlights: [
        'AWS Certified Machine Learning Specialist',
        'Google Analytics Certified',
        'Certified Data Management Professional (CDMP)'
      ],
      experience: [
        {
          title: 'Senior Data Scientist',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA',
          date: '2021 - Present',
          description: [
            'Led a team of 5 data scientists in developing machine learning models for customer segmentation',
            'Developed and deployed a recommendation system that increased user engagement by 25%',
            'Conducted A/B testing and statistical analysis to optimize product features'
          ]
        },
        {
          title: 'Data Scientist',
          company: 'DataFlow Solutions',
          location: 'San Francisco, CA',
          date: '2019 - 2021',
          description: [
            'Built predictive models for fraud detection, reducing false positives by 30%',
            'Collaborated with cross-functional teams to implement data-driven solutions',
            'Presented findings to stakeholders and provided actionable recommendations'
          ]
        }
      ],
      education: [
        {
          title: 'Master of Science in Data Science',
          university: 'Stanford University',
          location: 'Stanford, CA',
          date: '2017 - 2019',
          description: [
            'Specialized in machine learning and statistical modeling',
            'Thesis: "Deep Learning Applications in Natural Language Processing"'
          ]
        }
      ],
      colors: {
        left: { highlight: '#3feee6' },
        right: { highlight: '#6366f1' }
      },
      imageShapeOptions: [
        { name: 'Round', value: 'round' },
        { name: 'Square', value: 'square' }
      ],
      paperFormatOptions: [
        { name: 'A4', value: 'a4' },
        { name: 'US Letter', value: 'letter' }
      ]
    };
  },
  computed: {
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
        colors: this.colors,
        showImage: this.showImage,
        imageUrl: this.imageUrl,
        imageShape: this.imageShape
      };
    },
    resumeStyles() {
      return {
        '--highlight-color-left': this.colors.left.highlight,
        '--highlight-color-right': this.colors.right.highlight
      };
    }
  },
  watch: {
    resumeData: {
      handler() {
        this.saveData();
      },
      deep: true
    },
    currentTheme() {
      this.saveData();
    },
    currentTemplate() {
      this.saveData();
    }
  },
  methods: {
    initAppAnimations() {
      // Add any app-level animations here
    },
    goHome() {
      this.showHomePage = true;
    },
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },
    changeTheme(themeId) {
      this.currentTheme = `theme-${themeId}`;
    },
    changeTemplate(templateId) {
      this.currentTemplate = templateId;
      this.applyTemplate(templateId);
    },
    applyTemplate(templateId) {
      const templates = {
        'modern-minimal': {
          colors: { left: '#3feee6', right: '#6366f1' },
          showImage: true,
          imageShape: 'round'
        },
        'classic-professional': {
          colors: { left: '#2c3e50', right: '#34495e' },
          showImage: true,
          imageShape: 'square'
        },
        'creative-bold': {
          colors: { left: '#e74c3c', right: '#f39c12' },
          showImage: true,
          imageShape: 'round'
        },
        'clean-minimal': {
          colors: { left: '#95a5a6', right: '#7f8c8d' },
          showImage: false,
          imageShape: 'round'
        }
      };

      const template = templates[templateId];
      if (template) {
        this.colors.left.highlight = template.colors.left;
        this.colors.right.highlight = template.colors.right;
        this.showImage = template.showImage;
        this.imageShape = template.imageShape;
      }
    },
    applyVariation(variation) {
      // Apply the generated variation to the current resume
      Object.assign(this, variation);
    },
    editField(event, field) {
      if (field === 'contact') {
        this.contact[event.target.dataset.field] = event.target.innerText;
      } else {
        this[field] = event.target.innerText;
      }
    },
    editSkill(event, index) {
      this.skills[index] = event.target.innerText;
    },
    addSkill() {
      this.skills.push('New Skill');
    },
    removeSkill() {
      if (this.skills.length > 0) {
        this.skills.pop();
      }
    },
    editHighlight(event, index) {
      this.highlights[index] = event.target.innerText;
    },
    addHighlight() {
      this.highlights.push('New Certification');
    },
    removeHighlight() {
      if (this.highlights.length > 0) {
        this.highlights.pop();
      }
    },
    editExperience(event, index, field) {
      this.experience[index][field] = event.target.innerText;
    },
    editExperienceDesc(event, expIndex, descIndex) {
      this.experience[expIndex].description[descIndex] = event.target.innerText;
    },
    addExperience() {
      this.experience.push({
        title: 'Job Title',
        company: 'Company Name',
        location: 'Location',
        date: 'Start - End',
        description: ['Job description and achievements']
      });
    },
    removeExperience() {
      if (this.experience.length > 0) {
        this.experience.pop();
      }
    },
    editEducation(event, index, field) {
      this.education[index][field] = event.target.innerText;
    },
    editEducationDesc(event, eduIndex, descIndex) {
      this.education[eduIndex].description[descIndex] = event.target.innerText;
    },
    addEducation() {
      this.education.push({
        title: 'Degree',
        university: 'University Name',
        location: 'Location',
        date: 'Start - End',
        description: ['Relevant coursework or achievements']
      });
    },
    removeEducation() {
      if (this.education.length > 0) {
        this.education.pop();
      }
    },
    saveData() {
      try {
        const dataToSave = {
          ...this.resumeData,
          currentTheme: this.currentTheme,
          currentTemplate: this.currentTemplate,
          resumeFormat: this.resumeFormat,
          editing: this.editing
        };
        localStorage.setItem('resumeData', JSON.stringify(dataToSave));
      } catch (error) {
        console.error('Error saving data:', error);
      }
    },
    loadData() {
      try {
        const savedData = localStorage.getItem('resumeData');
        if (savedData) {
          const data = JSON.parse(savedData);
          Object.assign(this, data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    },
    downloadData() {
      try {
        const dataToDownload = {
          ...this.resumeData,
          currentTheme: this.currentTheme,
          currentTemplate: this.currentTemplate,
          resumeFormat: this.resumeFormat
        };
        
        const dataStr = JSON.stringify(dataToDownload, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `resume-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading data:', error);
        alert('Failed to download data. Please try again.');
      }
    },
    uploadData(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);
            Object.assign(this, data);
            alert('Data uploaded successfully!');
          } catch (error) {
            console.error('Error parsing uploaded data:', error);
            alert('Invalid JSON file. Please check your file and try again.');
          }
        };
        reader.readAsText(file);
      }
    }
  }
};
</script>

<style>
.app-container {
  display: flex;
  min-height: 100vh;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--dark-border);
}

.home-button,
.collapse-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--dark-bg-tertiary);
  border: 1px solid var(--dark-border);
  border-radius: 8px;
  color: var(--dark-text-secondary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.home-button:hover,
.collapse-button:hover {
  background: var(--dark-bg-quaternary);
  color: var(--dark-text-primary);
  border-color: var(--dark-accent);
}

.home-button svg,
.collapse-button svg {
  width: 16px;
  height: 16px;
}

.collapse-button {
  padding: 10px;
}

.main-content {
  flex: 1;
  margin-left: 340px;
  padding: 40px;
  transition: margin-left 0.3s ease;
  background: var(--dark-bg-primary);
}

.main-content.sidebar-collapsed {
  margin-left: 80px;
}

.ai-section {
  max-width: 1000px;
  margin: 0 auto 40px auto;
}

.resume-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.resume {
  width: 210mm;
  min-height: 297mm;
  background: white;
  color: #333;
  display: grid;
  grid-template-columns: 1fr 2fr;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.left-col {
  background: var(--highlight-color-left);
  color: white;
  padding: 40px 36px;
  position: relative;
}

.left-col::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%);
  pointer-events: none;
}

.left-col > * {
  position: relative;
  z-index: 2;
}

.right-col {
  padding: 40px 36px;
  background: white;
  color: #333;
}

.resume-header {
  margin-bottom: 32px;
  text-align: center;
  padding-bottom: 24px;
  border-bottom: 3px solid var(--highlight-color-right);
  position: relative;
}

.resume-header::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: var(--highlight-color-left);
}

.name {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 12px 0;
  color: var(--highlight-color-right);
  letter-spacing: -1px;
  text-transform: uppercase;
}

.title {
  font-size: 1.25rem;
  font-weight: 400;
  margin: 0;
  color: #666;
  font-style: italic;
  letter-spacing: 0.5px;
}

.intro-text {
  font-size: 15px;
  line-height: 1.7;
  color: #555;
  text-align: justify;
}

.skills,
.highlights {
  list-style: none;
  padding: 0;
  margin: 0;
}

.skills li,
.highlights li {
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.skills li:hover,
.highlights li:hover {
  padding-left: 8px;
  border-bottom-color: rgba(255, 255, 255, 0.4);
}

.skills li:last-child,
.highlights li:last-child {
  border-bottom: none;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 24px 0;
  color: var(--dark-text-primary);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.section-title svg {
  margin-right: 12px;
  color: var(--dark-accent);
}

.file-upload-wrapper {
  display: block;
  margin-top: 12px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
    padding: 20px;
  }
  
  .main-content.sidebar-collapsed {
    margin-left: 0;
  }
  
  .resume {
    width: 100%;
    max-width: 800px;
    min-height: auto;
    grid-template-columns: 1fr;
  }
  
  .left-col {
    order: 2;
  }
  
  .right-col {
    order: 1;
  }
}

@media (max-width: 768px) {
  .ai-section {
    margin-bottom: 20px;
  }
  
  .resume {
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
  
  .left-col,
  .right-col {
    padding: 24px 20px;
  }
  
  .name {
    font-size: 2rem;
  }
  
  .title {
    font-size: 1.1rem;
  }
}
</style>