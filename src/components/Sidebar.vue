<template>
    <div class="sidebar">
        <slot></slot>
    </div>
</template>


<style>
    .sidebar {
        width: 320px;
        padding: 32px 24px;
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        background: var(--dark-bg-secondary);
        border-right: 1px solid var(--dark-border);
        overflow-y: auto;
        backdrop-filter: blur(10px);
    }

    .sidebar label {
        margin-bottom: 16px;
        font-size: 14px;
        color: var(--dark-text-secondary);
        font-weight: 500;
    }

    .sidebar .btn {
        margin-bottom: 12px;
    }

    .sidebar-section {
        background: var(--dark-bg-tertiary);
        border: 1px solid var(--dark-border);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 24px;
        transition: all 0.2s ease;
    }

    .sidebar-section:hover {
        border-color: var(--dark-accent);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
    }
</style>