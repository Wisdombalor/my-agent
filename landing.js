'use strict';

// Match the workspace theme without loading its listing-specific controls.
try {
  const stored = localStorage.getItem('myagent_theme');
  document.documentElement.dataset.theme = stored === 'dark' || stored === 'light'
    ? stored : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
} catch {
  document.documentElement.dataset.theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const mosaic = document.querySelector('.property-mosaic');
const tiles = [...mosaic.querySelectorAll('.mosaic-tile')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let listings = SAMPLE_PROPERTIES;
try {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (Array.isArray(stored)) listings = stored;
} catch { /* Fall back to the same sample listings as the workspace. */ }
listings = listings.filter(property => property && typeof property.id === 'string' && property.image);
let visible = true;
let hovered = false;
let timer;
let step = 0;
let generation = 0;
const activeTransitions = new Map();
const order = [0, 4, 2, 3, 1, 5];
function linkListing(tile, listing) {
  tile.href = `workspace.html?listing=${encodeURIComponent(listing.id)}`;
  tile.setAttribute('aria-label', `View ${listing.title}, ${listing.location}`);
  tile.querySelector('.mosaic-caption').textContent = listing.location;
  tile.dataset.listing = listing.id;
}
tiles.forEach((tile, index) => {
  if (!listings.length) { tile.hidden = true; return; }
  const listing = listings[index % listings.length];
  tile.querySelector('.mosaic-base').src = listing.image;
  linkListing(tile, listing);
});
if (!listings.length) document.querySelector('.landing-gallery').hidden = true;
function canRotate() {
  return listings.length > 1 && !reducedMotion.matches && visible && !document.hidden
    && !hovered && !mosaic.contains(document.activeElement);
}
function settleTransitions() {
  activeTransitions.forEach(commit => commit());
}
async function rotatePhoto() {
  const currentGeneration = generation;
  const tile = tiles[order[step % order.length]];
  const current = listings.findIndex(listing => listing.id === tile.dataset.listing);
  const listing = listings[(current + 1) % listings.length];
  const next = tile.querySelector('.mosaic-next');
  next.src = listing.image;
  try { await next.decode(); } catch { step++; return; }
  if (!canRotate() || generation !== currentGeneration) return;
  linkListing(tile, listing);
  tile.classList.add('is-changing');
  const commit = () => {
    if (!activeTransitions.has(tile)) return;
    tile.querySelector('.mosaic-base').src = next.src;
    tile.classList.remove('is-changing');
    next.removeEventListener('transitionend', commit);
    activeTransitions.delete(tile);
  };
  activeTransitions.set(tile, commit);
  next.addEventListener('transitionend', commit, { once: true });
  setTimeout(commit, 700);
  step++;
}
function schedule() {
  clearTimeout(timer);
  generation++;
  if (!canRotate()) return;
  timer = setTimeout(async () => { await rotatePhoto(); schedule(); }, step === 0 ? 2800 : 1800);
}
// Hold each destination steady while a person points, taps or tabs to a photo.
mosaic.addEventListener('pointerenter', () => { hovered = true; settleTransitions(); schedule(); });
mosaic.addEventListener('pointerleave', () => { hovered = false; schedule(); });
mosaic.addEventListener('pointerdown', settleTransitions);
mosaic.addEventListener('focusin', () => { settleTransitions(); schedule(); });
mosaic.addEventListener('focusout', () => setTimeout(schedule, 0));
reducedMotion.addEventListener('change', () => { settleTransitions(); schedule(); });
document.addEventListener('visibilitychange', schedule);
new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }, { threshold: .1 }).observe(mosaic);
schedule();
