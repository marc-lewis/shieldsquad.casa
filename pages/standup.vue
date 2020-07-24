<template>
  <main>
    <member-form
      v-if="!slotMachineActive"
      :members="squadMembers"
      @updateMembers="showQuestionnaire($event)"
    />
    <slot-machine
      v-else
      :members="membersPresent"
    />
  </main>
</template>
<script>
import { createClient } from '~/plugins/contentful.js'
import { MemberForm } from '~/components/MemberForm'
import { SlotMachine } from '~/components/SlotMachine/SlotMachine'

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
      this.slotMachineActive = true
    }
  }
}
</script>
