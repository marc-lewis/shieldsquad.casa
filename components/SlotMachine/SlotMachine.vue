<template>
  <section class="slotMachine">
    <div class="slotMachine__reel">
      <div
        v-for="member in reelOne"
        :key="member"
        class="slotMachine__card"
      >
        {{ member }}
      </div>
    </div>
    <div class="slotMachine__reel">
      <div
        v-for="member in reelTwo"
        :key="member"
        class="slotMachine__card"
      >
        {{ member }}
      </div>
    </div>
    <div class="slotMachine__reel">
      <div
        v-for="member in reelTwo"
        :key="member"
        class="slotMachine__card"
      >
        {{ member }}
      </div>
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
  computed: {
    reelOne () {
      return this.getRandomisedOrderOfMembers()
    },
    reelTwo () {
      return this.getRandomisedOrderOfMembers()
    }
  },
  mounted () {
    this.setUpSlotMachine()
  },
  methods: {
    /**
     * @see {@link https://stackoverflow.com/a/2450976}
     * @returns Array
     */
    shuffle (array) {
      let currentIndex = array.length
      let temporaryValue, randomIndex

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
      }

      return array
    },

    /**
     * @returns Array
     */
    getRandomisedOrderOfMembers () {
      const membersClone = this.members.map(x => x.name)
      return this.shuffle(membersClone)
    },

    /**
     * Position the cards within a reel
     */
    setUpReel (reel) {
      const cards = reel.querySelectorAll('.slotMachine__card')
      const numOfCards = cards.length
      const spokeAngle = 360 / numOfCards
      const cardHeight = 80 // see height of .slotMachine__card
      const distanceToCard = (cardHeight / 2) / Math.tan(Math.tan(Math.PI / numOfCards))

      reel.style.marginTop = `${distanceToCard}px`
      for (let i = 0; i < numOfCards; i++) {
        cards[i].style.transform = `rotateX(${(spokeAngle) * (i)}deg) translateZ(${distanceToCard}px)`
      }
    },

    /*
     * Apply 3d transforms for cards
     * @returns {void}
     */
    setUpSlotMachine () {
      const reels = document.querySelectorAll('.slotMachine__reel')
      for (let i = 0; i < reels.length; i++) {
        this.setUpReel(reels[i])
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.slotMachine {
  display: flex;
  flex-direction: row;
  justify-content: center;
  perspective: 1000px;
}
.slotMachine__reel {
  animation: 2s rotateReel linear infinite;
  height: 80px;
  position: relative;
  transform-style: preserve-3d;
  width: 120px;
}
.slotMachine__card {
  @include arial;
  align-items: center;
  backface-visibility: hidden;
  border: 2px solid $zavaBlue;
  border-radius: 5px;
  color: $zavaBlue;
  display: flex;
  font-weight: bold;
  height: 80px;
  justify-content: center;
  position: absolute;
  text-transform: uppercase;
  transform-style: preserve-3d;
  width: 120px;
}
@keyframes rotateReel {
  0% {
    transform: rotateX(0deg);
  }
  100% {
    transform: rotateX(-359deg);
  }
}
</style>
