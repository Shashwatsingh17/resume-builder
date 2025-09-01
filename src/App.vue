<template>
  <main class="app-container" ref="appContainer">
    <Sidebar>
      <ToggleSwitch
        @switch-toggled="toggleEditMode"
        label="Edit mode"
        off-label="Export mode"
        :toggle-active="editing" />

      <div class="sidebar-section fade-in" v-if="editing" ref="leftColorSection">
        <h3 class="section-title">Left Column Colors</h3>
        <ColorInput
          label="Highlight color"
          @color-changed="colors.left.highlight = $event"
          :default-color="colors.left.highlight" />

        <ColorInput
          label="Background color"
          @color-changed="colors.left.background = $event"
          :default-color="colors.left.background" />

        <ColorInput
          label="Text color"
          @color-changed="colors.left.text = $event"
          :default-color="colors.left.text" />
      </div>

      <div class="sidebar-section fade-in" v-if="editing" ref="rightColorSection">
        <h3 class="section-title">Right Column Colors</h3>
        <ColorInput
          label="Highlight color"
          @color-changed="colors.right.highlight = $event"
          :default-color="colors.right.highlight" />

        <ColorInput
          label="Background color"
          @color-changed="colors.right.background = $event"
          :default-color="colors.right.background" />

        <ColorInput
          label="Text color"
          @color-changed="colors.right.text = $event"
          :default-color="colors.right.text" />
      </div>

      <div class="sidebar-section fade-in" v-if="editing" ref="layoutSection">
        <h3 class="section-title">Layout Settings</h3>
        <SelectInput
          v-if="editing"
          label="Headline thickness"
          :options="[
            { name: 'Thin', value: '300' },
            { name: 'Medium', value: '400' },
            { name: 'Thick', value: '600' },
          ]"
          :default-option="headlineWeight"
          @update-selection="headlineWeight = $event" />

        <PercentageInput
          v-if="editing"
          label="Width left column"
          :min="20"
          :max="80"
          :current-value="widthLeft"
          @percentage-changed="widthLeft = $event" />
      </div>

      <div class="sidebar-section fade-in" v-if="editing" ref="photoSection">
        <h3 class="section-title">Profile Photo</h3>
        <ToggleSwitch
          @switch-toggled="toggleImageDisplay"
          label="Show photo"
          :toggle-active="showImage" />

        <CustomButton v-if="showImage">
          <ImgUpload @image-changed="imageUrl = $event" />
        </CustomButton>

        <SelectInput
          v-if="showImage"
          label="Photo shape"
          :options="[
            { name: 'Square', value: 'square' },
            { name: 'Round', value: 'round' },
          ]"
          :default-option="imageShape"
          @update-selection="imageShape = $event" />
      </div>

      <div class="sidebar-section fade-in" v-if="!editing" ref="exportSection">
        <h3 class="section-title">Export Options</h3>
        <SelectInput
          label="Resume format"
          :options="[
            { name: 'DIN A4', value: 'a4' },
            { name: 'Letter', value: 'letter' },
          ]"
          :default-option="resumeFormat"
          @update-selection="resumeFormat = $event" />

        <ExportPdf :resume-format="resumeFormat" />
      </div>

      <div class="sidebar-section fade-in" v-if="!editing" ref="configSection">
        <h3 class="section-title">Configuration</h3>
        <p class="section-description">
          A file with your configuration will be downloaded to your computer.
          You can upload it whenever you want to restore your settings.
        </p>

        <CustomButton @click="downloadConfig" btn-type="secondary">
          Download configuration
        </CustomButton>

        <CustomButton>
          <label>
            Upload configuration
            <input type="file" accept=".json" @change="uploadConfig" />
          </label>
        </CustomButton>
      </div>
    </Sidebar>

    <div class="resume-wrapper" ref="resumeWrapper">
      <div class="resume-header" ref="resumeHeader">
        <h1 class="app-title gradient-text">Resume Builder</h1>
        <CustomButton @click="saveConfig" btn-type="primary-right">
          <svg class="save-icon" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6a1 1 0 10-2 0v5.586l-1.293-1.293z"/>
            <path d="M5 3a2 2 0 00-2 2v1a1 1 0 002 0V5a1 1 0 011-1h8a1 1 0 011 1v1a1 1 0 102 0V5a2 2 0 00-2-2H5zM5 15a2 2 0 01-2-2v-1a1 1 0 012 0v1a1 1 0 001 1h8a1 1 0 001-1v-1a1 1 0 112 0v1a2 2 0 01-2 2H5z"/>
          </svg>
          Save Configuration
        </CustomButton>
      </div>

      <AIAnalysis :resume-data="$data" v-if="!editing" ref="aiAnalysis" />

      <ResumeVariations 
        :resume-data="$data" 
        @apply-variation="applyVariation"
        v-if="!editing" 
        ref="resumeVariations" />

      <div
        id="resume"
        class="d-flex resume-container"
        ref="resumeContainer"
        :class="{
          'edit-off': !editing,
          'letter-format': resumeFormat == 'letter',
        }"
        :style="cssVariables">
        <div class="left-col" :style="{ width: percentageWidthLeft }" ref="leftCol">
          <ProfilePic :url="imageUrl" :shape="imageShape" :show="showImage" ref="profilePic" />

          <ResumeSection ref="aboutSection">
            <SectionHeadline
              :headline="headlines[0]"
              :editing="editing"
              @headline-edited="updateHeadline($event, 0)" />
            <p
              :contenteditable="editing"
              @blur="updateProperty($event, 'introText')">
              {{ introText }}
            </p>
          </ResumeSection>

          <ResumeSection ref="contactSection">
            <SectionHeadline
              :headline="headlines[1]"
              :editing="editing"
              @headline-edited="updateHeadline($event, 1)" />
            <Contact
              :contact="contact"
              :editing="editing"
              :icon-color="colors.left.highlight"
              @edit="updateNestedProperty" />
          </ResumeSection>

          <ResumeSection ref="skillsSection">
            <SectionHeadline
              :headline="headlines[2]"
              :editing="editing"
              @headline-edited="updateHeadline($event, 2)" />
            <ul>
              <li
                v-for="(skill, index) in skills"
                :key="index"
                :contenteditable="editing"
                @blur="updateNestedProperty($event, 'skills', index)">
                {{ skill }}
              </li>
            </ul>
            <EditButtons
              @add-click="skills.push('new entry')"
              @remove-click="skills.pop()"
              :show-remove-btn="skills.length > 0" />
          </ResumeSection>

          <ResumeSection ref="certificationsSection">
            <SectionHeadline
              :headline="headlines[3]"
              :editing="editing"
              @headline-edited="updateHeadline($event, 3)" />
            <ul>
              <li
                v-for="(highlight, index) in highlights"
                :key="index"
                :contenteditable="editing"
                @blur="updateNestedProperty($event, 'highlights', index)">
                {{ highlight }}
              </li>
            </ul>
            <EditButtons
              @add-click="highlights.push('new entry')"
              @remove-click="highlights.pop()"
              :show-remove-btn="highlights.length > 0" />
          </ResumeSection>
        </div>

        <div class="right-col" ref="rightCol">
          <div
            class="personal-name"
            ref="personalName"
            :contenteditable="editing"
            @blur="updateProperty($event, 'name')">
            {{ name }}
          </div>
          <div
            class="personal-title"
            ref="personalTitle"
            :contenteditable="editing"
            @blur="updateProperty($event, 'title')">
            {{ title }}
          </div>

          <ResumeSection ref="experienceSection">
            <div class="d-flex">
              <SectionHeadline
                :headline="headlines[4]"
                :editing="editing"
                @headline-edited="updateHeadline($event, 4)" />
              <EditButtons
                @add-click="addExperience"
                :show-remove-btn="false"
                text-add="Add experience" />
            </div>

            <div v-for="(item, index) in experience" :key="index">
              <EditButtons
                @remove-click="removeExperience(index)"
                :show-add-btn="false"
                btn-align="right"
                move-down="true" />
              <ResumeEntry
                :item="item"
                :editing="editing"
                @edit="($event, key) => updateExperience($event, key, index)"
                @edit-desc="
                  ($event, innerIndex) =>
                    updateExperienceDescription($event, index, innerIndex)
                " />

              <EditButtons
                @add-click="addDescriptionItem('experience', index)"
                @remove-click="removeDescriptionItem('experience', index)"
                :show-remove-btn="experience[index].description.length > 0" />
            </div>
          </ResumeSection>

          <ResumeSection ref="educationSection">
            <div class="d-flex">
              <SectionHeadline
                :headline="headlines[5]"
                :editing="editing"
                @headline-edited="updateHeadline($event, 5)" />
              <EditButtons
                @add-click="addEducation"
                :show-remove-btn="false"
                text-add="Add education" />
            </div>

            <div v-for="(item, index) in education" :key="index">
              <EditButtons
                @remove-click="removeEducation(index)"
                :show-add-btn="false"
                btn-align="right"
                move-down="true" />
              <ResumeEntry
                :item="item"
                :editing="editing"
                @edit="($event, key) => updateEducation($event, key, index)"
                @edit-desc="
                  ($event, innerIndex) =>
                    updateEducationDescription($event, index, innerIndex)
                " />

              <EditButtons
                @add-click="addDescriptionItem('education', index)"
                @remove-click="removeDescriptionItem('education', index)"
                :show-remove-btn="education[index].description.length > 0" />
            </div>
          </ResumeSection>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ResumeSection from "./components/ResumeSection.vue";
import SectionHeadline from "./components/SectionHeadline.vue";
import EditButtons from "./components/EditButtons.vue";
import ToggleSwitch from "./components/ToggleSwitch.vue";
import ProfilePic from "./components/ProfilePic.vue";
import Contact from "./components/Contact.vue";
import ColorInput from "./components/ColorInput.vue";
import PercentageInput from "./components/PercentageInput.vue";
import SelectInput from "./components/SelectInput.vue";
import Sidebar from "./components/Sidebar.vue";
import ImgUpload from "./components/ImgUpload.vue";
import CustomButton from "./components/CustomButton.vue";
import ResumeEntry from "./components/ResumeEntry.vue";
import ExportPdf from "./components/ExportPdf.vue";
import AIAnalysis from "./components/AIAnalysis.vue";
import ResumeVariations from "./components/ResumeVariations.vue";

gsap.registerPlugin(ScrollTrigger);

export default {
  mounted() {
    this.initAnimations();
  },
  created() {
    const savedResume = localStorage.getItem("resume");
    if (savedResume) {
      try {
        const resume = JSON.parse(savedResume);
        this.loadIntoData(resume);
      } catch (error) {
        console.error("Error parsing resume data:", error);
      }
    }
  },
  updated() {
    // Re-initialize animations when editing mode changes
    this.$nextTick(() => {
      this.initAnimations();
    });
  },
  components: {
    ResumeSection,
    SectionHeadline,
    EditButtons,
    ToggleSwitch,
    ProfilePic,
    Contact,
    ColorInput,
    PercentageInput,
    SelectInput,
    Sidebar,
    ImgUpload,
    CustomButton,
    ResumeEntry,
    ExportPdf,
    AIAnalysis,
    ResumeVariations,
  },
  data() {
    return {
      editing: true,
      colors: {
        left: {
          highlight: "#6366f1",
          text: "#ffffff",
          background: "#1e293b",
        },
        right: {
          highlight: "#6366f1",
          text: "#1e293b",
          background: "#ffffff",
        },
      },
      showImage: true,
      imageShape: "round",
      resumeFormat: "a4",
      headlineWeight: "400",
      name: "Michaela Scarn",
      widthLeft: 30,
      title: "Senior Data Scientist",
      introText:
        "From data cleaning to data analysis to machine learning, I am passionate about everything data.",
      imageUrl: "profile_pic.jpg",
      contact: {
        phone: "15713909584",
        email: "contact@gmail.com",
        address: "Main St 100, 19777 NY",
      },
      headlines: [
        "About me",
        "Contact",
        "Skills",
        "Certifications",
        "Experience",
        "Education",
      ],
      skills: [
        "Python",
        "Pandas",
        "SQL",
        "R",
        "AI",
        "C++",
        "Machine Learning",
        "Hadoop",
        "TensorFlow",
        "PyTorch",
        "NLP",
      ],
      highlights: [
        "Natural Language Processing with Python (Coursera)",
        "Recommendation Systems with TensorFlow on GCP (Google)",
      ],
      experience: [
        {
          title: "Senior Data Scientist",
          company: "ABC Analytics Inc.",
          location: "London",
          date: "2022 - Present",
          description: [
            "Led a team of data scientists in developing advanced machine learning models for predictive analytics",
            "Designed and implemented a recommendation system that boosted cross-selling, leading to a 20% increase in revenue",
            "Conducted A/B testing and statistical analysis to optimize product features",
          ],
        },
        {
          title: "Data Scientist",
          company: "XYZ Data Solutions",
          location: "London",
          date: "2017 - 2019",
          description: [
            "Developed and deployed machine learning models for fraud detection, reducing fraudulent transactions by 18%",
            "Conducted in-depth exploratory data analysis to identify key trends and insights",
            "Worked on data preprocessing, feature engineering, and model selection to improve model performance",
          ],
        },
        {
          title: "Data Scientist Trainee",
          company: "Data Insights Ltd.",
          location: "New York City",
          date: "2016-2017",
          description: [
            "Collaborated with external partners to integrate third-party data sources, expanding the company's data assets and enhancing predictive modeling capabilities.",
            "Presented data-driven insights and recommendations to executive leadership, influencing strategic decisions and driving revenue growth.",
          ],
        },
      ],
      education: [
        {
          title: "Master of Science in Data Science",
          university: "StellarTech University",
          location: "Starville",
          date: "2020-2022",
          description: [
            "Coursework included advanced machine learning, statistical modeling, and data visualization techniques.",
            "Thesis: 'Predictive Modeling for Customer Churn in E-commerce using Random Forest.'",
          ],
        },
        {
          title: "Bachelor of Science in Computer Science",
          university: "Evergreen State University",
          location: "Springdale",
          date: "2012-2015",
          description: [
            "Relevant coursework in database management, algorithms, and programming languages.",
            "Senior project: 'Development of a Recommender System for Movie Ratings.'",
          ],
        },
      ],
    };
  },
  computed: {
    cssVariables() {
      return {
        "--highlight-color-left": this.colors.left.highlight,
        "--background-color-left": this.colors.left.background,
        "--text-color-left": this.colors.left.text,
        "--highlight-color-right": this.colors.right.highlight,
        "--background-color-right": this.colors.right.background,
        "--text-color-right": this.colors.right.text,
        "--headline-weight": this.headlineWeight,
      };
    },
    percentageWidthLeft() {
      return this.widthLeft + "%";
    },
  },
  methods: {
    updateProperty(event, key) {
      this[key] = event.target.innerText;
    },
    updateHeadline(newValue, index) {
      this.headlines[index] = newValue;
    },
    updateNestedProperty(event, key1, key2) {
      this[key1][key2] = event.target.innerText;
    },
    updateExperience(event, key, index) {
      this.experience[index][key] = event.target.innerText;
    },
    updateExperienceDescription(event, index1, index2) {
      this.experience[index1]["description"][index2] = event.target.innerText;
    },
    updateEducation(event, key, index) {
      this.education[index][key] = event.target.innerText;
    },
    updateEducationDescription(event, index1, index2) {
      this.education[index1]["description"][index2] = event.target.innerText;
    },
    addDescriptionItem(key, index) {
      this[key][index].description.push("new entry");
    },
    removeDescriptionItem(key, index) {
      this[key][index].description.pop();
    },
    addExperience() {
      this.experience.unshift({
        title: "Job Title",
        company: "Company",
        location: "Location",
        date: "date range",
        description: ["description"],
      });
    },
    addEducation() {
      this.education.unshift({
        title: "Education title",
        university: "University",
        location: "Location",
        date: "date range",
        description: ["Summa cum laude, GPA 1.0"],
      });
    },
    removeExperience(index) {
      this.experience.splice(index, 1);
    },
    removeEducation(index) {
      this.education.splice(index, 1);
    },
    toggleEditMode(isChecked) {
      this.editing = isChecked;
    },
    toggleImageDisplay(isChecked) {
      this.showImage = isChecked;
    },
    downloadConfig() {
      const config = JSON.stringify(this.$data);
      // Create a Blob with the JSON content
      const blob = new Blob([config], { type: "application/json" });

      // Create an anchor element for download
      const a = document.createElement("a");
      a.download = "resume_configuration.json";
      a.href = window.URL.createObjectURL(blob);

      // Trigger a click event to initiate the download
      a.dispatchEvent(new MouseEvent("click"));
    },
    uploadConfig(event) {
      const selectedFile = event.target.files[0];
      if (!selectedFile) {
        return;
      }
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        try {
          const config = JSON.parse(reader.result);
          this.loadIntoData(config);
          // save in localStorage otherwise will be overwritten when created hook runs
          localStorage.setItem("resume", JSON.stringify(this.$data));
        } catch (error) {
          console.error("Error parsing resume data:", error);
        }
      });
      reader.readAsText(selectedFile);
    },
    loadIntoData(config) {
      for (const key in config) {
        if (this.$data.hasOwnProperty(key)) {
          this[key] = config[key];
        }
      }
    },
    saveConfig() {
      localStorage.setItem("resume", JSON.stringify(this.$data));
      const message = `Your resume configuration was saved to your browser's local storage. You can close and reopen the browser and your configuration will be there. This does not work across browsers or in incognito mode. If those cases apply to you, activate export mode in the sidebar and use the download and reupload buttons there instead.`;
      window.alert(message);
    },
    applyVariation(variationData) {
      // Apply the variation to the current resume
      this.loadIntoData(variationData);
      
      // Save to localStorage
      localStorage.setItem("resume", JSON.stringify(this.$data));
      
      // Show confirmation
      const message = "Resume variation has been applied successfully! Your resume has been updated with the new optimizations.";
      window.alert(message);
    },
    initAnimations() {
      // Clear previous animations
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      // Animate app container on load
      gsap.fromTo(this.$refs.appContainer, 
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power2.out" }
      );

      // Animate resume header
      if (this.$refs.resumeHeader) {
        gsap.fromTo(this.$refs.resumeHeader,
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power2.out" }
        );
      }

      // Animate resume container
      if (this.$refs.resumeContainer) {
        gsap.fromTo(this.$refs.resumeContainer,
          { scale: 0.95, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 1, delay: 0.4, ease: "power2.out" }
        );
      }

      // Animate sidebar sections
      const sidebarSections = [
        this.$refs.leftColorSection,
        this.$refs.rightColorSection,
        this.$refs.layoutSection,
        this.$refs.photoSection,
        this.$refs.exportSection,
        this.$refs.configSection
      ].filter(Boolean);

      sidebarSections.forEach((section, index) => {
        gsap.fromTo(section,
          { x: -50, opacity: 0 },
          { 
            x: 0, 
            opacity: 1, 
            duration: 0.6, 
            delay: 0.1 * index, 
            ease: "power2.out" 
          }
        );
      });

      // Animate resume sections
      const resumeSections = [
        this.$refs.aboutSection?.$el,
        this.$refs.contactSection?.$el,
        this.$refs.skillsSection?.$el,
        this.$refs.certificationsSection?.$el,
        this.$refs.experienceSection?.$el,
        this.$refs.educationSection?.$el
      ].filter(Boolean);

      resumeSections.forEach((section, index) => {
        gsap.fromTo(section,
          { y: 30, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.6, 
            delay: 0.6 + (0.1 * index), 
            ease: "power2.out" 
          }
        );
      });

      // Animate personal info
      if (this.$refs.personalName) {
        gsap.fromTo(this.$refs.personalName,
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, delay: 0.8, ease: "power2.out" }
        );
      }

      if (this.$refs.personalTitle) {
        gsap.fromTo(this.$refs.personalTitle,
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, delay: 0.9, ease: "power2.out" }
        );
      }

      // Animate profile picture
      if (this.$refs.profilePic?.$el) {
        gsap.fromTo(this.$refs.profilePic.$el,
          { scale: 0, rotation: -180 },
          { scale: 1, rotation: 0, duration: 1, delay: 1, ease: "back.out(1.7)" }
        );
      }

      // Animate AI Analysis and Resume Variations
      if (this.$refs.aiAnalysis?.$el) {
        gsap.fromTo(this.$refs.aiAnalysis.$el,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: "power2.out" }
        );
      }

      if (this.$refs.resumeVariations?.$el) {
        gsap.fromTo(this.$refs.resumeVariations.$el,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: "power2.out" }
        );
      }

      // Add hover animations for interactive elements
      this.addHoverAnimations();
    },
    addHoverAnimations() {
      // Add hover effects to buttons
      const buttons = this.$el.querySelectorAll('.btn');
      buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
          gsap.to(button, { scale: 1.05, duration: 0.2, ease: "power2.out" });
        });
        button.addEventListener('mouseleave', () => {
          gsap.to(button, { scale: 1, duration: 0.2, ease: "power2.out" });
        });
      });

      // Add hover effects to sidebar sections
      const sections = this.$el.querySelectorAll('.sidebar-section');
      sections.forEach(section => {
        section.addEventListener('mouseenter', () => {
          gsap.to(section, { 
            y: -2, 
            boxShadow: "0 8px 25px rgba(99, 102, 241, 0.15)", 
            duration: 0.3, 
            ease: "power2.out" 
          });
        });
        section.addEventListener('mouseleave', () => {
          gsap.to(section, { 
            y: 0, 
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", 
            duration: 0.3, 
            ease: "power2.out" 
          });
        });
      });
    },
    animateEditModeToggle() {
      const timeline = gsap.timeline();
      
      // Animate resume container
      timeline.to(this.$refs.resumeContainer, {
        scale: 0.98,
        duration: 0.2,
        ease: "power2.inOut"
      })
      .to(this.$refs.resumeContainer, {
        scale: 1,
        duration: 0.3,
        ease: "back.out(1.7)"
      });

      // Animate sidebar sections
      const sidebarSections = this.$el.querySelectorAll('.sidebar-section');
      gsap.fromTo(sidebarSections,
        { x: -20, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.4, 
          stagger: 0.1, 
          ease: "power2.out" 
        }
      );
    },
    toggleEditMode(isChecked) {
      this.editing = isChecked;
      this.$nextTick(() => {
        this.animateEditModeToggle();
      });
    },
  },
};
</script>

<style>
.app-container {
  margin: 0;
  max-width: none;
  min-height: 100vh;
  background: transparent;
  display: flex;
  position: relative;
}

.app-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
}

.save-icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
}

.resume-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 0 20px;
  background: var(--gradient-secondary);
  border-radius: 16px;
  padding: 24px 32px;
  border: 1px solid var(--dark-border);
  backdrop-filter: var(--blur-backdrop);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--dark-text-primary);
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 30px;
  height: 2px;
  background: var(--gradient-primary);
  border-radius: 1px;
}

.section-description {
  font-size: 12px;
  color: var(--dark-text-secondary);
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.resume-container {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

#resume {
  box-shadow: 
    0 32px 64px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  width: 210mm;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

#resume::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  pointer-events: none;
  border-radius: 16px;
}

#resume:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 40px 80px -12px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

#resume.edit-off {
  height: 297mm;
}

.resume-wrapper {
  width: 210mm;
  margin: 48px auto;
  padding: 0 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

#resume.edit-off.letter-format {
  width: 8.5in;
  height: 11in;
}

@media (min-width: 1400px) {
  .resume-wrapper {
    margin-left: 340px;
  }
}

@media (min-width: 1600px) {
  .resume-wrapper {
    margin-right: auto;
  }
}

.left-col {
  border-radius: 16px 0 0 16px;
  background-color: var(--background-color-left);
  color: var(--text-color-left);
  border-right: 2px solid var(--highlight-color-left);
  padding: 36px;
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
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.left-col li {
  margin-bottom: 12px;
  transition: all 0.2s ease;
}

.left-col li:hover {
  transform: translateX(4px);
}

.right-col {
  border-radius: 0 16px 16px 0;
  background-color: var(--background-color-right);
  color: var(--text-color-right);
  width: 70%;
  padding: 36px 36px 0 36px;
  position: relative;
  overflow: hidden;
}

.right-col::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(225deg, rgba(0, 0, 0, 0.02) 0%, transparent 50%);
  pointer-events: none;
}

.right-col li {
  margin-bottom: 8px;
  transition: all 0.2s ease;
}

.right-col li:hover {
  transform: translateX(2px);
}

.personal-name {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  color: var(--highlight-color-right);
  font-size: 32px;
  border-bottom: 3px solid var(--highlight-color-right);
  margin: 0;
  margin-left: -36px;
  padding-left: 36px;
  padding-bottom: 18px;
  letter-spacing: -0.5px;
  position: relative;
  background: linear-gradient(135deg, var(--highlight-color-right) 0%, rgba(99, 102, 241, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.personal-title {
  font-family: 'Inter', sans-serif;
  border-bottom: 2px solid rgba(99, 102, 241, 0.3);
  margin: 0 0 24px -36px;
  padding: 18px 0 18px 36px;
  font-weight: 500;
  font-size: 22px;
  color: var(--dark-text-secondary);
  letter-spacing: 0.5px;
}

#resume ul {
  padding-inline-start: 16px;
  margin-block-end: 0px;
  margin-block-start: 5px;
}

/* Enhanced animations for edit mode transitions */
.edit-mode-transition {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Floating elements */
.floating-element {
  animation: float 6s ease-in-out infinite;
}

/* Stagger animation utility */
.stagger-item {
  opacity: 0;
  transform: translateY(20px);
}
</style>
