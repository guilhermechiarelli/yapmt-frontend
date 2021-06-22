<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline: 0;
}

body {
  -webkit-font-smoothiing: antialiased;
}

#app {
  width: 100vw;
  min-height: 100vh;
  background-color: #0d1117;
  color: #f1f1f1;
}

body,
input,
button {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
}

h1,
h2,
h3,
h4,
hanging-punctuation,
h6,
strong {
  font-weight: 500;
}

button {
  cursor: pointer;
}
</style>
