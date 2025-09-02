<template>
    <label class="img-upload-label" ref="uploadLabel">
        Upload Image
        <input 
            type="file"
            ref="fileInput"
            accept="image/jpeg, image/png, image/jpg"
            @change="changeImage"
        >
    </label>
</template>

<script>
import { gsap } from 'gsap';

export default {
    mounted() {
        try {
            this.initUploadAnimations();
        } catch (error) {
            console.error('ImgUpload component mount error:', error);
        }
    },
    methods: {
        initUploadAnimations() {
            gsap.fromTo(this.$refs.uploadLabel,
                { scale: 0.9, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
            );
        },
        changeImage(event) {
            const selectedFile = event.target.files[0];
            if (selectedFile) {
                // Validate file size (max 5MB)
                if (selectedFile.size > 5 * 1024 * 1024) {
                    alert('File size must be less than 5MB');
                    this.$refs.fileInput.value = '';
                    return;
                }
                
                // Validate file type
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                if (!allowedTypes.includes(selectedFile.type)) {
                    alert('Please select a valid image file (JPEG, JPG, or PNG)');
                    this.$refs.fileInput.value = '';
                    return;
                }
                
                const reader = new FileReader();
                reader.addEventListener("load", () => {
                    this.$emit('imageChanged', reader.result);
                });
                reader.addEventListener("error", () => {
                    alert('Error reading file. Please try again.');
                    this.$refs.fileInput.value = '';
                });
                reader.readAsDataURL(selectedFile);
                
                // Animate successful upload
                gsap.to(this.$refs.uploadLabel, {
                    scale: 1.05,
                    duration: 0.2,
                    ease: "power2.out",
                    yoyo: true,
                    repeat: 1
                });
            }
        }
    }
}
</script>

<style scoped>
.img-upload-label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--dark-text-secondary);
    margin-bottom: 20px;
    padding: 12px 20px;
    background: var(--gradient-secondary);
    border: 2px dashed var(--dark-border);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.img-upload-label::before {
    content: '📁';
    font-size: 16px;
    margin-right: 4px;
}

.img-upload-label::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
}

.img-upload-label:hover {
    color: var(--dark-accent);
    border-color: var(--dark-accent);
    background: rgba(99, 102, 241, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.2);
}

.img-upload-label:hover::after {
    left: 100%;
}

input[type="file"] {
    display: none;
}
</style>