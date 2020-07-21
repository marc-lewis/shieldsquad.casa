<template>
  <section class="slotMachine">
    {{ members }}
    <!-- background -->
    <!-- bandit -->
    <!-- overlay -->
  </section>
</template>

<script>
export default {
  name: 'SlotMachine',
  props: {
    members: {
      type: Array,
      default: () => { return [] }
    }
  }
}
</script>
