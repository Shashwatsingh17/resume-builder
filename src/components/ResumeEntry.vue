<template>
  <div class="inner-section" :class="{ 'inner-section__editing': editing }">
    <div class="entry-title-row">
      <div
        class="resumeentry-title"
        :contenteditable="editing"
        @blur="$emit('edit', $event, 'title')"
      >
        {{ item.title }}
      </div>
    </div>

    <div class="d-flex justify-content-between">
      <div class="resumeentry-location">
        <span
          :contenteditable="editing"
          @blur="$emit('edit', $event, isEducation ? 'university' : 'company')"
        >
          {{ isEducation ? item.university : item.company }} </span
        >,
        <span
          :contenteditable="editing"
          @blur="$emit('edit', $event, 'location')"
        >
          {{ item.location }}
        </span>
      </div>
      <div
        class="resumeentry-date"
        :contenteditable="editing"
        @blur="$emit('edit', $event, 'date')"
      >
        {{ item.date }}
      </div>
    </div>
    <ul>
      <li
        v-for="(desc, index) in item.description"
        :key="index"
        :contenteditable="editing"
        @blur="$emit('editDesc', $event, index)"
      >
        {{ desc }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    editing: Boolean,
  },
  computed: {
    isEducation() {
      // can be value but also empty string in case edited. but will always be defined if eduction entry
      if (this.item.university === undefined) {
        return false;
      }
      return true;
    },
  },
};
</script>

<style scoped>
.entry-title-row {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.resumeentry-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--highlight-color-right);
}

.inner-section {
  margin-bottom: 24px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(99, 102, 241, 0.1);
}

.inner-section__editing {
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 8px;
  background: rgba(99, 102, 241, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.1);
}

.resumeentry-date,
.resumeentry-location {
  font-size: 13px;
  font-weight: 500;
}

.resumeentry-date {
  font-style: italic;
  color: var(--highlight-color-right);
  font-weight: 600;
}

li {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 8px;
}
</style>
