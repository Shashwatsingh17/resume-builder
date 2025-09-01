<template>
    <img
        v-if="show"
        ref="profileImage"
        :src="url"
        alt="profile picture"
        :class="{'circle': shape == 'round' }"
        class="profile-pic"
        @load="onImageLoad"
    >
</template>


<script>
import { gsap } from 'gsap';

export default {
    mounted() {
        if (this.show) {
            this.initProfileAnimations();
        }
    },
    watch: {
        show(newVal) {
            if (newVal) {
                this.$nextTick(() => {
                    this.initProfileAnimations();
                });
            }
        }
    },
    props: {
        url: String,
        show: Boolean,
        shape: String
    },
    methods: {
        initProfileAnimations() {
            if (this.$refs.profileImage) {
                // Set initial state
                gsap.set(this.$refs.profileImage, { 
                    scale: 0, 
                    rotation: -180,
                    opacity: 0 
                });
                
                // Animate entrance
                gsap.to(this.$refs.profileImage, {
                    scale: 1,
                    rotation: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "back.out(1.7)",
                    delay: 0.2
                });

                // Add floating animation
                gsap.to(this.$refs.profileImage, {
                    y: -3,
                    duration: 3,
                    ease: "power1.inOut",
                    yoyo: true,
                    repeat: -1
                });
            }
        },
        onImageLoad() {
            this.initProfileAnimations();
        }
    }
}
</script>


<style scoped>
.profile-pic {
  display: block;
  width: 150px;
  height: 150px;
  border: 4px solid var(--highlight-color-left);
  margin-bottom: 32px;
  object-fit: cover;
  margin-left: auto;
  margin-right: auto;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 12px 35px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
}

.profile-pic::before {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  background: linear-gradient(135deg, var(--highlight-color-left) 0%, rgba(99, 102, 241, 0.6) 100%);
  border-radius: inherit;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.profile-pic:hover {
  transform: scale(1.05) rotate(2deg);
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.profile-pic:hover::before {
  opacity: 0.3;
}

.circle {
  border-radius: 50%;
}

.circle::before {
  border-radius: 50%;
}
</style>