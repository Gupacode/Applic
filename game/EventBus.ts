// game/EventBus.ts
import Phaser from 'phaser';

// Estender a classe EventEmitter do Phaser é uma maneira robusta de criar um barramento de eventos.
class EventBus extends Phaser.Events.EventEmitter {
    constructor() {
        super();
    }
}

// Exportamos uma única instância para que toda a aplicação compartilhe o mesmo barramento.
export const GameEventBus = new EventBus();