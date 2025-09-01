<template>
    <button
        class="btn"
        :class="customClass"
    >
        <slot></slot>
    </button>
</template>

<script>
export default {
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
    }
}
</script>

<style scoped>
    .btn {
        border-radius: 8px;
        padding: 12px 20px;
        border: none;
        font-size: 14px;
        font-weight: 500;
        display: block;
        width: 100%;
        background: var(--dark-accent);
        color: var(--dark-text-primary);
        transition: all 0.2s ease;
        cursor: pointer;
        font-family: inherit;
    }
    
    .btn:hover {
        background: var(--dark-accent-hover);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
    
    .btn-primary {
        background: linear-gradient(135deg, var(--dark-accent) 0%, var(--dark-accent-hover) 100%);
        color: var(--dark-text-primary);
    }

    .btn-primary:hover {
        background: linear-gradient(135deg, var(--dark-accent-hover) 0%, #4f46e5 100%);
    }

    .btn-secondary {
        background: var(--dark-bg-tertiary);
        color: var(--dark-text-secondary);
        border: 1px solid var(--dark-border);
    }

    .btn-secondary:hover {
        background: var(--dark-border);
        color: var(--dark-text-primary);
    }

    /* added in 4.1 (saving configuration) */
    .btn-primary-right {
        background: linear-gradient(135deg, var(--dark-success) 0%, #059669 100%);
        color: var(--dark-text-primary);
        margin-left: auto;
        width: auto;
        padding: 12px 24px;
        font-weight: 600;
    }

    .btn-primary-right:hover {
        background: linear-gradient(135deg, #059669 0%, #047857 100%);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
    }

    .btn-disabled {
        opacity: 0.6;
        cursor: not-allowed;
        pointer-events: none;
    }
</style>