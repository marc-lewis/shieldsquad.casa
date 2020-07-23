<template>
  <section class="memberForm">
    <h1 class="memberForm__title">
      The Choosening
    </h1>
    <h1 class="memberForm__subtitle">
      Which members of SQUAD SHIELD do you need?
    </h1>
    <form
      class="memberForm__form"
      @submit.prevent="updateMembers"
    >
      <ul class="memberForm__list">
        <li
          v-for="member in sortMembers(members)"
          :key="member.name"
          class="memberForm__member"
        >
          <label>
            <input
              v-model="member.present"
              type="checkbox"
              :value="member.name"
            >
            {{ member.name }}
          </label>
        </li>
      </ul>
      <button
        type="submit"
        class="memberForm__submit"
      >
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
    updateMembers () {
      this.$emit('updateMembers', this.members)
    },
    sortMembers (members) {
      return members.sort((a, b) => {
        return a.name > b.name ? 1 : -1
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.memberForm {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-top: 50px;
}
.memberForm__title {
  @include arial;
  color: $zavaBlue;
  display: flex;
  font-size: 80px;
  font-weight: bold;
  margin-top: 20px;
}

.memberForm__subtitle {
  @include arial;
  color: $zavaBlue;
  font-size: 25px;
  margin-top: 5px;
}

.memberForm__form {
  @include arial;
  color: $zavaBlue;
  font-size: 18px;
  width: 320px;
}

.memberForm__list {
  @include arial;
  color: black;
  column-count: 2;
  font-size: 16px;
  list-style-type: none;
  margin-top: 25px;
  padding: 0;
}

.memberForm__member {
  font-size: 20px;
  padding: 10px 20px;

  &:hover {
    color: $zavaBlue;
  }

  label,
  input {
    cursor: pointer;
  }
}

.memberForm__submit {
  @include arial;
  background: $zavaBlue;
  border: 2px solid $zavaBlue;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  display: block;
  font-size: 18px;
  font-weight: bold;
  margin: 25px auto 0;
  padding: 15px 40px;

  &:hover {
    background: white;
    color: $zavaBlue;
  }
}
</style>
