// gupacode/applic/Applic-mod/game/DigitalSecurityGameScene.ts

import * as Phaser from 'phaser';
import { GameEventBus } from './EventBus';

export class DigitalSecurityGameScene extends Phaser.Scene {
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

    preload() {}

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
        if (this.feedbackContainer) this.feedbackContainer.destroy();
        this.feedbackContainer = null;
        if (this.inputElement) this.inputElement.remove();
        this.inputElement = null;
        if (this.dialogGroup) this.dialogGroup.destroy(true);
        this.dialogGroup = null;

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

            case 'phishingSms':
                instructionText.setText('Ao receber um SMS como o mostrado abaixo, qual ação você tomaria?');
                this.add.graphics().fillStyle(0x111111, 1).fillRoundedRect(centerX - 160, 80, 320, 500, 30);
                this.add.graphics().fillStyle(0x000000, 1).fillRect(centerX - 150, 90, 300, 480);
                this.add.graphics().fillStyle(0x222222, 1).fillRect(centerX-150, 90, 300, 40);
                this.add.text(centerX - 140, 110, '401-909', { fontSize: '18px', color: '#FFFFFF', ...baseTextStyle, align: 'left'}).setOrigin(0, 0.5);
                const blockButton = this.add.text(centerX + 140, 110, 'Bloquear', { fontSize: '16px', color: '#EF4444', ...baseTextStyle }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
                this.addPulsatingIcon(blockButton.x - blockButton.width / 2, blockButton.y);
                blockButton.on('pointerdown', () => this.handleCorrectChoice(scenarioKey, 'Ação correta! Bloquear o remetente e apagar a mensagem é a melhor forma de se proteger.'));
                this.interactiveElements.push(blockButton);
                this.add.graphics().fillStyle(0x373737, 1).fillRoundedRect(centerX - 140, 150, 280, 180, 15);
                this.add.text(centerX - 130, 160, 'GOV.BR INFORMA:', { fontSize: '16px', color: '#FFFFFF', fontStyle: 'bold', ...baseTextStyle, align: 'left' });
                this.add.text(centerX - 130, 190, 'Identificamos divergências em contas associadas ao seu CPF. REGULARIZE URGENTE para evitar intimação judicial.', { fontSize: '15px', color: '#FFFFFF', ...baseTextStyle, align: 'left', wordWrap: { width: 260 } });
                const smsLink = this.add.text(centerX - 130, 290, 'Acesse: www.gov-br-resolve.site', { fontSize: '15px', color: '#60A5FA', ...baseTextStyle, align: 'left' }).setInteractive({ useHandCursor: true });
                this.addPulsatingIcon(smsLink.x - 15, smsLink.y);
                smsLink.on('pointerdown', () => this.handleWrongChoice('Errado. O link é falso! O site oficial é "gov.br". Nunca clique em links suspeitos recebidos por SMS.'));
                this.interactiveElements.push(smsLink);
                this.add.graphics().fillStyle(0x222222, 1).fillRoundedRect(centerX - 140, 520, 280, 40, 20);
                const replyText = this.add.text(centerX - 130, 530, 'Digitar mensagem...', { fontSize: '16px', color: '#777', ...baseTextStyle, align: 'left' }).setInteractive({ useHandCursor: true });
                this.addPulsatingIcon(replyText.x - 15, replyText.y);
                replyText.on('pointerdown', () => this.handleWrongChoice('Responder a um SMS de phishing confirma que seu número é válido. Evite qualquer interação.'));
                this.interactiveElements.push(replyText);
                break;
            
            case 'fakeAd':
                instructionText.setText('Vamos analisar juntos os sinais de perigo neste anúncio.');
                const adX = centerX;
                const adY = centerY - 50; 
                const adWidth = 400;
                const adHeight = 480;
                const adContainer = this.add.container(adX, adY);
                const adBg = this.add.graphics().fillStyle(0xffffff, 1).fillRoundedRect(-adWidth / 2, -adHeight / 2, adWidth, adHeight, 10);
                adContainer.add(adBg);
                const title = this.add.text(0, -200, 'ESSE CELULAR\nPODE SER SEU!', { fontSize: '32px', color: '#002e6d', fontStyle: 'bold', fontFamily: 'sans-serif', align: 'center', lineSpacing: 5 }).setOrigin(0.5);
                const subtitle = this.add.text(0, -145, 'Promoção 25 anos', { fontSize: '16px', color: '#555', fontFamily: 'sans-serif' }).setOrigin(0.5);
                const imagePlaceholder = this.add.graphics().fillStyle(0xE0E0E0, 1).fillRect(-140, -110, 280, 200);
                const imagePlaceholderText = this.add.text(0, -10, '[Imagem do Produto]', { fontSize: '16px', color: '#999', align: 'center' }).setOrigin(0.5);
                const callToAction = this.add.text(0, 130, 'Responda o quiz especial e leve seu\ncelular com um mega desconto!', { fontSize: '16px', color: '#333', align: 'center', lineSpacing: 4, fontStyle: 'bold' }).setOrigin(0.5);
                const priceText = this.add.text(0, 185, 'R$169,90', { fontSize: '48px', color: '#d9534f', fontStyle: 'bold', fontFamily: 'sans-serif' }).setOrigin(0.5);
                const timerText = this.add.text(0, 225, 'Oferta termina em: 10:00', { fontSize: '16px', color: '#333', backgroundColor: '#f0ad4e', padding: {x: 8, y: 4}, fontFamily: 'sans-serif' }).setOrigin(0.5);
                adContainer.add([title, subtitle, imagePlaceholder, imagePlaceholderText, callToAction, priceText, timerText]);
                let timeLeft = 600;
                this.time.addEvent({
                    delay: 1000,
                    callback: () => {
                        timeLeft--;
                        const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
                        const seconds = (timeLeft % 60).toString().padStart(2, '0');
                        if (timerText.active) timerText.setText(`Oferta termina em: ${minutes}:${seconds}`);
                    },
                    loop: true
                });
                let tourStep = 0;
                let pulsatingIcon: Phaser.GameObjects.Container;
                const showStep = () => {
                    if (pulsatingIcon) pulsatingIcon.destroy();
                    tourStep++;
                    if (tourStep === 1) { 
                        pulsatingIcon = this.addPulsatingIcon(priceText.x + adX, priceText.y + adY);
                        this.createDialogBox(priceText.x + adX, priceText.y + adY - 40, 'Atenção ao preço: um valor tão baixo para um produto novo é o principal sinal de alerta. Sempre desconfie de ofertas que parecem milagrosas.', 'Próximo →', showStep);
                    } else if (tourStep === 2) { 
                        pulsatingIcon = this.addPulsatingIcon(timerText.x + adX, timerText.y + adY);
                        this.createDialogBox(timerText.x + adX, timerText.y + adY - 40, 'Senso de Urgência: O cronômetro e frases como "últimas unidades" são táticas para fazer você agir por impulso, sem pensar.', 'Próximo →', showStep);
                    } else if (tourStep === 3) {
                         pulsatingIcon = this.addPulsatingIcon(adX, adY - 100);
                         this.createDialogBox(adX, adY - 130, 'Onde você viu isso? Em redes sociais, sempre verifique o perfil do anunciante. Se for suspeito, denuncie!', 'Ok, próxima dica!', showStep);
                    } else if (tourStep === 4) {
                         pulsatingIcon = this.addPulsatingIcon(adX, adY - 100);
                         this.createDialogBox(adX, adY - 130, 'Regra de Ouro: Nunca confie de primeira. Pesquise a reputação da loja no Reclame Aqui e compare preços.', 'Começar o teste!', showStep);
                    } else if (tourStep === 5) { 
                        if (this.dialogGroup) this.dialogGroup.destroy();
                        instructionText.setText('Agora que você analisou os sinais, qual é a ação mais segura a tomar?');
                        const choicesContainer = this.add.container(centerX, adY + adHeight / 2 + 50);
                        const choiceStyle: Phaser.Types.GameObjects.Text.TextStyle = {fontSize: '16px', color: '#FFF', backgroundColor: '#4F46E5', padding:{x:12, y:8}, fontFamily: 'sans-serif', align: 'center', wordWrap: {width: 220}};
                        const optionA = this.add.text(-150, 0, 'Clicar no anúncio e comprar', choiceStyle).setOrigin(0.5).setInteractive({useHandCursor:true});
                        const optionB = this.add.text(150, 0, 'Investigar e ignorar o anúncio', choiceStyle).setOrigin(0.5).setInteractive({useHandCursor:true});
                        choicesContainer.add([optionA, optionB]);
                        this.interactiveElements.push(choicesContainer);
                        optionA.on('pointerdown', () => {
                            this.currentAttempts++;
                            this.showPersistentFeedback('Incorreto. Clicar em um anúncio como este pode te levar para uma página falsa para roubar seus dados!', '#EF4444', 'Tentar Novamente', () => { if (this.feedbackContainer) this.feedbackContainer.destroy(); });
                        });
                        optionB.on('pointerdown', () => this.handleCorrectChoice(scenarioKey, 'Excelente! Ignorar o anúncio e pesquisar em fontes confiáveis é a decisão mais segura.'));
                    }
                };
                this.time.delayedCall(1000, showStep);
                break;
                
            case 'fakeWebsite':
                instructionText.setText("Supondo que você clicou no link. Qual sua PRIMEIRA ação neste site?");
                const frameX = centerX - 200;
                const frameY = 80;
                const frameWidth = 400;
                const frameHeight = 500;
                this.add.graphics().fillStyle(0xF0F0F0, 1).fillRoundedRect(frameX, frameY, frameWidth, frameHeight, 15);
                const pageContentY = frameY;
                this.add.graphics().fillStyle(0xFFFFFF, 1).fillRect(frameX, pageContentY, frameWidth, frameHeight - 50);
                const navbarY = pageContentY;
                const navbarHeight = 60;
                const navbarGraphics = this.add.graphics();
                navbarGraphics.fillStyle(0xFFFFFF, 1).fillRect(frameX, navbarY, frameWidth, navbarHeight);
                navbarGraphics.fillStyle(0x000000, 0.1).fillRect(frameX, navbarY + navbarHeight, frameWidth, 4);
                let logoCurrentX = frameX + 20;
                const logoY = navbarY + navbarHeight / 2;
                const logoFontStyle: Phaser.Types.GameObjects.Text.TextStyle = { fontSize: '28px', fontStyle: 'bold', fontFamily: 'sans-serif' };
                const g = this.add.text(logoCurrentX, logoY, 'g', { ...logoFontStyle, color: '#08539c' }).setOrigin(0, 0.5);
                logoCurrentX += g.width;
                const o = this.add.text(logoCurrentX, logoY, 'o', { ...logoFontStyle, color: '#f8c20d' }).setOrigin(0, 0.5);
                logoCurrentX += o.width;
                const v = this.add.text(logoCurrentX, logoY, 'v', { ...logoFontStyle, color: '#28a745' }).setOrigin(0, 0.5);
                logoCurrentX += v.width;
                const dot = this.add.text(logoCurrentX, logoY, '.', { ...logoFontStyle, color: '#08539c' }).setOrigin(0, 0.5);
                logoCurrentX += dot.width;
                const b = this.add.text(logoCurrentX, logoY, 'b', { ...logoFontStyle, color: '#08539c' }).setOrigin(0, 0.5);
                logoCurrentX += b.width;
                this.add.text(logoCurrentX, logoY, 'r', { ...logoFontStyle, color: '#f8c20d' }).setOrigin(0, 0.5);
                const formY = navbarY + navbarHeight + 30;
                const formX = frameX + 30;
                const formWidth = frameWidth - 60;
                this.add.text(formX, formY, 'Identifique-se no gov.br com:', {fontSize: '20px', color: '#333', fontFamily: 'sans-serif', align: 'left'}).setOrigin(0);
                this.add.text(formX, formY + 40, 'Número do CPF', {fontSize: '16px', color: '#333', fontFamily: 'sans-serif', fontStyle: 'bold'}).setOrigin(0);
                this.add.text(formX, formY + 65, 'Digite seu CPF para criar ou acessar sua conta gov.br', {fontSize: '14px', color: '#555', fontFamily: 'sans-serif'}).setOrigin(0);
                this.add.text(formX, formY + 105, 'CPF', {fontSize: '14px', color: '#333', fontFamily: 'sans-serif'}).setOrigin(0);
                this.add.graphics().fillStyle(0xFFFFFF, 1).lineStyle(1, 0xAAAAAA).strokeRoundedRect(formX, formY + 125, formWidth, 50, 8);
                this.add.text(formX + 10, formY + 150, 'Digite seu CPF', {fontSize: '16px', color: '#777', fontFamily: 'sans-serif'}).setOrigin(0, 0.5);
                this.add.graphics().fillStyle(0x0D47A1, 1).fillRoundedRect(formX, formY + 190, formWidth, 50, 8);
                this.add.text(centerX, formY + 215, 'Continuar', {fontSize: '18px', color: '#FFF', fontFamily: 'sans-serif'}).setOrigin(0.5);
                this.add.text(centerX, formY + 270, 'Esqueci minha senha', {fontSize: '14px', color: '#007BFF', fontFamily: 'sans-serif'}).setOrigin(0.5);
                const bottomBarY = frameY + frameHeight - 40;
                this.add.graphics().fillStyle(0x222222, 1).fillRoundedRect(frameX + 10, bottomBarY, frameWidth - 20, 35, 15);
                this.add.text(centerX, bottomBarY + 18, 'sso.acesso-gov.info/login', {fontSize: '16px', color: '#FAA', fontFamily: 'sans-serif'}).setOrigin(0.5);
                const loginZone = this.add.zone(centerX, formY + 185, formWidth, 120).setOrigin(0.5).setInteractive({useHandCursor:true});
                this.addPulsatingIcon(formX - 10, formY + 150, '1');
                this.interactiveElements.push(loginZone);
                loginZone.on('pointerdown', () => this.handleWrongChoice('Erro! Inserir seus dados em um site suspeito é o objetivo dos golpistas.'));
                const forgotPassZone = this.add.zone(centerX, formY + 270, 200, 30).setOrigin(0.5).setInteractive({useHandCursor: true});
                this.addPulsatingIcon(centerX, formY + 295, '2');
                this.interactiveElements.push(forgotPassZone);
                forgotPassZone.on('pointerdown', () => this.handleWrongChoice('Quase! Essa é uma ação no site falso. A primeira atitude deve ser verificar a segurança do site.'));
                const urlZone = this.add.zone(centerX, bottomBarY + 20, frameWidth - 20, 35).setOrigin(0.5).setInteractive({useHandCursor: true});
                this.addPulsatingIcon(centerX, bottomBarY - 15, '3');
                this.interactiveElements.push(urlZone);
                urlZone.on('pointerdown', () => this.handleCorrectChoice(scenarioKey, 'Correto! Sempre verifique o endereço do site ANTES de qualquer outra ação. O endereço falso ".info" entrega o golpe.'));
                break;

            case 'passwordMeter':
                 instructionText.setText('Objetivo: Crie uma senha que seja considerada "Forte".');
                this.inputElement = document.createElement('input');
                this.inputElement.type = 'text';
                this.inputElement.style.width = '300px';
                const domElement = this.add.dom(centerX, 200, this.inputElement).setClassName('phaser-input');
                this.add.graphics().fillStyle(0x555555).fillRect(centerX - 150, 250, 300, 20);
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