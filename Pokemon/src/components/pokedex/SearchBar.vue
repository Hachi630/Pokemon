<template>
  <div class="search-bar">
    <n-input-group>
      <n-input
        :value="searchQuery"
        @update:value="searchQuery = $event"
        placeholder="输入宝可梦名称搜索..."
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <n-icon><Search /></n-icon>
        </template>
      </n-input>
      <n-button type="primary" @click="handleSearch">
        搜索
      </n-button>
    </n-input-group>
    <div class="debug-info">
      当前输入值: {{ searchQuery }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { NInputGroup, NInput, NButton, NIcon } from 'naive-ui'
import { Search } from '@vicons/ionicons5'

const searchQuery = ref('')
const emit = defineEmits(['search'])

const handleSearch = () => {
  console.log('当前搜索值:', searchQuery.value)
  if (searchQuery.value && searchQuery.value.trim()) {
    emit('search', searchQuery.value.trim())
  }
}
</script>

<style scoped>
.search-bar {
  margin: 20px auto;
  max-width: 500px;
}

.debug-info {
  margin-top: 4px;
  font-size: 12px;
  color: #666;
}
</style>
