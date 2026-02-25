const {CachManager} = require('./CachManager')

const cache = CachManager.getInstance()

class CaheDict{
    #links

    /**
   * @param {Array} linksKeys La donné a stocké
   */
    constructor(linksKeys=[]){
        this.#links = linksKeys
    }

    /**
     * 
     * @param {String} link Le lien a ajouté
     */
    addLink(link){
        this.#links.push(link)
    }

    /**
     * 
     * @returns {Array} la liste des lien
     */
    linkList(){
        return this.#links
    }

    /**
     * 
     * @returns {Array} Les donnée
     */
    getDatas(){
        let datas = []
        this.#update()

        this.#links.forEach(lk => {
            let cahedlink = cache.get(lk)

            if(cahedlink != null){
                datas.push(cahedlink.getData())
            }
        })

        return datas
    }

    #update(){
        this.#links.forEach((l, i) => {
            if(!cache.has(l)){
                this.#links.splice(i, 1)
            }
        })
    }
}

module.exports = {
    CaheDict
}