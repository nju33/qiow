<template>
  <aside class="user-board__box" :class="$theme.userBoard">
    <div class="user-board__user">
      <img
        class="user-board__user-img"
        :class="$theme.userBoardImg"
        :src="profileImageUrl"
      />
      <h2
        class="user-board__user-name"
        :class="$theme.userBoardName"
      >{{name}}</h2>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'user-board',
  props: {
    name: {
      required: true,
      type: String
    },
    profileImageUrl: {
      required: true,
      type: String
    }
  }
}
</script>

<style scoped>
.user-board__box {
  min-width: 10em;
  max-width: 10em;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.user-board__user {
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 0 2em;
  margin: 0 auto;
}

.user-board__user-img {
  border-radius: 50%;
  width: 5em;
}

.user-board__user-name {
  font-weight: normal;
  font-size: 1.2em;
  border-radius: 1em;
}
</style>
