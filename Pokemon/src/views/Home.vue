<template>
  <div class="home">
    <h1>宝可梦图鉴与对战系统</h1>
    <nav>
      <router-link to="/pokedex">进入图鉴</router-link> |
      <router-link to="/battle">开始对战</router-link>
    </nav>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
}

nav {
  margin-top: 2rem;
}

nav a {
  margin: 0 1rem;
  color: #2c3e50;
  text-decoration: none;
}

nav a:hover {
  color: #42b983;
}
</style>
