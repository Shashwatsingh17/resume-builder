<template>
  <div class="inner-section" ref="entrySection" :class="{ 'inner-section__editing': editing }">
    <div class="entry-title-row">
      <div
        class="resumeentry-title"
        data-field="title"
        :contenteditable="editing"
        @blur="$emit('edit', $event, 'title')"
      >
        {{ item.title }}
      </div>
    </div>

    <div class="d-flex justify-content-between">
      <div class="resumeentry-location">
        <span
          data-field="company"
          :contenteditable="editing"
          @blur="$emit('edit', $event, isEducation ? 'university' : 'company')"
        >
          {{ isEducation ? item.university : item.company }} </span
        >,
        <span
          data-field="location"
          :contenteditable="editing"
          @blur="$emit('edit', $event, 'location')"
        >
          {{ item.location }}
        </span>
      </div>
      <div
        class="resumeentry-date"
        data-field="date"
        :contenteditable="editing"
        @blur="$emit('edit', $event, 'date')"
      >
        {{ item.date }}
      </div>
    </div>
    <ul>
      <li
        v-for="(desc, index) in item.description"
        :key="index"
        :data-desc-index="index"
        :contenteditable="editing"
        @blur="$emit('editDesc', $event, index)"
      >
        {{ desc }}
      </li>
    </ul>
  </div>
</template>

<script>
import { gsap } from 'gsap';

export default {
  mounted() {
    try {
      this.initEntryAnimations();
    } catch (error) {
      console.error('ResumeEntry component mount error:', error);
    }
  },
  props: {
    item: Object,
    editing: Boolean,
  },
  computed: {
    isEducation() {
      // can be value but also empty string in case edited. but will always be defined if eduction entry
      if (this.item.university === undefined) {
        return false;
      }
      return true;
    },
  },
  methods: {
    initEntryAnimations() {
      // Animate entry entrance
      gsap.fromTo(this.$refs.entrySection,
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      );

      // Add hover effect
      this.$refs.entrySection.addEventListener('mouseenter', () => {
        gsap.to(this.$refs.entrySection, {
          x: 4,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      this.$refs.entrySection.addEventListener('mouseleave', () => {
        gsap.to(this.$refs.entrySection, {
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
.entry-title-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.resumeentry-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--highlight-color-right);
  letter-spacing: -0.2px;
  transition: all 0.2s ease;
}

.resumeentry-title:hover {
  transform: translateX(2px);
}

.inner-section {
  margin-bottom: 28px;
  padding: 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.inner-section::before {
  content: '';
  position: absolute;
  left: -20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.inner-section:hover::before {
  opacity: 0.6;
}

.inner-section__editing {
  margin-bottom: 20px;
  padding: 16px;
  border-radius: 12px;
  background: var(--dark-accent-light);
  border: 1px solid rgba(99, 102, 241, 0.1);
  backdrop-filter: blur(10px);
}

.resumeentry-date,
.resumeentry-location {
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.resumeentry-location:hover,
.resumeentry-date:hover {
  transform: translateX(2px);
}

.resumeentry-date {
  font-style: italic;
  color: var(--highlight-color-right);
  font-weight: 700;
}

li {
  font-size: 15px;
  line-height: 1.7;
  margin-bottom: 10px;
  transition: all 0.2s ease;
  position: relative;
}

li:hover {
  transform: translateX(3px);
  color: var(--dark-text-primary);
}

li::before {
  content: '';
  position: absolute;
  left: -16px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  background: var(--highlight-color-right);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s ease;
}

li:hover::before {
  opacity: 0.6;
}
</style>
