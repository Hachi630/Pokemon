<template>
  <div class="pokedex">
    <n-card class="pokedex-card">
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
          v-model:page="currentPage"
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

<style scoped>
.pokedex {
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
}

.pokedex-card {
  height: 100%;
  margin: 0 auto;
  max-width: 1400px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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