<style scoped>
.pokemon-card {
  width: 100%;
  height: 100%;
  transition: transform 0.2s;
}

.pokemon-card:hover {
  transform: translateY(-5px);
}

.pokemon-image {
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.pokemon-image img {
  width: 150px;
  height: 150px;
  object-fit: contain;
}

.pokemon-name {
  text-align: center;
  margin: 15px 0;
  font-size: 1.2em;
  color: #2c3e50;
}

.pokemon-types {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 15px;
}

.pokemon-stats {
  font-size: 0.9em;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.stat {
  margin: 8px 0;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}
</style> 