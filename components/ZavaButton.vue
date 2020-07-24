<template>
  <button
    class="zavaButton"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'ZavaButton'
}
</script>

<style lang="scss" scoped>
.zavaButton {
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
  padding: 10px 30px;

  &:hover {
    background: white;
    color: $zavaBlue;
  }
}
</style>
