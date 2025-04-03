<template>
  <div class="pokedex">
    <n-card>
      <h1>宝可梦图鉴</h1>
      <search-bar @search="handleSearch" />
      
      <div class="pokemon-grid">
        <pokemon-card
          v-for="pokemon in pokemonList"
          :key="pokemon.id"
          :pokemon="pokemon"
        />
      </div>

      <div class="pagination">
        <n-pagination
            v-model="currentPage"
          :page-size="pageSize"
          :item-count="totalCount"
          @update:page="handlePageChange"
        />
      </div>

      <n-spin :show="loading" description="加载中...">
        <template #description>
          <span>正在获取宝可梦数据...</span>
        </template>
      </n-spin>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { NCard, NPagination, NSpin } from 'naive-ui'
import PokemonCard from '../components/pokedex/PokemonCard.vue'
import SearchBar from '../components/pokedex/SearchBar.vue'
import { pokeApi } from '../api/pokeapi'

const pokemonList = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const totalCount = ref(0)
const loading = ref(false)

const fetchPokemonList = async () => {
  loading.value = true
  try {
    const offset = (currentPage.value - 1) * pageSize.value
    const response = await pokeApi.getPokemonList(offset, pageSize.value)
    totalCount.value = response.data.count
    
    const pokemonDetails = await Promise.all(
      response.data.results.map(pokemon => 
        pokeApi.getPokemonDetail(pokemon.name)
      )
    )
    
    pokemonList.value = pokemonDetails.map(response => response.data)
  } catch (error) {
    console.error('获取宝可梦列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchPokemonList()
}

const handleSearch = async (query) => {
  if (!query) {
    fetchPokemonList()
    return
  }
  
  loading.value = true
  try {
    const response = await pokeApi.getPokemonDetail(query.toLowerCase())
    pokemonList.value = [response.data]
    totalCount.value = 1
    currentPage.value = 1
  } catch (error) {
    console.error('搜索宝可梦失败:', error)
    pokemonList.value = []
    totalCount.value = 0
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPokemonList()
})
</script>

<style scoped>
.pokedex {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.pagination {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
</style>
