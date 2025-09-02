<template>
  <label>
    <Dropdown
      :options="options"
      optionLabel="name"
      optionValue="value"
      :modelValue="defaultOption"
      @update:modelValue="$emit('updateSelection', $event)"
      class="p-dropdown mr-2"
      :pt="{ root: { class: 'custom-input' } }"
      ></Dropdown>
    {{ label }}
  </label>
</template>

<script>
import Dropdown from 'primevue/dropdown';
export default {
  components: { Dropdown },
  props: {
    label: String,
    options: Array,
    defaultOption: String
  }
}
</script>

<style scoped>
label {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--dark-text-secondary);
  margin-bottom: 12px;
}
</style>
