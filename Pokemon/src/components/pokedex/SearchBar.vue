<template>
  <div class="search-bar">
    <n-input-group>
        <n-input
            v-model="searchQuery"
            placeholder="输入宝可梦名称搜索..."
            @keyup.enter="handleSearch"
            > 
            <template #prefix>
          <n-icon><search /></n-icon>
        </template>
      </n-input>
      <n-button type="primary" @click="handleSearch">
        搜索
      </n-button>
    </n-input-group>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { NInputGroup, NInput, NButton, NIcon } from 'naive-ui'
import { Search } from '@vicons/ionicons5'

const searchQuery = ref('')
const emit = defineEmits(['search'])

const handleSearch = () => {
  emit('search', searchQuery.value)
}
</script>

<style scoped>
.search-bar {
  margin: 20px 0;
  max-width: 500px;
  margin: 20px auto;
}
</style>
