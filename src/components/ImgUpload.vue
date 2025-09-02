<template>
    <label class="img-upload-label">
        Upload Image
        <input
            type="file"
            accept="image/*"
            @change="changeImage"
        >
    </label>
</template>

<script>
export default {
  methods: {
    changeImage(event) {
      try {
        const input = event.target;
        const selectedFile = input.files && input.files[0];
        if (!selectedFile) return;
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          // Emit both camelCase and kebab-case for Vue 3 case-sensitive listeners
          this.$emit('imageChanged', reader.result);
          this.$emit('image-changed', reader.result);
          // Reset input to allow re-selecting the same file
          input.value = '';
        });
        reader.readAsDataURL(selectedFile);
      } catch (e) {
        console.error('Image upload error:', e);
      }
    }
  }
}
</script>

<style scoped>
.img-upload-label {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: var(--dark-text-secondary);
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.img-upload-label:hover {
  color: var(--dark-text-primary);
}

input[type="file"] {
  display: none;
}
</style>
