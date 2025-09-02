<template>
    <label>
        <select class="custom-input" @change="$emit('updateSelection', $event.target.value)">
            <option
                v-for="option in options"
                :key="option.value"
                :value="option.value"
                :selected="defaultOption == option.value">
                {{ option.name }}
            </option>
        </select>
        {{ label }}
    </label>
</template>

<script>
    export default {
        props: {
            label: String,
            options: Array,
            defaultOption: String
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

    select {
        display: inline-block;
        min-width: 120px;
        padding: 10px 32px 10px 12px;
        background: var(--dark-bg-tertiary) url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='%23888888' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e") right 12px center/8px 10px no-repeat;
        appearance: none;
        margin-right: 12px;
        border: 1px solid var(--dark-border);
        border-radius: 8px;
        color: var(--dark-text-primary);
        font-size: 14px;
        transition: all 0.2s ease;
    }

    select:hover {
        border-color: var(--dark-accent);
    }

    select:focus {
        border-color: var(--dark-accent);
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
</style>