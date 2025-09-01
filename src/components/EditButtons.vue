<template>
  <div
    class="button-wrapper"
    :style="{ textAlign: btnAlign }"
    :class="{ 'button-wrapper__down': moveDown }">
    <button
      v-if="showAddBtn"
      class="edit-btn edit-btn-add"
      @click="$emit('addClick')">
      {{ textAdd }}
    </button>
    <button
      v-if="showRemoveBtn"
      class="edit-btn edit-btn-remove"
      @click="$emit('removeClick')">
      {{ textRemove }}
    </button>
  </div>
</template>

<script>
export default {
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
};
</script>

<style scoped>
.edit-btn {
  min-width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background-color: transparent;
  margin-left: 6px;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.edit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.edit-btn-add {
  background: var(--dark-success);
  color: var(--dark-text-primary);
}

.edit-btn-add:hover {
  background: #059669;
}

.edit-btn-remove {
  background: var(--dark-error);
  color: var(--dark-text-primary);
}

.edit-btn-remove:hover {
  background: #dc2626;
}

.edit-off .edit-btn {
  display: none;
}

.button-wrapper__down {
  height: 0;
  text-align: right;
  position: relative;
  bottom: 8px;
}
</style>
