<template>
    <h4 
        class="section-headline" 
        ref="headline"
        :contenteditable="editing" 
        @blur="notifyParent"
        @mouseenter="onHover"
        @mouseleave="onLeave">
        {{ headline }}
    </h4>
</template>

<script>
import { gsap } from 'gsap';

export default {
    mounted() {
        try {
            this.initHeadlineAnimations();
        } catch (error) {
            console.error('SectionHeadline component mount error:', error);
        }
    },
    props: {
        headline: {
            type: String
        },
        editing: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        initHeadlineAnimations() {
            // Animate headline entrance
            gsap.fromTo(this.$refs.headline,
                { x: -20, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
            );
        },
        notifyParent(event) {
            this.$emit("headlineEdited", event.target.innerText);
        },
        onHover() {
            if (this.editing) {
                gsap.to(this.$refs.headline, {
                    scale: 1.02,
                    duration: 0.2,
                    ease: "power2.out"
                });
            }
        },
        onLeave() {
            if (this.editing) {
                gsap.to(this.$refs.headline, {
                    scale: 1,
                    duration: 0.2,
                    ease: "power2.out"
                });
            }
        }
    }
};
</script>


<style scoped>
.section-headline {
    font-size: 18px;
    font-weight: var(--headline-weight);
    margin-bottom: 20px;
    margin-top: 0;
    letter-spacing: 0.5px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
}

.left-col .section-headline {
    border-bottom: 2px solid var(--highlight-color-left);
    padding-bottom: 12px;
    margin-right: -36px;
    padding-right: 36px;
    color: var(--highlight-color-left);
    text-transform: uppercase;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 1px;
    position: relative;
}

.left-col .section-headline::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--highlight-color-left) 0%, rgba(99, 102, 241, 0.5) 100%);
    transition: width 0.4s ease;
}

.left-col .section-headline:hover::after {
    width: 60%;
}

.right-col .section-headline {
    color: var(--highlight-color-right);
    font-size: 22px;
    font-weight: 600;
    position: relative;
}

.right-col .section-headline::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 0;
    background: var(--gradient-primary);
    border-radius: 2px;
    transition: height 0.3s ease;
}

.right-col .section-headline:hover::before {
    height: 100%;
}
</style>