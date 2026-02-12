// ==========================================
// VALENTINE CARD — DOUBLE GIFT EDITION 💜
// MOBILE-OPTIMIZED VERSION
// ==========================================

// ---- Screen Order ----
// 0: opening-screen  (ribbon gift box)
// 1: gifts-screen    (flower + stuffy)
// 2: game-screen     (snake — gift 1)
// 3: catch-screen    (catch hearts — gift 2)
// 4: memories-screen (polaroids)
// 5: loading-screen  (prank loading)
// 6: valentine-screen (happy valentine's day)
// 7: letter-screen
// 8: final-screen

const screens = [
    document.getElementById('opening-screen'),
    document.getElementById('gifts-screen'),
    document.getElementById('game-screen'),
    document.getElementById('catch-screen'),
    document.getElementById('memories-screen'),
    document.getElementById('loading-screen'),
    document.getElementById('valentine-screen'),
    document.getElementById('letter-screen'),
    document.getElementById('final-screen')
];

let currentScreenIndex = 0;

// Completion flags
let snakeDone = false;
let catchDone = false;

// DOM
const bgMusic  = document.getElementById('bg-music');
const bgVideo  = document.getElementById('bg-video');
const giftWrapper = document.getElementById('gift-wrapper');
const clickPrompt = document.getElementById('click-prompt');
const giftFlower = document.getElementById('gift-flower');
const giftStudfy = document.getElementById('gift-stuffy');
const snakeBadge = document.getElementById('snake-badge');
const catchBadge = document.getElementById('catch-badge');
const stuffyCta  = document.getElementById('stuffy-cta');
const continueButtons = document.querySelectorAll('.continue-btn');
const polaroids = document.querySelectorAll('.polaroid');
const modal     = document.getElementById('polaroid-modal');
const modalClose = document.querySelector('.modal-close');

// ==========================================
// BACKGROUND MEDIA
// ==========================================
function initMedia() {
    bgMusic.volume = 0.5;
    bgMusic.play().catch(() => {});
    if (bgVideo) bgVideo.classList.add('active');
}

// ==========================================
// CONSTELLATION (Opening Screen)
// ==========================================
(function initConstellation() {
    const canvas = document.getElementById('constellation-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animFrame;

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    function heartPoint(t) {
        const cx = canvas.width / 2, cy = canvas.height / 2;
        const scale = Math.min(canvas.width, canvas.height) * 0.18;
        return {
            x: cx + scale * 16 * Math.pow(Math.sin(t), 3) / 16,
            y: cy - scale * (13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t)) / 16
        };
    }

    let stars = [];
    function createStars() {
        stars = [];
        for (let i = 0; i < 120; i++) stars.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, r: Math.random()*1.8+0.3, opacity: 0, twinklSpeed: Math.random()*0.02+0.005, twinklOffset: Math.random()*Math.PI*2, isHeart: false, connections: [] });
        const heartCount = 28;
        const heartStars = [];
        for (let i = 0; i < heartCount; i++) {
            const pt = heartPoint((i/heartCount)*Math.PI*2);
            const s = { x: pt.x, y: pt.y, r: Math.random()*1.5+1, opacity: 0, targetOpacity: Math.random()*0.6+0.3, twinklSpeed: Math.random()*0.015+0.008, twinklOffset: Math.random()*Math.PI*2, isHeart: true, heartIndex: i, connections: [], fadeDelay: i*80 };
            stars.push(s);
            heartStars.push(s);
        }
        heartStars.forEach((s, i) => s.connections.push(heartStars[(i+1)%heartStars.length]));
    }
    createStars();

    let startTime = null;
    function draw(ts) {
        if (!startTime) startTime = ts;
        const elapsed = ts - startTime;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        stars.filter(s => s.isHeart).forEach(s => {
            s.connections.forEach(t => {
                const op = Math.min(s.opacity, t.opacity) * 0.35;
                if (op > 0.02) { ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(t.x,t.y); ctx.strokeStyle=`rgba(216,158,232,${op})`; ctx.lineWidth=0.8; ctx.stroke(); }
            });
        });

        stars.forEach(s => {
            const tw = 0.5 + 0.5*Math.sin(ts*s.twinklSpeed + s.twinklOffset);
            if (s.isHeart) {
                const fs = 800 + s.heartIndex*60, fe = fs + 600;
                if (elapsed > fs) s.opacity = Math.min(1,(elapsed-fs)/(fe-fs)) * s.targetOpacity * (0.6+0.4*tw);
                if (s.opacity > 0.05) {
                    const g = ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*4);
                    g.addColorStop(0, `rgba(216,158,232,${s.opacity*0.6})`);
                    g.addColorStop(1, 'rgba(216,158,232,0)');
                    ctx.beginPath(); ctx.arc(s.x,s.y,s.r*4,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
                }
            } else {
                s.opacity = (0.1 + 0.6*tw)*0.5;
            }
            ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
            ctx.fillStyle = s.isHeart ? `rgba(216,158,232,${s.opacity})` : `rgba(255,245,255,${s.opacity})`;
            ctx.fill();
        });
        animFrame = requestAnimationFrame(draw);
    }
    animFrame = requestAnimationFrame(draw);
    window.addEventListener('constellationStop', () => { cancelAnimationFrame(animFrame); ctx.clearRect(0,0,canvas.width,canvas.height); });
})();

// ==========================================
// RIBBON GIFT BOX UNWRAP (Screen 0 → 1)
// ==========================================
let unwrapped = false;

function createHeartBurst() {
    const hearts = ['💜','💕','💖','💗','💓','💝'];
    for (let i = 0; i < 8; i++) {
        const el = document.createElement('div');
        el.className = 'heart-burst';
        el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        const angle = (i / 8) * Math.PI * 2;
        el.style.setProperty('--tx', `${Math.cos(angle) * 150}px`);
        el.style.setProperty('--ty', `${Math.sin(angle) * 150}px`);
        giftWrapper.appendChild(el);
        setTimeout(() => el.classList.add('animate'), 10);
        setTimeout(() => el.remove(), 1000);
    }
}

giftWrapper.addEventListener('click', () => {
    if (unwrapped) return;
    unwrapped = true;
    initMedia();
    window.dispatchEvent(new Event('constellationStop'));
    clickPrompt.classList.add('hidden');
    giftWrapper.classList.add('unwrapping');
    setTimeout(() => createHeartBurst(), 400);
    setTimeout(() => goToScreen(1), 1500); // → Two gifts screen
});

// ==========================================
// TWO GIFTS CLICK LOGIC (Screen 1)
// ==========================================
giftFlower.addEventListener('click', () => {
    giftFlower.classList.add('opening');
    setTimeout(() => goToScreen(2), 600); // → Snake game
});

giftStudfy.addEventListener('click', () => {
    if (giftStudfy.classList.contains('locked')) return;
    giftStudfy.classList.add('opening');
    setTimeout(() => goToScreen(3), 600); // → Catch hearts
});

// ==========================================
// SCREEN TRANSITIONS
// ==========================================
function goToScreen(index) {
    const from = screens[currentScreenIndex];
    const to   = screens[index];
    from.classList.add('fade-out');
    setTimeout(() => {
        from.classList.remove('active','fade-out');
        to.classList.add('active');
        currentScreenIndex = index;
        onScreenEnter(index);
    }, 500);
}

function goToNextScreen() {
    goToScreen(currentScreenIndex + 1);
}

function onScreenEnter(index) {
    if (index === 2) setTimeout(initSnakeGame, 300);  // snake
    if (index === 3) setTimeout(initCatchGame, 300);  // catch
    if (index === 5) setTimeout(startPrankLoading, 300);  // prank loading
    if (index === 6) setTimeout(initValentineScreen, 300);  // happy valentine's day
    if (index === 8) setTimeout(() => { startFinalHeartAnimation(); initAudioVisualizer(); }, 300);  // final
}

// ==========================================
// AFTER BOTH GAMES: unlock Gift 2 / proceed
// ==========================================
function onSnakeComplete() {
    snakeDone = true;
    snakeBadge.classList.add('visible');
    giftStudfy.classList.remove('locked');
    stuffyCta.textContent = 'Click to play 💜';
    giftStudfy.classList.add('unlocked-bounce');
    // Return to gifts screen (index 1) so they can click Gift 2
    setTimeout(() => goToScreen(1), 1800);
}

function onCatchComplete() {
    catchDone = true;
    catchBadge.classList.add('visible');
    // Return briefly to gifts screen, then auto-proceed to memories (index 4)
    setTimeout(() => {
        goToScreen(1);
        setTimeout(() => goToScreen(4), 1400);
    }, 1800);
}

// ==========================================
// PRANK LOADING SCREEN - TOO MANY HEARTS ERROR 💕
// ==========================================
function startPrankLoading() {
    const loadingText = document.getElementById('loading-text');
    const loadingBar = document.getElementById('loading-bar');
    const loadingPercentage = document.getElementById('loading-percentage');
    const loadingScreen = document.getElementById('loading-screen');
    
    let progress = 0;
    
    // Fast progress to 100%
    const fastInterval = setInterval(() => {
        progress += Math.random() * 8 + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(fastInterval);
            loadingBar.style.width = '100%';
            loadingPercentage.textContent = '100%';
            
            // Brief pause, then heart overflow
            setTimeout(() => {
                showHeartOverflow();
            }, 500);
        } else {
            loadingBar.style.width = progress + '%';
            loadingPercentage.textContent = Math.floor(progress) + '%';
        }
    }, 100);
    
    function showHeartOverflow() {
        // Change to pink error state
        loadingText.style.color = '#ec4899';
        loadingText.textContent = "ERROR: Too many hearts to count! 💜💜💜";
        loadingBar.style.background = 'linear-gradient(90deg, #ec4899, #f472b6)';
        
        // Create raining hearts
        const hearts = ['💜', '💕', '💖', '💗', '💓', '💝', '💘', '❤️'];
        const heartContainer = document.createElement('div');
        heartContainer.style.position = 'fixed';
        heartContainer.style.top = '0';
        heartContainer.style.left = '0';
        heartContainer.style.width = '100%';
        heartContainer.style.height = '100%';
        heartContainer.style.pointerEvents = 'none';
        heartContainer.style.zIndex = '10001';
        heartContainer.style.overflow = 'hidden';
        loadingScreen.appendChild(heartContainer);
        
        // Spawn raining hearts
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
                heart.style.position = 'absolute';
                heart.style.left = Math.random() * 100 + '%';
                heart.style.top = '-50px';
                heart.style.fontSize = (Math.random() * 30 + 20) + 'px';
                heart.style.opacity = '0';
                heart.style.animation = 'heartRain 2s ease-in forwards';
                heart.style.animationDelay = '0s';
                heartContainer.appendChild(heart);
                
                setTimeout(() => heart.remove(), 2000);
            }, i * 50);
        }
        
        // Add CSS animation for heart rain
        if (!document.getElementById('heart-rain-style')) {
            const style = document.createElement('style');
            style.id = 'heart-rain-style';
            style.textContent = `
                @keyframes heartRain {
                    0% {
                        top: -50px;
                        opacity: 0;
                        transform: translateX(0) rotate(0deg);
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        top: 100vh;
                        opacity: 0;
                        transform: translateX(${Math.random() * 100 - 50}px) rotate(${Math.random() * 360}deg);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Show success message
        setTimeout(() => {
            loadingText.style.color = '#6b4984';
            loadingText.textContent = "Overflow successful! 💜";
            loadingBar.style.background = 'linear-gradient(90deg, #e8b4f0, #d89ee8, #c084fc)';
        }, 1500);
        
        // Move to valentine screen
        setTimeout(() => {
            loadingText.textContent = "Something special is waiting...";
            setTimeout(() => {
                heartContainer.remove();
                goToScreen(6);
            }, 600);
        }, 2500);
    }
}

// ==========================================
// HAPPY VALENTINE'S DAY SCREEN
// ==========================================
function initValentineScreen() {
    // Spawn floating petals/hearts
    const container = document.getElementById('vday-petals');
    if (!container) return;
    container.innerHTML = '';

    const symbols = ['💜', '💕', '✦', '🌸', '💖', '✿', '♡', '💗'];
    for (let i = 0; i < 22; i++) {
        const petal = document.createElement('div');
        petal.className = 'vday-petal';
        petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (4 + Math.random() * 6) + 's';
        petal.style.animationDelay = (Math.random() * 4) + 's';
        petal.style.fontSize = (14 + Math.random() * 22) + 'px';
        petal.style.opacity = (0.3 + Math.random() * 0.5).toString();
        container.appendChild(petal);
    }

    // Wire up continue button
    const btn = document.getElementById('vday-continue-btn');
    if (btn) {
        btn.onclick = () => {
            btn.classList.add('btn-clicked');
            setTimeout(() => goToNextScreen(), 500);
        };
    }
}

// ==========================================
// SNAKE GAME - WITH MOBILE TOUCH CONTROLS
// ==========================================
const GRID_SIZE = 30, TILE_COUNT = 20, SNAKE_WIN = 3, SNAKE_SPEED = 200;
let snakeCanvas, snakeCtx, snake=[], food={}, dir='RIGHT', nextDir='RIGHT';
let snakeScore=0, snakeRunning=false, snakeInterval=null;

const startGameBtn   = document.getElementById('start-game-btn');
const restartGameBtn = document.getElementById('restart-game-btn');
const gameStartEl    = document.getElementById('game-start');
const gameOverEl     = document.getElementById('game-over');
const gameVictoryEl  = document.getElementById('game-victory');

// Touch control variables
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function initSnakeGame() {
    snakeCanvas = document.getElementById('snakeCanvas');
    if (!snakeCanvas) return;
    snakeCtx = snakeCanvas.getContext('2d');
    snake = [{x:10,y:10},{x:9,y:10},{x:8,y:10}];
    dir = nextDir = 'RIGHT';
    snakeScore = 0;
    snakeRunning = false;
    updateSnakeScore();
    gameStartEl.classList.remove('hidden');
    gameOverEl.classList.add('hidden');
    gameVictoryEl.classList.add('hidden');
    placeSnakeFood();
    drawSnake();
    
    // Add touch event listeners for mobile
    snakeCanvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    snakeCanvas.addEventListener('touchend', handleTouchEnd, { passive: false });
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}

function handleTouchEnd(e) {
    e.preventDefault();
    const touch = e.changedTouches[0];
    touchEndX = touch.clientX;
    touchEndY = touch.clientY;
    handleSwipe();
}

function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const minSwipeDistance = 30;
    
    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0 && dir !== 'LEFT') {
                nextDir = 'RIGHT';
            } else if (deltaX < 0 && dir !== 'RIGHT') {
                nextDir = 'LEFT';
            }
        }
    } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0 && dir !== 'UP') {
                nextDir = 'DOWN';
            } else if (deltaY < 0 && dir !== 'DOWN') {
                nextDir = 'UP';
            }
        }
    }
}

function startSnake() {
    if (snakeRunning) return;
    gameStartEl.classList.add('hidden');
    snakeRunning = true;
    if (snakeInterval) clearInterval(snakeInterval);
    snakeInterval = setInterval(snakeLoop, SNAKE_SPEED);
}

function snakeLoop() {
    if (!snakeRunning) return;
    dir = nextDir;
    const head = {...snake[0]};
    if (dir==='UP') head.y--; else if (dir==='DOWN') head.y++; else if (dir==='LEFT') head.x--; else head.x++;
    snake.unshift(head);
    if (head.x<0||head.x>=TILE_COUNT||head.y<0||head.y>=TILE_COUNT||snake.slice(1).some(s=>s.x===head.x&&s.y===head.y)) {
        snakeRunning=false; clearInterval(snakeInterval);
        document.getElementById('final-score').textContent=snakeScore;
        gameOverEl.classList.remove('hidden'); return;
    }
    if (head.x===food.x&&head.y===food.y) {
        snakeScore++; updateSnakeScore();
        if (snakeScore>=SNAKE_WIN) { snakeRunning=false; clearInterval(snakeInterval); gameVictoryEl.classList.remove('hidden'); onSnakeComplete(); return; }
        placeSnakeFood();
    } else { snake.pop(); }
    drawSnake();
}

function placeSnakeFood() {
    do { food={x:Math.floor(Math.random()*TILE_COUNT),y:Math.floor(Math.random()*TILE_COUNT)}; }
    while (snake.some(s=>s.x===food.x&&s.y===food.y));
}

function drawSnake() {
    snakeCtx.fillStyle='#fff'; snakeCtx.fillRect(0,0,snakeCanvas.width,snakeCanvas.height);
    snakeCtx.strokeStyle='#f0f0f0'; snakeCtx.lineWidth=1;
    for(let i=0;i<=TILE_COUNT;i++){snakeCtx.beginPath();snakeCtx.moveTo(i*GRID_SIZE,0);snakeCtx.lineTo(i*GRID_SIZE,snakeCanvas.height);snakeCtx.stroke();snakeCtx.beginPath();snakeCtx.moveTo(0,i*GRID_SIZE);snakeCtx.lineTo(snakeCanvas.width,i*GRID_SIZE);snakeCtx.stroke();}
    snake.forEach((s,i)=>{snakeCtx.fillStyle=i===0?'#6b4984':'#e8b4f0';snakeCtx.fillRect(s.x*GRID_SIZE+1,s.y*GRID_SIZE+1,GRID_SIZE-2,GRID_SIZE-2);snakeCtx.strokeStyle='#6b4984';snakeCtx.lineWidth=1;snakeCtx.strokeRect(s.x*GRID_SIZE+1,s.y*GRID_SIZE+1,GRID_SIZE-2,GRID_SIZE-2);});
    snakeCtx.font='16px Arial'; snakeCtx.textAlign='center'; snakeCtx.textBaseline='middle';
    snakeCtx.fillText('💜',food.x*GRID_SIZE+GRID_SIZE/2,food.y*GRID_SIZE+GRID_SIZE/2);
}

function updateSnakeScore() { const el=document.getElementById('score'); if(el) el.textContent=snakeScore; }

// Keyboard controls for desktop
document.addEventListener('keydown', e => {
    const map={'ArrowUp':'UP','ArrowDown':'DOWN','ArrowLeft':'LEFT','ArrowRight':'RIGHT'};
    if (map[e.key]) { const opp={UP:'DOWN',DOWN:'UP',LEFT:'RIGHT',RIGHT:'LEFT'}; if(opp[map[e.key]]!==dir) nextDir=map[e.key]; e.preventDefault(); }
});

startGameBtn?.addEventListener('click', startSnake);
restartGameBtn?.addEventListener('click', () => { initSnakeGame(); startSnake(); });

// ==========================================
// CATCH HEARTS GAME
// ==========================================
let catchCanvas, catchCtx;
let catchRunning = false, catchAnimFrame = null;
let basket = { x: 300, y: 540, w: 100, h: 28 };
let hearts = [];
let caughtCount = 0, missedCount = 0;
const CATCH_WIN = 10, CATCH_MAX_MISS = 5;
let heartSpawnTimer = 0, heartSpawnInterval = 90; // frames
let catchFrame = 0;

const catchStartEl   = document.getElementById('catch-start');
const catchOverEl    = document.getElementById('catch-over');
const catchVictoryEl = document.getElementById('catch-victory');
const startCatchBtn  = document.getElementById('start-catch-btn');
const restartCatchBtn= document.getElementById('restart-catch-btn');

function initCatchGame() {
    catchCanvas = document.getElementById('catchCanvas');
    if (!catchCanvas) return;
    catchCtx = catchCanvas.getContext('2d');
    basket = { x: catchCanvas.width/2 - 50, y: catchCanvas.height - 70, w: 100, h: 28 };
    hearts = [];
    caughtCount = 0; missedCount = 0; catchFrame = 0; heartSpawnTimer = 0;
    catchRunning = false;
    updateCatchScore();
    catchStartEl.classList.remove('hidden');
    catchOverEl.classList.add('hidden');
    catchVictoryEl.classList.add('hidden');
    drawCatchIdle();

    // Mouse / touch control
    catchCanvas.addEventListener('mousemove', moveCatchBasket);
    catchCanvas.addEventListener('touchmove', moveCatchBasketTouch, {passive:false});
}

function moveCatchBasket(e) {
    if (!catchRunning) return;
    const rect = catchCanvas.getBoundingClientRect();
    const scaleX = catchCanvas.width / rect.width;
    basket.x = (e.clientX - rect.left) * scaleX - basket.w / 2;
    basket.x = Math.max(0, Math.min(catchCanvas.width - basket.w, basket.x));
}

function moveCatchBasketTouch(e) {
    e.preventDefault(); // Prevent scrolling while playing
    if (!catchRunning || !e.touches[0]) return;
    const rect = catchCanvas.getBoundingClientRect();
    const scaleX = catchCanvas.width / rect.width;
    basket.x = (e.touches[0].clientX - rect.left) * scaleX - basket.w / 2;
    basket.x = Math.max(0, Math.min(catchCanvas.width - basket.w, basket.x));
}

function startCatchGame() {
    catchStartEl.classList.add('hidden');
    catchRunning = true;
    if (catchAnimFrame) cancelAnimationFrame(catchAnimFrame);
    catchAnimFrame = requestAnimationFrame(catchLoop);
}

function catchLoop() {
    if (!catchRunning) return;
    catchFrame++;
    updateCatchGame();
    drawCatchGame();
    catchAnimFrame = requestAnimationFrame(catchLoop);
}

function updateCatchGame() {
    // Spawn hearts
    heartSpawnTimer++;
    // Speed up over time
    const spawnRate = Math.max(35, heartSpawnInterval - Math.floor(catchFrame / 120));
    if (heartSpawnTimer >= spawnRate) {
        heartSpawnTimer = 0;
        const speed = 2.5 + Math.random() * 2 + (catchFrame / 600);
        hearts.push({
            x: Math.random() * (catchCanvas.width - 30) + 15,
            y: -30,
            speed: speed,
            size: 18 + Math.random() * 10,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.05 + Math.random() * 0.05,
            caught: false,
            missed: false,
            alpha: 1
        });
    }

    // Move hearts
    hearts.forEach(h => {
        if (h.caught || h.missed) return;
        h.y += h.speed;
        h.wobble += h.wobbleSpeed;
        h.x += Math.sin(h.wobble) * 0.8;

        // Check catch
        if (
            h.y + h.size > basket.y &&
            h.y < basket.y + basket.h &&
            h.x + h.size/2 > basket.x &&
            h.x - h.size/2 < basket.x + basket.w
        ) {
            h.caught = true;
            caughtCount++;
            updateCatchScore();
            if (caughtCount >= CATCH_WIN) {
                endCatchGame('win');
            }
        }

        // Missed
        if (h.y > catchCanvas.height + 20) {
            h.missed = true;
            missedCount++;
            updateCatchScore();
            if (missedCount >= CATCH_MAX_MISS) {
                endCatchGame('lose');
            }
        }
    });

    // Clean up
    hearts = hearts.filter(h => !h.caught && !h.missed);
}

function drawCatchGame() {
    const w = catchCanvas.width, h = catchCanvas.height;
    catchCtx.clearRect(0, 0, w, h);

    // Background
    catchCtx.fillStyle = '#fff';
    catchCtx.fillRect(0, 0, w, h);

    // Grid
    catchCtx.strokeStyle = '#f0f0f0'; catchCtx.lineWidth = 1;
    for (let i = 0; i < w; i += 30) { catchCtx.beginPath(); catchCtx.moveTo(i,0); catchCtx.lineTo(i,h); catchCtx.stroke(); }
    for (let i = 0; i < h; i += 30) { catchCtx.beginPath(); catchCtx.moveTo(0,i); catchCtx.lineTo(w,i); catchCtx.stroke(); }

    // Hearts
    hearts.forEach(heart => {
        catchCtx.font = `${heart.size * 2}px serif`;
        catchCtx.textAlign = 'center';
        catchCtx.textBaseline = 'middle';
        catchCtx.globalAlpha = heart.alpha;
        catchCtx.fillText('💜', heart.x, heart.y);
        catchCtx.globalAlpha = 1;
    });

    // Basket
    drawBasket();

    // HUD: missed indicator (red dots)
    for (let i = 0; i < CATCH_MAX_MISS; i++) {
        catchCtx.beginPath();
        catchCtx.arc(20 + i * 22, 20, 8, 0, Math.PI * 2);
        catchCtx.fillStyle = i < missedCount ? '#ef4444' : 'rgba(239,68,68,0.2)';
        catchCtx.fill();
    }
}

function drawCatchIdle() {
    if (!catchCtx) return;
    const w = catchCanvas.width, h = catchCanvas.height;
    catchCtx.fillStyle = '#fff';
    catchCtx.fillRect(0, 0, w, h);
    catchCtx.strokeStyle = '#f0f0f0'; catchCtx.lineWidth = 1;
    for (let i = 0; i < w; i += 30) { catchCtx.beginPath(); catchCtx.moveTo(i,0); catchCtx.lineTo(i,h); catchCtx.stroke(); }
    for (let i = 0; i < h; i += 30) { catchCtx.beginPath(); catchCtx.moveTo(0,i); catchCtx.lineTo(w,i); catchCtx.stroke(); }
    drawBasket();
}

function drawBasket() {
    const bx = basket.x, by = basket.y, bw = basket.w, bh = basket.h;
    // Shadow
    catchCtx.shadowColor = 'rgba(107,73,132,0.3)';
    catchCtx.shadowBlur = 10;
    // Body
    catchCtx.fillStyle = '#6b4984';
    catchCtx.beginPath();
    catchCtx.moveTo(bx, by);
    catchCtx.lineTo(bx + bw, by);
    catchCtx.lineTo(bx + bw - 8, by + bh);
    catchCtx.lineTo(bx + 8, by + bh);
    catchCtx.closePath();
    catchCtx.fill();
    // Rim
    catchCtx.shadowBlur = 0;
    catchCtx.fillStyle = '#e8b4f0';
    catchCtx.fillRect(bx - 4, by - 6, bw + 8, 10);
    // Shine
    catchCtx.fillStyle = 'rgba(255,255,255,0.25)';
    catchCtx.fillRect(bx + 8, by - 3, bw * 0.35, 4);
    catchCtx.shadowBlur = 0;
}

function endCatchGame(result) {
    catchRunning = false;
    cancelAnimationFrame(catchAnimFrame);

    if (result === 'win') {
        catchVictoryEl.classList.remove('hidden');
        onCatchComplete();
    } else {
        document.getElementById('catch-final').textContent = caughtCount;
        catchOverEl.classList.remove('hidden');
    }
}

function updateCatchScore() {
    const cs = document.getElementById('catch-score');
    const cm = document.getElementById('catch-missed');
    if (cs) cs.textContent = caughtCount;
    if (cm) cm.textContent = missedCount;
}

startCatchBtn?.addEventListener('click', startCatchGame);
restartCatchBtn?.addEventListener('click', () => { initCatchGame(); startCatchGame(); });

// ==========================================
// CONTINUE BUTTONS (memories → loading etc)
// ==========================================
continueButtons.forEach(btn => btn.addEventListener('click', e => { e.preventDefault(); goToNextScreen(); }));

// ==========================================
// FINAL SCREEN — NO AUTO-TIMER, MANUAL CLOSE BUTTON
// ==========================================
document.getElementById('final-close-btn')?.addEventListener('click', () => {
    showCloseGiftModal();
});

function showCloseGiftModal() {
    const closeModal = document.getElementById('close-gift-modal');
    const yesCloseBtn = document.getElementById('yes-close-btn');
    const noCloseBtn = document.getElementById('no-close-btn');
    const exitBtn = document.getElementById('close-gift-exit');
    
    closeModal.classList.add('active');
    
    // Yes button - reset everything
    yesCloseBtn.onclick = () => {
        closeModal.classList.remove('active');
        resetToBeginning();
    };
    
    // No button - close modal, stay on final screen
    noCloseBtn.onclick = () => {
        closeModal.classList.remove('active');
    };
    
    // Exit (×) button on modal - close modal, stay on final screen
    exitBtn.onclick = () => {
        closeModal.classList.remove('active');
    };
}

function resetToBeginning() {
    // Reset all game states
    snakeDone = false;
    catchDone = false;
    unwrapped = false;
    
    // Reset gift items
    giftFlower.classList.remove('opening');
    giftStudfy.classList.remove('opening', 'unlocked-bounce');
    giftStudfy.classList.add('locked');
    snakeBadge.classList.remove('visible');
    catchBadge.classList.remove('visible');
    stuffyCta.textContent = 'Open Gift 1 first 🔒';
    
    // Reset gift wrapper
    giftWrapper.classList.remove('unwrapping');
    clickPrompt.classList.remove('hidden');
    
    // Fade out current screen
    screens[currentScreenIndex].classList.add('fade-out');
    
    setTimeout(() => {
        // Remove active from all screens
        screens.forEach(s => s.classList.remove('active', 'fade-out'));
        
        // Reset to opening screen
        currentScreenIndex = 0;
        screens[0].classList.add('active');
        
        // Reload page to restart constellation and music
        window.location.reload();
    }, 500);
}

// ==========================================
// FINAL SCREEN
// ==========================================
function startFinalHeartAnimation() {
    document.querySelectorAll('.animated-heart').forEach((h, i) => setTimeout(() => h.classList.add('beating'), i*200));
}

function initAudioVisualizer() {
    const vizCanvas = document.getElementById('visualizer-canvas');
    if (!vizCanvas) return;
    const vizCtx = vizCanvas.getContext('2d');
    let analyser = null, dataArray = null, vizFrame = null;
    let useFake = true, fakePhase = 0;

    function resizeViz() { const s = Math.min(window.innerWidth, window.innerHeight)*0.55; vizCanvas.width=s; vizCanvas.height=s; }
    resizeViz(); window.addEventListener('resize', resizeViz);

    try {
        const AC = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AC();
        const src = audioCtx.createMediaElementSource(bgMusic);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128;
        src.connect(analyser); analyser.connect(audioCtx.destination);
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        useFake = false;
    } catch(e) { useFake = true; }

    function getFake(n) {
        fakePhase += 0.04;
        const arr = new Uint8Array(n);
        for (let i=0;i<n;i++) { const t=fakePhase+i*0.4; arr[i]=Math.max(20,Math.min(255,80+50*Math.sin(t*0.7)+30*Math.sin(t*1.3+1.5)+Math.random()*20)); }
        return arr;
    }

    function drawViz() {
        vizFrame = requestAnimationFrame(drawViz);
        const w=vizCanvas.width, h=vizCanvas.height, cx=w/2, cy=h/2;
        vizCtx.clearRect(0,0,w,h);
        const data = useFake ? getFake(48) : (analyser.getByteFrequencyData(dataArray), dataArray);
        const inner = Math.min(w,h)*0.2, maxBar = Math.min(w,h)*0.22;
        for (let i=0;i<data.length;i++) {
            const angle=(i/data.length)*Math.PI*2-Math.PI/2, amp=data[i]/255;
            const barH = inner*0.2 + amp*maxBar;
            const hue=280+amp*60, sat=70+amp*30, lit=55+amp*20, alpha=0.4+amp*0.6;
            vizCtx.beginPath(); vizCtx.moveTo(cx+Math.cos(angle)*inner,cy+Math.sin(angle)*inner); vizCtx.lineTo(cx+Math.cos(angle)*(inner+barH),cy+Math.sin(angle)*(inner+barH));
            vizCtx.strokeStyle=`hsla(${hue},${sat}%,${lit}%,${alpha})`; vizCtx.lineWidth=(w/data.length)*0.6; vizCtx.lineCap='round'; vizCtx.stroke();
        }
        const avg = Array.from(data).reduce((a,b)=>a+b,0)/data.length/255;
        const pr = inner*(0.85+avg*0.25);
        const g=vizCtx.createRadialGradient(cx,cy,0,cx,cy,pr);
        g.addColorStop(0,`rgba(232,180,240,${0.3+avg*0.5})`); g.addColorStop(0.6,`rgba(168,85,247,${0.15+avg*0.3})`); g.addColorStop(1,'rgba(168,85,247,0)');
        vizCtx.beginPath(); vizCtx.arc(cx,cy,pr,0,Math.PI*2); vizCtx.fillStyle=g; vizCtx.fill();
        vizCtx.font=`${inner*(0.9+avg*0.3)}px serif`; vizCtx.textAlign='center'; vizCtx.textBaseline='middle'; vizCtx.fillText('💜',cx,cy+inner*0.05);
    }
    drawViz();
}

// ==========================================
// POLAROID MODAL
// ==========================================
polaroids.forEach(p => {
    p.addEventListener('click', () => {
        const img = p.querySelector('.polaroid-image img');
        if (!img) return;
        modal.querySelector('.modal-image').innerHTML = '';
        modal.querySelector('.modal-image').appendChild(img.cloneNode(true));
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

function closeModal() { modal.classList.remove('active'); document.body.style.overflow='auto'; }
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target===modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key==='Escape' && modal.classList.contains('active')) closeModal(); });

// ==========================================
// INIT
// ==========================================
window.addEventListener('load', () => { screens[0].classList.add('active'); });
console.log('%c💜 Happy Valentine\'s Day! 💜', 'font-size:20px;color:#e8b4f0;');