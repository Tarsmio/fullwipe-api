class CacheObject {
  #ttl;
  #data;

  /**
   * @param {Object} data La donné a stocké
   * @param {Number} ttl la durée de vie
   */
  constructor(data, ttl = 0) {
    this.#data = data;
    this.#ttl = ttl;
  }

  /**
   * @returns {Object} la donné stocké
   */
  getData() {
    return this.#data;
  }

  /**
   * @returns {Number} la durée de vie
   */
  getTtl() {
    return this.#ttl;
  }
}

module.exports = {
  CacheObject,
};
