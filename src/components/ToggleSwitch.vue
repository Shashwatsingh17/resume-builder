<!-- in lesson 2.4 , this component is named EditToggle. In lesson 3.2 we rename it to ToggleSwitch so we can reuse it -->
<template>
  <div class="switch-wrapper">
    <label>
      <span v-if="offLabel" style="margin-right: 10px">{{ offLabel }}</span>

      <div class="switch">
        <input type="checkbox" @click="onToggle" :checked="toggleActive" />
        <span class="slider"></span>
      </div>

      <span>{{ label }}</span>
    </label>
  </div>
</template>

<script>
export default {
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
    onToggle(event) {
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
  padding: 16px 0;
  border-bottom: 1px solid var(--dark-border);
  margin-bottom: 24px;
}

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 28px;
  margin: 0 12px;
}

/* Hide default HTML checkbox */
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
  background-color: var(--dark-border);
  transition: 0.3s ease;
  border-radius: 14px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: rgb(255, 255, 255);
  transition: 0.3s ease;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input:checked + .slider {
  background: var(--dark-accent);
}

input:focus + .slider {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

input:checked + .slider:before {
  transform: translateX(20px);
}

label {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--dark-text-primary);
  width: 100%;
}
</style>
