<template>
  <div>
    <el-button type="info" @click="logOut">退出</el-button>
  </div>

</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    logOut() {
      sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="sass" scoped>

</style>>
