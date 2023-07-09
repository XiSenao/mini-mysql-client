const localStorage = window.localStorage

export default {
  name: 'storage',

  /**
   * save value(Object) to key
   * @param {string} key 键
   * @param {Object} value 值
   */
  set (key, value) {
    if (key !== 'userName') {
      let username = this.get('userName')
      key = username + '$' + key
    }
    localStorage.setItem(key, JSON.stringify(value))
  },

  /**
   * get value(Object) by key
   * @param {string} key 键
   * @return {Object}
   */
  get (key) {
    if (key !== 'userName') {
      let username = this.get('userName')
      key = username + '$' + key
    }
    return JSON.parse(localStorage.getItem(key))
  },

  /**
   * remove key from localStorage
   * @param {string} key 键
   */
  remove (key) {
    if (key !== 'userName') {
      let username = this.get('userName')
      key = username + '$' + key
    }
    localStorage.removeItem(key)
  },
  /**
   * clear all
   */
  clear () {
    localStorage.clear()
  }
}