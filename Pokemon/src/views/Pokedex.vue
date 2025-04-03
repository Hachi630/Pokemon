<template>
  <div class="pokedex">
    <n-card>
      <h1>宝可梦图鉴</h1>
      <search-bar @search="handleSearch" />
      
      <n-spin :show="loading">
        <div class="pokemon-grid" v-if="pokemonList.length > 0">
          <pokemon-card
            v-for="pokemon in pokemonList"
            :key="pokemon.id"
            :pokemon="pokemon"
          />
        </div>
        <div v-else class="no-results">
          未找到宝可梦
        </div>
      </n-spin>

      <div class="pagination" v-if="totalCount > pageSize">
        <n-pagination
          v-model:page="currentPage"
          :page-size="pageSize"
          :item-count="totalCount"
          @update:page="handlePageChange"
        />
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { NCard, NPagination, NSpin, useMessage } from 'naive-ui'
import PokemonCard from '../components/pokedex/PokemonCard.vue'
import SearchBar from '../components/pokedex/SearchBar.vue'
import { pokeApi } from '../api/pokeapi'

const message = useMessage()
const pokemonList = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const totalCount = ref(0)
const loading = ref(false)

const handleSearch = async (query) => {
  console.log('接收到搜索请求:', query)
  
  if (!query || query.trim() === '') {
    message.warning('请输入宝可梦名称')
    return
  }

  loading.value = true
  message.info('正在搜索: ' + query)
  
  try {
    const searchTerm = query.trim().toLowerCase()
    console.log('发送搜索请求:', searchTerm)
    
    const response = await pokeApi.getPokemonDetail(searchTerm)
    console.log('搜索响应:', response)
    
    if (response.data) {
      pokemonList.value = [response.data]
      totalCount.value = 1
      currentPage.value = 1
      message.success('找到宝可梦: ' + response.data.name)
    }
  } catch (error) {
    console.error('搜索失败:', error)
    message.error('未找到该宝可梦，请检查名称是否正确')
    pokemonList.value = []
    totalCount.value = 0
  } finally {
    loading.value = false
  }
}

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
    message.success('加载成功')
  } catch (error) {
    console.error('获取列表失败:', error)
    message.error('获取宝可梦列表失败')
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchPokemonList()
}

onMounted(() => {
  console.log('组件挂载，开始获取数据')
  fetchPokemonList()
})
</script>

<style scoped>
.pokedex {
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
}

.pokedex-card {
  height: 100%;
  margin: 0 auto;
  max-width: 1600px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
  padding: 0 10px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin: 20px 0;
  padding: 10px;
}
</style>
