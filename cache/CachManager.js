const logger = require("../logger");
const { CacheObject } = require("./CacheObject");

var instance = null;

class CachManager {
  #cahe;
  #dict;

  constructor() {
    if (instance != null) {
      return instance;
    } else {
      instance = this;
    }

    this.#cahe = new Map();
    this.#dict = new Map();
  }

  /**
   * @param {String} key La clé du cache
   * @returns {CacheObject | null} Le cache corespondant ou null si inexistant
   */
  get(key) {
    if (this.#cahe.has(key)) {
    logger.info(`Cache ${key} acceder`)
      return this.#cahe.get(key);
    }

    return null;
  }

  /**
   * @param {String} key La clé du cache a ajouté
   * @param {CacheObject} cacheObj le cache a ajouté
   */
  set(key, cacheObj){
    this.#cahe.set(key, cacheObj)

    logger.info(`Mise en cache de ${key}`)

    if(cacheObj.getTtl() > 0){
        setTimeout(() => {
            this.#endCache(key)
        }, cacheObj.getTtl())
    }
  }

  /**
   * @param {String} key La clé du cache
   */
  has(key){
    return this.#cahe.has(key)
  }

  /**
   * @param {String} key La clé du dictionaire a obtenir
   * @returns {CaheDict | null} Le dictionaire corespondant ou null si inexistant
   */
  getDict(key){
    if(this.#dict.has(key)){
      return this.#dict.get(key)
    }

    return null
  }

  /**
   * @param {String} key La clé du dictionaire a ajouté
   * @param {CaheDict} dictObject le dictionaire a ajouté
   */
  registerDict(key, dictObject){
    this.#dict.set(key, dictObject)
  }

  async #endCache(key){
    this.#cahe.delete(key)
    logger.info(`Cache ${key} supprimé`)
  }

  /**
   *
   * @returns {CachManager}
   */
  static getInstance() {
    if (instance != null) {
      return instance;
    } else {
      instance = new CachManager();
      return instance;
    }
  }
}

module.exports = {
  CachManager,
};
