<template>
  <div
    class="button-wrapper"
    ref="buttonWrapper"
    :style="{ textAlign: btnAlign }"
    :class="{ 'button-wrapper__down': moveDown }">
    <button
      v-if="showAddBtn"
      class="edit-btn edit-btn-add" 
      ref="addBtn"
      @mouseenter="onAddHover"
      @mouseleave="onAddLeave"
      @click="$emit('addClick')">
      {{ textAdd }}
    </button>
    <button
      v-if="showRemoveBtn"
      class="edit-btn edit-btn-remove"
      ref="removeBtn"
      @mouseenter="onRemoveHover"
      @mouseleave="onRemoveLeave"
      @click="$emit('removeClick')">
      {{ textRemove }}
    </button>
  </div>
</template>

<script>
import { gsap } from 'gsap';

export default {
  mounted() {
    this.initButtonAnimations();
  },
  props: {
    showAddBtn: {
      type: Boolean,
      default: true,
    },
    showRemoveBtn: {
      type: Boolean,
      default: true,
    },
    textAdd: {
      type: String,
      default: "+",
    },
    textRemove: {
      type: String,
      default: "-",
    },
    btnAlign: {
      type: String,
      default: "center",
    },
    moveDown: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    initButtonAnimations() {
      // Animate buttons entrance
      const buttons = [this.$refs.addBtn, this.$refs.removeBtn].filter(Boolean);
      
      buttons.forEach((button, index) => {
        gsap.fromTo(button,
          { scale: 0, opacity: 0 },
          { 
            scale: 1, 
            opacity: 1, 
            duration: 0.4, 
            delay: index * 0.1,
            ease: "back.out(1.7)" 
          }
        );
      });
    },
    onAddHover() {
      if (this.$refs.addBtn) {
        gsap.to(this.$refs.addBtn, {
          scale: 1.1,
          rotation: 90,
          duration: 0.2,
          ease: "power2.out"
        });
      }
    },
    onAddLeave() {
      if (this.$refs.addBtn) {
        gsap.to(this.$refs.addBtn, {
          scale: 1,
          rotation: 0,
          duration: 0.2,
          ease: "power2.out"
        });
      }
    },
    onRemoveHover() {
      if (this.$refs.removeBtn) {
        gsap.to(this.$refs.removeBtn, {
          scale: 1.1,
          duration: 0.2,
          ease: "power2.out"
        });
      }
    },
    onRemoveLeave() {
      if (this.$refs.removeBtn) {
        gsap.to(this.$refs.removeBtn, {
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
.edit-btn {
  min-width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background-color: transparent;
  margin-left: 8px;
  font-size: 14px;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.edit-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.edit-btn:hover::before {
  width: 100%;
  height: 100%;
}

.edit-btn-add {
  background: linear-gradient(135deg, var(--dark-success) 0%, #059669 100%);
  color: var(--dark-text-primary);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.edit-btn-add:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.edit-btn-remove {
  background: linear-gradient(135deg, var(--dark-error) 0%, #dc2626 100%);
  color: var(--dark-text-primary);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
}

.edit-btn-remove:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
}

.edit-off .edit-btn {
  display: none;
}

.button-wrapper__down {
  height: 0;
  text-align: right;
  position: relative;
  bottom: 12px;
}
</style>
