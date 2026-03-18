<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-4"
  >
    <div class="md:hidden bg-black bg-opacity-95 border-t border-forest-green backdrop-blur-sm">
      <nav class="container mx-auto px-4 py-4">
        <div class="flex flex-col space-y-3">
          <router-link 
            v-for="item in items"
            :key="item.path"
            :to="item.path"
            @click="$emit('close')"
            class="nav-link text-gray-medium hover:text-white py-3 px-2 border-b border-forest-green border-opacity-30 transition-colors duration-300"
            active-class="text-white"
          >
            {{ item.label }}
          </router-link>
        </div>
      </nav>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  }
})

defineEmits(['close'])
</script>

<style scoped>
.router-link-active {
  @apply text-mystical-gold;
}
</style> 