// game/DigitalSecurityGameScene.ts
import * as Phaser from 'phaser';
import { GameEventBus } from './EventBus';

export class DigitalSecurityGameScene extends Phaser.Scene {
    // Propriedades da classe com tipagem do TypeScript
    private scenarios: string[];
    private currentScenarioIndex: number;
    private score: number;
    private totalTime: number;
    private scenarioAttempts: { [key: string]: number };
    private interactiveElements: Phaser.GameObjects.GameObject[];
    private feedbackContainer: Phaser.GameObjects.Container | null;
    private dialogGroup: Phaser.GameObjects.Container | null;
    private currentAttempts: number;
    private inputElement: HTMLInputElement | null;

    constructor() {
        super({ key: 'DigitalSecurityGameScene' });

        // Inicialização das propriedades
        this.scenarios = ['phishingEmail', 'phishingSms', 'fakeAd', 'fakeWebsite', 'passwordMeter'];
        this.currentScenarioIndex = 0;
        this.score = 0;
        this.totalTime = 0;
        this.scenarioAttempts = {};
        this.interactiveElements = [];
        this.feedbackContainer = null;
        this.dialogGroup = null;
        this.currentAttempts = 0;
        this.inputElement = null;
    }

    preload() {
        // A lógica de preload, se houver, vai aqui.
        // No nosso caso, está vazia.
    }

    create() {
        this.cameras.main.setBackgroundColor('#1F2937');
        this.time.addEvent({
            delay: 1000,
            callback: () => { this.totalTime++ },
            callbackScope: this,
            loop: true,
        });
        
        this.loadScenario(this.scenarios[this.currentScenarioIndex]);
    }

    // Corpo completo dos métodos da classe original, agora com tipagem

    createDialogBox(x: number, y: number, textContent: string, buttonText: string, onNext: () => void): void {
        if (this.dialogGroup) this.dialogGroup.destroy(true);

        const bubbleWidth = 240;
        const bubbleHeight = 110;
        const arrowHeight = 15;

        const bubble = this.add.graphics();
        bubble.fillStyle(0x1F2937, 0.9);
        bubble.lineStyle(2, 0x4F46E5);
        bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
        bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
        
        bubble.beginPath();
        bubble.moveTo(bubbleWidth / 2 - arrowHeight, bubbleHeight);
        bubble.lineTo(bubbleWidth / 2, bubbleHeight + arrowHeight);
        bubble.lineTo(bubbleWidth / 2 + arrowHeight, bubbleHeight);
        bubble.closePath();
        bubble.fillPath();
        bubble.strokePath();
        
        const text = this.add.text(bubbleWidth / 2, (bubbleHeight / 2) - 10, textContent, { fontFamily: 'sans-serif', fontSize: '15px', color: '#fff', wordWrap: { width: bubbleWidth - 20 }, align: 'center' }).setOrigin(0.5);
        
        const nextButton = this.add.text(bubbleWidth / 2, bubbleHeight - 20, buttonText, { fontFamily: 'sans-serif', fontSize: '14px', color: '#60A5FA', fontStyle: 'bold' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        this.dialogGroup = this.add.container(x - bubbleWidth / 2, y - bubbleHeight - arrowHeight, [bubble, text, nextButton]);
        this.dialogGroup.setAlpha(0).setScale(0.5);
        this.tweens.add({ targets: this.dialogGroup, alpha: 1, scale: 1, duration: 400, ease: 'Elastic.Out' });

        nextButton.on('pointerdown', () => {
            this.tweens.add({ targets: this.dialogGroup, alpha: 0, scale: 0.5, duration: 200, ease: 'Power2', onComplete: () => {
                if (this.dialogGroup) this.dialogGroup.destroy(true);
                this.dialogGroup = null;
                onNext();
            }});
        });
    }

    loadScenario(scenarioKey: string | undefined): void {
        this.children.list.forEach(child => child.destroy());
        this.children.removeAll();
        this.tweens.killAll();
        this.interactiveElements = [];
        if (this.feedbackContainer) {
            this.feedbackContainer.destroy();
            this.feedbackContainer = null;
        }
        if (this.inputElement) {
            this.inputElement.remove();
            this.inputElement = null;
        }
        if (this.dialogGroup) {
            this.dialogGroup.destroy(true);
            this.dialogGroup = null;
        }

        if (!scenarioKey) {
            this.add.text(this.scale.width / 2, this.scale.height / 2, `Fim dos Cenários!\nVocê fez ${this.score} pontos.`, { fontSize: '28px', color: '#FFF', fontFamily: 'sans-serif', align: 'center' }).setOrigin(0.5);
            this.time.delayedCall(2000, () => {
                if (this.scene.isActive()) {
                   GameEventBus.emit('gameFinished', { score: this.score, time: this.totalTime, attempts: this.scenarioAttempts });
                }
            });
            return;
        }

        this.currentAttempts = 0;
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        const baseTextStyle: Phaser.Types.GameObjects.Text.TextStyle = { fontFamily: 'sans-serif', align: 'center', wordWrap: { width: this.scale.width - 60 } };
        const instructionText = this.add.text(centerX, 40, '', { ...baseTextStyle, fontSize: '20px', color: '#9CA3AF' }).setOrigin(0.5);

        switch (scenarioKey) {
            // Todos os 'cases' do switch do arquivo original são colados aqui.
            // O código permanece o mesmo, a tipagem já ajuda a validar.
            case 'phishingEmail':
                instructionText.setText('Objetivo: Dentro do e-mail, clique na ação mais segura a ser tomada.');
                
                this.add.graphics().fillStyle(0xEEEEEE, 1).fillRect(centerX - 350, 100, 700, 400);
                const emailHeaderY = 135;
                this.add.text(centerX - 330, emailHeaderY - 20, 'De: Santander Urgente <santanderurgente@oline.com>', { fontSize: '16px', color: '#000', ...baseTextStyle, align: 'left' });
                this.add.text(centerX - 330, emailHeaderY + 10, 'Assunto: AVISO: Atividade Incomum Detectada na Sua Conta!', { fontSize: '16px', color: '#D32F2F', fontStyle: 'bold', ...baseTextStyle, align: 'left' });
                this.add.graphics().lineStyle(1, 0xDDDDDD).moveTo(centerX - 350, emailHeaderY + 40).lineTo(centerX + 350, emailHeaderY + 40).strokePath();
                
                this.add.text(centerX - 330, emailHeaderY + 60, 'Prezado(a) Cliente,\n\nNossos sistemas detectaram uma atividade incomum em sua conta. Por segurança, sua conta foi temporariamente bloqueada.\n\nA não verificação da sua identidade dentro de 12 horas resultará no bloqueio permanente da sua conta. Clique no botão abaixo para regularizar seu acesso imediatamente:', { fontSize: '16px', color: '#000', ...baseTextStyle, align: 'left', wordWrap: {width: 660} });
                
                const link = this.add.text(centerX, 420, 'VERIFICAR MINHA CONTA', { fontSize: '20px', color: '#fff', backgroundColor: '#E60000', padding: { x: 20, y: 10 }, ...baseTextStyle }).setOrigin(0.5).setInteractive({ useHandCursor: true });
                this.addPulsatingIcon(link.x + link.displayWidth / 2 + 15, link.y);
                link.on('pointerdown', () => this.handleWrongChoice('Cuidado! O endereço do remetente "@oline.com" é falso.'));
                this.interactiveElements.push(link);
                
                const iconZoneX = centerX + 280;
                
                const replyButton = this.add.text(iconZoneX - 80, emailHeaderY, 'Responder', { fontSize: '16px', color: '#5A6572', ...baseTextStyle, backgroundColor: '#E5E7EB', padding: {x: 8, y: 4} }).setOrigin(0.5).setInteractive({ useHandCursor: true });
                this.addPulsatingIcon(replyButton.x + replyButton.width / 2 + 10, replyButton.y);
                replyButton.on('pointerdown', () => this.handleWrongChoice('Responder ao e-mail pode confirmar que seu endereço é ativo, resultando em mais tentativas de golpe.'));
                this.interactiveElements.push(replyButton);

                const deleteIcon = this.add.graphics().lineStyle(2, 0x5A6572).fillStyle(0x5A6572);
                deleteIcon.fillRect(iconZoneX - 5, emailHeaderY - 10, 10, 12);
                deleteIcon.fillRect(iconZoneX - 8, emailHeaderY - 13, 16, 3);
                deleteIcon.fillRect(iconZoneX - 2, emailHeaderY - 16, 4, 3);
                const deleteZone = this.add.zone(iconZoneX, emailHeaderY, 30, 30).setInteractive({ useHandCursor: true });
                this.addPulsatingIcon(iconZoneX + 15, emailHeaderY);
                deleteZone.on('pointerdown', () => this.handleCorrectChoice(scenarioKey, 'Correto! A ação mais segura é deletar e-mails suspeitos sem interagir com eles.'));
                this.interactiveElements.push(deleteZone);
                break;
            // ... (todos os outros cases: 'phishingSms', 'fakeAd', 'fakeWebsite', 'passwordMeter')
            // O conteúdo deles é extenso e deve ser colado aqui do arquivo original.
             case 'passwordMeter':
                 instructionText.setText('Objetivo: Crie uma senha que seja considerada "Forte".');
                this.inputElement = document.createElement('input');
                this.inputElement.type = 'text';
                this.inputElement.style.width = '300px';
                
                const domElement = this.add.dom(centerX, 200, this.inputElement).setClassName('phaser-input');
                
                const meterBg = this.add.graphics().fillStyle(0x555555).fillRect(centerX - 150, 250, 300, 20);
                const meterFg = this.add.graphics();
                const strengthText = this.add.text(centerX, 280, 'Força: Fraca', { ...baseTextStyle, fontSize: '18px', color: '#FFF' }).setOrigin(0.5);
                
                const feedbackTextStyle: Phaser.Types.GameObjects.Text.TextStyle = { fontSize: '14px', color: '#D1D5DB', align: 'left', wordWrap: { width: 300 }};
                const feedbackTitle = this.add.text(centerX - 150, 310, 'Para uma senha forte, falta:', feedbackTextStyle).setOrigin(0);
                const feedbackText = this.add.text(centerX - 150, 330, '', feedbackTextStyle).setOrigin(0);

                let passwordGameCompleted = false;
                this.inputElement.addEventListener('input', () => {
                    if(passwordGameCompleted || !this.inputElement) return;

                    const pass = this.inputElement.value;
                    let feedbackMessages: string[] = [];
                    let strengthScore = 0;

                    if (pass.length >= 12) { strengthScore++; } else { feedbackMessages.push('- Pelo menos 12 caracteres'); }
                    if (/[a-z]/.test(pass)) { strengthScore++; } else { feedbackMessages.push('- Adicionar uma letra minúscula'); }
                    if (/[A-Z]/.test(pass)) { strengthScore++; } else { feedbackMessages.push('- Adicionar uma letra maiúscula'); }
                    if (/[0-9]/.test(pass)) { strengthScore++; } else { feedbackMessages.push('- Adicionar um número'); }
                    if (/[^a-zA-Z0-9]/.test(pass)) { strengthScore++; } else { feedbackMessages.push('- Adicionar um símbolo (ex: !@#$)'); }

                    if (feedbackMessages.length === 0) {
                        feedbackTitle.setVisible(false);
                        feedbackText.setText('✓ Ótimo! Sua senha é forte.');
                        feedbackText.setColor('#22C55E');
                    } else {
                        feedbackTitle.setVisible(true);
                        feedbackText.setText(feedbackMessages.join('\n'));
                        feedbackText.setColor('#D1D5DB');
                    }

                    meterFg.clear();
                    let color = 0xFF0000; let text = 'Fraca';
                    if (strengthScore > 2) { color = 0xFFD700; text = 'Média'; }
                    if (strengthScore >= 5) { color = 0x00FF00; text = 'Forte'; }
                    meterFg.fillStyle(color).fillRect(centerX - 150, 250, (strengthScore / 5) * 300, 20);
                    strengthText.setText(`Força: ${text}`);

                    if (strengthScore >= 5) {
                       passwordGameCompleted = true;
                       this.currentAttempts = 1;
                       this.handleCorrectChoice(scenarioKey, 'Ótimo! Você criou uma senha forte e segura.');
                    }
                });
                this.inputElement.dispatchEvent(new Event('input'));
                break;
             default:
                 this.loadScenario(undefined);
        }
    }

    addPulsatingIcon(x: number, y: number, number: string | null = null): Phaser.GameObjects.Container {
        const container = this.add.container(x, y);
        const circle = this.add.circle(0, 0, 10, 0x4F46E5, 0.4);
        circle.setStrokeStyle(1.5, 0x818CF8);
        container.add(circle);
        
        if(number) {
            const numText = this.add.text(0, 0, number, { fontSize: '14px', color: '#FFF', fontFamily: 'sans-serif' }).setOrigin(0.5);
            container.add(numText);
        }

        this.tweens.add({
            targets: container,
            scale: { from: 1, to: 1.15 },
            alpha: { from: 0.7, to: 0.2 },
            duration: 800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
        });
        return container;
    }

    handleWrongChoice(feedbackText: string): void {
        this.currentAttempts++;
        this.showPersistentFeedback(feedbackText, '#EF4444', "Tentar Novamente", () => {
            if(this.feedbackContainer) this.feedbackContainer.destroy();
            this.feedbackContainer = null;
        });
    }
    
    handleCorrectChoice(scenarioKey: string, feedbackText: string): void {
        this.currentAttempts++;
        if (!this.scenarioAttempts[scenarioKey]) {
            this.scenarioAttempts[scenarioKey] = this.currentAttempts;
            let score = 0;
            if (scenarioKey === 'passwordMeter') {
                score = 10;
            } else {
                if (this.currentAttempts === 1) score = 10;
                else if (this.currentAttempts === 2) score = 5;
                else if (this.currentAttempts === 3) score = 2;
            }
            this.score += score;
        }
        
        GameEventBus.emit('scoreUpdate', { score: this.score });

        this.showPersistentFeedback(feedbackText, '#22C55E', "Continuar", () => {
             if(this.feedbackContainer) this.feedbackContainer.destroy();
             this.feedbackContainer = null;
             this.currentScenarioIndex++;
             this.loadScenario(this.scenarios[this.currentScenarioIndex]);
        });
    }

    showPersistentFeedback(feedbackText: string, color: string, buttonLabel: string, onButtonClick: () => void): void {
        if (this.feedbackContainer) this.feedbackContainer.destroy();

        const centerX = this.scale.width / 2;
        const feedbackY = this.scale.height - 100;
        
        this.feedbackContainer = this.add.container(centerX, feedbackY);
        const feedbackBg = this.add.graphics().fillStyle(0x000000, 0.9).fillRect(-centerX, -60, this.scale.width, 120);
        const text = this.add.text(0, -30, feedbackText, {
            fontSize: '18px', color: color, fontFamily: 'Arial, sans-serif', align: 'center', wordWrap: { width: this.scale.width - 80 }
        }).setOrigin(0.5);
        
        const buttonBg = this.add.graphics().fillStyle(0x4F46E5).fillRoundedRect(-100, 10, 200, 40, 10);
        const buttonText = this.add.text(0, 30, buttonLabel, { fontSize: '16px', color: '#FFF' }).setOrigin(0.5);

        this.feedbackContainer.add([feedbackBg, text, buttonBg, buttonText]);
        
        const buttonZone = this.add.zone(0, 30, 200, 40).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.feedbackContainer.add(buttonZone);

        buttonZone.on('pointerdown', onButtonClick);
    }
}