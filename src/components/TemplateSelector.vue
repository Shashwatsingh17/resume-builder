<template>
  <div class="template-selector">
    <h3 class="section-title">
      <svg class="template-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Resume Template
    </h3>
    
    <div class="template-grid">
      <div 
        v-for="template in templates" 
        :key="template.id"
        class="template-option"
        :class="{ 'active': currentTemplate === template.id }"
        @click="selectTemplate(template.id)"
      >
        <div class="template-preview" :style="getTemplatePreviewStyle(template)">
          <div class="preview-header"></div>
          <div class="preview-left"></div>
          <div class="preview-right"></div>
        </div>
        <div class="template-info">
          <h4>{{ template.name }}</h4>
          <p>{{ template.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TemplateSelector',
  props: {
    currentTemplate: {
      type: String,
      default: 'modern-minimal'
    }
  },
  data() {
    return {
      templates: [
        {
          id: 'modern-minimal',
          name: 'Modern Minimal',
          description: 'Clean, professional design with subtle accents',
          colors: {
            left: '#3feee6',
            right: '#6366f1'
          },
          showImage: true,
          imageShape: 'round'
        },
        {
          id: 'classic-professional',
          name: 'Classic Professional',
          description: 'Traditional layout with sophisticated color scheme',
          colors: {
            left: '#2c3e50',
            right: '#34495e'
          },
          showImage: true,
          imageShape: 'square'
        },
        {
          id: 'creative-bold',
          name: 'Creative Bold',
          description: 'Vibrant colors for creative industries',
          colors: {
            left: '#e74c3c',
            right: '#f39c12'
          },
          showImage: true,
          imageShape: 'round'
        },
        {
          id: 'clean-minimal',
          name: 'Clean Minimal',
          description: 'Ultra-clean design without profile picture',
          colors: {
            left: '#95a5a6',
            right: '#7f8c8d'
          },
          showImage: false,
          imageShape: 'round'
        },
        {
          id: 'overleaf-awesome-cv',
          name: 'Awesome CV',
          description: 'Bold section accents and compact typography',
          colors: {
            left: '#cc0000',
            right: '#2b2b2b'
          },
          showImage: false,
          imageShape: 'round'
        },
        {
          id: 'overleaf-deedy',
          name: 'Deedy Resume',
          description: 'Modern two-column layout with vivid blue',
          colors: {
            left: '#1f6feb',
            right: '#0d1117'
          },
          showImage: true,
          imageShape: 'square'
        },
        {
          id: 'overleaf-moderncv',
          name: 'moderncv',
          description: 'Professional palette with highlight accents',
          colors: {
            left: '#2c3e50',
            right: '#18bc9c'
          },
          showImage: true,
          imageShape: 'round'
        },
        {
          id: 'overleaf-classic',
          name: 'Classic CV',
          description: 'Traditional grayscale focused on content',
          colors: {
            left: '#555555',
            right: '#2c3e50'
          },
          showImage: false,
          imageShape: 'square'
        },
        {
          id: 'overleaf-compact',
          name: 'Compact',
          description: 'Space-efficient layout with vibrant accents',
          colors: {
            left: '#7e57c2',
            right: '#26a69a'
          },
          showImage: false,
          imageShape: 'round'
        },
        {
          id: 'overleaf-cv-tex',
          name: 'Overleaf LaTeX CV',
          description: 'Monochrome, content-first LaTeX-inspired style',
          colors: {
            left: '#2a2a2a',
            right: '#111111'
          },
          showImage: false,
          imageShape: 'square'
        },
        {
          id: 'altacv',
          name: 'AltaCV',
          description: 'Clean two-column CV with vibrant cyan accents',
          colors: {
            left: '#00bcd4',
            right: '#263238'
          },
          showImage: true,
          imageShape: 'round'
        },
        {
          id: 'twenty-seconds',
          name: 'Twenty Seconds',
          description: 'Bold header strip with readable single column',
          colors: {
            left: '#7c3aed',
            right: '#312e81'
          },
          showImage: false,
          imageShape: 'round'
        },
        {
          id: 'classicthesis',
          name: 'Classicthesis',
          description: 'Academic, understated tones with strong headings',
          colors: {
            left: '#6b7280',
            right: '#374151'
          },
          showImage: false,
          imageShape: 'square'
        },
        {
          id: 'timeline',
          name: 'Timeline',
          description: 'Single-column timeline-focused layout',
          colors: {
            left: '#059669',
            right: '#065f46'
          },
          showImage: false,
          imageShape: 'round'
        },
        {
          id: 'material',
          name: 'Material',
          description: 'Card-like sections with teal and indigo accents',
          colors: {
            left: '#009688',
            right: '#3f51b5'
          },
          showImage: true,
          imageShape: 'square'
        },
        {
          id: 'monochrome',
          name: 'Monochrome',
          description: 'High-contrast black and white minimalist',
          colors: {
            left: '#111827',
            right: '#111827'
          },
          showImage: false,
          imageShape: 'square'
        }
      ]
    };
  },
  methods: {
    selectTemplate(templateId) {
      this.$emit('template-changed', templateId);
    },
    getTemplatePreviewStyle(template) {
      return {
        '--preview-left-color': template.colors.left,
        '--preview-right-color': template.colors.right
      };
    }
  }
};
</script>

<style scoped>
.template-selector {
  margin-bottom: 32px;
}

.template-icon {
  width: 20px;
  height: 20px;
  color: var(--dark-accent);
  filter: drop-shadow(0 2px 4px rgba(99, 102, 241, 0.3));
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.template-option {
  background: var(--gradient-secondary);
  border: 2px solid var(--dark-border-light);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.template-option::before {
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

.template-option:hover {
  border-color: rgba(99, 102, 241, 0.4);
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.15);
}

.template-option:hover::before {
  opacity: 1;
}

.template-option.active {
  border-color: var(--dark-accent);
  background: rgba(99, 102, 241, 0.1);
  box-shadow: 0 0 0 1px var(--dark-accent);
}

.template-option.active::before {
  opacity: 1;
}

.template-preview {
  width: 100%;
  height: 80px;
  background: #ffffff;
  border-radius: 8px;
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
}

.preview-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: var(--preview-right-color);
}

.preview-left {
  width: 35%;
  height: 100%;
  background: var(--preview-left-color);
  opacity: 0.8;
}

.preview-right {
  flex: 1;
  background: #f8fafc;
  position: relative;
}

.preview-right::after {
  content: '';
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  height: 4px;
  background: var(--preview-right-color);
  border-radius: 2px;
}

.preview-right::before {
  content: '';
  position: absolute;
  top: 35px;
  left: 20px;
  right: 40px;
  height: 3px;
  background: #cbd5e1;
  border-radius: 2px;
}

.template-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--dark-text-primary);
}

.template-info p {
  margin: 0;
  font-size: 12px;
  color: var(--dark-text-secondary);
  line-height: 1.4;
}

/* Animation for template selection */
.template-option {
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

.template-option:nth-child(1) { animation-delay: 0.1s; }
.template-option:nth-child(2) { animation-delay: 0.2s; }
.template-option:nth-child(3) { animation-delay: 0.3s; }
.template-option:nth-child(4) { animation-delay: 0.4s; }
.template-option:nth-child(5) { animation-delay: 0.5s; }
.template-option:nth-child(6) { animation-delay: 0.6s; }
.template-option:nth-child(7) { animation-delay: 0.7s; }
.template-option:nth-child(8) { animation-delay: 0.8s; }
.template-option:nth-child(9) { animation-delay: 0.9s; }
.template-option:nth-child(10) { animation-delay: 1.0s; }
.template-option:nth-child(11) { animation-delay: 1.1s; }
.template-option:nth-child(12) { animation-delay: 1.2s; }
.template-option:nth-child(13) { animation-delay: 1.3s; }
.template-option:nth-child(14) { animation-delay: 1.4s; }

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hover effects */
.template-option:hover .template-preview {
  transform: scale(1.02);
  transition: transform 0.2s ease;
}

.template-option.active .template-preview {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.2);
}
</style>
