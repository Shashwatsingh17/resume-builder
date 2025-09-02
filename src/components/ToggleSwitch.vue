<!-- in lesson 2.4 , this component is named EditToggle. In lesson 3.2 we rename it to ToggleSwitch so we can reuse it -->
<template>
  <div class="switch-wrapper" ref="switchWrapper">
    <label>
      <span v-if="offLabel" style="margin-right: 10px">{{ offLabel }}</span>

      <div class="switch">
        <input type="checkbox" @click="onToggle" :checked="toggleActive" ref="checkbox" />
        <span class="slider" ref="slider">
          <span class="slider-thumb" ref="thumb"></span>
        </span>
      </div>

      <span>{{ label }}</span>
    </label>
  </div>
</template>

<script>
import { gsap } from 'gsap';

export default {
  mounted() {
    try {
      this.initSwitchAnimations();
    } catch (error) {
      console.error('ToggleSwitch component mount error:', error);
    }
  },
  props: {
    label: String,
    offLabel: {
      type: String,
      default: null,
    },
    toggleActive: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    initSwitchAnimations() {
      // Animate switch entrance
      gsap.fromTo(this.$refs.switchWrapper,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    },
    onToggle(event) {
      // Animate toggle action
      const timeline = gsap.timeline();
      
      timeline.to(this.$refs.slider, {
        scale: 1.1,
        duration: 0.1,
        ease: "power2.out"
      })
      .to(this.$refs.slider, {
        scale: 1,
        duration: 0.2,
        ease: "back.out(1.7)"
      });

      // Animate thumb
      gsap.to(this.$refs.thumb, {
        scale: 1.2,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      });

      this.$emit("switchToggled", event.target.checked);
    },
  },
};
</script>

<style scoped>
.switch-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 28px;
  transition: all 0.3s ease;
}

.switch-wrapper:hover {
  padding-left: 4px;
  margin-left: -4px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 30px;
  margin: 0 16px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--dark-border) 0%, var(--dark-bg-tertiary) 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 15px;
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.1);
}

.slider-thumb {
  position: absolute;
  height: 22px;
  width: 22px;
  left: 4px;
  top: 4px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 50%;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.2),
    0 1px 3px rgba(0, 0, 0, 0.1);
  display: block;
}

input:checked + .slider {
  background: var(--gradient-primary);
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.1),
    0 2px 12px rgba(99, 102, 241, 0.3);
}

input:focus + .slider {
  box-shadow: 
    0 0 0 3px rgba(99, 102, 241, 0.3),
    inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

input:checked + .slider .slider-thumb {
  transform: translateX(22px);
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  box-shadow: 
    0 3px 12px rgba(0, 0, 0, 0.25),
    0 1px 4px rgba(0, 0, 0, 0.1);
}

label {
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--dark-text-primary);
  width: 100%;
  letter-spacing: 0.3px;
  transition: all 0.2s ease;
}

label:hover {
  color: var(--dark-accent);
}
</style>
