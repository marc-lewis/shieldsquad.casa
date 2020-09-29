<template>
  <section class="slotMachine">
    <div class="slotMachine__face">
      <template v-for="i in reels">
        <reel
          :key="i"
          :members="members"
          :reel-index="i"
          :card-winner="cardWinner"
        />
      </template>
    </div>
    <zava-button v-if="!selectingMember" @click.native="selectMember">
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
    members: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      selectingMember: false,
      reels: [1],
      cardWinner: ''
    }
  },
  methods: {
    /**
     * Select a random member
     */
    selectMember () {
      this.selectingMember = true
      // get random member
      this.selectedMember = this.members[
        Math.round(Math.random() * (this.members.length - 1))
      ].name
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
