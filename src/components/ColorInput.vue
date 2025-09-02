<template>
    <label ref="colorLabel">
        <input type="color"
            class="color-picker"
            ref="colorPicker"
            @input="$emit('colorChanged', $event.target.value)"
            @change="onColorChange"
            :value="defaultColor"
        >
        {{ label }}
    </label>
</template>

<script>
import { gsap } from 'gsap';

export default {
    mounted() {
        try {
            this.initColorInputAnimations();
        } catch (error) {
            console.error('ColorInput component mount error:', error);
        }
    },
    props: {
        label: {
            type: String,
            default: "Choose a color"
        },
        defaultColor: {
            type: String
        }
    },
    methods: {
        initColorInputAnimations() {
            // Animate entrance
            gsap.fromTo(this.$refs.colorLabel,
                { x: -15, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
            );
        },
        onColorChange() {
            // Animate color change
            gsap.to(this.$refs.colorPicker, {
                scale: 1.1,
                duration: 0.1,
                ease: "power2.out",
                yoyo: true,
                repeat: 1
            });
        }
    }
}
</script>


<style scoped>
label {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: var(--dark-text-secondary);
    margin-bottom: 16px;
    transition: all 0.2s ease;
}

label:hover {
    color: var(--dark-text-primary);
}

.color-picker {
    margin-right: 16px;
    width: 36px;
    height: 36px;
    padding: 0;
    border: 2px solid var(--dark-border);
    border-radius: 10px;
    background: transparent;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.color-picker::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: var(--gradient-primary);
    border-radius: 12px;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
}

.color-picker:hover {
    border-color: var(--dark-accent);
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
}

.color-picker:hover::before {
    opacity: 0.3;
}
</style>