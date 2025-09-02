<template>
    <div class="sidebar" :class="{ collapsed }" ref="sidebar" aria-label="Sidebar" :aria-expanded="!collapsed">
        <div class="sidebar-backdrop"></div>
        <div class="sidebar-content">
        <slot></slot>
        </div>
    </div>
</template>

<script>
import { gsap } from 'gsap';

export default {
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    try {
      this.initSidebarAnimations();
    } catch (error) {
      console.error('Sidebar component mount error:', error);
    }
  },
  methods: {
    initSidebarAnimations() {
      // Animate sidebar entrance
      gsap.fromTo(this.$refs.sidebar,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );

      // Add subtle floating animation to sidebar
      gsap.to(this.$refs.sidebar, {
        y: -2,
        duration: 4,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
      });
    }
  }
};
</script>


<style>
.sidebar {
  width: 340px;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 100;
  overflow: hidden;
  transition: width 0.3s ease;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gradient-secondary);
  backdrop-filter: var(--blur-backdrop);
  border-right: 1px solid var(--dark-border-light);
}

.sidebar-backdrop::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 0% 100%, rgba(139, 92, 246, 0.08) 0%, transparent 50%);
}

.sidebar-content {
  position: relative;
  z-index: 2;
  padding: 40px 28px;
  height: 100%;
  overflow-y: auto;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.sidebar.collapsed .sidebar-content {
  opacity: 0;
  transform: translateX(-10px);
  pointer-events: none;
}

.sidebar label {
  margin-bottom: 18px;
  font-size: 13px;
  color: var(--dark-text-secondary);
  font-weight: 500;
  letter-spacing: 0.3px;
}

.sidebar .btn {
  margin-bottom: 14px;
}

.sidebar-section {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--dark-border);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 28px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.sidebar-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
}

.sidebar-section:hover {
  border-color: rgba(99, 102, 241, 0.4);
  background: rgba(255, 255, 255, 0.05);
  box-shadow:
    0 8px 32px rgba(99, 102, 241, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .sidebar.collapsed {
    width: 0;
  }
}
</style>
