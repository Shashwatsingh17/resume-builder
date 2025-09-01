<template>
    <button
        class="btn" 
        ref="button"
        :class="customClass"
        @mouseenter="onHover"
        @mouseleave="onLeave"
    >
        <slot></slot>
    </button>
</template>

<script>
import { gsap } from 'gsap';

export default {
    mounted() {
        this.initButtonAnimations();
    },
    props: {
        btnType: {
            type: String,
            default: ""
        }
    },
    computed: {
        customClass() {
            if(this.btnType) {
                return 'btn-' + this.btnType
            }
        }
    },
    methods: {
        initButtonAnimations() {
            // Set initial state
            gsap.set(this.$refs.button, { scale: 1 });
        },
        onHover() {
            gsap.to(this.$refs.button, {
                scale: 1.05,
                duration: 0.2,
                ease: "power2.out"
            });
        },
        onLeave() {
            gsap.to(this.$refs.button, {
                scale: 1,
                duration: 0.2,
                ease: "power2.out"
            });
        }
    }
}
</script>

<style scoped>
.btn {
  border-radius: 12px;
  padding: 14px 24px;
  border: none;
  font-size: 13px;
  font-weight: 600;
  display: block;
  width: 100%;
  background: var(--gradient-primary);
  color: var(--dark-text-primary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  font-family: inherit;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  font-size: 12px;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn:hover::before {
  left: 100%;
}

.btn:hover {
  background: linear-gradient(135deg, var(--dark-accent-hover) 0%, #8b5cf6 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.btn-primary {
  background: var(--gradient-primary);
  color: var(--dark-text-primary);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.25);
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--dark-accent-hover) 0%, #7c3aed 100%);
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.35);
}

.btn-secondary {
  background: var(--dark-bg-tertiary);
  color: var(--dark-text-secondary);
  border: 1px solid var(--dark-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-secondary:hover {
  background: var(--dark-bg-quaternary);
  color: var(--dark-text-primary);
  border-color: var(--dark-accent);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.btn-primary-right {
  background: linear-gradient(135deg, var(--dark-success) 0%, #059669 100%);
  color: var(--dark-text-primary);
  margin-left: auto;
  width: auto;
  padding: 14px 28px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.25);
}

.btn-primary-right:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(16, 185, 129, 0.4);
}

.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
  transform: none !important;
}
</style>