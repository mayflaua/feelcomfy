<template>
  <div class="admin-panel">
    <button :class="{'burger--active': isMenuVisible}" class="burger" @click="isMenuVisible = !isMenuVisible">
      <span class="burger__line" />
    </button>
    <aside :class="{'admin-panel__aside--visible': isMenuVisible}" class="admin-panel__aside">
      <div class="aside__header" @click="currentComponent = InfoPage">
        FeelComfy Admin
      </div>
      <ul class="aside__menu">
        <li
          v-for="item in asideLinks"
          :key="item.label"
          :class="`menu__item--${item.classLabel}`"
          class="menu__item"
          @click="currentComponent=item.component"
        >
          {{ item.label }}
        </li>
      </ul>
    </aside>
    <div class="admin-panel__body">
      <Suspense>
        <component :is="currentComponent" />
        <template #fallback>
          <UILoader fullscreen v2 />
        </template>
      </Suspense>
    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import AddProduct from '~/components/Admin/AddProduct'
import InfoPage from '~/components/Admin/InfoPage'

const EditProducts = defineAsyncComponent({
  loader: () => import('~/components/Admin/EditProducts')
})

definePageMeta({
  layout: false,
  middleware: 'only-dev'
})

const isMenuVisible = ref(false)

const currentComponent = shallowRef(InfoPage)

const asideLinks = [
  {
    label: 'Добавить товар',
    component: AddProduct,
    classLabel: 'add'
  },
  {
    label: 'Редактировать товары',
    component: EditProducts,
    classLabel: 'edit'
  }
]
</script>

<style lang="scss" scoped>

.admin-panel {
  display: flex;

  .burger {
    background: none;
    z-index: 3;
    position: fixed;
    outline: none;
    border: none;
    min-width: 30px;
    height: 40px;
    padding: 0;

    cursor: pointer;

    margin: 5px 10px;

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
        transition: all 0.2s ease;
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

    &--active {
      .burger__line {
        &:before,
        &:after {
          width: 60%;
          left: -3px;
        }

        &:before {
          transform: rotate(-45deg);
          top: -5px;
        }

        &:after {
          transform: rotate(45deg);
          top: 5px;
        }
      }
    }

  }

  &__aside {
    box-shadow: 0 3px 3px 3px rgba(black, 0.2);
    position: fixed;
    top: 0;
    left: 0;
    width: 300px;
    height: 100vh;
    background-color: $light;

    transform: translateX(calc(-100% + 50px));
    transition: transform 0.5s ease, box-shadow 0.4s ease;

    &--visible {
      box-shadow: 0 3px 60px 3px rgba(black, 0.6);
      transform: none;
    }

    .aside__header {
      width: 100%;
      height: 50px;
      line-height: 50px;
      font-size: 1.4rem;
      font-weight: 600;

      text-align: center;
      color: $bg;
      background-color: $blue;
    }

    .aside__menu {
      list-style: none;
      padding: 0;

      .menu__item {
        padding: 0 0 0 15px;
        font-size: 1.1rem;
        height: 40px;
        line-height: 40px;
        cursor: pointer;

        background-position: 96%;
        background-size: 28px;
        background-repeat: no-repeat;

        &:hover {
          background-color: darken($light, 10)
        }

        &--add {
          background-image: url('~/assets/icons/add.png')
        }

        &--edit {
          background-image: url('~/assets/icons/edit.png')
        }
      }
    }
  }

  &__body {
    flex-grow: 1;
    max-width: calc(100% - 50px);
    overflow-x: hidden;
    padding: 30px;
    margin-left: 50px;
  }
}
</style>
