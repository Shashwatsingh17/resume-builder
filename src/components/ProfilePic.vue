<template>
    <img
        v-if="show"
        :src="url"
        alt="profile picture"
        :class="{'circle': shape == 'round' }"
        class="profile-pic"
    >
</template>


<script>
export default {
    props: {
        url: String,
        show: Boolean,
        shape: String
    }
}
</script>


<style scoped>
.profile-pic {
  display: block;
  width: 140px;
  height: 140px;
  border: 3px solid var(--highlight-color-left);
  margin-bottom: 24px;
  object-fit: cover;
  margin-left: auto;
  margin-right: auto;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.profile-pic:hover {
  transform: scale(1.02);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}

.circle {
  border-radius: 50%;
}
</style>