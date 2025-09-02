<template>
  <ul class="contact" ref="contactList">
    <li ref="phoneItem">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        width="16px"
        height="16px"
        :fill="iconColor">
        <path
          d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"></path>
      </svg>

      <span
        data-field="phone"
        :contenteditable="editing"
        @blur="$emit('edit', $event, 'contact', 'phone')"
        >{{ contact.phone }}</span
      >
    </li>

    <li ref="emailItem">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        width="16px"
        height="16px"
        :fill="iconColor">
        <path
          d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"></path>
      </svg>
      <span
        data-field="email"
        :contenteditable="editing"
        @blur="$emit('edit', $event, 'contact', 'email')"
        >{{ contact.email }}</span
      >
    </li>

    <li ref="addressItem">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        width="16px"
        height="16px"
        :fill="iconColor">
        <path
          d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"></path>
      </svg>
      <span
        data-field="address"
        :contenteditable="editing"
        @blur="$emit('edit', $event, 'contact', 'address')"
        >{{ contact.address }}</span
      >
    </li>
  </ul>
</template>

<script>
import { gsap } from 'gsap';

export default {
  mounted() {
    this.initContactAnimations();
  },
  props: {
    iconColor: String,
    contact: Object,
    editing: Boolean,
  },
  methods: {
    initContactAnimations() {
      // Animate contact items
      const items = [this.$refs.phoneItem, this.$refs.emailItem, this.$refs.addressItem];
      
      items.forEach((item, index) => {
        gsap.fromTo(item,
          { x: -20, opacity: 0 },
          { 
            x: 0, 
            opacity: 1, 
            duration: 0.5, 
            delay: index * 0.1,
            ease: "power2.out" 
          }
        );

        // Add hover animation
        item.addEventListener('mouseenter', () => {
          gsap.to(item, {
            x: 6,
            duration: 0.3,
            ease: "power2.out"
          });
          
          // Animate icon
          const icon = item.querySelector('svg');
          gsap.to(icon, {
            scale: 1.1,
            rotation: 5,
            duration: 0.2,
            ease: "power2.out"
          });
        });

        item.addEventListener('mouseleave', () => {
          gsap.to(item, {
            x: 0,
            duration: 0.3,
            ease: "power2.out"
          });
          
          // Reset icon
          const icon = item.querySelector('svg');
          gsap.to(icon, {
            scale: 1,
            rotation: 0,
            duration: 0.2,
            ease: "power2.out"
          });
        });
      });
    }
  }
};
</script>

<style scoped>
#resume .contact {
  padding-inline-start: 0;
}

.contact li {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 16px;
  padding: 12px 0;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.contact li::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--highlight-color-left);
  border-radius: 2px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.contact li:last-child {
  margin-bottom: 0;
}

.contact li:hover {
  background: rgba(255, 255, 255, 0.05);
  padding-left: 12px;
  margin-left: -12px;
  margin-right: -12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.contact li:hover::before {
  opacity: 1;
}

.contact svg {
  display: inline-block;
  margin-right: 16px;
  opacity: 0.8;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.contact li:hover svg {
  opacity: 1;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.contact span {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.contact li:hover span {
  color: var(--highlight-color-left);
}
</style>