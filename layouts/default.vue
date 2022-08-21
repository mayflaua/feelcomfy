<template>
  <div class="container">
    <TheNav></TheNav>
    <main class="content"><slot /></main>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 80vw;
  margin: 0 auto;
  overflow: hidden;

  @media (max-width: 1600px) {
    width: 90vw;
  }
  @media (max-width: 1400px) {
    width: 100vw;
  }
}

.content {
  margin: 50px 0 0 0;
}
</style>
