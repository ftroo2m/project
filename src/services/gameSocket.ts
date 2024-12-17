// src/services/gameSocket.ts
import type { GameState } from '../types/game'

export class GameSocket {
    private ws: WebSocket | null = null;
    private gameStateCallback: ((state: GameState) => void) | null = null;
    private messageCallbacks: Map<string, (data: any) => void> = new Map();
    
    async fetchCardDetails(cardName: string) {
      try {
        const response = await fetch('http://localhost:8080/api/game/onecard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ name: cardName })
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch card details');
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching card details:', error);
        return null;
      }
    }

    async processNewCards(newCards: string[]) {
      const cardDetails = await Promise.all(
        newCards.filter(name => name !== "").map(name => this.fetchCardDetails(name))
      );
      return cardDetails.filter(card => card !== null);
    }
    
    connect(roomId: string, onGameState: (state: GameState) => void) {
      this.gameStateCallback = onGameState;
      
      this.ws = new WebSocket('ws://localhost:8080/api/game/start/game');
      
      this.ws.onopen = () => {
        console.log('WebSocket 连接已建立');
        this.send({
          type: "init"
        });
      };
      
      this.ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log('收到消息:', data);
        
        if (data.type === 'initReturn' || data.type === 'cardEnd' || data.type === 'endRound' || data.type === 'monsterDeath' || data.type === 'playerDeath') {
          if (data.player?.newCard) {
            const cardDetails = await this.processNewCards(data.player.newCard);
            data.player.newCard = cardDetails;
          }
          this.gameStateCallback?.(data);
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket 错误:', error);
      };
      
      this.ws.onclose = () => {
        console.log('WebSocket 连接已关闭');
      };
    }
    
    disconnect() {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
    }
    
    send(message: any) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(message));
      }
    }
  }
  
  export const gameSocket = new GameSocket();