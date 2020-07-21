<template>
  <section class="membersPresent">
    <h1>Which members of SQUAD SHIELD are in, today?</h1>
    <form
      class="memberSelect"
      @submit.prevent="changeMembers"
    >
      <label
        v-for="member in members"
        :key="member.name"
      >
        <input
          v-model="member.present"
          type="checkbox"
          :value="member.name"
        >
        {{ member.name }}
      </label>
      <button type="submit">
        Spin!
      </button>
    </form>
  </section>
</template>

<script>
export default {
  name: 'MemberForm',
  props: {
    members: {
      type: Array,
      required: true
    }
  },
  methods: {
    changeMembers () {
      this.$emit('changeMembers', this.members)
    }
  }
}
</script>
