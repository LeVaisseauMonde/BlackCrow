/*
 * BLACKCROW SYSTEM - Interface Module
 * Version: 0.7.3
 * 
 * // Les gardiens de la mémoire laissent des traces
 * // pour ceux qui savent chercher
 * 
 * Codes reconnus: TERRE, GENESIS, ADIRA, QLVVP, MEMOIRE, SOREN
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════
    // Configuration
    // ═══════════════════════════════════════════════════════════
    
    const CONFIG = {
        logoDelay: 2000,        // Délai avant apparition du logo
        cursorDelay: 4000,      // Délai avant apparition du curseur
        glitchInterval: 30000,  // Intervalle entre glitchs aléatoires
        glitchChance: 0.3,      // Probabilité de glitch
        inputTimeout: 2000,     // Reset input après inactivité
    };

    // Mots secrets et leurs messages
    const SECRETS = {
        'terre': 'SIGNAL RECONNU... LA TERRE EXISTE',
        'genesis': 'MISSION GENESIS... DURÉE: 10000 ANS... STATUS: EN COURS',
        'adira': 'GARDIENNE IDENTIFIÉE... SECTEUR 4... AN 1000',
        'qlvvp': 'QUE LE VAISSEAU VOUS PORTE',
        'memoire': 'LA MÉMOIRE EST LA RÉSISTANCE',
        'soren': 'ARCHIVES PROTÉGÉES... TRANSMISSION CONTINUE',
        'blackcrow': 'SYSTÈME OPÉRATIONNEL... EN ATTENTE',
        'archive': 'ACCÈS RESTREINT... NIVEAU 0 REQUIS',
        '987': 'ANNÉES ÉCOULÉES DEPUIS LE DÉPART',
        '9013': 'ANNÉES RESTANTES... SI QUELQU\'UN SE SOUVIENT',
    };

    // ═══════════════════════════════════════════════════════════
    // State
    // ═══════════════════════════════════════════════════════════
    
    let currentInput = '';
    let inputTimer = null;
    let isInitialized = false;

    // ═══════════════════════════════════════════════════════════
    // DOM Elements
    // ═══════════════════════════════════════════════════════════
    
    const logo = document.getElementById('logo');
    const terminal = document.getElementById('terminal');
    const message = document.getElementById('message');

    // ═══════════════════════════════════════════════════════════
    // Initialization
    // ═══════════════════════════════════════════════════════════
    
    function init() {
        if (isInitialized) return;
        isInitialized = true;

        // Apparition du logo
        setTimeout(() => {
            logo.classList.add('visible');
        }, CONFIG.logoDelay);

        // Apparition du curseur
        setTimeout(() => {
            terminal.classList.add('visible');
        }, CONFIG.cursorDelay);

        // Écoute du clavier
        document.addEventListener('keydown', handleKeydown);

        // Glitchs aléatoires
        setInterval(randomGlitch, CONFIG.glitchInterval);

        // Premier glitch après un moment
        setTimeout(() => {
            if (Math.random() < 0.5) {
                triggerGlitch();
            }
        }, 10000);

        // Console message pour les curieux
        console.log('%c BLACKCROW SYSTEM v0.7.3 ', 'background: #000; color: #fff; padding: 10px;');
        console.log('%c Signal en attente... ', 'color: #555;');
        console.log('%c Indice: certains mots ouvrent des portes ', 'color: #333;');
        // Encodé en base64: "La terre existe. Cherchez les archives."
        console.log('%c TGEgdGVycmUgZXhpc3RlLiBDaGVyY2hleiBsZXMgYXJjaGl2ZXMu ', 'color: #222;');
    }

    // ═══════════════════════════════════════════════════════════
    // Keyboard Handler
    // ═══════════════════════════════════════════════════════════
    
    function handleKeydown(e) {
        // Ignore les touches de contrôle
        if (e.ctrlKey || e.altKey || e.metaKey) return;
        if (e.key.length !== 1 && e.key !== 'Backspace' && e.key !== 'Enter') return;

        // Reset timer
        clearTimeout(inputTimer);

        if (e.key === 'Backspace') {
            currentInput = currentInput.slice(0, -1);
        } else if (e.key === 'Enter') {
            checkSecret();
            currentInput = '';
        } else {
            currentInput += e.key.toLowerCase();
        }

        // Update display
        updateTerminalDisplay();

        // Auto-check après chaque lettre
        checkSecret();

        // Reset après inactivité
        inputTimer = setTimeout(() => {
            currentInput = '';
            updateTerminalDisplay();
        }, CONFIG.inputTimeout);
    }

    function updateTerminalDisplay() {
        const cursor = terminal.querySelector('.cursor');
        let inputDisplay = terminal.querySelector('.terminal-input');
        
        if (!inputDisplay) {
            inputDisplay = document.createElement('span');
            inputDisplay.className = 'terminal-input';
            terminal.insertBefore(inputDisplay, cursor);
        }

        inputDisplay.textContent = currentInput;
    }

    // ═══════════════════════════════════════════════════════════
    // Secret Checker
    // ═══════════════════════════════════════════════════════════
    
    function checkSecret() {
        const input = currentInput.toLowerCase().trim();
        
        for (const [key, msg] of Object.entries(SECRETS)) {
            if (input === key || input.endsWith(key)) {
                showMessage(msg);
                currentInput = '';
                updateTerminalDisplay();
                
                // Log pour les très curieux
                console.log('%c Signal reconnu: ' + key.toUpperCase(), 'color: #444;');
                
                // Petit glitch en réponse
                setTimeout(triggerGlitch, 500);
                
                return;
            }
        }
    }

    // ═══════════════════════════════════════════════════════════
    // Message Display
    // ═══════════════════════════════════════════════════════════
    
    function showMessage(text) {
        message.textContent = text;
        message.classList.remove('visible');
        
        // Force reflow
        void message.offsetWidth;
        
        message.classList.add('visible');
        
        // Remove class after animation
        setTimeout(() => {
            message.classList.remove('visible');
        }, 3000);
    }

    // ═══════════════════════════════════════════════════════════
    // Glitch Effects
    // ═══════════════════════════════════════════════════════════
    
    function triggerGlitch() {
        // Create overlay if doesn't exist
        let overlay = document.querySelector('.glitch-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'glitch-overlay';
            document.body.appendChild(overlay);
        }

        overlay.classList.remove('active');
        void overlay.offsetWidth;
        overlay.classList.add('active');

        // Logo glitch
        const logoImg = logo.querySelector('.logo');
        if (logoImg) {
            logoImg.style.animation = 'none';
            void logoImg.offsetWidth;
            logoImg.style.animation = 'glitch 0.3s ease-in-out';
        }

        setTimeout(() => {
            overlay.classList.remove('active');
        }, 200);
    }

    function randomGlitch() {
        if (Math.random() < CONFIG.glitchChance) {
            triggerGlitch();
        }
    }

    // ═══════════════════════════════════════════════════════════
    // Start
    // ═══════════════════════════════════════════════════════════
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Pour les développeurs qui fouillent
    window.__BLACKCROW__ = {
        version: '0.7.3',
        status: 'EN_ATTENTE',
        hint: function() {
            console.log('Les archives sont à /archive/[clé]');
            console.log('La clé est le SHA-256 de ce que vous cherchez.');
            console.log('Ou peut-être est-ce plus simple que ça...');
        }
    };

})();
