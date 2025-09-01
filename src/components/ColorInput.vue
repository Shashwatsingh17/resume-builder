<template>
    <label>
        <input type="color"
            class="color-picker"
            @input="$emit('colorChanged', $event.target.value)"
            :value="defaultColor"
        >
        {{ label }}
    </label>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            default: "Choose a color"
        },
        defaultColor: {
            type: String
        }
    }
}
</script>


<style scoped>
    label {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: var(--dark-text-secondary);
        margin-bottom: 12px;
    }
    
    .color-picker {
        margin-right: 12px;
        width: 32px;
        height: 32px;
        padding: 0;
        border: 2px solid var(--dark-border);
        border-radius: 6px;
        background: transparent;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .color-picker:hover {
        border-color: var(--dark-accent);
        transform: scale(1.05);
    }
</style>