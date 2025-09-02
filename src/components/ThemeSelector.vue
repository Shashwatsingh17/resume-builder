<template>
  <div class="theme-selector">
    <h3 class="section-title">
      <svg class="theme-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3a9 9 0 100 18 9 9 0 000-18z" stroke="currentColor" stroke-width="2"/>
        <path d="M12 3v18M3 12h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      Theme
    </h3>
    <div class="theme-grid">
      <button
        v-for="theme in themes"
        :key="theme.id"
        class="theme-option btn"
        :class="{ active: currentTheme === theme.id }"
        @click="$emit('theme-changed', theme.id)"
      >
        <span class="swatch" :style="{background: theme.preview}"></span>
        <div class="theme-info">
          <strong>{{ theme.name }}</strong>
          <small>{{ theme.description }}</small>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThemeSelector',
  props: {
    currentTheme: {
      type: String,
      default: 'dark-neon'
    }
  },
  data() {
    return {
      themes: [
        { id: 'dark-neon', name: 'Dark Neon', description: 'Vibrant dark UI with neon accents', preview: 'linear-gradient(90deg,#141420,#1a1a2e)' },
        { id: 'minimal-light', name: 'Minimal Light', description: 'Clean, airy light theme', preview: 'linear-gradient(90deg,#ffffff,#f5f7fb)' },
        { id: 'solarized', name: 'Solarized', description: 'Comfortable contrast and hues', preview: 'linear-gradient(90deg,#073642,#002b36)' },
        { id: 'material', name: 'Material', description: 'Teal + Indigo material palette', preview: 'linear-gradient(90deg,#009688,#3f51b5)' },
        { id: 'monochrome', name: 'Monochrome', description: 'High-contrast grayscale', preview: 'linear-gradient(90deg,#111827,#374151)' },
        { id: 'high-contrast', name: 'High Contrast', description: 'Accessibility-first contrast', preview: 'linear-gradient(90deg,#000000,#1f2937)' }
      ]
    };
  }
};
</script>

<style scoped>
.theme-icon { width: 20px; height: 20px; color: var(--dark-accent); }
.theme-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(180px,1fr)); gap: 12px; }
.theme-option { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--gradient-secondary); border: 1px solid var(--dark-border-light); border-radius: 12px; cursor: pointer; }
.theme-option.active { box-shadow: 0 0 0 1px var(--dark-accent); background: rgba(99,102,241,0.1); }
.swatch { width: 36px; height: 24px; border-radius: 6px; border: 1px solid var(--dark-border-light); box-shadow: inset 0 1px 0 rgba(255,255,255,0.1); }
.theme-info { display: flex; flex-direction: column; text-align: left; }
.theme-info strong { color: var(--dark-text-primary); font-size: 13px; }
.theme-info small { color: var(--dark-text-secondary); font-size: 11px; }
</style>
