<template>
  <main class="standup">
    <h1 class="standup__title">
      The Choosening
    </h1>
    <member-form
      v-if="!slotMachineActive"
      :members="squadMembers"
      @updateMembers="showQuestionnaire($event)"
    />
    <slot-machine
      v-else
      :cards="membersPresent"
    />
  </main>
</template>
<script>
import { createClient } from '~/plugins/contentful.js'
import MemberForm from '~/components/MemberForm'
import SlotMachine from '~/components/SlotMachine/SlotMachine'

const client = createClient()

export default {
  components: {
    MemberForm,
    SlotMachine
  },
  asyncData ({ env }) {
    return Promise.all([
      client.getEntries({
        'sys.id': env.CTF_SQUAD_ID
      })
    ]).then(([entries]) => {
      const squadMembers = entries.items[0].fields.members.map((member) => {
        return {
          name: member.fields.name,
          present: true
        }
      })

      return {
        squadMembers: squadMembers.sort((a, b) => {
          return a.name > b.name ? 1 : -1
        })
      }
    }).catch(console.error)
  },
  data: () => {
    return {
      slotMachineActive: false,
      membersPresent: []
    }
  },
  methods: {
    showQuestionnaire (members) {
      this.membersPresent = members.filter((member) => {
        return member.present
      })
      if (this.membersPresent.length <= 1) {
        this.membersPresent = [
          { name: 'yes' },
          { name: 'no' },
          { name: 'maybe' },
          { name: 'spin again' }
        ]
      }
      this.slotMachineActive = true
    }
  }
}
</script>
<style lang="scss">
.standup {
  align-items: center;
  display: flex;
  flex-direction: column;
}

.standup__title {
  @include arial;
  color: $zavaBlue;
  font-size: 80px;
  font-weight: bold;
  margin-top: 20px;
}
</style>
