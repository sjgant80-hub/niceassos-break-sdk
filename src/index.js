// niceassos-break SDK · sovereign single-file library · MIT · AI-Native Solutions
// Extracted from niceassos-break/index.html · 5520 bytes of source logic
// Public-safe: no primes/glyphs/dyad references

const mon = $('mon');
const tally = { 2: 0, 3: 0, 5: 0, 7: 0 };
function bumpTally(p) { tally[p]++; $('c' + p).textContent = tally[p]; }
function resetTally() { for (const k of [2,3,5,7]) { tally[k] = 0; $('c'+k).textContent = 0; } mon.innerHTML = ''; }
function addEnv(env, dir) {
  const div = document.createElement('div');
  div.className = 'env ' + (dir === 'out' ? 'out' : '');
  const short = env.fork_pub ? env.fork_pub.slice(0, 12) + '…' : '';
  const p = env.payload || {};
  let extra = '';
  if (dir === 'out' && p.transform) {
    extra = ` · organ=<b>${p.organ}</b> · fold=${p.transform.fold} · class=<span class="prime-${p.transform.primeClass}">${p.transform.primeClass}</span>`;
  } else if (p.organs) {
    extra = ` · organs=${p.organs.length}`;
  }
  div.innerHTML = `<div><span class="k">${dir === 'out' ? '↑ affect_seed' : '↓ fork_join'}</span> · seq=${env.seq}${extra}</div>
    <div class="meta">fork_pub=${short} · sig=${(env.signature || '').slice(0, 16)}…</div>`;
  mon.insertBefore(div, mon.firstChild);
  while (mon.children.length > 30) mon.removeChild(mon.lastChild);
}
// -- Visualizer -----------------------------------------------------------
function drawViz() {
  const svg = $('viz');
  const W = 900, H = 320;
  const cx = W / 2, cyBreak = H / 2;
  // L2 nodes (top)
  const l2 = [];
  const L2_N = 8;
  for (let i = 0; i < L2_N; i++) {
    const x = 80 + (i / (L2_N - 1)) * (W - 160);
    l2.push({ x, y: 40 });
  }
  // L3 nodes (bottom, arranged by prime class)
  const spineCols = { 2: 0.15, 3: 0.38, 5: 0.62, 7: 0.85 };
  const l3 = [];
  for (const p of [2, 3, 5, 7]) {
    for (let i = 0; i < 3; i++) {
      l3.push({ x: spineCols[p] * W, y: 240 + i * 22, prime: p });
    }
  }
  let html = '';
  // torus (depth-4)
  html += `<ellipse cx="${cx}" cy="${cyBreak}" rx="120" ry="28" class="torus"/>`;
  html += `<ellipse cx="${cx}" cy="${cyBreak}" rx="80" ry="18" class="torus" opacity="0.6"/>`;
  html += `<ellipse cx="${cx}" cy="${cyBreak}" rx="40" ry="9" class="torus" opacity="0.4"/>`;
  html += `<text x="${cx}" y="${cyBreak + 4}" text-anchor="middle" class="lbl">depth-4 · mod 210</text>`;
  // flows L2 → break
  for (const n of l2) {
    html += `<path class="flow" d="M ${n.x} ${n.y + 6} Q ${n.x} ${cyBreak - 40} ${cx} ${cyBreak}"/>`;
  }
  // flows break → L3
  for (const n of l3) {
    html += `<path class="flow" d="M ${cx} ${cyBreak} Q ${n.x} ${cyBreak + 40} ${n.x} ${n.y - 4}"/>`;
  }
  // L2 dots
  for (const n of l2) {
    html += `<circle cx="${n.x}" cy="${n.y}" r="5" class="l-l2"/>`;
  }
  html += `<text x="30" y="44" class="lbl">L2 bus</text>`;
  // L3 dots
  for (const n of l3) {
    html += `<circle cx="${n.x}" cy="${n.y}" r="4" class="prime-${n.prime}"/>`;
  }
  html += `<text x="30" y="248" class="lbl">L3 affect</text>`;
  // prime labels
  for (const p of [2, 3, 5, 7]) {
    html += `<text x="${spineCols[p] * W}" y="230" text-anchor="middle" class="lbl prime-${p}">prime ${p}</text>`;
  }
  svg.innerHTML = html;
}
drawViz();
// -- Wire the break -------------------------------------------------------
const brk = new GutBrainBreak({
  onIn: env => addEnv(env, 'in'),
  onOut: env => {
    addEnv(env, 'out');
    if (env.payload && env.payload.transform) bumpTally(env.payload.transform.primeClass);
  }
});
brk.init().then(pub => {
  $('brk-pub').textContent = 'break fork_pub · ' + pub.slice(0, 24) + '…';
  brk.attachMesh(null); // open BroadcastChannels itself
});
// -- Probe ----------------------------------------------------------------
$('probeBtn').onclick = async () => {
  const t = await depth4Transform($('probe').value);
  $('probeOut').textContent =
`input       = "${$('probe').value}"
sha256      = ${t.hash.slice(0, 16)}…
seed_u32    = ${parseInt(t.hash.slice(0,8),16)}
fold(x, 4)  = ${t.fold}   // mod ${PRIMORIAL_4}
primeClass  = ${t.primeClass}   // largest spine prime dividing fold
position    = ${t.spinePosition}`;
};
// -- Simulate a fork_join --------------------------------------------------
$('simBtn').onclick = async () => {
  const organs = ['operator','fallmind-v2','si-didy','konomi-signer','fall-cascade','fall-verify','cassie-anthropic','ain-hub','exitengine','fallcompass'];
  const fake = {
    version: 'niceassos-mesh-v1',
    kind: 'fork_join',
    fork_pub: 'deadbeef'.repeat(8),
    ts: new Date().toISOString(),
    seq: Math.floor(Math.random() * 1000),
    prev_hash: null,
    payload: { handle: 'sim', vertical: 'strategy', organs }
  };
  await brk.handleForkJoin(fake);
};
$('resetBtn').onclick = resetTally;
// -- Manual paste ---------------------------------------------------------
$('runBtn').onclick = async () => {
  try {
    const cfg = JSON.parse($('forkIn').value);
    const fake = {
      version: 'niceassos-mesh-v1',
      kind: 'fork_join',
      fork_pub: cfg.konomi_pub || 'manual',
      ts: new Date().toISOString(),
      seq: 0,
      prev_hash: null,
      payload: {
        handle: 'manual',
        vertical: (cfg.verdict && cfg.verdict.vertical) || 'unknown',
        organs: cfg.organs || []
      }
    };
    await brk.handleForkJoin(fake);
  } catch (e) {
    alert('Invalid JSON · ' + e.message);
  }
};
// -- Register service worker ---------------------------------------------
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// Named exports for the primary API surface
export { bumpTally };
export { resetTally };
export { addEnv };
export { drawViz };

export { W };
export { L2_N };
