import axios from 'axios'

const BASE_URL = 'https://pokeapi.co/api/v2'

export const pokeApi = {
  async getPokemonList(offset = 0, limit = 20) {
    try {
      return await axios.get(`${BASE_URL}/pokemon`, {
        params: { offset, limit }
      })
    } catch (error) {
      console.error('获取宝可梦列表失败:', error)
      throw error
    }
  },
  
  async getPokemonDetail(idOrName) {
    try {
      return await axios.get(`${BASE_URL}/pokemon/${idOrName}`)
    } catch (error) {
      console.error('获取宝可梦详情失败:', error)
      throw error
    }
  }
}
