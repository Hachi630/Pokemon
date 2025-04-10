<template>
  <n-card class="pokemon-card" hoverable>
    <div class="pokemon-image">
      <img :src="pokemon.sprites.front_default" :alt="pokemon.name">
    </div>
    <div class="pokemon-info">
      <h3 class="pokemon-name">{{ formatPokemonName(pokemon.name) }}</h3>
      <div class="pokemon-types">
        <n-tag 
          v-for="type in pokemon.types" 
          :key="type.type.name"
          :color="getTypeColor(type.type.name)"
        >
          {{ type.type.name }}
        </n-tag>
      </div>
      <div class="pokemon-stats">
        <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="stat">
          <span>{{ formatStatName(stat.stat.name) }}: {{ stat.base_stat }}</span>
        </div>
      </div>
    </div>
  </n-card>
</template>

<script setup>
import { NCard, NTag } from 'naive-ui'

const props = defineProps({
  pokemon: {
    type: Object,
    required: true
  }
})

const typeColors = {
  normal: { color: '#A8A878' },
  fire: { color: '#F08030' },
  water: { color: '#6890F0' },
  electric: { color: '#F8D030' },
  grass: { color: '#78C850' },
  ice: { color: '#98D8D8' },
  fighting: { color: '#C03028' },
  poison: { color: '#A040A0' },
  ground: { color: '#E0C068' },
  flying: { color: '#A890F0' },
  psychic: { color: '#F85888' },
  bug: { color: '#A8B820' },
  rock: { color: '#B8A038' },
  ghost: { color: '#705898' },
  dragon: { color: '#7038F8' },
  dark: { color: '#705848' },
  steel: { color: '#B8B8D0' },
  fairy: { color: '#EE99AC' }
}

const getTypeColor = (type) => typeColors[type] || { color: '#888888' }

const formatPokemonName = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

const formatStatName = (statName) => {
  const statNames = {
    'hp': 'HP',
    'attack': '攻击',
    'defense': '防御',
    'special-attack': '特攻',
    'special-defense': '特防',
    'speed': '速度'
  }
  return statNames[statName] || statName
}
</script>

// ... existing code ...

<style scoped>
.pokemon-card {
  width: 100%;
  height: 100%;
  transition: transform 0.2s;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
}

.pokemon-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pokemon-image {
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
}

.pokemon-image img {
  width: 180px;
  height: 180px;
  object-fit: contain;
}

.pokemon-name {
  text-align: center;
  margin: 15px 0;
  font-size: 1.4em;
  color: #2c3e50;
  font-weight: bold;
}

.pokemon-types {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 15px;
  padding: 0 10px;
}

.pokemon-stats {
  font-size: 1em;
  padding: 15px;
  background-color: #f8f9fa;
}

.stat {
  margin: 8px 0;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  color: #4a5568;
}
</style>
