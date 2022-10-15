<template>
  <div class="nav__search-form">
    <input
      v-model.trim="searchQuery"
      class="search-form__input"
      placeholder="Найти товары"
      type="text"
      ui-input
      @blur="suggestionsList = []"
      @input="getSuggestions"
      @keydown.enter="handleSearchClick(searchQuery)"
    >
    <button
      class="search-form__search-btn"
      @click="handleSearchClick(searchQuery)"
    >
      <span class="search-btn__icon dark-invert" />
    </button>
    <button class="nav__burger dark-invert" @click="$emit('open-aside')">
      <span class="burger__line" />
    </button>
    <transition name="list">
      <div
        v-if="suggestionsList.length !== 0"
        :class="{'suggestions-list--disabled':
          fetchingSuggestions}"
        class="suggestions-list"
      >
        <transition-group name="list">
          <p key="history-label" class="suggestion__label">
            Вы недавно искали:
          </p>
          <p v-for="item in searchHistory" :key="item" class="suggestion" @click="handleSearchClick(item)">
            {{ item }}
          </p>
          <p key="results-label" class="suggestion__label">
            Результаты поиска:
          </p>

          <p v-for="item in suggestionsList" :key="item" class="suggestion" @click="handleSearchClick(item)">
            {{ item }}
          </p>
        </transition-group>
      </div>
    </transition>
  </div>
</template>

<script setup>

import useSearch from '@/composables/useSearch'

const emit = defineEmits(['open-aside'])

const search = useSearch()

const suggestionsList = ref([])
const searchHistory = ref([])

const fetchingSuggestions = ref(false)
const searchQuery = ref('')

const handleSearchClick = async (query) => {
  if (query) {
    await navigateTo({
      path: '/search',
      query: {
        q: query
      }
    })
    searchQuery.value = ''
  }
}
const getSuggestions = async () => {
  if (searchQuery.value) {
    fetchingSuggestions.value = true
    const { res, history } = await search.fetchSuggestions(searchQuery.value)
    suggestionsList.value = res
    searchHistory.value = history
    fetchingSuggestions.value = false
  } else {
    suggestionsList.value = []
  }
}

</script>

<style lang="scss" scoped>

.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(15px);
}

.nav__search-form {
  flex-grow: 1;

  height: 100%;
  display: flex;
  position: relative;

  &:hover {
    & > .search-form__input,
    & > .search-form__search-btn {
      border-color: $dark;
    }
  }

  .suggestions-list {
    overflow: auto;

    width: 100%;
    max-height: 300px;
    height: min-content;

    position: absolute;
    z-index: 1;
    top: 95%;
    left: 0;

    padding: 0.4rem 0 0 0;

    background-color: $light;
    border: 1px solid $default;
    border-radius: 0 0 3px 3px;

    &--disabled {
      opacity: 0.7;
      pointer-events: none;
    }

    .suggestion {
      font-size: 0.9rem;
      padding: 0.35rem 1rem;
      margin: 0;

      cursor: pointer;

      &:hover {
        background-color: lighten($blue, 10);
        color: white;
      }

      &__label {
        font-style: italic;
        font-size: 0.8rem;
        margin: 0;
        padding: 0.6rem 1rem 0.35rem 1rem;
        font-weight: 500;
        color: $dark;
      }
    }
  }

  @media (max-width: 768px) {
    width: 98%;
    padding: 0 10px;
    flex-direction: row-reverse;
    height: 40px;
    justify-content: center;
    order: 1;
  }

  .nav__burger {
    display: none;
    background: none;
    position: relative;
    outline: none;
    border: none;
    min-width: 30px;
    height: 40px;
    padding: 0;

    cursor: pointer;

    margin: 0 15px 0 auto;

    .burger__line {
      width: 100%;
      height: 4px;
      background: black;
      position: absolute;
      top: calc(50% - 2px);
      left: 0;

      border-radius: 2px;

      &:after,
      &:before {
        border-radius: 2px;

        content: "";
        width: 100%;
        height: 4px;
        background: black;
        position: absolute;
        top: calc(50% - 10px);
        left: 0;
      }

      &:after {
        top: calc(50% + 6px);
      }
    }

    @media (max-width: 768px) {
      display: block;
    }
  }

  .search-form {

    &__input {
      width: 100%;
      height: 100%;

      z-index: 2;
      position: relative;

      border: 1px solid $default;
      border-radius: 5px 0 0 5px;
      border-right: none;
      outline: none;

      padding: 5px 15px;

      @media (max-width: 768px) {
        border-radius: 0 5px 5px 0;
        border-left: none;
        border-right: 1px solid $default;
        width: 90%;
      }
    }

    &__search-btn {
      min-width: 40px;

      z-index: 2;
      position: relative;

      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      border: 1px solid $default;
      outline: none;
      border-left: none;
      cursor: pointer;

      background-color: $light;

      .search-btn__icon {
        width: 100%;
        height: 100%;
        display: block;
        background: url("~/assets/icons/search.webp") no-repeat center/18px;
      }

      @media (max-width: 768px) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        border-right: none;
        border-left: 1px solid $default;
        background-color: transparent;

        width: 10%;
      }
    }
  }
}

</style>
