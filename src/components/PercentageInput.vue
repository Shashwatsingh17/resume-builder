<template>
    <label class="label-input-wrapper">
        <input type="number"
            :min="min"
            :max="max"
            :value="currentValue"
            class="custom-input"
            @change="onChange"
        >
        % {{ label }}
    </label>
</template>

<script>

export default {
    props: {
        label: {
            type: String
        },
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 100
        },
        currentValue: {
            default: 0
        }
    },
    methods: {
        onChange(e) {
            const val = e.target.value;
            this.$emit('percentageChanged', val);
            this.$emit('percentage-changed', val);
        }
    }
}

</script>

<style scoped>

    .label-input-wrapper {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: var(--dark-text-secondary);
        margin-bottom: 12px;
    }

    input {
        width: 60px;
        margin-right: 12px;
        display: block;
        padding: 8px 12px;
        background: var(--dark-bg-tertiary);
        border: 1px solid var(--dark-border);
        border-radius: 6px;
        color: var(--dark-text-primary);
        font-size: 14px;
        transition: all 0.2s ease;
    }

    input:hover {
        border-color: var(--dark-accent);
    }

    input:focus {
        border-color: var(--dark-accent);
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
</style>
