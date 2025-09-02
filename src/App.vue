<template>
  <div class="container" :class="{ 'edit-off': !editing }">
    <!-- Sidebar -->
    <Sidebar :collapsed="sidebarCollapsed">
      <!-- Template Selection -->
      <div class="sidebar-section">
        <TemplateSelector 
          :currentTemplate="currentTemplate"
          @template-changed="applyTemplate"
        />
      </div>

      <!-- Theme Selection -->
      <div class="sidebar-section">
        <ThemeSelector 
          :currentTheme="currentTheme"
          @theme-changed="changeTheme"
        />
      </div>

      <!-- Edit Mode Toggle -->
      <div class="sidebar-section">
        <ToggleSwitch 
          label="Edit Mode" 
          :toggleActive="editing" 
          @switchToggled="editing = $event"
        />
      </div>

      <!-- Image Settings -->
      <div class="sidebar-section" v-if="showImageSettings">
        <h3 class="section-title">Profile Image</h3>
        <ToggleSwitch 
          label="Show Image" 
          :toggleActive="showImage" 
          @switchToggled="showImage = $event"
        />
        <div v-if="showImage">
          <ImgUpload @imageChanged="imageUrl = $event" />
          <SelectInput 
            label="Image Shape"
            :options="imageShapeOptions"
            :defaultOption="imageShape"
            @updateSelection="imageShape = $event"
          />
        </div>
      </div>

      <!-- Color Customization -->
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

      <!-- Export Options -->
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

      <!-- Data Management -->
      <div class="sidebar-section">
        <h3 class="section-title">Data</h3>
        <CustomButton @click="downloadData" btn-type="secondary">
          Download JSON
        </CustomButton>
        <label class="file-upload-label">
          <input type="file" accept=".json" @change="uploadData" style="display: none;">
          <CustomButton btn-type="secondary">Upload JSON</CustomButton>
        </label>
      </div>

      <!-- AI Features -->
      <div class="sidebar-section">
        <h3 class="section-title">AI Tools</h3>
        <AIAnalysis :resumeData="resumeData" />
        <ResumeVariations 
          :resumeData="resumeData" 
          @apply-variation="applyVariation"
        />
      </div>
    </Sidebar>

    <!-- Main Resume Content -->
    <div class="main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <div id="resume" class="resume-container" :class="currentTemplate">
        <!-- Resume content based on template -->
        <div v-if="currentTemplate === 'modern-minimal'" class="modern-minimal-layout">
          <!-- Left Column -->
          <div class="left-col">
            <ProfilePic 
              :url="imageUrl" 
              :show="showImage" 
              :shape="imageShape"
            />
            
            <div 
              class="name"
              :contenteditable="editing"
              @blur="editField($event, 'name')"
            >
              {{ name }}
            </div>
            
            <div 
              class="title"
              :contenteditable="editing"
              @blur="editField($event, 'title')"
            >
              {{ title }}
            </div>

            <div 
              class="intro-text"
              :contenteditable="editing"
              @blur="editField($event, 'introText')"
            >
              {{ introText }}
            </div>

            <!-- Contact Section -->
            <ResumeSection>
              <SectionHeadline 
                headline="Contact" 
                :editing="editing"
                @headlineEdited="editHeadline($event, 'contact')"
              />
              <Contact 
                :contact="contact" 
                :editing="editing" 
                :iconColor="colors.left.highlight"
                @edit="editContactField"
              />
            </ResumeSection>

            <!-- Skills Section -->
            <ResumeSection>
              <SectionHeadline 
                headline="Skills" 
                :editing="editing"
                @headlineEdited="editHeadline($event, 'skills')"
              />
              <ul class="skills-list">
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
                textAdd="Add Skill"
                textRemove="Remove Skill"
              />
            </ResumeSection>

            <!-- Certifications Section -->
            <ResumeSection>
              <SectionHeadline 
                headline="Certifications" 
                :editing="editing"
                @headlineEdited="editHeadline($event, 'highlights')"
              />
              <ul class="highlights-list">
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
                textAdd="Add Certification"
                textRemove="Remove Certification"
              />
            </ResumeSection>
          </div>

          <!-- Right Column -->
          <div class="right-col">
            <!-- Experience Section -->
            <ResumeSection>
              <SectionHeadline 
                headline="Experience" 
                :editing="editing"
                @headlineEdited="editHeadline($event, 'experience')"
              />
              <ResumeEntry
                v-for="(exp, index) in experience"
                :key="index"
                :item="exp"
                :editing="editing"
                @edit="editExperienceField($event, index, $event)"
                @editDesc="editExperienceDescription($event, index, $event)"
              />
              <EditButtons 
                v-if="editing"
                @addClick="addExperience"
                @removeClick="removeExperience"
                textAdd="Add Experience"
                textRemove="Remove Experience"
                btnAlign="left"
              />
            </ResumeSection>

            <!-- Education Section -->
            <ResumeSection>
              <SectionHeadline 
                headline="Education" 
                :editing="editing"
                @headlineEdited="editHeadline($event, 'education')"
              />
              <ResumeEntry
                v-for="(edu, index) in education"
                :key="index"
                :item="edu"
                :editing="editing"
                @edit="editEducationField($event, index, $event)"
                @editDesc="editEducationDescription($event, index, $event)"
              />
              <EditButtons 
                v-if="editing"
                @addClick="addEducation"
                @removeClick="removeEducation"
                textAdd="Add Education"
                textRemove="Remove Education"
                btnAlign="left"
              />
            </ResumeSection>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap';

// Components
import Sidebar from './components/Sidebar.vue';
import TemplateSelector from './components/TemplateSelector.vue';
import ThemeSelector from './components/ThemeSelector.vue';
import ToggleSwitch from './components/ToggleSwitch.vue';
import ImgUpload from './components/ImgUpload.vue';
import SelectInput from './components/SelectInput.vue';
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
  components: {
    Sidebar,
    TemplateSelector,
    ThemeSelector,
    ToggleSwitch,
    ImgUpload,
    SelectInput,
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
      editing: false,
      sidebarCollapsed: false,
      currentTemplate: 'modern-minimal',
      currentTheme: 'dark-neon',
      
      // Resume data
      name: "Jane Doe",
      title: "Senior Data Scientist",
      introText: "Experienced data scientist with expertise in machine learning, statistical analysis, and data visualization. Passionate about turning complex data into actionable insights.",
      
      imageUrl: "/profile_pic.jpg",
      showImage: true,
      imageShape: "round",
      
      colors: {
        left: { highlight: "#3feee6" },
        right: { highlight: "#6366f1" }
      },
      
      contact: {
        phone: "+1 (555) 123-4567",
        email: "jane.doe@email.com",
        address: "San Francisco, CA"
      },
      
      skills: [
        "Python", "R", "SQL", "Machine Learning", "Deep Learning",
        "Data Visualization", "Statistical Analysis", "TensorFlow",
        "Pandas", "Scikit-learn", "Tableau", "Power BI"
      ],
      
      highlights: [
        "AWS Certified Machine Learning Specialist",
        "Google Analytics Certified",
        "Certified Data Management Professional (CDMP)"
      ],
      
      experience: [
        {
          title: "Senior Data Scientist",
          company: "TechCorp Inc.",
          location: "San Francisco, CA",
          date: "2021 - Present",
          description: [
            "Led a team of 5 data scientists in developing machine learning models for customer segmentation",
            "Developed and deployed a recommendation system that boosted cross-selling by 20%",
            "Conducted statistical analysis on large datasets to identify business opportunities"
          ]
        },
        {
          title: "Data Analyst",
          company: "DataSolutions LLC",
          location: "San Francisco, CA", 
          date: "2019 - 2021",
          description: [
            "Built automated reporting dashboards using Python and SQL",
            "Performed A/B testing analysis for product optimization",
            "Collaborated with cross-functional teams to define KPIs and metrics"
          ]
        }
      ],
      
      education: [
        {
          title: "Master of Science in Data Science",
          university: "Stanford University",
          location: "Stanford, CA",
          date: "2017 - 2019",
          description: [
            "Specialized in machine learning and statistical modeling",
            "Thesis: 'Deep Learning Applications in Natural Language Processing'"
          ]
        },
        {
          title: "Bachelor of Science in Computer Science",
          university: "UC Berkeley",
          location: "Berkeley, CA",
          date: "2013 - 2017",
          description: [
            "Graduated Magna Cum Laude",
            "Relevant coursework: Algorithms, Data Structures, Statistics"
          ]
        }
      ],
      
      resumeFormat: "a4",
      
      // Options
      imageShapeOptions: [
        { name: "Round", value: "round" },
        { name: "Square", value: "square" }
      ],
      
      paperFormatOptions: [
        { name: "A4", value: "a4" },
        { name: "US Letter", value: "letter" }
      ]
    };
  },
  computed: {
    resumeData() {
      return {
        name: this.name,
        title: this.title,
        introText: this.introText,
        imageUrl: this.imageUrl,
        showImage: this.showImage,
        contact: this.contact,
        skills: this.skills,
        highlights: this.highlights,
        experience: this.experience,
        education: this.education,
        colors: this.colors
      };
    },
    showImageSettings() {
      return ['modern-minimal', 'classic-professional', 'creative-bold'].includes(this.currentTemplate);
    }
  },
  watch: {
    colors: {
      handler() {
        this.updateCSSVariables();
      },
      deep: true
    },
    currentTheme() {
      this.applyTheme();
    }
  },
  methods: {
    initAppAnimations() {
      // Animate main content entrance
      gsap.fromTo('.main-content',
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.3 }
      );
    },
    
    // Template methods
    applyTemplate(templateId) {
      this.currentTemplate = templateId;
      
      // Apply template-specific settings
      const templates = {
        'modern-minimal': {
          colors: { left: { highlight: '#3feee6' }, right: { highlight: '#6366f1' } },
          showImage: true,
          imageShape: 'round'
        },
        'classic-professional': {
          colors: { left: { highlight: '#2c3e50' }, right: { highlight: '#34495e' } },
          showImage: true,
          imageShape: 'square'
        },
        'creative-bold': {
          colors: { left: { highlight: '#e74c3c' }, right: { highlight: '#f39c12' } },
          showImage: true,
          imageShape: 'round'
        },
        'clean-minimal': {
          colors: { left: { highlight: '#95a5a6' }, right: { highlight: '#7f8c8d' } },
          showImage: false,
          imageShape: 'round'
        }
      };
      
      if (templates[templateId]) {
        Object.assign(this, templates[templateId]);
      }
      
      this.saveData();
    },
    
    // Theme methods
    changeTheme(themeId) {
      this.currentTheme = themeId;
      this.applyTheme();
    },
    
    applyTheme() {
      const themes = {
        'dark-neon': {
          '--dark-bg-primary': '#0f0f23',
          '--dark-bg-secondary': '#16213e',
          '--dark-accent': '#6366f1'
        },
        'minimal-light': {
          '--dark-bg-primary': '#ffffff',
          '--dark-bg-secondary': '#f8fafc',
          '--dark-accent': '#3b82f6'
        }
      };
      
      if (themes[this.currentTheme]) {
        Object.entries(themes[this.currentTheme]).forEach(([property, value]) => {
          document.documentElement.style.setProperty(property, value);
        });
      }
    },
    
    // Variation methods
    applyVariation(variation) {
      Object.assign(this, variation);
      this.saveData();
    },
    
    // Edit methods
    editField(event, field) {
      this[field] = event.target.innerText;
      this.saveData();
    },
    
    editContactField(event, section, field) {
      this[section][field] = event.target.innerText;
      this.saveData();
    },
    
    editHeadline(newText, section) {
      // Handle headline editing if needed
      this.saveData();
    },
    
    editSkill(event, index) {
      this.skills[index] = event.target.innerText;
      this.saveData();
    },
    
    editHighlight(event, index) {
      this.highlights[index] = event.target.innerText;
      this.saveData();
    },
    
    editExperienceField(event, index, field) {
      this.experience[index][field] = event.target.innerText;
      this.saveData();
    },
    
    editExperienceDescription(event, expIndex, descIndex) {
      this.experience[expIndex].description[descIndex] = event.target.innerText;
      this.saveData();
    },
    
    editEducationField(event, index, field) {
      this.education[index][field] = event.target.innerText;
      this.saveData();
    },
    
    editEducationDescription(event, eduIndex, descIndex) {
      this.education[eduIndex].description[descIndex] = event.target.innerText;
      this.saveData();
    },
    
    // Add/Remove methods
    addSkill() {
      this.skills.push("New Skill");
      this.saveData();
    },
    
    removeSkill() {
      if (this.skills.length > 0) {
        this.skills.pop();
        this.saveData();
      }
    },
    
    addHighlight() {
      this.highlights.push("New Certification");
      this.saveData();
    },
    
    removeHighlight() {
      if (this.highlights.length > 0) {
        this.highlights.pop();
        this.saveData();
      }
    },
    
    addExperience() {
      this.experience.push({
        title: "Job Title",
        company: "Company Name",
        location: "Location",
        date: "Start - End",
        description: ["Job description"]
      });
      this.saveData();
    },
    
    removeExperience() {
      if (this.experience.length > 0) {
        this.experience.pop();
        this.saveData();
      }
    },
    
    addEducation() {
      this.education.push({
        title: "Degree",
        university: "University Name",
        location: "Location",
        date: "Start - End",
        description: ["Education description"]
      });
      this.saveData();
    },
    
    removeEducation() {
      if (this.education.length > 0) {
        this.education.pop();
        this.saveData();
      }
    },
    
    // Data management
    saveData() {
      try {
        localStorage.setItem('resumeData', JSON.stringify(this.resumeData));
      } catch (error) {
        console.error('Error saving data:', error);
      }
    },
    
    loadData() {
      try {
        const saved = localStorage.getItem('resumeData');
        if (saved) {
          const data = JSON.parse(saved);
          Object.assign(this, data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    },
    
    downloadData() {
      const dataStr = JSON.stringify(this.resumeData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'resume-data.json';
      link.click();
      URL.revokeObjectURL(url);
    },
    
    uploadData(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);
            Object.assign(this, data);
            this.saveData();
          } catch (error) {
            alert('Invalid JSON file');
          }
        };
        reader.readAsText(file);
      }
    },
    
    updateCSSVariables() {
      document.documentElement.style.setProperty('--highlight-color-left', this.colors.left.highlight);
      document.documentElement.style.setProperty('--highlight-color-right', this.colors.right.highlight);
    }
  }
};
</script>

<style>
/* CSS Variables for dynamic colors */
:root {
  --highlight-color-left: #3feee6;
  --highlight-color-right: #6366f1;
}

.main-content {
  flex: 1;
  margin-left: 340px;
  padding: 40px;
  transition: margin-left 0.3s ease;
  min-height: 100vh;
}

.main-content.sidebar-collapsed {
  margin-left: 80px;
}

.resume-container {
  max-width: 1000px;
  margin: 0 auto;
  background: var(--glass-bg-primary);
  backdrop-filter: var(--blur-backdrop);
  border: 1px solid var(--dark-border-light);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
}

.resume-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--gradient-primary);
}

.modern-minimal-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  min-height: 800px;
}

.left-col {
  background: var(--gradient-secondary);
  padding: 40px 36px;
  border-right: 1px solid var(--dark-border-light);
  position: relative;
}

.left-col::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(180deg, var(--highlight-color-left) 0%, transparent 100%);
  opacity: 0.6;
}

.right-col {
  padding: 40px 36px;
  background: var(--dark-bg-primary);
}

.name {
  font-size: 28px;
  font-weight: 800;
  color: var(--dark-text-primary);
  margin-bottom: 12px;
  text-align: center;
  letter-spacing: -0.5px;
  transition: all 0.2s ease;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: var(--highlight-color-left);
  margin-bottom: 24px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.2s ease;
}

.intro-text {
  font-size: 14px;
  line-height: 1.7;
  color: var(--dark-text-secondary);
  margin-bottom: 32px;
  text-align: justify;
  transition: all 0.2s ease;
}

.skills-list,
.highlights-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.skills-list li,
.highlights-list li {
  background: rgba(255, 255, 255, 0.05);
  margin-bottom: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border-left: 3px solid var(--highlight-color-left);
  transition: all 0.3s ease;
  position: relative;
}

.skills-list li:hover,
.highlights-list li:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Responsive design */
@media (max-width: 1200px) {
  .main-content {
    margin-left: 0;
    padding: 20px;
  }
  
  .modern-minimal-layout {
    grid-template-columns: 1fr;
  }
  
  .left-col {
    border-right: none;
    border-bottom: 1px solid var(--dark-border-light);
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }
  
  .left-col,
  .right-col {
    padding: 24px;
  }
  
  .name {
    font-size: 24px;
  }
  
  .title {
    font-size: 14px;
  }
}

/* File upload styling */
.file-upload-label {
  display: block;
  margin-bottom: 14px;
}

.file-upload-label input {
  display: none;
}
</style>