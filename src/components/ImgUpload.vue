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
        const file = input.files && input.files[0];
        if (!file) return;
        // Prefer ObjectURL for speed and broad support (works on localhost)
        try {
          const objectUrl = URL.createObjectURL(file);
          this.$emit('imageChanged', objectUrl);
          this.$emit('image-changed', objectUrl);
        } catch (_) {
          // Fallback to Data URL
          const reader = new FileReader();
          reader.onload = () => {
            this.$emit('imageChanged', reader.result);
            this.$emit('image-changed', reader.result);
          };
          reader.readAsDataURL(file);
        } finally {
          input.value = '';
        }
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
