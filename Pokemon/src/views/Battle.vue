<template>
  <div class="battle-container">
    <n-card class="battle-card">
      <h2 class="page-title">对战页面</h2>
      <div v-if="!battleStore.playerPokemon" class="pokemon-selection">
        <h3 class="selection-title">选择你的宝可梦</h3>
        <div class="pokemon-list">
          <div 
            v-for="pokemon in availablePokemon" 
            :key="pokemon.id" 
            class="pokemon-option"
            @click="selectPokemon(pokemon)"
          >
            <img :src="pokemon.sprites.front_default" :alt="pokemon.name">
            <div class="pokemon-name">{{ pokemon.name }}</div>
            <div class="pokemon-stats">
              <div class="stat-item">HP: {{ pokemon.stats.hp }}</div>
              <div class="stat-item">攻击: {{ pokemon.stats.attack }}</div>
              <div class="stat-item">防御: {{ pokemon.stats.defense }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="battle-arena">
        <!-- 敌方宝可梦 -->
        <div class="pokemon enemy">
          <div class="pokemon-info">
            <h3 class="pokemon-battle-name">{{ battleStore.enemyPokemon.name }}</h3>
            <div class="hp-bar">
              <div class="hp-fill" :style="{
                width: `${(battleStore.enemyPokemon.currentHP / battleStore.enemyPokemon.stats.hp) * 100}%`,
                backgroundColor: getHPColor(battleStore.enemyPokemon)
              }"></div>
            </div>
            <div class="hp-text">
              HP: {{ battleStore.enemyPokemon.currentHP }}/{{ battleStore.enemyPokemon.stats.hp }}
            </div>
          </div>
          <img 
            :src="battleStore.enemyPokemon.sprites.front_default" 
            :alt="battleStore.enemyPokemon.name"
            class="battle-sprite"
          >
        </div>

        <!-- 我方宝可梦 -->
        <div class="pokemon player">
          <img 
            :src="battleStore.playerPokemon.sprites.back_default" 
            :alt="battleStore.playerPokemon.name"
            class="battle-sprite"
          >
          <div class="pokemon-info">
            <h3 class="pokemon-battle-name">{{ battleStore.playerPokemon.name }}</h3>
            <div class="hp-bar">
              <div class="hp-fill" :style="{
                width: `${(battleStore.playerPokemon.currentHP / battleStore.playerPokemon.stats.hp) * 100}%`,
                backgroundColor: getHPColor(battleStore.playerPokemon)
              }"></div>
            </div>
            <div class="hp-text">
              HP: {{ battleStore.playerPokemon.currentHP }}/{{ battleStore.playerPokemon.stats.hp }}
            </div>
          </div>
        </div>

        <!-- 战斗控制面板 -->
        <div class="battle-controls">
          <div class="moves-grid">
            <n-button
              v-for="move in battleStore.playerPokemon.moves"
              :key="move.name"
              :disabled="!battleStore.isPlayerTurn"
              @click="useMove(move)"
              class="move-button"
              type="primary"
            >
              {{ move.name }}
            </n-button>
          </div>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { NCard, NButton } from 'naive-ui'
import { useBattleStore } from '../stores/battle'
import { pokeApi } from '../api/pokeapi'

const battleStore = useBattleStore()
const availablePokemon = ref([])

const fetchAvailablePokemon = async () => {
  try {
    const response = await pokeApi.getPokemonList(0, 10)
    const pokemonDetails = await Promise.all(
      response.data.results.map(pokemon => pokeApi.getPokemonDetail(pokemon.name))
    )
    availablePokemon.value = pokemonDetails.map(response => {
      const pokemon = response.data
      
      // 调整属性值使其更平衡
      const baseStats = {
        hp: pokemon.stats.find(s => s.stat.name === 'hp').base_stat,
        attack: pokemon.stats.find(s => s.stat.name === 'attack').base_stat,
        defense: pokemon.stats.find(s => s.stat.name === 'defense').base_stat
      }

      // 平衡属性值
      const stats = {
        hp: Math.floor(baseStats.hp * 1.5),  // 提高HP以延长战斗
        attack: Math.floor(baseStats.attack * 0.7),  // 降低攻击力
        defense: Math.floor(baseStats.defense * 0.8)  // 适当降低防御力
      }

      // 平衡技能伤害
      const moves = pokemon.moves
        .slice(0, 4)
        .map(moveData => ({
          name: moveData.move.name,
          // 降低技能威力范围
          power: 20 + Math.floor(Math.random() * 20),  // 20-40的伤害范围
          accuracy: 85 + Math.floor(Math.random() * 10)  // 85-95的命中率
        }))

      return {
        id: pokemon.id,
        name: pokemon.name,
        sprites: pokemon.sprites,
        stats: stats,
        moves: moves
      }
    })
    console.log('获取到的宝可梦列表:', availablePokemon.value)
  } catch (error) {
    console.error('获取宝可梦列表失败:', error)
  }
}

const selectPokemon = (pokemon) => {
  console.log('选择宝可梦:', pokemon)
  // 随机选择一个敌方宝可梦
  const enemyPokemon = availablePokemon.value[
    Math.floor(Math.random() * availablePokemon.value.length)
  ]
  
  // 初始化战斗
  battleStore.initializeBattle(pokemon, enemyPokemon)
}

const getHPColor = (pokemon) => {
  const hpPercentage = (pokemon.currentHP / pokemon.stats.hp) * 100
  if (hpPercentage > 50) return '#4caf50'
  if (hpPercentage > 20) return '#ffc107'
  return '#f44336'
}

const useMove = (move) => {
  battleStore.playerAttack(move)
}

onMounted(() => {
  console.log('组件挂载')
  fetchAvailablePokemon()
})
</script>

<style scoped>
.battle-container {
  padding: 40px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.battle-card {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  font-size: 2.5em;
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.selection-title {
  font-size: 1.8em;
  text-align: center;
  color: #34495e;
  margin-bottom: 20px;
}

.pokemon-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  padding: 20px;
}

.pokemon-option {
  text-align: center;
  padding: 20px;
  border: 2px solid #ddd;
  border-radius: 15px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pokemon-option:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border-color: #42b983;
}

.pokemon-option img {
  width: 180px;
  height: 180px;
  object-fit: contain;
}

.pokemon-name {
  font-size: 1.5em;
  margin: 15px 0;
  color: #2c3e50;
  font-weight: bold;
  text-transform: capitalize;
}

.pokemon-stats {
  text-align: left;
  margin-top: 15px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.stat-item {
  padding: 8px;
  font-size: 1.1em;
  color: #34495e;
  border-bottom: 1px solid #eee;
}

.battle-arena {
  margin-top: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.pokemon {
  display: flex;
  align-items: center;
  margin: 30px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 12px;
}

.pokemon.enemy {
  flex-direction: row;
}

.pokemon.player {
  flex-direction: row-reverse;
}

.pokemon-info {
  flex: 1;
  padding: 0 30px;
}

.pokemon-battle-name {
  font-size: 1.8em;
  color: #2c3e50;
  margin-bottom: 15px;
  text-transform: capitalize;
}

.hp-bar {
  width: 100%;
  height: 25px;
  background-color: #ddd;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hp-fill {
  height: 100%;
  transition: all 0.3s ease;
}

.hp-text {
  margin-top: 10px;
  font-size: 1.2em;
  color: #34495e;
}

.battle-sprite {
  width: 200px;
  height: 200px;
  object-fit: contain;
}

.battle-controls {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 12px;
}

.moves-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 15px;
}

.move-button {
  padding: 20px;
  font-size: 1.2em;
  text-transform: capitalize;
}

.move-button:hover:not(:disabled) {
  transform: translateY(-2px);
}
</style>
