<template>
  <div>
    <div class="cards" v-if="cards.length > 0">
      <Card v-for="card in cards" :key="card.id" :card="card" />
    </div>
    <!-- TODO: loading component -->
    <div v-else>LOADING...</div>
    <button @click="_add">ADd more</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    cards: [],
    cardsLoaded: 10,
    itemsToLoad: 10,
    cardsLoading: false,
    store: null,
  }),

  methods: {
    async _getCardsData() {
      this.cardsLoading = true;
      const start = this.cardsLoaded - this.itemsToLoad;
      const res = await $fetch(
        `/api/cards?start=${start}&limit=${this.itemsToLoad}`
      );
      this.cardsLoading = false;
      return res;
    },
    _pushCardsData() {
      this._getCardsData().then((res) => this.cards.push(...res));
    },

    _add() {
      this.cardsLoading = true;
      this.cardsLoaded += this.itemsToLoad;
      this._pushCardsData();
      this.cardsLoading = false;
    },
  },

  mounted() {
    this._pushCardsData();

    window.onscroll = (ev) => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        if (!this.cardsLoading) {
          this._add();
        }
      }
    };
  },
};
</script>

<style lang="scss" scoped>
.cards {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-row-gap: 30px;
  grid-column-gap: 20px;
  justify-items: center;

  @media (max-width: 1500px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 1300px) {
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 10px;
  }
  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
