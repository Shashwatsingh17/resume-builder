<template>
    <h4 class="section-headline" :contenteditable="editing" @blur="notifyParent">{{ headline }}</h4>
</template>

<script>
    export default {
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
            notifyParent(event) {
                this.$emit("headlineEdited", event.target.innerText);
            }
        }
    }
</script>


<style scoped>
    .section-headline {
        font-size: 18px;
        font-weight: var(--headline-weight);
        margin-bottom: 16px;
        margin-top: 0;
        letter-spacing: 0.5px;
    }

    .left-col .section-headline {
        border-bottom: 1px solid var(--highlight-color-left);
        padding-bottom: 8px;
        margin-right: -30px;
        padding-right: 30px;
        color: var(--highlight-color-left);
        text-transform: uppercase;
        font-size: 14px;
        font-weight: 600;
    }

    .right-col .section-headline {
        color: var(--highlight-color-right);
        font-size: 20px;
    }
</style>