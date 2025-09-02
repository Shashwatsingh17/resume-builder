<!-- in lesson 2.4 , this component is named EditToggle. In lesson 3.2 we rename it to ToggleSwitch so we can reuse it -->
<template>
  <div class="switch-wrapper" ref="switchWrapper">
    <label>
      <span v-if="offLabel" style="margin-right: 10px">{{ offLabel }}</span>
      <InputSwitch :modelValue="toggleActive" @update:modelValue="emitToggle" class="p-inputswitch"/>
      <span>{{ label }}</span>
    </label>
  </div>
</template>

<script>
import { gsap } from 'gsap';
import InputSwitch from 'primevue/inputswitch';

export default {
  components: { InputSwitch },
  mounted() {
    try {
      this.initSwitchAnimations();
    } catch (error) {
      console.error('ToggleSwitch component mount error:', error);
    }
  },
  props: {
    label: String,
    offLabel: { type: String, default: null },
    toggleActive: { type: Boolean, default: true }
  },
  methods: {
    initSwitchAnimations() {
      gsap.fromTo(this.$refs.switchWrapper,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    },
    emitToggle(val) {
      this.$emit('switchToggled', !!val);
    }
  }
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

.switch-wrapper:hover { padding-left: 4px; margin-left: -4px; }

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

label:hover { color: var(--dark-accent); }
</style>
