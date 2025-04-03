import { defineStore } from 'pinia'

// 技能伤害计算公式
const calculateDamage = (attacker, defender, move) => {
  // 基础伤害值降低
  const baseDamage = Math.floor(move.power * (attacker.stats.attack / defender.stats.defense) * 0.5)
  // 随机因素范围缩小 (0.9 到 1.1 之间)
  const randomFactor = 0.9 + Math.random() * 0.2
  // 确保最小伤害
  return Math.max(1, Math.floor(baseDamage * randomFactor))
}

export const useBattleStore = defineStore('battle', {
  state: () => ({
    playerPokemon: null,
    enemyPokemon: null,
    battleLog: [],
    currentTurn: 'player', // 'player' 或 'enemy'
    gameStatus: 'waiting', // 'waiting', 'inProgress', 'victory', 'defeat'
    selectedMove: null,
  }),

  getters: {
    isPlayerTurn: (state) => state.currentTurn === 'player',
    isBattleOver: (state) => ['victory', 'defeat'].includes(state.gameStatus),
    battleResult: (state) => state.gameStatus === 'victory' ? 'Victory!' : 'Defeat!',
  },

  actions: {
    initializeBattle(playerPokemon, enemyPokemon) {
      this.playerPokemon = {
        ...playerPokemon,
        currentHP: playerPokemon.stats.hp,
      }
      this.enemyPokemon = {
        ...enemyPokemon,
        currentHP: enemyPokemon.stats.hp,
      }
      this.battleLog = [`Battle Start: ${playerPokemon.name} VS ${enemyPokemon.name}`]
      this.currentTurn = 'player'
      this.gameStatus = 'inProgress'
      
      console.log('Battle initialized:', {
        player: this.playerPokemon,
        enemy: this.enemyPokemon
      })
    },

    addBattleLog(message) {
      this.battleLog.push(message)
    },

    async executeMove(move, attacker, defender, isPlayerAttacking) {
      // Check hit
      if (Math.random() > move.accuracy / 100) {
        this.addBattleLog(`${attacker.name}'s ${move.name} missed!`)
        return
      }

      const damage = calculateDamage(attacker, defender, move)
      defender.currentHP = Math.max(0, defender.currentHP - damage)

      this.addBattleLog(
        `${attacker.name} used ${move.name}, dealt ${damage} damage!` +
        `(${defender.name} HP: ${defender.currentHP}/${defender.stats.hp})`
      )

      if (defender.currentHP <= 0) {
        if (isPlayerAttacking) {
          this.gameStatus = 'victory'
          this.addBattleLog(`${defender.name} fainted! You won!`)
        } else {
          this.gameStatus = 'defeat'
          this.addBattleLog(`${defender.name} fainted! You lost!`)
        }
        console.log('Battle ended, status:', this.gameStatus)
      }
    },

    async playerAttack(move) {
      if (this.currentTurn !== 'player' || this.gameStatus !== 'inProgress') return

      await this.executeMove(move, this.playerPokemon, this.enemyPokemon, true)
      
      if (this.gameStatus === 'inProgress') {
        this.currentTurn = 'enemy'
        setTimeout(() => this.enemyAttack(), 1000)
      }
    },

    async enemyAttack() {
      if (this.gameStatus !== 'inProgress') return

      const moves = this.enemyPokemon.moves
      const randomMove = moves[Math.floor(Math.random() * moves.length)]

      await this.executeMove(randomMove, this.enemyPokemon, this.playerPokemon, false)
      
      if (this.gameStatus === 'inProgress') {
        this.currentTurn = 'player'
      }
    },

    resetBattle() {
      this.playerPokemon = null
      this.enemyPokemon = null
      this.battleLog = []
      this.currentTurn = 'player'
      this.gameStatus = 'waiting'
      this.selectedMove = null
    }
  }
})
