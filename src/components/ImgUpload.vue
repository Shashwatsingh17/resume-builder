<template>
    <label class="img-upload-label">
        Upload Image
        <input type="file"
            accept="image/jpeg, image/png, image/jpg"
            @change="changeImage">
    </label>
</template>

<script>
    export default {
        methods: {
            changeImage(event) {
                const selectedFile = event.target.files[0];
                if (selectedFile) {
                    const reader = new FileReader();
                    reader.addEventListener("load", () => {
                        this.$emit('imageChanged', reader.result)
                    });
                    reader.readAsDataURL(selectedFile);
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