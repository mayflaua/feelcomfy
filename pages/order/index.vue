<template>
  <div class="order">
    <h1 class="order__title">
      Оформление заказа
    </h1>

    <div class="order__body">
      <div class="delivery-block-wrapper">
        <div class="order__delivery-block">
          <p class="delivery-block__title">
            Способ получения и адрес доставки:
          </p>

          <div class="delivery-block__city">
            <p class="city__title">
              Город доставки
            </p>
            <v-select
              :clearable="false"
              :options="cities"
              class="city__input"
            />
          </div>

          <div class="delivery-block__pick-method">
            <p class="pick-method__title">
              Способ получения
            </p>
            <div class="pick-method">
              <div class="pick-method__pvz">
                <UIRadio disabled />
                <div class="pvz__title">
                  Пункт выдачи FeelComfy
                  <p>Пока у нас нет собственных пунктов выдачи :(</p>
                </div>
              </div>
              <div class="pick-method__courier">
                <UIRadio selected />
                <p class="courier__title">
                  Курьером до двери
                </p>
              </div>
            </div>
          </div>

          <form class="delivery-block__form">
            <div class="form__street">
              <p class="street__label">
                Улица, дом
              </p>
              <input class="street__input" type="text">
            </div>
            <div class="form__apartment">
              <p class="apartment__label">
                Квартира/офис
              </p>
              <input class="apartment__input" type="text">
            </div>
            <div class="form__entrance">
              <p class="entrance__label">
                Подъезд
              </p>
              <input class="entrance__input" type="text">
            </div>
            <div class="form__floor">
              <p class="floor__label">
                Этаж
              </p>
              <input class="floor__input" type="text">
            </div>
            <div class="form__code">
              <p class="code__label">
                Код домофона
              </p>
              <input class="code__input" type="text">
            </div>
            <div class="form__comment">
              <p class="comment__label">
                Комментарий для курьера
              </p>
              <input class="comment__input" type="text">
              <span class="comment__subtitle">
                Например, куда именно привезти заказ, ближайший адрес или
                ориентир
              </span>
            </div>
          </form>
        </div>
      </div>
      <div class="receiver-block-wrapper">
        <div class="order__receiver-block">
          <p class="receiver-block__title">
            Получатель заказа:
          </p>
          <form ref="form" class="receiver-block__form" @input="checkValid">
            <div class="form__last-name">
              <p class="last-name__label">
                Фамилия
              </p>
              <input
                class="last-name__input"
                placeholder="Введите фамилию"
                required
                type="text"
              >
            </div>
            <div class="form__first-name">
              <p class="first-name__label">
                Имя
              </p>
              <input
                class="first-name__input"
                placeholder="Введите имя"
                required
                type="text"
              >
            </div>
            <div class="form__courier-tip">
              <p class="tip">
                Мы пришлем уведомление о статусе заказа на указанные вами
                телефон и email.
              </p>
              <p class="tip">
                Курьер свяжется с вами по телефону для уточнения времени
                доставки.
              </p>
            </div>
            <div class="form__phone">
              <p class="phone__label">
                Номер телефона
              </p>
              <input
                class="phone__input"
                placeholder="Введите номер телефона"
                required
                type="tel"
              >
            </div>
            <div class="form__email">
              <p class="email__label">
                Электронная почта
              </p>
              <input
                class="email__input"
                placeholder="Введите email"
                required
                type="email"
              >
            </div>
          </form>
        </div>
        <div class="subscription">
          <UICheckbox class="subscription__checkbox" />
          <span
            class="subscription__label"
          >Подписаться на наши новости и акции. Вы будете одними из первых
            узнавать о новых скидках, акциях и распродажах.</span>
        </div>
      </div>
      <div class="payment-block-wrapper">
        <div class="order__payment-block">
          <p class="payment-block__title">
            Способ оплаты
          </p>
          <div class="payment__method">
            <div class="method__card">
              <UIRadio class="radio" selected />
              <p class="title">
                Картой онлайн
                <span>Принимаем Visa, Mastercard и Мир</span>
              </p>
            </div>
            <div class="method__installment">
              <UIRadio class="radio" disabled />
              <p class="title">
                Рассрочка без переплат
                <span>Доступно в настоящих интернет-магазинах</span>
              </p>
            </div>
            <div class="method__doli">
              <UIRadio class="radio" disabled />
              <p class="title">
                Оплата "Долями"<span>Доступно в настоящих интернет-магазинах</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="goods-block">
        <p class="goods-block__title" @click="showGoodsList = !showGoodsList">
          Товары в заказе
          <svg
            :class="showGoodsList ? 'arrow--up' : ''"
            class="arrow"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.21967 9.21967C5.51256 8.92678 5.98744 8.92678 6.28033 9.21967L12 14.9393L17.7197 9.21967C18.0126 8.92678 18.4874 8.92678 18.7803 9.21967C19.0732 9.51256 19.0732 9.98744 18.7803 10.2803L12.5303 16.5303C12.2374 16.8232 11.7626 16.8232 11.4697 16.5303L5.21967 10.2803C4.92678 9.98744 4.92678 9.51256 5.21967 9.21967Z"
            />
          </svg>
        </p>
        <div v-if="showGoodsList" class="goods-list">
          <CartItem
            v-for="item in order"
            :key="item.id"
            :item-info="item"
            class="list__item"
            no-input
          />
        </div>
      </div>
    </div>
    <div class="order__order-info">
      <p class="info__title">
        Ваш заказ
        <nuxt-link
          class="link"
          to="/cart"
        >
          Перейти в корзину
        </nuxt-link>
      </p>
      <p class="info__worth">
        Товары ({{ order?.length || 0 }}):
        <span>{{ orderWorthFormatted }}</span>
      </p>
      <p class="info__delivery">
        Доставка:
        <span>{{ deliveryWorthFormatted }}</span>
      </p>
      <p class="info__total">
        Итого:
        <span>{{ formatter.format(deliveryWorth + orderWorth) }}</span>
      </p>
      <UIButton
        :disabled="!formValid"
        class="btn"
        value="Подтвердить и оплатить"
        @click="handleSubmitButton"
      />
    </div>
  </div>
</template>

<script setup>
import 'vue-select/dist/vue-select.css'

useHead({
  title: 'Оформление заказа - FeelComfy'
})

definePageMeta({
  middleware: 'auth',
  meta: [
    { name: 'robots', content: 'none, noyaca, noarchive' }
  ]
})

const vSelect = defineAsyncComponent({
  loader: () => import('vue-select')
})

const { user } = useAuth()
const { supabase } = useSupabase()
const pageMeta = definePageMeta({
  middleware: ['auth']
})
const order = ref(null)
const cities = await $fetch('/api/cities')

const showGoodsList = ref(false)

const getQueryData = () => {
  /* get order_id from query and clear query */
  const router = useRouter()
  if (router.currentRoute.value.query.order) {
    const orderID = router.currentRoute.value.query.order
    router.replace({ query: null })
    return orderID
  } else {
    navigateTo('/')
  }
}

const getOrderInfo = async (id) => {
  try {
    /* get order info from database */
    const response = await supabase
      .from('orders')
      .select('order')
      .eq('order_id', id)

    /* list all goods ids */
    const ids = response?.data[0].order.map(item => item.id)

    /* select goods with listed ids from database */
    const goods = await supabase
      .from('goods')
      .select('title, image_url, model, color, pk_id')
      .in('pk_id', ids)

    /* push price and qty from order to goods list */
    goods.data.forEach((item) => {
      const index =
        response.data[0].order[
          response.data[0].order.findIndex(i => i.id == item.pk_id)
        ]
      item.qty = index.qty
      item.final_price = index.price
    })

    return goods.data
  } catch (err) {
    throw err
  }
}
const orderWorth = computed(() =>
  order.value?.reduce((acc, curr) => acc + curr.qty * curr.final_price, 0)
)
const orderWorthFormatted = computed(() => formatter.format(orderWorth.value))

const deliveryWorth = computed(() => (orderWorth.value < 8000 ? 1000 : 0))
const deliveryWorthFormatted = computed(() =>
  formatter.format(deliveryWorth.value)
)

const form = ref()
const formValid = ref(false)
const checkValid = () =>
  (formValid.value = Array.from(form.value.elements)
    .map(item => item.validity.valid)
    .every(Boolean))

const handleSubmitButton = async () => {
  if (formValid.value) {
    const router = useRouter()
    router.push({ name: 'order-success', query: { referrer: 'order' } })
  }
}

/* currency formatter */
const formatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0
})

onBeforeMount(async () => {
  order.value = await getOrderInfo(getQueryData())
})
</script>

<style lang="scss" scoped>
.order {
  min-height: 200px;
  display: grid;
  grid-auto-columns: 1fr;
  grid-template-columns: 1.4fr 0.6fr;
  grid-template-rows: 70px 1fr;
  gap: 0 15px;
  grid-template-areas:
    "title title"
    ". .";

  &__title {
    font-size: 1.4rem;
    font-weight: 600;
    grid-area: title;
  }

  &__body {
    .delivery-block-wrapper,
    .receiver-block-wrapper,
    .payment-block-wrapper {
      padding: 10px 20px;
      border: 1px solid $default;
      margin: 0 0 20px 0;

      .order__delivery-block {
        width: 500px;

        .delivery-block {
          &__title {
            font-size: 1.2rem;
            font-weight: 500;
          }

          &__city {
            .city__title {
              font-size: 0.9rem;
              margin: 10px 0;
            }
          }

          &__pick-method {
            .pick-method {
              &__title {
                font-size: 0.9rem;
                margin: 30px 0 10px 0;
              }

              &__pvz,
              &__courier {
                background-color: $light;
                padding: 15px 25px;
                display: flex;
                align-items: center;
                gap: 15px;
                font-weight: 500;
                font-size: 0.95rem;
                margin: 20px 0;
              }

              .pvz__title {
                p {
                  font-size: 0.85rem;
                  color: $dark;

                  margin: 4px 0;
                }
              }
            }
          }
        }

        .delivery-block__form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr 1fr 1fr;
          gap: 0 15px;
          grid-template-areas:
            "first-row first-row"
            ". ."
            ". ."
            "fourth-row fourth-row";
        }

        .form {
          &__street,
          &__apartment,
          &__entrance,
          &__floor,
          &__code,
          &__comment {
            p {
              font-size: 0.95rem;
            }

            input {
              width: 100%;
              height: 35px;
              border: 1px solid $default;
              border-radius: 3px;
              outline: none;
              padding: 3px 20px;
              font-size: 0.9rem;

              &:focus {
                border-color: black;
              }
            }
          }

          &__street {
            grid-area: first-row;
          }

          &__comment {
            grid-area: fourth-row;

            .comment__subtitle {
              font-size: 0.8rem;
              color: $dark;
            }
          }
        }
      }

      .order__receiver-block {
        width: 500px;

        .receiver-block {
          &__title {
            font-size: 1.2rem;
            font-weight: 500;
          }

          &__form {
            display: grid;
            grid-template-rows: 1fr 1fr 1fr;
            grid-template-columns: 1fr 1fr;
            gap: 0 15px;
            grid-template-areas:
              ". ."
              "tip tip"
              ". .";

            .form {
              &__last-name,
              &__first-name,
              &__courier-tip,
              &__phone,
              &__email {
                p {
                  font-size: 0.95rem;

                  &:not(.tip)::after {
                    content: "*";
                    color: red;
                    margin: 0 0 0 3px;
                  }
                }

                input {
                  width: 100%;
                  height: 35px;
                  border: 1px solid $default;
                  border-radius: 3px;
                  outline: none;
                  padding: 3px 20px;
                  font-size: 0.9rem;

                  &:focus {
                    border-color: black;
                  }
                }
              }

              &__courier-tip {
                grid-area: tip;
                margin: 15px 0;

                .tip {
                  margin: 5px 0;
                  font-size: 0.85rem;
                  color: $dark;
                }
              }
            }
          }
        }
      }

      .subscription {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin: 30px 0;

        &__label {
          font-size: 0.92rem;
          width: 500px;
        }
      }

      .order__payment-block {
        padding: 0 0 20px 0;

        .payment-block {
          &__title {
            font-size: 1.2rem;
            font-weight: 500;
          }
        }

        .payment__method {
          display: grid;
          width: 90%;
          gap: 0 20px;
          margin: 0 auto;
          grid-template-columns: repeat(3, 1fr);

          .method {
            &__card,
            &__installment,
            &__doli {
              display: flex;
              background-color: $light;
              justify-content: flex-start;
              padding: 15px;
              gap: 10px;

              .radio {
                min-width: 20px;
              }

              .title {
                display: flex;
                flex-direction: column;
                gap: 8px;
                font-weight: 500;
                margin: 0;

                span {
                  font-weight: 400;
                  font-size: 0.85rem;
                  color: $dark;
                }
              }
            }
          }
        }
      }
    }

    .goods-block {
      // padding: 20px 15px;
      border: 1px solid $default;

      &__title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.2rem;
        font-weight: 500;
        height: 60px;
        text-indent: 20px;
        margin: 0;
        cursor: pointer;

        .arrow {
          fill: $blue;
          transition: transform 0.5s ease;
          margin: 0 20px 0 0;

          &--up {
            transform: rotate(180deg);
          }
        }
      }

      .goods-list {
        margin: 0 15px;

        .list__item {
          border-top: 1px solid $default;
        }
      }
    }
  }

  &__order-info {
    padding: 10px 20px;

    border: 1px solid $dark;
    border-radius: 8px;

    position: sticky;
    position: -webkit-sticky;
    top: 2rem;
    align-self: start;

    .info {
      &__title {
        font-size: 1.2rem;
        font-weight: 500;

        display: flex;
        align-items: center;
        justify-content: space-between;

        .link {
          font-size: 0.85rem;
          color: $dark;
        }
      }

      &__worth,
      &__delivery,
      &__total {
        display: flex;
        justify-content: space-between;
        font-size: 0.83rem;
      }

      &__total {
        font-size: 0.9rem;

        span {
          font-size: 1.15rem;
          font-weight: 500;
        }
      }
    }

    .btn {
      width: 100%;
      border-radius: 10px;
    }
  }
}

@media (max-width: 1000px) {
  .order {
    display: flex;
    flex-direction: column;

    &__title {
      text-align: center;
    }

    &__order-info {
      width: 100%;
      margin: 20px 0 30px 0;
      border: none;
    }

    &__body {
      .delivery-block-wrapper,
      .receiver-block-wrapper,
      .payment-block-wrapper,
      .goods-block {
        border: none;

        .order__delivery-block,
        .order__receiver-block,
        .order__payment-block {
          width: 100%;
        }
      }
    }
  }
}
</style>
