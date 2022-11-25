import { getJsonData } from '@/api/common'

const enum TableKeys {
  PUBLIC_PRIZE_POOL = '1669286174849',
}

interface Options<K> {
  (key: K): any | Promise<any>
}

class FieldStorage<K extends string | number | symbol> {
  private _cache: Partial<Record<K, any>> = {}
  private _options: Options<K>

  constructor(options: Options<K>) {
    this._options = options
  }

  async get(key: K) {
    if (this._cache[key]) return this._cache[key]
    const value = await this._options(key)
    return this.set(key, value)
  }

  private set(key: K, value: any) {
    this._cache[key] = value
    return value
  }
}

export const fieldStorage = new FieldStorage<TableKeys>(async (key) => {
  const res = await getJsonData(key)
  return res.body.jsonData
})
