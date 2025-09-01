<template>
    <div class="resume-section">
        <slot></slot>
    </div>
</template>

<style scoped>
.resume-section {
  margin-bottom: 32px;
}

.resume-section:last-child {
  margin-bottom: 0;
}
</style>