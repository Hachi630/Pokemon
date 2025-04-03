import { defineStore } from 'pinia'

export const usePokedexStore = defineStore('pokedex', {
  state: () => ({
    pokemons: [],
    currentPage: 1,
    pageSize: 20,
    searchQuery: '',
  }),
  
  actions: {
    async fetchPokemons() {
      // 实现分页获取宝可梦数据
    },
    async searchPokemon(query) {
      // 实现搜索功能
    }
  }
})
