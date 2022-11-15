import type { Ref } from 'vue'

export function watchPromise<T = any>(
  promise: Promise<T>,
  option: {
    loading: Ref<boolean>
  },
) {
  option.loading.value = true
  return promise
    .then((e) => {
      option.loading.value = false
      return e
    })
    .finally(() => {
      option.loading.value = false
    })
}
