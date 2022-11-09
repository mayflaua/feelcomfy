import { defineNuxtPlugin } from '#app'
import { EventEmitter } from 'eventemitter3'

export default defineNuxtPlugin(() => {
  const emitter = new EventEmitter()
  return {
    provide: {
      emitter
    }
  }
})
