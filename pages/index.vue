<template>
  <div>
    <CartPopup ref="popup" />
    <div class="cards" v-if="!cardsLoading">
      <Card
        v-for="card in cards"
        :key="card.pk_id"
        :card="card"
        @show-popup="_showPopup"
      />
    </div>
    <UILoader
      :text="'Загружаю товары...'"
      v-if="cardsLoading || moreContentLoading"
    />
  </div>
</template>

<script>
import { useCartStore } from "~/stores/cart";
export default {
  data: () => ({
    cards: [],
    cardsLoaded: 10,
    itemsToLoad: 10,
    cardsLoading: true,
    moreContentLoading: false,
    cartStore: useCartStore(),
    sb: useSupabase(),
  }),
  methods: {
    async _getCardsData() {
      // this.cardsLoading = true;
      const start = this.cardsLoaded - this.itemsToLoad;
      const res = await this.sb.supabase
        .from("goods")
        .select()
        .range(this.cardsLoaded, this.cardsLoaded + this.itemsToLoad - 1);
      return res.data;
    },
    async _pushCardsData() {
      const res = await this._getCardsData();
      this.cards.push(...res);
      this.cardsLoading = false;
    },
    async _loadMore() {
      this.moreContentLoading = true;
      this.cardsLoaded += this.itemsToLoad;
      await this._pushCardsData();
      this.moreContentLoading = false;
    },
    _showPopup({ name, url }) {
      this.$refs.popup.show(name, url);
    },
  },
  mounted() {
    window.onscroll = (ev) => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        if (!this.cardsLoading) {
          this._loadMore();
        }
      }
    };
  },
  beforeMount() {
    this._pushCardsData();
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
