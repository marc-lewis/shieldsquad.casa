<template>
  <section class="slotMachine">
    <div class="ring">
      {{ members }}
    </div>
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
  },
  methods: {
    shuffle (array) {
      let currentIndex = array.length
      let temporaryValue, randomIndex

      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
      }

      return array
    },

    /**
     * Clone the members names and
     * @returns {*}
     */
    getRandomRingArray () {
      const membersClone = this.members.map((x) => x.name)
      return this.shuffle(membersClone)

    }
  }
}
</script>
