// --- LIQUID POP AUDIO ENGINE ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playPop() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    // Quick frequency sweep for the "pop" effect
    osc.frequency.setValueAtTime(500, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

// --- CURSOR GLOW ---
const glow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
});

const eventsData = [
    { date: '15', title: 'Grand Launch: Innovent 2026', type: 'Symposium' },
    { date: '18', title: 'Inter-College Coding Battle', type: 'Competition' },
    { date: '20', title: 'UI/UX Design Masterclass', type: 'Workshop' },
    { date: '22', title: 'Web3 & Blockchain Summit', type: 'Tech Talk' },
    { date: '25', title: 'Robotics Expo 2026', type: 'Exhibition' },
    { date: '28', title: '48H Mega Hackathon', type: 'Main Event' },
    { date: '31', title: 'Closing Ceremony & Awards', type: 'Finale' }
];

const menu = document.getElementById('dropdown-menu');
const label = document.getElementById('selected-label');
const arrow = document.getElementById('arrow-icon');

// Initialize Dropdown
eventsData.forEach(ev => {
    const fullTitle = `${ev.title} (Mar ${ev.date})`;
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.innerText = fullTitle;
    item.onclick = (e) => {
        e.stopPropagation();
        playPop(); // Trigger Sound
        selectEvent(fullTitle);
    };
    menu.appendChild(item);
});

document.getElementById('dropdown-trigger').onclick = (e) => {
    e.stopPropagation();
    playPop(); // Trigger Sound
    menu.classList.toggle('hidden');
    arrow.classList.toggle('rotate-180');
};

function selectEvent(val) {
    label.innerText = val;
    menu.classList.add('hidden');
    arrow.classList.remove('rotate-180');
}

// Render Grid
const grid = document.getElementById('schedule-grid');
eventsData.forEach(ev => {
    grid.innerHTML += `
        <div class="flex flex-col md:flex-row items-center gap-8 p-8 rounded-[3rem] liquid-glass liquid-card reveal group relative overflow-hidden">
            <div class="z-10 flex flex-col items-center justify-center bg-yellow-400 text-black font-black w-24 h-24 rounded-[2rem] shrink-0">
                <span class="text-[10px] opacity-70 leading-none">MAR</span>
                <span class="text-4xl leading-none">${ev.date}</span>
            </div>
            <div class="z-10 flex-grow text-center md:text-left">
                <h3 class="text-2xl md:text-3xl font-bold text-white group-hover:text-yellow-400 transition-all">${ev.title}</h3>
                <p class="text-slate-500 text-[10px] font-bold uppercase mt-1 tracking-[0.2em]">${ev.type}</p>
            </div>
            <button onclick="toggleModal('${ev.title}')" class="z-10 bg-white/10 hover:bg-yellow-400 hover:text-black text-white px-8 py-4 rounded-2xl text-[10px] font-black transition-all">SECURE SPOT</button>
        </div>
    `;
});

function toggleModal(name = null) {
    playPop(); // Trigger Sound
    const modal = document.getElementById('contact-modal');
    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) {
        if (name) {
            const matched = eventsData.find(e => e.title.includes(name));
            selectEvent(`${matched.title} (Mar ${matched.date})`);
        } else {
            selectEvent("Choose Your Event");
        }
    }
}

// --- GLOBAL CLICK INTERACTION SOUND ---
window.addEventListener('click', (e) => {
    // If user clicks a link or button, play the pop
    if (e.target.closest('button') || e.target.closest('a')) {
        playPop();
    }
    menu.classList.add('hidden');
    arrow.classList.remove('rotate-180');
});

function updateTimer() {
    const target = new Date('March 15, 2026 09:00:00').getTime();
    const diff = target - new Date().getTime();
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    document.getElementById('timer').innerHTML = `${d}D : ${h}H : ${m}M`;
}
setInterval(updateTimer, 1000); updateTimer();

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('active'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));