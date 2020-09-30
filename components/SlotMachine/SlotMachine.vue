<template>
  <section class="slotMachine">
    <div class="slotMachine__face">
      <template v-for="i in numOfReels">
        <reel
          :key="i"
          :cards="cards"
          :reel-index="i"
          :selected-card="selectedCard"
          @updateReelState="updateReelState($event)"
        />
      </template>
    </div>
    <zava-button
      v-if="showSpinButton"
      @click.native="selectCard"
    >
      SPIN
    </zava-button>
  </section>
</template>

<script>
import ZavaButton from '~/components/ZavaButton'
import Reel from '~/components/SlotMachine/Reel'

export default {
  name: 'SlotMachine',
  components: {
    Reel,
    ZavaButton
  },
  props: {
    cards: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      selectingCard: false,
      reelsRegistered: false,
      numOfReels: 4,
      selectedCard: '',
      reels: {},
      reelRegistrationWatcher: null
    }
  },
  computed: {
    showSpinButton () {
      return !this.selectingCard && this.reelsRegistered
    }
  },
  watch: {
    reels: {
      handler (reels) {
        // eslint-disable-next-line
        for (const [reelIndex, reelAnimation] of Object.entries(reels)) {
          if (reelAnimation === 'selection') {
            this.selectingCard = true
            return
          }
        }
        this.selectingCard = false
      },
      deep: true
    }
  },
  created () {
    this.reelRegistrationWatcher = this.$watch('reels', this.reelRegistrationHandler, { deep: true })
  },
  methods: {
    /**
     * Select a random card
     */
    selectCard () {
      this.selectedCard = this.cards[
        Math.round(Math.random() * (this.cards.length - 1))
      ].name
    },
    /**
     * Register a wheel
     * @listens updateReelState
     */
    updateReelState (reelState) {
      this.$set(this.reels, reelState.reelIndex, reelState.spinType)
    },
    /**
     * Wait for all reels to be registered
     * By calling the watcher again we will 'unwatch'
     * @link https://vuejs.org/v2/api/#vm-watch
     */
    reelRegistrationHandler (oldVal, newVal) {
      if (Object.keys(this.reels).length === this.numOfReels) {
        this.reelsRegistered = true
        this.reelRegistrationWatcher()
      }
    }
  }
}

</script>

<style lang="scss" scoped>
.slotMachine {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-top: 50px;
}
.slotMachine__face {
  animation: sway 20s ease-in-out infinite;
  display: flex;
  flex-direction: row;
  justify-content: center;
  perspective: 2000px;
  transform-style: preserve-3d;
}

@keyframes sway {
  0% {
    transform: rotateY(0deg);
  }
  25% {
    transform: rotateY(-15deg);
  }
  50% {
    transform: rotateY(0deg);
  }
  75% {
    transform: rotateY(15deg);
  }
}
</style>
