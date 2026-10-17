/* eslint-disable */
/**
 * Generates the ORIGINAL sample illustrations used as placeholder imagery
 * (public/images/*.webp), the social share card (public/og/og-default.jpg)
 * and the app icons (app/icon.svg, app/apple-icon.png).
 *
 * These are illustrations drawn in code — they are NOT photographs of House of
 * Garden projects. Replace them with real project photos when you have them
 * (see README → "Replacing the sample images").
 *
 * Usage:  npm run images:generate      (needs `sharp`, which Next.js installs)
 */
"use strict";
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const IMG_DIR = path.join(ROOT, "public", "images");
const OG_DIR = path.join(ROOT, "public", "og");
const APP_DIR = path.join(ROOT, "app");
for (const d of [IMG_DIR, OG_DIR, APP_DIR]) fs.mkdirSync(d, { recursive: true });

/* ───────────────────────── helpers ───────────────────────── */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const n = (v) => Math.round(v * 10) / 10;
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
const lerp = (a, b, t) => a + (b - a) * t;

const C = {
  g1: "#17402a", g2: "#215a37", g3: "#2f7a45", g4: "#4a9a52", g5: "#74b765", g6: "#a4d17f", g7: "#cfe8a8",
  sage1: "#b9cbb2", sage2: "#d4e0cc", sage3: "#e6eedf",
  cream: "#f6f3ea", sand: "#e9e1cf", stone: "#d9d2c0", stone2: "#b4ad9b",
  soil1: "#5b4330", soil2: "#7a5a40", soil3: "#3d2d20",
  terra1: "#c5683f", terra2: "#a9512e", terra3: "#df8a60",
  white: "#f4f1e8", ink: "#233029", charcoal: "#37413c",
  wood1: "#c9a068", wood2: "#a67844", wood3: "#7f5a30",
  water: "#9bd6e6", flowers: ["#f2c14e", "#e56b6f", "#f7efe3", "#c98ad3", "#f19a5a"],
};

const svgWrap = (W, H, defs, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs>${defs}</defs>${body}</svg>`;
const vGrad = (id, c1, c2, o1 = 0, o2 = 1) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="${o1}" stop-color="${c1}"/><stop offset="${o2}" stop-color="${c2}"/></linearGradient>`;
const rGrad = (id, c, o1 = 0.9, o2 = 0) =>
  `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${o1}"/><stop offset="1" stop-color="${c}" stop-opacity="${o2}"/></radialGradient>`;

/* ───────────────────────── primitives ───────────────────────── */
function leaf(x, y, len, w, ang, fill, vein) {
  const mid = vein
    ? `<path d="M0 0L${n(len * 0.9)} 0" stroke="${vein}" stroke-width="${n(Math.max(0.8, w * 0.07))}" stroke-linecap="round" opacity=".5"/>`
    : "";
  return `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(ang)})"><path d="M0 0C${n(len * 0.2)} ${n(-w)} ${n(len * 0.7)} ${n(-w * 1.05)} ${n(len)} 0C${n(len * 0.7)} ${n(w * 1.05)} ${n(len * 0.2)} ${n(w)} 0 0Z" fill="${fill}"/>${mid}</g>`;
}

// heart-shaped broad leaf pointing "up" at angle 0 (like a peace-lily / monstera style leaf)
function broadLeaf(x, y, size, ang, fill, vein) {
  const w = size;
  return `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(ang)})">
    <path d="M0 0C${n(-w * 0.95)} ${n(-w * 0.15)} ${n(-w * 1.05)} ${n(-w * 1.15)} 0 ${n(-w * 1.5)}C${n(w * 1.05)} ${n(-w * 1.15)} ${n(w * 0.95)} ${n(-w * 0.15)} 0 0Z" fill="${fill}"/>
    <path d="M0 0L0 ${n(-w * 1.38)}M0 ${n(-w * 0.4)}L${n(-w * 0.5)} ${n(-w * 0.75)}M0 ${n(-w * 0.4)}L${n(w * 0.5)} ${n(-w * 0.75)}M0 ${n(-w * 0.8)}L${n(-w * 0.4)} ${n(-w * 1.05)}M0 ${n(-w * 0.8)}L${n(w * 0.4)} ${n(-w * 1.05)}" stroke="${vein}" stroke-width="${n(Math.max(1, w * 0.035))}" stroke-linecap="round" fill="none" opacity=".45"/>
  </g>`;
}

// soft dome of overlapping blobs (shrubs, tree canopies, hedges)
function blobCluster(r, cx, cy, rx, ry, count, cols, minR, maxR) {
  const blobs = [];
  for (let i = 0; i < count; i++) {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r());
    blobs.push({ x: cx + Math.cos(a) * d * rx, y: cy + Math.sin(a) * d * ry, rad: lerp(minR, maxR, r()) });
  }
  blobs.sort((a, b) => b.y - a.y);
  let s = "";
  for (const b of blobs) {
    const t = Math.min(1, Math.max(0, (b.y - (cy - ry)) / (2 * ry))); // 0 top .. 1 bottom
    const idx = Math.min(cols.length - 1, Math.floor((1 - t) * cols.length));
    s += `<circle cx="${n(b.x)}" cy="${n(b.y)}" r="${n(b.rad)}" fill="${cols[idx]}"/>`;
  }
  return s;
}

function shrub(r, x, y, rad, cols, flowerCol) {
  let s = `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(rad * 1.05)}" ry="${n(rad * 0.16)}" fill="#0b2415" opacity=".16"/>`;
  s += blobCluster(r, x, y - rad * 0.55, rad * 0.95, rad * 0.55, 8 + Math.floor(rad / 9), cols, rad * 0.3, rad * 0.5);
  if (flowerCol) {
    for (let i = 0; i < 9; i++) {
      const fx = x + (r() * 2 - 1) * rad * 0.8;
      const fy = y - rad * (0.25 + r() * 0.75);
      s += `<circle cx="${n(fx)}" cy="${n(fy)}" r="${n(Math.max(2.5, rad * 0.045))}" fill="${pick(r, flowerCol)}"/>`;
    }
  }
  return s;
}

function tree(r, x, y, h, cols, trunk = C.soil2) {
  const tw = h * 0.05;
  let s = `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(h * 0.28)}" ry="${n(h * 0.035)}" fill="#0b2415" opacity=".14"/>`;
  s += `<path d="M${n(x - tw)} ${n(y)}C${n(x - tw * 0.6)} ${n(y - h * 0.25)} ${n(x - tw * 0.5)} ${n(y - h * 0.45)} ${n(x - tw * 0.3)} ${n(y - h * 0.62)}L${n(x + tw * 0.3)} ${n(y - h * 0.62)}C${n(x + tw * 0.5)} ${n(y - h * 0.45)} ${n(x + tw * 0.6)} ${n(y - h * 0.25)} ${n(x + tw)} ${n(y)}Z" fill="${trunk}"/>`;
  s += `<path d="M${n(x - tw * 0.2)} ${n(y)}C${n(x - tw * 0.1)} ${n(y - h * 0.3)} ${n(x - tw * 0.1)} ${n(y - h * 0.5)} ${n(x)} ${n(y - h * 0.62)}" stroke="#000" stroke-opacity=".12" stroke-width="${n(tw * 0.5)}" fill="none"/>`;
  s += blobCluster(r, x, y - h * 0.72, h * 0.34, h * 0.26, 26, cols, h * 0.07, h * 0.15);
  return s;
}

function palm(r, x, y, h, trunkCol = C.soil2, frondCol = C.g3, rib = C.g1) {
  const lean = (r() - 0.5) * h * 0.12;
  const tx = x + lean, ty = y - h;
  let s = `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(h * 0.14)}" ry="${n(h * 0.02)}" fill="#0b2415" opacity=".14"/>`;
  s += `<path d="M${n(x)} ${n(y)}Q${n(x + lean * 0.2)} ${n(y - h * 0.5)} ${n(tx)} ${n(ty)}" stroke="${trunkCol}" stroke-width="${n(h * 0.045)}" stroke-linecap="round" fill="none"/>`;
  for (let i = 1; i < 14; i++) {
    const t = i / 14;
    const px = lerp(x, tx, t * t * 0.9 + t * 0.1), py = lerp(y, ty, t);
    s += `<path d="M${n(px - h * 0.022)} ${n(py)}L${n(px + h * 0.022)} ${n(py - 4)}" stroke="#000" stroke-opacity=".16" stroke-width="2.4"/>`;
  }
  const angs = [-172, -150, -128, -104, -76, -52, -30, -8, 14, 168, 194];
  for (const a of angs) s += frond(tx, ty, h * (0.34 + r() * 0.1), a, frondCol, rib);
  return s;
}
function frond(x, y, len, angDeg, col, rib) {
  const a = (angDeg * Math.PI) / 180;
  const ex = x + Math.cos(a) * len, ey = y + Math.sin(a) * len + len * 0.28;
  const cx = x + Math.cos(a) * len * 0.5, cy = y + Math.sin(a) * len * 0.5 - len * 0.18;
  let s = `<path d="M${n(x)} ${n(y)}Q${n(cx)} ${n(cy)} ${n(ex)} ${n(ey)}" stroke="${rib}" stroke-width="${n(Math.max(2, len * 0.016))}" fill="none" stroke-linecap="round"/>`;
  for (let t = 0.1; t <= 1; t += 0.055) {
    const px = (1 - t) * (1 - t) * x + 2 * (1 - t) * t * cx + t * t * ex;
    const py = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * cy + t * t * ey;
    const tx = 2 * (1 - t) * (cx - x) + 2 * t * (ex - cx);
    const ty = 2 * (1 - t) * (cy - y) + 2 * t * (ey - cy);
    const tl = Math.hypot(tx, ty) || 1;
    const nx = -ty / tl, ny = tx / tl;
    const ll = len * 0.17 * (1 - t * 0.55);
    for (const sgn of [-1, 1]) {
      const dx = (tx / tl) * 0.45 + nx * sgn * 0.9, dy = (ty / tl) * 0.45 + ny * sgn * 0.9 + 0.35;
      s += `<path d="M${n(px)} ${n(py)}L${n(px + dx * ll)} ${n(py + dy * ll)}" stroke="${col}" stroke-width="${n(Math.max(2.4, len * 0.02))}" stroke-linecap="round"/>`;
    }
  }
  return s;
}

function snake(r, x, y, h, w) {
  let s = "";
  const cols = [C.g2, C.g3, C.g1, C.g3, C.g2, C.g3, C.g1];
  for (let i = 0; i < 7; i++) {
    const bh = h * (0.62 + r() * 0.38), bw = w * 0.19, bx = x + (i - 3) * w * 0.2 + (r() - 0.5) * 6, tilt = (i - 3) * 2.6 + (r() - 0.5) * 3;
    s += `<g transform="translate(${n(bx)} ${n(y)}) rotate(${n(tilt)})">
      <path d="M${n(-bw / 2)} 0C${n(-bw * 0.65)} ${n(-bh * 0.5)} ${n(-bw * 0.3)} ${n(-bh * 0.86)} 0 ${n(-bh)}C${n(bw * 0.3)} ${n(-bh * 0.86)} ${n(bw * 0.65)} ${n(-bh * 0.5)} ${n(bw / 2)} 0Z" fill="${cols[i]}"/>
      <path d="M${n(-bw * 0.5)} 0C${n(-bw * 0.65)} ${n(-bh * 0.5)} ${n(-bw * 0.3)} ${n(-bh * 0.86)} 0 ${n(-bh)}" stroke="#d6e27a" stroke-width="${n(bw * 0.09)}" fill="none" opacity=".9"/>
      <path d="M${n(bw * 0.5)} 0C${n(bw * 0.65)} ${n(-bh * 0.5)} ${n(bw * 0.3)} ${n(-bh * 0.86)} 0 ${n(-bh)}" stroke="#d6e27a" stroke-width="${n(bw * 0.09)}" fill="none" opacity=".9"/>
      <path d="M0 0L0 ${n(-bh * 0.9)}" stroke="${C.g6}" stroke-opacity=".35" stroke-width="${n(bw * 0.12)}"/>
    </g>`;
  }
  return s;
}

function rosette(x, y, rad, col1, col2, count = 12) {
  let s = "";
  for (let i = 0; i < count; i++) {
    const a = -170 + (160 * i) / (count - 1);
    s += leaf(x, y, rad, rad * 0.22, a, i % 2 ? col1 : col2);
  }
  for (let i = 0; i < count - 3; i++) {
    const a = -160 + (140 * i) / (count - 4);
    s += leaf(x, y, rad * 0.62, rad * 0.16, a, i % 2 ? col2 : col1);
  }
  return s;
}

function broadFan(r, x, y, size, count, cols, vein) {
  let s = "";
  for (let i = 0; i < count; i++) {
    const a = lerp(-62, 62, count === 1 ? 0.5 : i / (count - 1)) + (r() - 0.5) * 8;
    const sz = size * (0.8 + r() * 0.35);
    const stemLen = sz * (0.6 + r() * 0.6);
    const rad = (a * Math.PI) / 180;
    const sx = x + Math.sin(rad) * stemLen, sy = y - Math.cos(rad) * stemLen;
    s += `<path d="M${n(x)} ${n(y)}L${n(sx)} ${n(sy)}" stroke="${C.g2}" stroke-width="${n(Math.max(2, sz * 0.05))}" stroke-linecap="round"/>`;
    s += broadLeaf(sx, sy, sz, a * 0.9, cols[i % cols.length], vein);
  }
  return s;
}

function trail(r, x, y, len, col = C.g4, col2 = C.g5) {
  let s = "";
  const strands = 3 + Math.floor(r() * 2);
  for (let k = 0; k < strands; k++) {
    const sx = x + (k - (strands - 1) / 2) * 14;
    const L = len * (0.65 + r() * 0.45), sway = (r() - 0.5) * 70;
    s += `<path d="M${n(sx)} ${n(y)}C${n(sx + sway)} ${n(y + L * 0.3)} ${n(sx - sway)} ${n(y + L * 0.65)} ${n(sx + sway * 0.4)} ${n(y + L)}" stroke="${C.g2}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    for (let t = 0.1; t <= 1; t += 0.085) {
      const px = sx + sway * (Math.sin(t * Math.PI * 1.6) * 0.6) * (1 - t * 0.2);
      const py = y + L * t;
      s += leaf(px, py, 20, 8.5, 90 + (k % 2 ? 40 : -40) + (r() - 0.5) * 30, t % 0.17 < 0.085 ? col : col2);
    }
  }
  return s;
}

function grass(r, x, y, h, cols, blades = 9) {
  let s = "";
  for (let i = 0; i < blades; i++) {
    const bx = x + (i - blades / 2) * 5 + (r() - 0.5) * 6;
    const bh = h * (0.5 + r() * 0.6);
    const dx = (r() - 0.5) * h * 0.7;
    s += `<path d="M${n(bx)} ${n(y)}Q${n(bx + dx * 0.3)} ${n(y - bh * 0.6)} ${n(bx + dx)} ${n(y - bh)}" stroke="${pick(r, cols)}" stroke-width="${n(2.2 + r() * 1.6)}" fill="none" stroke-linecap="round"/>`;
  }
  return s;
}

function flowerDots(r, x, y, w, h, count, size = 5) {
  let s = "";
  for (let i = 0; i < count; i++) {
    const fx = x + r() * w, fy = y + r() * h;
    const col = pick(r, C.flowers);
    s += `<circle cx="${n(fx)}" cy="${n(fy)}" r="${n(size * (0.7 + r() * 0.6))}" fill="${col}"/><circle cx="${n(fx)}" cy="${n(fy)}" r="${n(size * 0.28)}" fill="#f9d86b"/>`;
  }
  return s;
}

// pots return {svg, top, cx, w}
function pot(x, y, w, h, kind, col, rimCol) {
  const dark = rimCol || col;
  let body = "";
  const top = y - h;
  if (kind === "taper") {
    const bw = w * 0.68;
    body = `<path d="M${n(x - w / 2)} ${n(top + h * 0.14)}L${n(x + w / 2)} ${n(top + h * 0.14)}L${n(x + bw / 2)} ${n(y)}L${n(x - bw / 2)} ${n(y)}Z" fill="${col}"/>
      <rect x="${n(x - w * 0.54)}" y="${n(top)}" width="${n(w * 1.08)}" height="${n(h * 0.16)}" rx="${n(h * 0.04)}" fill="${dark}"/>
      <path d="M${n(x - w * 0.36)} ${n(top + h * 0.2)}L${n(x - bw * 0.36)} ${n(y - 6)}" stroke="#fff" stroke-opacity=".2" stroke-width="${n(w * 0.06)}" stroke-linecap="round"/>`;
  } else if (kind === "bulb") {
    body = `<path d="M${n(x - w * 0.34)} ${n(top)}C${n(x - w * 0.62)} ${n(top + h * 0.3)} ${n(x - w * 0.58)} ${n(top + h * 0.85)} ${n(x - w * 0.28)} ${n(y)}L${n(x + w * 0.28)} ${n(y)}C${n(x + w * 0.58)} ${n(top + h * 0.85)} ${n(x + w * 0.62)} ${n(top + h * 0.3)} ${n(x + w * 0.34)} ${n(top)}Z" fill="${col}"/>
      <rect x="${n(x - w * 0.38)}" y="${n(top - h * 0.03)}" width="${n(w * 0.76)}" height="${n(h * 0.1)}" rx="${n(h * 0.04)}" fill="${dark}"/>
      <path d="M${n(x - w * 0.36)} ${n(top + h * 0.28)}C${n(x - w * 0.44)} ${n(top + h * 0.5)} ${n(x - w * 0.4)} ${n(top + h * 0.72)} ${n(x - w * 0.24)} ${n(y - 8)}" stroke="#fff" stroke-opacity=".22" stroke-width="${n(w * 0.05)}" stroke-linecap="round" fill="none"/>`;
  } else if (kind === "cyl") {
    body = `<rect x="${n(x - w / 2)}" y="${n(top)}" width="${n(w)}" height="${n(h)}" rx="${n(w * 0.06)}" fill="${col}"/>
      <rect x="${n(x - w / 2)}" y="${n(top)}" width="${n(w)}" height="${n(h * 0.09)}" rx="${n(w * 0.04)}" fill="${dark}"/>
      <rect x="${n(x - w * 0.38)}" y="${n(top + h * 0.15)}" width="${n(w * 0.06)}" height="${n(h * 0.78)}" rx="${n(w * 0.03)}" fill="#fff" opacity=".18"/>`;
  } else {
    // bowl
    body = `<path d="M${n(x - w / 2)} ${n(top)}L${n(x + w / 2)} ${n(top)}C${n(x + w * 0.48)} ${n(top + h * 0.75)} ${n(x + w * 0.2)} ${n(y)} ${n(x)} ${n(y)}C${n(x - w * 0.2)} ${n(y)} ${n(x - w * 0.48)} ${n(top + h * 0.75)} ${n(x - w / 2)} ${n(top)}Z" fill="${col}"/>
      <rect x="${n(x - w * 0.52)}" y="${n(top - h * 0.04)}" width="${n(w * 1.04)}" height="${n(h * 0.12)}" rx="${n(h * 0.05)}" fill="${dark}"/>`;
  }
  const shadow = `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(w * 0.55)}" ry="${n(w * 0.08)}" fill="#1b1409" opacity=".18"/>`;
  return { svg: shadow + body, top, cx: x, w };
}

function bench(x, y, w, col = C.wood2) {
  return `<g><rect x="${n(x - w / 2)}" y="${n(y - 54)}" width="${n(w)}" height="10" rx="3" fill="${col}"/>
    <rect x="${n(x - w / 2)}" y="${n(y - 100)}" width="${n(w)}" height="8" rx="3" fill="${col}"/><rect x="${n(x - w / 2)}" y="${n(y - 82)}" width="${n(w)}" height="8" rx="3" fill="${col}"/>
    <rect x="${n(x - w / 2 + 8)}" y="${n(y - 100)}" width="8" height="106" fill="#3d3a33"/><rect x="${n(x + w / 2 - 16)}" y="${n(y - 100)}" width="8" height="106" fill="#3d3a33"/>
    <ellipse cx="${n(x)}" cy="${n(y + 6)}" rx="${n(w * 0.55)}" ry="6" fill="#0b2415" opacity=".15"/></g>`;
}
function lamp(x, y, h) {
  return `<rect x="${n(x - 3)}" y="${n(y - h)}" width="6" height="${n(h)}" fill="#3b4540"/><circle cx="${n(x)}" cy="${n(y - h)}" r="11" fill="#fff6d6"/><circle cx="${n(x)}" cy="${n(y - h)}" r="26" fill="url(#glowW)" />`;
}

function bands(y0, W, H, c1, c2, count = 12, grow = 1.2) {
  let hs = [], h = 1;
  for (let i = 0; i < count; i++) { hs.push(h); h *= grow; }
  const sum = hs.reduce((a, b) => a + b, 0);
  let y = y0, s = "";
  for (let i = 0; i < count; i++) {
    const hh = ((H - y0) * hs[i]) / sum;
    s += `<rect x="0" y="${n(y)}" width="${W}" height="${n(hh + 1)}" fill="${i % 2 ? c2 : c1}"/>`;
    y += hh;
  }
  return s;
}
function catmull(pts, seg = 14) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let s = 0; s < seg; s++) {
      const t = s / seg, t2 = t * t, t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1]), p1[2] + (p2[2] - p1[2]) * t]);
    }
  }
  const l = pts[pts.length - 1];
  out.push([l[0], l[1], l[2]]);
  return out;
}
function ribbon(pts, fill, seg) {
  const c = catmull(pts, seg);
  const L = c.map((p) => [p[0] - p[2], p[1]]);
  const R = c.map((p) => [p[0] + p[2], p[1]]).reverse();
  return `<path d="M${L.concat(R).map((p) => `${n(p[0])} ${n(p[1])}`).join("L")}Z" fill="${fill}"/>`;
}
function stones(pts, r, fill, step = 5, scale = 0.62) {
  const c = catmull(pts, 14);
  let s = "";
  for (let i = 2; i < c.length - 2; i += step) {
    const [x, y, w] = c[i];
    const rx = w * scale * (0.9 + r() * 0.2);
    s += `<ellipse cx="${n(x + (r() - 0.5) * w * 0.3)}" cy="${n(y)}" rx="${n(rx)}" ry="${n(rx * 0.32)}" fill="${fill}"/><ellipse cx="${n(x)}" cy="${n(y - 2)}" rx="${n(rx * 0.85)}" ry="${n(rx * 0.24)}" fill="#fff" opacity=".28"/>`;
  }
  return s;
}
function pebbles(r, pts, count, cols) {
  const c = catmull(pts, 14);
  let s = "";
  for (let i = 0; i < count; i++) {
    const p = c[Math.floor(r() * c.length)];
    const px = p[0] + (r() * 2 - 1) * p[2] * 0.95;
    s += `<ellipse cx="${n(px)}" cy="${n(p[1] + (r() - 0.5) * 6)}" rx="${n(2 + p[2] * 0.03 + r() * 3)}" ry="${n(1.4 + r() * 1.8)}" fill="${pick(r, cols)}" opacity=".8"/>`;
  }
  return s;
}
function boulder(x, y, w, h, col = C.stone2) {
  return `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(w * 0.58)}" ry="${n(h * 0.14)}" fill="#0b2415" opacity=".16"/>
    <path d="M${n(x - w / 2)} ${n(y)}C${n(x - w * 0.55)} ${n(y - h * 0.7)} ${n(x - w * 0.2)} ${n(y - h)} ${n(x + w * 0.1)} ${n(y - h * 0.96)}C${n(x + w * 0.45)} ${n(y - h * 0.9)} ${n(x + w * 0.58)} ${n(y - h * 0.3)} ${n(x + w / 2)} ${n(y)}Z" fill="${col}"/>
    <path d="M${n(x - w * 0.3)} ${n(y - h * 0.55)}C${n(x - w * 0.2)} ${n(y - h * 0.85)} ${n(x)} ${n(y - h * 0.9)} ${n(x + w * 0.12)} ${n(y - h * 0.86)}" stroke="#fff" stroke-opacity=".35" stroke-width="${n(w * 0.03)}" fill="none" stroke-linecap="round"/>`;
}
function cloud(x, y, s, o = 0.7) {
  return `<g opacity="${o}" fill="#fff"><ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(70 * s)}" ry="${n(22 * s)}"/><ellipse cx="${n(x - 38 * s)}" cy="${n(y + 6 * s)}" rx="${n(44 * s)}" ry="${n(16 * s)}"/><ellipse cx="${n(x + 30 * s)}" cy="${n(y - 14 * s)}" rx="${n(40 * s)}" ry="${n(22 * s)}"/></g>`;
}
function windowsGrid(r, x, y, w, h, cols, rows, lit = 0.25) {
  let s = "";
  const cw = w / cols, rh = h / rows;
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++) {
      const wx = x + i * cw + cw * 0.2, wy = y + j * rh + rh * 0.18;
      const on = r() < lit;
      s += `<rect x="${n(wx)}" y="${n(wy)}" width="${n(cw * 0.6)}" height="${n(rh * 0.5)}" rx="2" fill="${on ? "#f8e7b0" : "#b9d2d8"}"/>`;
      s += `<rect x="${n(wx - cw * 0.06)}" y="${n(wy + rh * 0.52)}" width="${n(cw * 0.72)}" height="${n(Math.max(3, rh * 0.06))}" fill="#fff" opacity=".85"/>`;
    }
  return s;
}
function block(r, x, y, w, h, col, side) {
  const cols = Math.max(2, Math.round(w / 64)), rows = Math.max(3, Math.round(h / 78));
  return `<rect x="${n(x)}" y="${n(y - h)}" width="${n(w)}" height="${n(h)}" fill="${col}"/>
    <rect x="${n(x + w)}" y="${n(y - h + 14)}" width="${n(w * 0.1)}" height="${n(h - 14)}" fill="${side}"/>
    <rect x="${n(x - 8)}" y="${n(y - h - 12)}" width="${n(w + 16)}" height="16" fill="${side}"/>
    ${windowsGrid(r, x + 6, y - h + 28, w - 12, h - 80, cols, rows - 1, 0.22)}
    <rect x="${n(x + w / 2 - 28)}" y="${n(y - 54)}" width="56" height="54" fill="#6b7a74"/><rect x="${n(x + w / 2 - 22)}" y="${n(y - 48)}" width="44" height="48" fill="#cfe3e6"/>`;
}
function bungalow(x, y, w) {
  const h = w * 0.46;
  return `<ellipse cx="${n(x + w / 2)}" cy="${n(y)}" rx="${n(w * 0.58)}" ry="12" fill="#0b2415" opacity=".18"/>
    <rect x="${n(x)}" y="${n(y - h)}" width="${n(w)}" height="${n(h)}" fill="#f2ebd9"/>
    <rect x="${n(x)}" y="${n(y - h * 0.12)}" width="${n(w)}" height="${n(h * 0.12)}" fill="#d8cfb8"/>
    <path d="M${n(x - w * 0.07)} ${n(y - h + 6)}L${n(x + w * 0.12)} ${n(y - h * 1.5)}L${n(x + w * 0.88)} ${n(y - h * 1.5)}L${n(x + w * 1.07)} ${n(y - h + 6)}Z" fill="${C.terra2}"/>
    <path d="M${n(x - w * 0.07)} ${n(y - h + 6)}L${n(x + w * 1.07)} ${n(y - h + 6)}L${n(x + w * 1.05)} ${n(y - h + 20)}L${n(x - w * 0.05)} ${n(y - h + 20)}Z" fill="${C.terra1}"/>
    <rect x="${n(x + w * 0.72)}" y="${n(y - h * 1.78)}" width="${n(w * 0.07)}" height="${n(h * 0.34)}" fill="#8b7f6c"/>
    ${[0.1, 0.62].map((f) => `<g><rect x="${n(x + w * f)}" y="${n(y - h * 0.78)}" width="${n(w * 0.19)}" height="${n(h * 0.44)}" fill="#fff"/><rect x="${n(x + w * f + 6)}" y="${n(y - h * 0.78 + 6)}" width="${n(w * 0.19 - 12)}" height="${n(h * 0.44 - 12)}" fill="#bcd8de"/><path d="M${n(x + w * f + w * 0.095)} ${n(y - h * 0.78 + 6)}V${n(y - h * 0.34 - 6)}M${n(x + w * f + 6)} ${n(y - h * 0.56)}H${n(x + w * f + w * 0.19 - 6)}" stroke="#fff" stroke-width="4"/></g>`).join("")}
    <rect x="${n(x + w * 0.4)}" y="${n(y - h * 0.62)}" width="${n(w * 0.2)}" height="${n(h * 0.62)}" fill="#fff"/>
    <path d="M${n(x + w * 0.43)} ${n(y)}V${n(y - h * 0.46)}Q${n(x + w * 0.5)} ${n(y - h * 0.6)} ${n(x + w * 0.57)} ${n(y - h * 0.46)}V${n(y)}Z" fill="${C.wood2}"/>
    <circle cx="${n(x + w * 0.545)}" cy="${n(y - h * 0.24)}" r="3.5" fill="#f2c14e"/>`;
}

/* ───────────────────────── scenes ───────────────────────── */
const scenes = {};

scenes.hero = () => {
  const W = 1280, H = 1536, r = rng(11);
  const defs = vGrad("sky", "#dfece3", "#f6f3ea") + rGrad("sun", "#fff3c4", 0.95, 0) + rGrad("glowW", "#fff3c4", 0.7, 0);
  let b = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`;
  b += `<circle cx="900" cy="340" r="320" fill="url(#sun)"/><circle cx="900" cy="340" r="110" fill="#fbf1c9" opacity=".9"/>`;
  b += cloud(300, 230, 1.5, 0.7) + cloud(1040, 520, 1.1, 0.55);
  b += `<path d="M0 760C260 650 520 760 780 700S1120 650 1280 720V1100H0Z" fill="${C.sage2}"/><path d="M0 840C300 760 560 860 860 800S1180 790 1280 830V1100H0Z" fill="${C.sage1}"/>`;
  b += blobCluster(r, 640, 900, 700, 80, 70, [C.g4, C.g3, C.g2, C.g2], 34, 70);
  b += palm(r, 235, 1060, 760, C.soil2, C.g3, C.g1);
  b += palm(r, 1010, 1070, 640, C.soil2, C.g4, C.g2);
  b += tree(r, 640, 1060, 520, [C.g5, C.g4, C.g3, C.g2]);
  // terrace
  b += `<rect y="1040" width="${W}" height="${H - 1040}" fill="#e6dfcd"/>`;
  b += `<rect y="1020" width="${W}" height="34" fill="#f4efe2"/><rect y="1054" width="${W}" height="8" fill="#000" opacity=".08"/>`;
  for (let i = 0; i < 9; i++) b += `<path d="M${n(lerp(-200, 1480, i / 8))} ${H}L${n(lerp(500, 780, i / 8))} 1062" stroke="#cfc6b0" stroke-width="3"/>`;
  for (let i = 1; i < 7; i++) { const yy = 1062 + Math.pow(i / 6, 1.7) * (H - 1062); b += `<path d="M0 ${n(yy)}H${W}" stroke="#cfc6b0" stroke-width="3"/>`; }
  b += shrub(r, 120, 1050, 150, [C.g5, C.g4, C.g3, C.g2], C.flowers);
  b += shrub(r, 1170, 1052, 160, [C.g5, C.g4, C.g3, C.g2], C.flowers);
  b += shrub(r, 520, 1052, 110, [C.g6, C.g5, C.g4, C.g3]);
  b += shrub(r, 800, 1052, 120, [C.g6, C.g5, C.g4, C.g3]);
  // foreground pots
  const p1 = pot(300, 1400, 330, 320, "bulb", C.terra1, C.terra2);
  b += p1.svg + snake(r, 300, p1.top + 20, 380, 280);
  const p2 = pot(660, 1470, 270, 250, "taper", C.white, "#e0d9c6");
  b += p2.svg + broadFan(r, 660, p2.top + 16, 150, 6, [C.g3, C.g4, C.g2, C.g5], C.g1);
  const p3 = pot(980, 1410, 250, 330, "cyl", C.charcoal, "#2a322e");
  b += p3.svg + rosette(980, p3.top + 10, 150, C.g4, C.g3, 14) + trail(r, 880, p3.top + 22, 190);
  const p4 = pot(1160, 1480, 130, 120, "taper", C.terra3, C.terra1);
  b += p4.svg + rosette(1160, p4.top + 8, 60, C.g5, C.g4, 10);
  const p5 = pot(80, 1480, 150, 130, "bowl", C.sage1, "#a9bba2");
  b += p5.svg + broadFan(r, 80, p5.top + 6, 60, 4, [C.g4, C.g5], C.g2);
  b += grass(r, 40, 1536, 120, [C.g3, C.g4, C.g5], 12) + grass(r, 1240, 1536, 150, [C.g3, C.g4, C.g5], 12);
  return svgWrap(W, H, defs, b);
};

scenes.residential = () => {
  const W = 1600, H = 1200, r = rng(21);
  const defs = vGrad("sky", "#cfe3dc", "#f6f3ea") + rGrad("glowW", "#fff3c4", 0.7, 0);
  let b = `<rect width="${W}" height="${H}" fill="url(#sky)"/>` + cloud(300, 150, 1.6) + cloud(1250, 230, 1.2, 0.6);
  b += `<path d="M0 600C300 500 640 590 940 540S1400 500 1600 570V800H0Z" fill="${C.sage2}"/>`;
  b += blobCluster(r, 800, 700, 820, 70, 70, [C.g4, C.g3, C.g2], 36, 66);
  b += bungalow(500, 800, 600);
  b += bands(800, W, H, "#6fb35f", "#62a954", 12, 1.22);
  b += ribbon([[820, 800, 36], [760, 880, 56], [900, 980, 84], [800, 1090, 122], [910, 1200, 170]], "#e6dfcc", 16);
  b += stones([[820, 800, 36], [760, 880, 56], [900, 980, 84], [800, 1090, 122], [910, 1200, 170]], r, "#cdc5b0", 6, 0.55);
  b += tree(r, 240, 840, 520, [C.g5, C.g4, C.g3, C.g2]);
  b += tree(r, 1390, 830, 470, [C.g5, C.g4, C.g3, C.g2]);
  b += shrub(r, 440, 812, 80, [C.g5, C.g4, C.g3, C.g2], C.flowers) + shrub(r, 590, 812, 68, [C.g6, C.g5, C.g4, C.g3]);
  b += shrub(r, 1030, 812, 70, [C.g6, C.g5, C.g4, C.g3]) + shrub(r, 1170, 812, 84, [C.g5, C.g4, C.g3, C.g2], C.flowers);
  b += `<path d="M0 960C200 930 420 980 560 1060S420 1200 300 1200H0Z" fill="#5a3f2b"/>` + flowerDots(r, 40, 990, 420, 190, 46, 8);
  b += shrub(r, 120, 1120, 140, [C.g5, C.g4, C.g3, C.g2], C.flowers) + shrub(r, 1500, 1130, 160, [C.g5, C.g4, C.g3, C.g2], C.flowers);
  b += grass(r, 1120, 1200, 100, [C.g3, C.g4], 10);
  return svgWrap(W, H, defs, b);
};

scenes.society = () => {
  const W = 1600, H = 1200, r = rng(31);
  const defs = vGrad("sky", "#cfe3dc", "#f6f3ea") + rGrad("glowW", "#fff3c4", 0.8, 0);
  let b = `<rect width="${W}" height="${H}" fill="url(#sky)"/>` + cloud(250, 170, 1.4) + cloud(1300, 120, 1.1, 0.6);
  b += block(r, 90, 860, 430, 640, "#efe7d4", "#dacfb6") + block(r, 600, 860, 480, 760, "#f6f1e3", "#ded4bd") + block(r, 1150, 860, 400, 560, "#e5ddca", "#d0c5ab");
  b += bands(860, W, H, "#6fb35f", "#63a955", 12, 1.2);
  const path = [[800, 860, 70], [800, 960, 110], [800, 1070, 170], [800, 1200, 250]];
  b += ribbon(path, "#e8e1ce", 12);
  for (let i = 0; i < 5; i++) { const yy = 880 + i * i * 14 + i * 40; b += `<path d="M${n(800 - 70 - i * 40)} ${n(yy)}H${n(800 + 70 + i * 40)}" stroke="#d3ccb7" stroke-width="3"/>`; }
  b += shrub(r, 90, 870, 90, [C.g5, C.g4, C.g3, C.g2], C.flowers) + shrub(r, 560, 870, 80, [C.g6, C.g5, C.g4, C.g3]) + shrub(r, 1100, 870, 80, [C.g6, C.g5, C.g4, C.g3]) + shrub(r, 1520, 870, 90, [C.g5, C.g4, C.g3, C.g2], C.flowers);
  for (const [x, y, h] of [[690, 930, 330], [910, 930, 330], [600, 1040, 440], [1000, 1040, 440]]) b += tree(r, x, y, h, [C.g5, C.g4, C.g3, C.g2]);
  b += lamp(690, 990, 150) + lamp(910, 990, 150);
  b += bench(520, 1090, 150) + bench(1080, 1090, 150);
  b += shrub(r, 280, 1090, 170, [C.g5, C.g4, C.g3, C.g2], C.flowers) + shrub(r, 1330, 1100, 190, [C.g5, C.g4, C.g3, C.g2], C.flowers);
  b += `<ellipse cx="800" cy="1150" rx="120" ry="26" fill="#d9cfb7"/><ellipse cx="800" cy="1140" rx="104" ry="20" fill="#5a3f2b"/>` + flowerDots(r, 720, 1118, 160, 36, 26, 7);
  return svgWrap(W, H, defs, b);
};

scenes.lawn = () => {
  const W = 1600, H = 1200, r = rng(41);
  const defs = vGrad("sky", "#d6e8df", "#f6f3ea") + rGrad("glowW", "#fff3c4", 0.7, 0);
  let b = `<rect width="${W}" height="${H}" fill="url(#sky)"/>` + cloud(1200, 180, 1.4);
  b += `<rect y="470" width="${W}" height="240" fill="${C.g2}"/>` + blobCluster(r, 800, 520, 840, 70, 120, [C.g4, C.g3, C.g2, C.g1], 30, 58);
  b += tree(r, 360, 650, 470, [C.g5, C.g4, C.g3, C.g2]) + tree(r, 1250, 650, 430, [C.g5, C.g4, C.g3, C.g2]);
  b += bands(650, W, H, "#72b862", "#5ea64f", 16, 1.18);
  b += `<path d="M0 760C260 740 520 790 700 880S660 1120 380 1200H0Z" fill="#4e3a28"/>`;
  b += `<path d="M0 760C260 740 520 790 700 880S660 1120 380 1200" stroke="${C.stone}" stroke-width="12" fill="none"/>`;
  b += shrub(r, 160, 880, 120, [C.g5, C.g4, C.g3, C.g2], C.flowers) + shrub(r, 420, 840, 90, [C.g6, C.g5, C.g4, C.g3]) + flowerDots(r, 60, 920, 520, 220, 60, 9);
  b += shrub(r, 220, 1130, 140, [C.g6, C.g5, C.g4, C.g3], C.flowers);
  const sp = [[1120, 700, 22], [1060, 800, 34], [1130, 900, 50], [1040, 1010, 70], [1100, 1200, 96]];
  b += stones(sp, r, "#d4ccb8", 4, 1.0);
  b += bench(1380, 720, 160);
  b += shrub(r, 1500, 700, 90, [C.g5, C.g4, C.g3, C.g2]);
  return svgWrap(W, H, defs, b);
};

scenes.landscaping = () => {
  const W = 1600, H = 1200, r = rng(51);
  const defs = vGrad("sky", "#d9e9e0", "#f6f3ea") + rGrad("glowW", "#fff3c4", 0.7, 0);
  let b = `<rect width="${W}" height="${H}" fill="url(#sky)"/>` + cloud(400, 150, 1.5) + cloud(1250, 240, 1.0, 0.55);
  b += `<path d="M0 560C300 470 640 540 940 500S1400 470 1600 540V760H0Z" fill="${C.sage2}"/>`;
  b += blobCluster(r, 800, 640, 830, 70, 80, [C.g4, C.g3, C.g2], 34, 66);
  b += bands(650, W, H, "#79bb68", "#6bb05b", 12, 1.2);
  const path = [[760, 650, 22], [680, 760, 52], [900, 880, 90], [760, 1010, 140], [880, 1200, 200]];
  b += ribbon(path, "#e7dfcb", 16) + pebbles(r, path, 260, ["#c9c0aa", "#b8ae98", "#f1ebd8", "#a99f8a"]);
  // maple (ornamental)
  b += tree(r, 330, 820, 470, ["#d98558", "#c56b43", "#b4533c", "#9a4430"], C.soil3);
  b += tree(r, 1320, 790, 420, [C.g5, C.g4, C.g3, C.g2]);
  for (const [x, y, w, h] of [[500, 790, 150, 90], [560, 810, 90, 60], [1120, 840, 190, 110], [1210, 860, 100, 66], [980, 1070, 230, 120], [330, 1100, 260, 140]]) b += boulder(x, y, w, h, pick(r, ["#b7b0a0", "#a6a090", "#c4bdae"]));
  for (const x of [610, 700, 1060, 1190, 250, 440, 1020, 150, 1450]) b += grass(r, x, x > 900 ? 1140 : 960, 160, ["#cbb98a", "#b8aa77", C.g5, "#d8c9a0"], 14);
  b += shrub(r, 1020, 800, 90, [C.g6, C.g5, C.g4, C.g3], C.flowers) + shrub(r, 140, 1160, 150, [C.g5, C.g4, C.g3, C.g2], C.flowers) + shrub(r, 1480, 1120, 150, [C.g5, C.g4, C.g3, C.g2], C.flowers);
  return svgWrap(W, H, defs, b);
};

scenes.vertical = () => {
  const W = 1200, H = 1600, r = rng(61);
  const defs = vGrad("wall", "#efe9d9", "#e3dbc6") + rGrad("glowW", "#fff0b8", 0.9, 0) + `<clipPath id="panel"><rect x="190" y="170" width="820" height="1090" rx="22"/></clipPath>`;
  let b = `<rect width="${W}" height="${H}" fill="url(#wall)"/>`;
  b += `<rect y="1400" width="${W}" height="200" fill="#d6cdb6"/><rect y="1392" width="${W}" height="12" fill="#bfb59d"/>`;
  b += `<rect x="170" y="150" width="860" height="1130" rx="30" fill="${C.wood3}"/><rect x="190" y="170" width="820" height="1090" rx="22" fill="${C.g1}"/>`;
  b += `<g clip-path="url(#panel)">`;
  const cols = [C.g1, C.g2, C.g3, C.g4, C.g5, C.g6];
  for (let i = 0; i < 640; i++) {
    const x = 170 + r() * 860, y = 150 + r() * 1130;
    const t = Math.min(1, Math.max(0, ((x - 170) / 860) * 0.45 + ((1 - (y - 150) / 1130)) * 0.55 + (r() - 0.5) * 0.35));
    const col = cols[Math.min(cols.length - 1, Math.floor(t * cols.length))];
    const sz = 46 + r() * 70;
    b += i % 3 === 0 ? broadLeaf(x, y, sz * 0.55, r() * 360, col, C.g1) : leaf(x, y, sz, sz * 0.26, r() * 360, col, C.g1);
  }
  for (let i = 0; i < 26; i++) { const x = 230 + r() * 740, y = 220 + r() * 1000; b += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(7 + r() * 5)}" fill="${pick(r, ["#f7efe3", "#e8a0b4", "#f2c14e"])}"/><circle cx="${n(x)}" cy="${n(y)}" r="3.4" fill="#f9d86b"/>`; }
  b += `</g>`;
  b += `<rect x="140" y="1260" width="920" height="96" rx="14" fill="${C.wood2}"/><rect x="140" y="1260" width="920" height="22" rx="10" fill="${C.wood1}"/>`;
  for (const x of [260, 420, 600, 780, 940]) b += rosette(x, 1262, 80, C.g4, C.g3, 11);
  b += trail(r, 330, 1286, 240) + trail(r, 700, 1286, 180) + trail(r, 880, 1286, 220);
  for (const x of [240, 960]) b += `<rect x="${x - 7}" y="90" width="14" height="46" rx="5" fill="#3b4540"/><path d="M${x - 40} 136H${x + 40}L${x + 26} 74H${x - 26}Z" fill="#3b4540"/><circle cx="${x}" cy="150" r="150" fill="url(#glowW)"/>`;
  b += `<ellipse cx="600" cy="1410" rx="520" ry="18" fill="#000" opacity=".1"/>`;
  return svgWrap(W, H, defs, b);
};

scenes.balcony = () => {
  const W = 1200, H = 1600, r = rng(71);
  const defs = vGrad("sky", "#f2d7b0", "#e1ecde", 0, 0.9) + rGrad("sun", "#fff1c4", 0.95, 0) + rGrad("glowW", "#fff1c4", 0.7, 0);
  let b = `<rect width="${W}" height="${H}" fill="url(#sky)"/><circle cx="360" cy="640" r="300" fill="url(#sun)"/>`;
  b += cloud(800, 260, 1.5, 0.5);
  // skyline
  let x = -20;
  while (x < W) { const w = 70 + r() * 110, h = 160 + r() * 380; b += `<rect x="${n(x)}" y="${n(1080 - h)}" width="${n(w)}" height="${n(h)}" fill="${pick(r, ["#b7c8c0", "#a9bdb4", "#c3d1c9"])}"/>` + windowsGrid(r, x + 4, 1080 - h + 14, w - 8, h - 30, Math.max(2, Math.round(w / 40)), Math.max(3, Math.round(h / 58)), 0.12); x += w + 6 + r() * 12; }
  b += blobCluster(r, 600, 1090, 640, 50, 40, [C.g4, C.g3, C.g2], 30, 56);
  // top beam + hanging pots
  b += `<rect width="${W}" height="74" fill="#6f4f30"/><rect y="62" width="${W}" height="14" fill="#8a6236"/>`;
  for (const [hx, hy, col] of [[230, 480, C.terra1], [600, 560, C.white], [960, 450, C.sage1]]) {
    b += `<path d="M${hx - 50} 76L${hx} ${hy - 90}L${hx + 50} 76" stroke="#d5c9ad" stroke-width="3" fill="none"/>`;
    const p = pot(hx, hy + 40, 150, 120, "bowl", col, col);
    b += trail(r, hx, p.top + 8, 330, C.g4, C.g5) + p.svg + rosette(hx, p.top + 6, 55, C.g5, C.g4, 9);
  }
  // railing
  b += `<rect y="1080" width="${W}" height="30" fill="#2f3a35"/>`;
  for (let i = 0; i < 31; i++) b += `<rect x="${i * 40 + 10}" y="1110" width="8" height="300" fill="#3a4540"/>`;
  b += `<rect y="1400" width="${W}" height="200" fill="#d8cfb9"/><rect y="1392" width="${W}" height="14" fill="#b9af97"/>`;
  for (let i = 0; i < 6; i++) b += `<path d="M${i * 240} 1406V1600" stroke="#c3b9a1" stroke-width="3"/>`;
  const p1 = pot(220, 1520, 300, 300, "bulb", C.terra1, C.terra2);
  b += p1.svg + snake(r, 220, p1.top + 18, 380, 260);
  const p2 = pot(560, 1540, 250, 230, "taper", C.white, "#ddd5c2");
  b += p2.svg + broadFan(r, 560, p2.top + 14, 130, 6, [C.g3, C.g4, C.g2], C.g1);
  const p3 = pot(900, 1520, 260, 340, "cyl", C.charcoal, "#2a322e");
  b += p3.svg + palm(r, 900, p3.top + 10, 430, C.g2, C.g3, C.g1).replace(/<ellipse[^>]*opacity="\.14"\/>/, "");
  const p4 = pot(1100, 1560, 120, 110, "taper", C.terra3, C.terra1);
  b += p4.svg + rosette(1100, p4.top + 6, 52, C.g5, C.g4, 9);
  const p5 = pot(40, 1565, 110, 100, "bowl", C.sage1, "#a9bba2");
  b += p5.svg + rosette(40, p5.top + 6, 48, C.g4, C.g5, 9);
  return svgWrap(W, H, defs, b);
};

scenes.irrigation = () => {
  const W = 1600, H = 1200, r = rng(81);
  const defs = vGrad("sky", "#d3e7e2", "#f6f3ea") + rGrad("glowW", "#fff3c4", 0.7, 0) + rGrad("mist", "#ffffff", 0.45, 0);
  let b = `<rect width="${W}" height="${H}" fill="url(#sky)"/><circle cx="1280" cy="220" r="150" fill="url(#glowW)"/>`;
  b += `<rect y="480" width="${W}" height="200" fill="${C.g2}"/>` + blobCluster(r, 800, 520, 840, 70, 110, [C.g4, C.g3, C.g2, C.g1], 30, 58);
  b += tree(r, 220, 650, 440, [C.g5, C.g4, C.g3, C.g2]) + tree(r, 1380, 640, 400, [C.g5, C.g4, C.g3, C.g2]);
  b += bands(640, W, H, "#72b862", "#62a954", 14, 1.2);
  const heads = [[720, 780, 0.5], [900, 930, 0.75], [640, 1090, 1.05]];
  for (const [hx, hy, s] of heads) {
    b += `<ellipse cx="${hx}" cy="${hy - 40 * s}" rx="${n(190 * s)}" ry="${n(60 * s)}" fill="url(#mist)"/>`;
    for (let k = -6; k <= 6; k++) {
      const dx = k * 36 * s, top = hy - (120 - Math.abs(k) * 7) * s;
      b += `<path d="M${hx} ${n(hy - 8 * s)}Q${n(hx + dx * 0.55)} ${n(top - 60 * s)} ${n(hx + dx)} ${n(hy + 10 * s)}" stroke="#ffffff" stroke-opacity=".75" stroke-width="${n(3 * s + 1)}" fill="none" stroke-linecap="round"/>`;
      for (let d = 0; d < 3; d++) b += `<circle cx="${n(hx + dx * (0.35 + d * 0.22))}" cy="${n(hy - (70 - d * 12) * s + Math.abs(k) * 4 * s)}" r="${n(2.4 * s + 0.6)}" fill="#fff" opacity=".85"/>`;
    }
    b += `<rect x="${n(hx - 9 * s)}" y="${n(hy - 12 * s)}" width="${n(18 * s)}" height="${n(16 * s)}" rx="3" fill="#2f3a35"/><ellipse cx="${hx}" cy="${n(hy + 5 * s)}" rx="${n(16 * s)}" ry="${n(5 * s)}" fill="#1f2824" opacity=".6"/>`;
  }
  // drip line in bed
  b += `<path d="M900 1010C1100 960 1300 1000 1600 960V1200H940Z" fill="#4e3a28"/>`;
  b += shrub(r, 1100, 1060, 90, [C.g5, C.g4, C.g3, C.g2]) + shrub(r, 1290, 1050, 100, [C.g5, C.g4, C.g3, C.g2], C.flowers) + shrub(r, 1480, 1040, 90, [C.g6, C.g5, C.g4, C.g3]);
  b += `<path d="M930 1130C1120 1090 1320 1120 1600 1080" stroke="#1d2420" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  for (let i = 0; i < 9; i++) { const ex = 980 + i * 70, ey = 1124 - Math.sin(i / 8 * Math.PI) * 30 - i * 4.6; b += `<circle cx="${ex}" cy="${n(ey)}" r="6" fill="#4a5750"/><path d="M${ex} ${n(ey + 12)}q-6 10 0 16q6 -6 0 -16z" fill="${C.water}"/><path d="M${ex + 10} ${n(ey + 30)}q-4 7 0 11q4 -4 0 -11z" fill="${C.water}" opacity=".7"/>`; }
  b += `<path d="M0 1010C140 990 280 1040 330 1120S240 1200 120 1200H0Z" fill="#4e3a28"/>` + flowerDots(r, 20, 1040, 280, 140, 22, 8);
  b += grass(r, 520, 1200, 110, [C.g3, C.g4], 10);
  return svgWrap(W, H, defs, b);
};

scenes.pots = () => {
  const W = 1600, H = 1200, r = rng(91);
  const defs = vGrad("wall", "#eaf0e4", "#dfe8d6") + rGrad("light", "#fff6d8", 0.7, 0);
  let b = `<rect width="${W}" height="${H}" fill="url(#wall)"/><rect y="800" width="${W}" height="${H - 800}" fill="#dccfb4"/>`;
  for (let i = 0; i < 12; i++) b += `<path d="M0 ${n(800 + Math.pow(i / 11, 1.5) * 400)}H${W}" stroke="#c9bb9d" stroke-width="3"/>`;
  b += `<path d="M1080 0L1600 0L1600 700L980 900Z" fill="#fff6d8" opacity=".35"/>`;
  b += `<rect x="180" y="120" width="360" height="460" rx="8" fill="#fff" opacity=".7"/><rect x="198" y="138" width="324" height="424" fill="#cfe6ee"/><path d="M360 138V562M198 350H522" stroke="#fff" stroke-width="10"/>`;
  b += `<rect y="792" width="${W}" height="14" fill="#cdbf9f"/>`;
  // back row
  const back = [
    [330, 900, 250, 300, "taper", C.white, "#e0d8c4", (x, t) => snake(r, x, t + 16, 340, 240)],
    [690, 905, 230, 360, "cyl", C.charcoal, "#2a322e", (x, t) => palm(r, x, t + 10, 360, C.g2, C.g3, C.g1).replace(/<ellipse[^>]*opacity="\.14"\/>/, "")],
    [1060, 900, 280, 290, "bulb", C.terra1, C.terra2, (x, t) => broadFan(r, x, t + 16, 130, 7, [C.g3, C.g4, C.g2], C.g1)],
    [1380, 905, 210, 270, "taper", "#e7ccb0", "#d3b394", (x, t) => rosette(x, t + 10, 130, C.g4, C.g3, 14)],
  ];
  const front = [
    [200, 1110, 240, 250, "bowl", C.sage1, "#a8bba0", (x, t) => rosette(x, t + 6, 100, C.g5, C.g4, 13)],
    [560, 1140, 260, 280, "bulb", C.white, "#ddd5c1", (x, t) => broadFan(r, x, t + 10, 110, 6, [C.g4, C.g5, C.g3], C.g1)],
    [900, 1130, 190, 210, "cyl", C.terra2, "#8c3f21", (x, t) => rosette(x, t + 6, 90, C.g5, C.g4, 12) + trail(r, x - 30, t + 12, 140)],
    [1190, 1150, 230, 250, "taper", C.charcoal, "#2a322e", (x, t) => snake(r, x, t + 14, 230, 170)],
    [1480, 1130, 170, 170, "taper", C.terra3, C.terra1, (x, t) => rosette(x, t + 6, 70, C.g4, C.g5, 11)],
  ];
  for (const [x, y, w, h, kind, col, rim, plant] of [...back, ...front]) { const p = pot(x, y, w, h, kind, col, rim); b += p.svg + plant(x, p.top); }
  return svgWrap(W, H, defs, b);
};

scenes.makeover = () => {
  const W = 1600, H = 1200, r = rng(101);
  const defs = vGrad("skyA", "#e1e2d8", "#efece1") + vGrad("skyB", "#d3e7df", "#f6f3ea") + rGrad("glowW", "#fff3c4", 0.7, 0) +
    `<clipPath id="L"><rect x="0" y="0" width="800" height="${H}"/></clipPath><clipPath id="R"><rect x="800" y="0" width="800" height="${H}"/></clipPath>`;
  let b = `<g clip-path="url(#L)"><rect width="${W}" height="${H}" fill="url(#skyA)"/>`;
  b += `<rect y="560" width="${W}" height="${H - 560}" fill="#b99f78"/><path d="M0 760C200 720 400 780 800 740V1200H0Z" fill="#a98d66"/>`;
  b += `<rect y="470" width="${W}" height="130" fill="#8f8b7c"/>`;
  for (let i = 0; i < 18; i++) b += `<rect x="${i * 48 + (r() * 8)}" y="${470 + r() * 10}" width="30" height="${110 + r() * 16}" fill="#7f7b6c"/>`;
  b += `<path d="M0 520L800 540" stroke="#6f6b5d" stroke-width="8"/>`;
  for (let i = 0; i < 26; i++) { const x = r() * 800, y = 650 + r() * 520; b += grass(r, x, y, 60 + r() * 50, ["#cbb98a", "#b8a773", "#a39560"], 6); }
  for (let i = 0; i < 10; i++) { const x = 40 + r() * 720, y = 700 + r() * 440; b += `<path d="M${n(x)} ${n(y)}l-6 -34M${n(x)} ${n(y)}l8 -30M${n(x)} ${n(y)}l16 -22" stroke="#7d8a4d" stroke-width="4" stroke-linecap="round"/>`; }
  b += `<ellipse cx="300" cy="1000" rx="110" ry="24" fill="#9a7f58" opacity=".6"/><ellipse cx="560" cy="860" rx="150" ry="28" fill="#9a7f58" opacity=".5"/>`;
  b += `<path d="M620 620l-4 -70M630 620l8 -60" stroke="#6b5a3b" stroke-width="5"/><path d="M180 700l-8 -50M190 700l14 -44" stroke="#6b5a3b" stroke-width="5"/></g>`;
  b += `<g clip-path="url(#R)"><rect width="${W}" height="${H}" fill="url(#skyB)"/>` + cloud(1200, 180, 1.4);
  b += blobCluster(r, 1200, 520, 420, 60, 60, [C.g4, C.g3, C.g2], 30, 56);
  b += `<rect y="480" width="${W}" height="140" fill="#f2ecdc"/>`;
  for (let i = 0; i < 18; i++) b += `<rect x="${800 + i * 48}" y="470" width="30" height="150" fill="#fff" opacity=".7"/>`;
  b += `<path d="M800 480H1600" stroke="#e4dcc8" stroke-width="10"/>`;
  b += bands(620, W, H, "#72b862", "#62a954", 12, 1.2);
  b += ribbon([[1190, 620, 20], [1120, 760, 50], [1280, 900, 90], [1180, 1050, 130], [1290, 1200, 180]], "#e6dfcc", 14);
  b += stones([[1190, 620, 20], [1120, 760, 50], [1280, 900, 90], [1180, 1050, 130], [1290, 1200, 180]], r, "#cdc5b0", 6, 0.5);
  b += tree(r, 1480, 720, 380, [C.g5, C.g4, C.g3, C.g2]);
  b += shrub(r, 900, 640, 80, [C.g6, C.g5, C.g4, C.g3]) + shrub(r, 1040, 640, 70, [C.g5, C.g4, C.g3, C.g2], C.flowers) + shrub(r, 1380, 640, 70, [C.g6, C.g5, C.g4, C.g3]);
  b += shrub(r, 900, 1000, 130, [C.g5, C.g4, C.g3, C.g2], C.flowers) + shrub(r, 1500, 1110, 150, [C.g5, C.g4, C.g3, C.g2], C.flowers) + flowerDots(r, 820, 1070, 200, 110, 20, 8);
  b += `</g>`;
  b += `<rect x="797" y="0" width="6" height="${H}" fill="#fff"/><circle cx="800" cy="600" r="34" fill="#fff"/><path d="M788 600l10 -9v18zM812 600l-10 -9v18z" fill="${C.g2}"/>`;
  b += `<g font-family="Inter, Arial, sans-serif" font-weight="700" font-size="30" letter-spacing="4"><rect x="40" y="40" width="230" height="58" rx="29" fill="#2b3530" opacity=".82"/><text x="155" y="79" text-anchor="middle" fill="#fff">BEFORE</text><rect x="1330" y="40" width="230" height="58" rx="29" fill="${C.g2}" opacity=".92"/><text x="1445" y="79" text-anchor="middle" fill="#fff">AFTER</text></g>`;
  return svgWrap(W, H, defs, b);
};

scenes.maintenance = () => {
  const W = 1600, H = 1200, r = rng(111);
  const defs = vGrad("sky", "#d6e8df", "#f6f3ea") + rGrad("glowW", "#fff3c4", 0.7, 0);
  let b = `<rect width="${W}" height="${H}" fill="url(#sky)"/>` + cloud(300, 170, 1.4) + cloud(1220, 140, 1.1, 0.6);
  b += `<path d="M0 520C300 440 640 510 940 470S1400 440 1600 510V700H0Z" fill="${C.sage2}"/>`;
  b += tree(r, 1380, 720, 480, [C.g5, C.g4, C.g3, C.g2]);
  b += `<rect x="40" y="520" width="1100" height="190" rx="40" fill="${C.g2}"/>` + blobCluster(r, 590, 545, 540, 50, 90, [C.g4, C.g3, C.g2], 30, 46) + `<rect x="40" y="620" width="1100" height="90" fill="${C.g2}"/>`;
  b += bands(700, W, H, "#72b862", "#62a954", 14, 1.2);
  for (const x of [250, 620, 990]) { const p = pot(x, 880, 150, 130, "taper", C.terra1, C.terra2); b += p.svg; b += x === 620 ? `<path d="M${x} ${p.top + 8}l-70 -130h140z" fill="${C.g3}"/><circle cx="${x}" cy="${p.top - 128}" r="8" fill="${C.g3}"/>` : `<circle cx="${x}" cy="${p.top - 52}" r="68" fill="${C.g3}"/><circle cx="${x - 20}" cy="${p.top - 72}" r="30" fill="${C.g4}" opacity=".8"/>`; }
  // wheelbarrow
  b += `<ellipse cx="560" cy="1090" rx="230" ry="20" fill="#0b2415" opacity=".18"/><path d="M330 880L760 880L690 1030H410Z" fill="${C.g2}"/><path d="M330 880L760 880L750 910L342 910Z" fill="${C.g1}"/>`;
  b += `<path d="M410 880Q430 820 470 800Q520 790 560 840Q600 790 650 810Q700 830 700 880Z" fill="${C.soil3}"/>` + shrub(r, 520, 860, 70, [C.g5, C.g4, C.g3], C.flowers);
  b += `<circle cx="760" cy="1030" r="48" fill="#2b3530"/><circle cx="760" cy="1030" r="26" fill="#9aa8a2"/><circle cx="760" cy="1030" r="8" fill="#2b3530"/>`;
  b += `<path d="M700 900L930 840M700 925L930 865" stroke="${C.wood2}" stroke-width="12" stroke-linecap="round"/><path d="M420 1030L380 1090M650 1030L690 1090" stroke="#2b3530" stroke-width="9" stroke-linecap="round"/>`;
  // watering can
  b += `<ellipse cx="1090" cy="1130" rx="120" ry="16" fill="#0b2415" opacity=".18"/><path d="M1010 960H1170L1150 1120H1030Z" fill="#9db0b2"/><path d="M1010 960H1170L1166 985H1014Z" fill="#7f9496"/><path d="M1170 1010L1290 940L1304 962L1162 1050Z" fill="#9db0b2"/><path d="M1280 930L1318 950L1308 975L1272 955Z" fill="#7f9496"/><path d="M1020 975C960 930 980 860 1090 860C1190 860 1190 920 1160 962" stroke="#7f9496" stroke-width="12" fill="none" stroke-linecap="round"/>`;
  // shears
  b += `<g transform="translate(1440 1060) rotate(-12)"><path d="M0 0L0 -170" stroke="#aeb7b9" stroke-width="12" stroke-linecap="round"/><path d="M26 0L10 -170" stroke="#9aa5a7" stroke-width="12" stroke-linecap="round"/><path d="M-6 0L-6 120" stroke="${C.terra1}" stroke-width="16" stroke-linecap="round"/><path d="M32 0L40 120" stroke="${C.terra1}" stroke-width="16" stroke-linecap="round"/></g>`;
  for (let i = 0; i < 30; i++) b += leaf(40 + r() * 1500, 1000 + r() * 190, 22, 8, r() * 360, pick(r, ["#d8b24f", "#c98a3f", "#a9b64f"]));
  b += shrub(r, 120, 1160, 140, [C.g5, C.g4, C.g3, C.g2], C.flowers);
  return svgWrap(W, H, defs, b);
};

scenes.soil = () => {
  const W = 1600, H = 1200, r = rng(121);
  const defs = vGrad("bg", "#f0e9d8", "#e4dbc3");
  let b = `<rect width="${W}" height="${H}" fill="url(#bg)"/><rect y="860" width="${W}" height="340" fill="#d9ceb3"/><rect y="852" width="${W}" height="12" fill="#c6b999"/>`;
  b += `<path d="M0 0H400V380H0Z" fill="#fff" opacity=".25"/>`;
  const mound = (x, y, w, h, c1, c2, seed) => { const rr = rng(seed); let s = `<ellipse cx="${x}" cy="${y}" rx="${n(w * 0.6)}" ry="14" fill="#1b1409" opacity=".2"/><path d="M${n(x - w / 2)} ${y}C${n(x - w * 0.42)} ${n(y - h * 0.75)} ${n(x - w * 0.15)} ${n(y - h)} ${x} ${n(y - h)}C${n(x + w * 0.15)} ${n(y - h)} ${n(x + w * 0.42)} ${n(y - h * 0.75)} ${n(x + w / 2)} ${y}Z" fill="${c1}"/>`; for (let i = 0; i < 90; i++) { const px = x + (rr() - 0.5) * w * 0.8, py = y - rr() * h * 0.85; s += `<circle cx="${n(px)}" cy="${n(py)}" r="${n(2 + rr() * 4)}" fill="${rr() > 0.5 ? c2 : "#000"}" opacity="${rr() > 0.5 ? 0.5 : 0.18}"/>`; } return s; };
  b += mound(300, 960, 440, 240, "#4a3626", "#8c6a4a", 3) + mound(1400, 960, 360, 200, "#6b4a30", "#c7a477", 5);
  // cocopeat bricks
  for (const [x, y, w, h] of [[640, 960, 220, 90], [690, 872, 200, 86], [610, 872, 190, 86]].sort((a, b2) => a[1] - b2[1]).reverse()) { b += `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" rx="10" fill="#a47a4e"/><rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h * 0.22}" rx="10" fill="#c09468"/>`; for (let i = 0; i < 34; i++) { const fx = x - w / 2 + 10 + r() * (w - 20), fy = y - h + 12 + r() * (h - 20); b += `<path d="M${n(fx)} ${n(fy)}l${n((r() - 0.5) * 30)} ${n((r() - 0.5) * 8)}" stroke="#6d4a2b" stroke-width="2" opacity=".55"/>`; } }
  // potting-mix bag
  b += `<ellipse cx="930" cy="1030" rx="170" ry="18" fill="#1b1409" opacity=".2"/><path d="M780 700L1080 700L1100 1020H760Z" fill="#cfa876"/><path d="M780 700L1080 700L1090 760H770Z" fill="#bd9460"/><path d="M780 700Q930 640 1080 700" fill="#d8b684"/><path d="M800 720H1060" stroke="#a97f50" stroke-width="4" stroke-dasharray="10 8"/>`;
  b += `<rect x="810" y="790" width="240" height="180" rx="18" fill="#f6f1e2"/><circle cx="930" cy="860" r="44" fill="${C.g3}"/>` + leaf(930, 888, 62, 22, -90, C.g6, C.g2) + `<rect x="850" y="925" width="160" height="14" rx="7" fill="${C.g2}"/><rect x="880" y="946" width="100" height="9" rx="4" fill="${C.stone2}"/>`;
  // seedling tray
  b += `<ellipse cx="1400" cy="1136" rx="170" ry="14" fill="#1b1409" opacity=".18"/><path d="M1260 1010H1540L1520 1130H1280Z" fill="#2f3a35"/>`;
  for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) { const cx = 1306 + i * 64, cy = 1048 + j * 52; b += `<rect x="${cx - 26}" y="${cy - 10}" width="52" height="36" rx="6" fill="#4a3626"/>` + leaf(cx, cy - 8, 30, 10, -140, C.g5) + leaf(cx, cy - 8, 30, 10, -40, C.g4); }
  // trowel
  b += `<g transform="translate(150 1090) rotate(-8)"><path d="M0 0L300 0L360 -26L300 -52L0 -52Z" fill="#aeb7b9" transform="translate(120 20) scale(.8)"/><rect x="-60" y="-14" width="190" height="34" rx="14" fill="${C.wood2}"/><rect x="-40" y="-8" width="30" height="22" fill="${C.wood3}"/></g>`;
  // seedling pot
  const p = pot(1180, 1130, 150, 130, "taper", C.terra1, C.terra2);
  b += p.svg + leaf(1180, p.top + 8, 56, 20, -120, C.g5, C.g2) + leaf(1180, p.top + 8, 56, 20, -60, C.g4, C.g2) + leaf(1180, p.top + 8, 44, 16, -90, C.g6, C.g2);
  return svgWrap(W, H, defs, b);
};

scenes.frames = () => {
  const W = 1600, H = 1200, r = rng(131);
  const defs = vGrad("wall", "#d3b58a", "#c2a073");
  let b = `<rect width="${W}" height="${H}" fill="url(#wall)"/>`;
  for (let i = 0; i < 40; i++) b += `<rect x="${i * 40}" width="38" height="${H}" fill="${i % 3 === 0 ? "#bf9c6c" : i % 3 === 1 ? "#cfae80" : "#c8a678"}"/>` + `<path d="M${i * 40 + 20} 0V${H}" stroke="#8a6236" stroke-opacity=".15"/>`;
  b += `<rect y="1050" width="${W}" height="150" fill="#d7ccb4"/><rect y="1040" width="${W}" height="14" fill="#bfb393"/>`;
  const frames = [[330, 400, 430, 460], [800, 320, 430, 560], [1270, 400, 430, 460]];
  for (const [fx, fy, fw, fh] of frames) {
    b += `<rect x="${fx - fw / 2 + 12}" y="${fy - fh / 2 + 16}" width="${fw}" height="${fh}" rx="8" fill="#000" opacity=".14"/>`;
    b += `<rect x="${fx - fw / 2}" y="${fy - fh / 2}" width="${fw}" height="${fh}" rx="8" fill="#6f4f30"/><rect x="${fx - fw / 2 + 14}" y="${fy - fh / 2 + 14}" width="${fw - 28}" height="${fh - 28}" rx="4" fill="#d9bf92" opacity=".35"/>`;
    const rows = fh > 500 ? 3 : 2;
    for (let j = 1; j < rows; j++) b += `<rect x="${fx - fw / 2 + 8}" y="${n(fy - fh / 2 + (fh / rows) * j - 7)}" width="${fw - 16}" height="14" fill="#8a6236"/>`;
    for (let j = 0; j < rows; j++) for (let i = 0; i < 3; i++) {
      const px = fx - fw / 2 + (fw / 3) * (i + 0.5), shelf = fy - fh / 2 + (fh / rows) * (j + 1) - 8;
      const col = pick(r, [C.white, C.terra1, "#e7ccb0", C.charcoal]);
      const pp = pot(px, shelf, 96, 84, pick(r, ["taper", "bowl"]), col, col);
      const kind = (i + j) % 3;
      b += (kind === 0 ? trail(r, px, pp.top + 8, 140 + r() * 40) : "") + pp.svg + (kind === 1 ? rosette(px, pp.top + 6, 48, C.g5, C.g4, 10) : kind === 2 ? broadFan(r, px, pp.top + 8, 44, 4, [C.g4, C.g3, C.g5], C.g1) : rosette(px, pp.top + 6, 40, C.g4, C.g5, 9));
    }
  }
  const pb = pot(150, 1130, 160, 160, "bulb", C.white, "#ddd5c2");
  b += pb.svg + snake(r, 150, pb.top + 12, 230, 160);
  const pc = pot(1450, 1140, 150, 150, "cyl", C.charcoal, "#2a322e");
  b += pc.svg + broadFan(r, 1450, pc.top + 10, 80, 5, [C.g3, C.g4], C.g1);
  return svgWrap(W, H, defs, b);
};

/* ───────────────────────── logo mark / icons / OG ───────────────────────── */
const markInner = (stroke = "#f6f3ea") =>
  `<path d="M16 26V15" stroke="${stroke}" stroke-width="2.2" stroke-linecap="round"/>
   <path d="M16 18C9.5 18 7.5 13.5 7.5 9.5C13 9.5 16 12.5 16 18Z" fill="#a4d17f"/>
   <path d="M16 14.5C16 9.5 19 6 25 6C25 11 22 14.5 16 14.5Z" fill="#f6f3ea"/>`;
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#1f4d33"/>${markInner()}</svg>\n`;
const appleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="180" height="180"><rect width="32" height="32" fill="#1f4d33"/><g transform="translate(16 16) scale(.86) translate(-16 -16)">${markInner()}</g></svg>`;

function ogSvg() {
  const r = rng(7);
  let b = `<defs>${vGrad("g", "#1b4a30", "#12301f")}</defs><rect width="1200" height="630" fill="url(#g)"/>`;
  for (let i = 0; i < 14; i++) b += leaf(1230 - r() * 250, 30 + r() * 600, 110 + r() * 110, 30 + r() * 20, 140 + r() * 70, pick(r, ["#2f7a45", "#3b8c4f", "#4a9a52", "#215a37"]), "#17402a");
  b += `<circle cx="1100" cy="140" r="240" fill="#a4d17f" opacity=".07"/>`;
  b += `<g transform="translate(84 112) scale(3)"><rect width="32" height="32" rx="8" fill="#f6f3ea"/><g transform="translate(0 0)">${markInner("#1f4d33").replace('fill="#f6f3ea"', 'fill="#1f4d33"')}</g></g>`;
  b += `<text x="84" y="350" font-family="DejaVu Serif, Georgia, serif" font-size="80" font-weight="700" fill="#f6f3ea">House of Garden</text>`;
  b += `<text x="88" y="424" font-family="Inter, Arial, sans-serif" font-size="38" font-weight="500" fill="#cfe8a8">Gardening &amp; Landscaping Services</text>`;
  b += `<rect x="88" y="470" width="86" height="5" rx="2.5" fill="#a4d17f"/>`;
  b += `<text x="88" y="540" font-family="Inter, Arial, sans-serif" font-size="30" fill="#e6eedf" opacity=".9">Mumbai · Maharashtra</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">${b}</svg>`;
}

/* ───────────────────────── render ───────────────────────── */
async function main() {
  const only = process.argv[2];
  const manifest = [];
  for (const [name, fn] of Object.entries(scenes)) {
    if (only && only !== name) continue;
    const svg = fn();
    if (/NaN|undefined/.test(svg)) throw new Error(`Scene "${name}" produced invalid numbers`);
    const m =svg.match(/viewBox="0 0 (\d+) (\d+)"/);
    const W = +m[1], H = +m[2];
    for (const w of [640, 1280]) {
      const h = Math.round((H * w) / W);
      await sharp(Buffer.from(svg), { density: 96 }).resize(w, h).webp({ quality: 80, effort: 5 }).toFile(path.join(IMG_DIR, `${name}-${w}.webp`));
    }
    manifest.push({ name, width: 1280, height: Math.round((H * 1280) / W) });
    console.log("✓", name, `${W}x${H}`);
  }
  if (!only) {
    await sharp(Buffer.from(ogSvg())).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(OG_DIR, "og-default.jpg"));
    await sharp(Buffer.from(appleSvg)).png().toFile(path.join(APP_DIR, "apple-icon.png"));
    fs.writeFileSync(path.join(APP_DIR, "icon.svg"), iconSvg);
    fs.writeFileSync(path.join(IMG_DIR, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
    console.log("✓ og-default.jpg, apple-icon.png, icon.svg");
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
