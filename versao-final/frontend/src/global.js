import Vue from 'vue'

export const baseApiUrl = 'http://localhost:4000'

export function showError(e) {
    if(e && e.response && e.response.data) {
        Vue.toasted.error(e.response.data)
    } else if(typeof e === 'string') {
        Vue.toasted.error(e)
    } else {
        Vue.toasted.error('Erro inesperado')
    }
}

export default { baseApiUrl, showError }
