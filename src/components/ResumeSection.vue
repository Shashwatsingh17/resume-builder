<template>
    <div class="resume-section" ref="section">
        <slot></slot>
    </div>
</template>

<script>
import { gsap } from 'gsap';

export default {
    mounted() {
        try {
            this.initSectionAnimations();
        } catch (error) {
            console.error('ResumeSection component mount error:', error);
        }
    },
    methods: {
        initSectionAnimations() {
            // Add subtle entrance animation
            gsap.fromTo(this.$refs.section,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
            );

            // Add hover effect
            this.$refs.section.addEventListener('mouseenter', () => {
                gsap.to(this.$refs.section, {
                    x: 2,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            this.$refs.section.addEventListener('mouseleave', () => {
                gsap.to(this.$refs.section, {
                    x: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        }
    }
};
</script>

<style scoped>
.resume-section {
  margin-bottom: 36px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.resume-section:last-child {
  margin-bottom: 0;
}

.resume-section::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, var(--highlight-color-left) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.resume-section:hover::before {
  opacity: 0.6;
}
</style>