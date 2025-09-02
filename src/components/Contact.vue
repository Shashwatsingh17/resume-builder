<template>
  <ul class="contact" ref="contactList">
    <li ref="phoneItem">
      <i class="pi pi-phone contact-icon" :style="{ color: iconColor }"></i>

      <span
        data-field="phone"
        :contenteditable="editing"
        @blur="$emit('edit', $event, 'contact', 'phone')"
        >{{ contact.phone }}</span
      >
    </li>

    <li ref="emailItem">
      <i class="pi pi-envelope contact-icon" :style="{ color: iconColor }"></i>
      <span
        data-field="email"
        :contenteditable="editing"
        @blur="$emit('edit', $event, 'contact', 'email')"
        >{{ contact.email }}</span
      >
    </li>

    <li ref="addressItem">
      <i class="pi pi-map-marker contact-icon" :style="{ color: iconColor }"></i>
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
    try {
      this.initContactAnimations();
    } catch (error) {
      console.error('Contact component mount error:', error);
    }
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

.contact .contact-icon {
  display: inline-block;
  margin-right: 16px;
  opacity: 0.9;
  font-size: 1rem;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.contact li:hover .contact-icon {
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
