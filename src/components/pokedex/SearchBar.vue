<n-input
  v-model="searchQuery"
  placeholder="输入宝可梦名称搜索..."
  @keyup.enter="handleSearch"
> 