import axios from 'axios'

const BASE_URL = 'https://pokeapi.co/api/v2'

// 创建一个 axios 实例
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 秒超时
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

export const pokeApi = {
  async getPokemonList(offset = 0, limit = 20) {
    console.log('正在获取宝可梦列表:', { offset, limit })
    try {
      const response = await apiClient.get('/pokemon', {
        params: { offset, limit }
      })
      console.log('获取列表成功:', response.data)
      return response
    } catch (error) {
      console.error('获取宝可梦列表失败:', error.message)
      throw error
    }
  },
  
  async getPokemonDetail(idOrName) {
    console.log('正在获取宝可梦详情:', idOrName)
    try {
      const response = await apiClient.get(`/pokemon/${idOrName.toLowerCase()}`)
      console.log('获取详情成功:', response.data)
      return response
    } catch (error) {
      console.error('获取宝可梦详情失败:', error.message)
      throw error
    }
  }
}
