// =====================
// Numerical Helpers
// =====================

export function normPDF(z: number): number {
  return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
}

// Abramowitz & Stegun approximation for standard normal CDF
export function normCDF(z: number): number {
  if (z < -8) return 0;
  if (z > 8) return 1;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const poly =
    t *
    (0.31938153 +
      t *
        (-0.356563782 +
          t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const d = normPDF(z) * poly;
  return z >= 0 ? 1 - d : d;
}

// Rational approximation for inverse normal CDF (probit)
export function normInv(p: number): number {
  if (p <= 0) return Number.NEGATIVE_INFINITY;
  if (p >= 1) return Number.POSITIVE_INFINITY;
  if (p < 0.5) return -normInv(1 - p);
  const q = Math.sqrt(-2 * Math.log(1 - p));
  const c = [2.515517, 0.802853, 0.010328];
  const d = [1.432788, 0.189269, 0.001308];
  return (
    q -
    (c[0] + c[1] * q + c[2] * q * q) /
      (1 + d[0] * q + d[1] * q * q + d[2] * q * q * q)
  );
}

// Log-Gamma using Lanczos approximation
export function lnGamma(xIn: number): number {
  if (xIn <= 0) return Number.POSITIVE_INFINITY;
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (xIn < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * xIn)) - lnGamma(1 - xIn);
  }
  const x = xIn - 1;
  let a = c[0];
  const t = x + g + 0.5;
  for (let i = 1; i < g + 2; i++) {
    a += c[i] / (x + i);
  }
  return (
    0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a)
  );
}

export function gammaFn(x: number): number {
  return Math.exp(lnGamma(x));
}

// Regularized incomplete gamma P(a, x) using series and continued fraction
export function regularizedGammaP(a: number, x: number): number {
  if (x < 0 || a <= 0) return 0;
  if (x === 0) return 0;
  if (x < a + 1) {
    // Series expansion
    let sum = 1 / a;
    let term = 1 / a;
    for (let n = 1; n < 200; n++) {
      term *= x / (a + n);
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * 1e-12) break;
    }
    return Math.min(1, sum * Math.exp(-x + a * Math.log(x) - lnGamma(a)));
  }
  // Continued fraction (Lentz method) for upper incomplete gamma
  return 1 - regularizedGammaQ(a, x);
}

function regularizedGammaQ(a: number, x: number): number {
  let b = x + 1 - a;
  let c = 1 / 1e-30;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i <= 200; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = b + an / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 1e-12) break;
  }
  return Math.min(1, h * Math.exp(-x + a * Math.log(x) - lnGamma(a)));
}

// Inverse regularized gamma (for quantiles) using Newton-Raphson
export function gammaQuantile(p: number, alpha: number, beta: number): number {
  if (p <= 0) return 0;
  if (p >= 1) return Number.POSITIVE_INFINITY;
  const z = normInv(p);
  const h = 2 / (9 * alpha);
  let x = alpha * beta * (1 - h + z * Math.sqrt(h)) ** 3;
  if (x < 0) x = 0.001;
  for (let i = 0; i < 100; i++) {
    const fx = regularizedGammaP(alpha, x / beta) - p;
    const dfx =
      Math.exp((alpha - 1) * Math.log(x / beta) - x / beta - lnGamma(alpha)) /
      beta;
    const dx = fx / dfx;
    x -= dx;
    if (x <= 0) x = 1e-10;
    if (Math.abs(dx) < 1e-10 * Math.abs(x)) break;
  }
  return x;
}

// =====================
// Distribution Types
// =====================

export type DistributionId =
  | "fatigue-life-bs"
  | "frechet"
  | "fatigue-life-bs-3p"
  | "frechet-3p"
  | "gamma"
  | "gamma-3p";

export interface DistributionParam {
  name: string;
  symbol: string;
  label: string;
  defaultValue: number;
  min: number;
  step: number;
}

export interface Distribution {
  id: DistributionId;
  name: string;
  shortName: string;
  params: DistributionParam[];
}

export const DISTRIBUTIONS: Distribution[] = [
  {
    id: "fatigue-life-bs",
    name: "Fatigue Life (Birnbaum-Saunders) Distribution",
    shortName: "Fatigue Life (BS)",
    params: [
      {
        name: "alpha",
        symbol: "α",
        label: "Shape (α)",
        defaultValue: 0.5,
        min: 0.001,
        step: 0.1,
      },
      {
        name: "beta",
        symbol: "β",
        label: "Scale (β)",
        defaultValue: 1.0,
        min: 0.001,
        step: 0.1,
      },
    ],
  },
  {
    id: "frechet",
    name: "Frechet Distribution",
    shortName: "Frechet",
    params: [
      {
        name: "alpha",
        symbol: "α",
        label: "Shape (α)",
        defaultValue: 2.0,
        min: 0.001,
        step: 0.1,
      },
      {
        name: "s",
        symbol: "s",
        label: "Scale (s)",
        defaultValue: 1.0,
        min: 0.001,
        step: 0.1,
      },
    ],
  },
  {
    id: "fatigue-life-bs-3p",
    name: "Fatigue Life (3 Parameters) Distribution",
    shortName: "Fatigue Life (3P)",
    params: [
      {
        name: "alpha",
        symbol: "α",
        label: "Shape (α)",
        defaultValue: 0.5,
        min: 0.001,
        step: 0.1,
      },
      {
        name: "beta",
        symbol: "β",
        label: "Scale (β)",
        defaultValue: 1.0,
        min: 0.001,
        step: 0.1,
      },
      {
        name: "gamma",
        symbol: "γ",
        label: "Location (γ)",
        defaultValue: 0,
        min: -100,
        step: 0.1,
      },
    ],
  },
  {
    id: "frechet-3p",
    name: "Frechet (3 Parameters) Distribution",
    shortName: "Frechet (3P)",
    params: [
      {
        name: "alpha",
        symbol: "α",
        label: "Shape (α)",
        defaultValue: 2.0,
        min: 0.001,
        step: 0.1,
      },
      {
        name: "s",
        symbol: "s",
        label: "Scale (s)",
        defaultValue: 1.0,
        min: 0.001,
        step: 0.1,
      },
      {
        name: "m",
        symbol: "m",
        label: "Location (m)",
        defaultValue: 0,
        min: -100,
        step: 0.1,
      },
    ],
  },
  {
    id: "gamma",
    name: "Gamma Distribution",
    shortName: "Gamma",
    params: [
      {
        name: "alpha",
        symbol: "α",
        label: "Shape (α)",
        defaultValue: 2.0,
        min: 0.001,
        step: 0.1,
      },
      {
        name: "beta",
        symbol: "β",
        label: "Scale (β)",
        defaultValue: 1.0,
        min: 0.001,
        step: 0.1,
      },
    ],
  },
  {
    id: "gamma-3p",
    name: "Gamma (3 Parameters) Distribution",
    shortName: "Gamma (3P)",
    params: [
      {
        name: "alpha",
        symbol: "α",
        label: "Shape (α)",
        defaultValue: 2.0,
        min: 0.001,
        step: 0.1,
      },
      {
        name: "beta",
        symbol: "β",
        label: "Scale (β)",
        defaultValue: 1.0,
        min: 0.001,
        step: 0.1,
      },
      {
        name: "gamma",
        symbol: "γ",
        label: "Location (γ)",
        defaultValue: 0,
        min: -100,
        step: 0.1,
      },
    ],
  },
];

export interface StatResults {
  mean: number | string;
  median: number;
  mode: number | string;
  variance: number | string;
  skewness: number | string;
  kurtosis: number | string;
  probabilityDifference: number;
  q1: number;
  q2: number;
  q3: number;
  q4: string;
  mgf: string;
  momentLine: string;
}

export interface ChartPoint {
  x: number;
  pdf: number;
  cdf: number;
  sf: number;
  hf: number;
}

export interface PPPoint {
  theoretical: number;
  empirical: number;
}

export interface QQPoint {
  theoretical: number;
  empirical: number;
}

// =====================
// Fatigue Life (BS)
// =====================

function bsCDF(x: number, alpha: number, beta: number): number {
  if (x <= 0) return 0;
  const z = (Math.sqrt(x / beta) - Math.sqrt(beta / x)) / alpha;
  return normCDF(z);
}

function bsPDF(x: number, alpha: number, beta: number): number {
  if (x <= 0) return 0;
  const sqrtXB = Math.sqrt(x / beta);
  const sqrtBX = Math.sqrt(beta / x);
  const z = (sqrtXB - sqrtBX) / alpha;
  return ((sqrtXB + sqrtBX) / (2 * alpha * x)) * normPDF(z);
}

function bsQuantile(p: number, alpha: number, beta: number): number {
  const z = normInv(p);
  const u = (alpha * z + Math.sqrt(alpha * alpha * z * z + 4)) / 2;
  return beta * u * u;
}

function bsMode(alpha: number, beta: number): number {
  let xBest = beta;
  let pdfBest = bsPDF(beta, alpha, beta);
  const xs = [beta * 0.01, beta * 0.1, beta * 0.5, beta, beta * 2];
  for (const x0 of xs) {
    let x = x0;
    for (let i = 0; i < 200; i++) {
      const h = x * 1e-5;
      const f1 = bsPDF(x + h, alpha, beta);
      const f0 = bsPDF(x, alpha, beta);
      const fm = bsPDF(x - h, alpha, beta);
      const ddf = (f1 - 2 * f0 + fm) / (h * h);
      const df = (f1 - fm) / (2 * h);
      if (Math.abs(ddf) < 1e-30) break;
      const step = df / ddf;
      x -= step;
      if (x <= 0) {
        x = 1e-10;
        break;
      }
      if (Math.abs(step) < 1e-10) break;
    }
    if (x > 0 && bsPDF(x, alpha, beta) > pdfBest) {
      pdfBest = bsPDF(x, alpha, beta);
      xBest = x;
    }
  }
  return xBest;
}

export function computeFatigueLifeBS(params: Record<string, number>): {
  stats: StatResults;
  chartData: ChartPoint[];
  ppData: PPPoint[];
  qqData: QQPoint[];
} {
  const { alpha, beta } = params;

  const mean = beta * (1 + (alpha * alpha) / 2);
  const median = bsQuantile(0.5, alpha, beta);
  const mode = bsMode(alpha, beta);
  const variance = alpha * alpha * beta * beta * (1 + (5 * alpha * alpha) / 4);
  const skewness =
    (4 * alpha * (11 * alpha * alpha + 6)) / (5 * alpha * alpha + 4) ** 1.5;
  const kurtosis =
    (6 * alpha * alpha * (93 * alpha * alpha + 40)) /
    (5 * alpha * alpha + 4) ** 2;
  const q1 = bsQuantile(0.25, alpha, beta);
  const q3 = bsQuantile(0.75, alpha, beta);

  const stats: StatResults = {
    mean,
    median,
    mode,
    variance,
    skewness,
    kurtosis,
    probabilityDifference:
      bsCDF(mean + Math.sqrt(variance), alpha, beta) -
      bsCDF(mean - Math.sqrt(variance), alpha, beta),
    q1,
    q2: median,
    q3,
    q4: "∞ (unbounded upper tail)",
    mgf: "No closed-form MGF exists for Birnbaum-Saunders distribution",
    momentLine: `E[X] = β(1 + α²/2) = ${mean.toFixed(4)}`,
  };

  const xMin = bsQuantile(0.001, alpha, beta);
  const xMax = bsQuantile(0.999, alpha, beta);
  const chartData: ChartPoint[] = [];
  const n = 200;
  for (let i = 0; i <= n; i++) {
    const x = xMin + ((xMax - xMin) * i) / n;
    const pdf = bsPDF(x, alpha, beta);
    const cdf = bsCDF(x, alpha, beta);
    const sf = 1 - cdf;
    const hf = sf > 1e-12 ? pdf / sf : 0;
    chartData.push({ x: Number.parseFloat(x.toFixed(5)), pdf, cdf, sf, hf });
  }

  const ppData = generatePPData(
    (x: number) => bsCDF(x, alpha, beta),
    chartData,
  );
  const qqData = generateQQData(
    (p: number) => bsQuantile(p, alpha, beta),
    mean,
    Math.sqrt(variance),
  );

  return { stats, chartData, ppData, qqData };
}

// =====================
// Frechet
// =====================

function frechetCDF(x: number, alpha: number, s: number, m = 0): number {
  const y = x - m;
  if (y <= 0) return 0;
  return Math.exp(-((s / y) ** alpha));
}

function frechetPDF(x: number, alpha: number, s: number, m = 0): number {
  const y = x - m;
  if (y <= 0) return 0;
  return (alpha / s) * (s / y) ** (alpha + 1) * Math.exp(-((s / y) ** alpha));
}

function frechetQuantile(p: number, alpha: number, s: number, m = 0): number {
  if (p <= 0) return m;
  if (p >= 1) return Number.POSITIVE_INFINITY;
  return m + s / (-Math.log(p)) ** (1 / alpha);
}

export function computeFrechet(
  params: Record<string, number>,
  threeParam = false,
): {
  stats: StatResults;
  chartData: ChartPoint[];
  ppData: PPPoint[];
  qqData: QQPoint[];
} {
  const { alpha, s } = params;
  const m = threeParam ? params.m : 0;

  const meanVal = alpha > 1 ? m + s * gammaFn(1 - 1 / alpha) : Number.NaN;
  const medianVal = frechetQuantile(0.5, alpha, s, m);
  const modeVal = m + s * (alpha / (alpha + 1)) ** (1 / alpha);
  const varianceVal =
    alpha > 2
      ? s * s * (gammaFn(1 - 2 / alpha) - gammaFn(1 - 1 / alpha) ** 2)
      : Number.NaN;

  let skewnessVal: number | string = "Undefined (requires α > 3)";
  if (alpha > 3) {
    const g1 = gammaFn(1 - 1 / alpha);
    const g2 = gammaFn(1 - 2 / alpha);
    const g3 = gammaFn(1 - 3 / alpha);
    skewnessVal = (g3 - 3 * g2 * g1 + 2 * g1 ** 3) / (g2 - g1 * g1) ** 1.5;
  }

  let kurtosisVal: number | string = "Undefined (requires α > 4)";
  if (alpha > 4) {
    const g1 = gammaFn(1 - 1 / alpha);
    const g2 = gammaFn(1 - 2 / alpha);
    const g3 = gammaFn(1 - 3 / alpha);
    const g4 = gammaFn(1 - 4 / alpha);
    kurtosisVal = (g4 - 4 * g3 * g1 + 3 * g2 * g2) / (g2 - g1 * g1) ** 2 - 6;
  }

  const q1 = frechetQuantile(0.25, alpha, s, m);
  const q3 = frechetQuantile(0.75, alpha, s, m);
  const std = Number.isNaN(varianceVal as number)
    ? 1
    : Math.sqrt(varianceVal as number);

  const stats: StatResults = {
    mean: Number.isNaN(meanVal) ? "Undefined (requires α > 1)" : meanVal,
    median: medianVal,
    mode: modeVal,
    variance: Number.isNaN(varianceVal as number)
      ? "Undefined (requires α > 2)"
      : varianceVal,
    skewness: skewnessVal,
    kurtosis: kurtosisVal,
    probabilityDifference:
      frechetCDF(medianVal + std, alpha, s, m) -
      frechetCDF(Math.max(m + 1e-10, medianVal - std), alpha, s, m),
    q1,
    q2: medianVal,
    q3,
    q4: "∞ (unbounded upper tail)",
    mgf: "No standard closed-form MGF for Fréchet distribution",
    momentLine:
      alpha > 1
        ? `E[X] = s·Γ(1 − 1/α) = ${meanVal.toFixed(4)}`
        : "E[X] undefined for α ≤ 1",
  };

  const xMin = Math.max(m + 1e-9, frechetQuantile(0.001, alpha, s, m));
  const xMax = frechetQuantile(0.999, alpha, s, m);
  const chartData: ChartPoint[] = [];
  const n = 200;
  for (let i = 0; i <= n; i++) {
    const x = xMin + ((xMax - xMin) * i) / n;
    const pdf = frechetPDF(x, alpha, s, m);
    const cdf = frechetCDF(x, alpha, s, m);
    const sf = 1 - cdf;
    const hf = sf > 1e-12 ? pdf / sf : 0;
    chartData.push({ x: Number.parseFloat(x.toFixed(5)), pdf, cdf, sf, hf });
  }

  const ppData = generatePPData(
    (x: number) => frechetCDF(x, alpha, s, m),
    chartData,
  );
  const qqData = generateQQData(
    (p: number) => frechetQuantile(p, alpha, s, m),
    medianVal,
    std,
  );

  return { stats, chartData, ppData, qqData };
}

// =====================
// Fatigue Life BS 3P
// =====================

export function computeFatigueLifeBS3P(params: Record<string, number>): {
  stats: StatResults;
  chartData: ChartPoint[];
  ppData: PPPoint[];
  qqData: QQPoint[];
} {
  const { alpha, beta } = params;
  const gamma = params.gamma ?? 0;

  const baseCDF = (x: number) => bsCDF(x - gamma, alpha, beta);
  const basePDF = (x: number) => bsPDF(x - gamma, alpha, beta);
  const baseQuantile = (p: number) => gamma + bsQuantile(p, alpha, beta);

  const mean = gamma + beta * (1 + (alpha * alpha) / 2);
  const median = baseQuantile(0.5);
  const modeVal = gamma + bsMode(alpha, beta);
  const variance = alpha * alpha * beta * beta * (1 + (5 * alpha * alpha) / 4);
  const skewness =
    (4 * alpha * (11 * alpha * alpha + 6)) / (5 * alpha * alpha + 4) ** 1.5;
  const kurtosis =
    (6 * alpha * alpha * (93 * alpha * alpha + 40)) /
    (5 * alpha * alpha + 4) ** 2;
  const q1 = baseQuantile(0.25);
  const q3 = baseQuantile(0.75);
  const std = Math.sqrt(variance);

  const stats: StatResults = {
    mean,
    median,
    mode: modeVal,
    variance,
    skewness,
    kurtosis,
    probabilityDifference: baseCDF(mean + std) - baseCDF(mean - std),
    q1,
    q2: median,
    q3,
    q4: "∞ (unbounded upper tail)",
    mgf: "No closed-form MGF (location-shifted Birnbaum-Saunders)",
    momentLine: `E[X] = γ + β(1 + α²/2) = ${mean.toFixed(4)}`,
  };

  const xMin = baseQuantile(0.001);
  const xMax = baseQuantile(0.999);
  const chartData: ChartPoint[] = [];
  const n = 200;
  for (let i = 0; i <= n; i++) {
    const x = xMin + ((xMax - xMin) * i) / n;
    const pdf = basePDF(x);
    const cdf = baseCDF(x);
    const sf = 1 - cdf;
    const hf = sf > 1e-12 ? pdf / sf : 0;
    chartData.push({ x: Number.parseFloat(x.toFixed(5)), pdf, cdf, sf, hf });
  }

  const ppData = generatePPData(baseCDF, chartData);
  const qqData = generateQQData(baseQuantile, mean, std);

  return { stats, chartData, ppData, qqData };
}

// =====================
// Frechet 3P
// =====================

export function computeFrechet3P(params: Record<string, number>): {
  stats: StatResults;
  chartData: ChartPoint[];
  ppData: PPPoint[];
  qqData: QQPoint[];
} {
  return computeFrechet(params, true);
}

// =====================
// Gamma
// =====================

function gammaCDF(x: number, alpha: number, beta: number, shift = 0): number {
  const y = x - shift;
  if (y <= 0) return 0;
  return regularizedGammaP(alpha, y / beta);
}

function gammaPDF(x: number, alpha: number, beta: number, shift = 0): number {
  const y = x - shift;
  if (y <= 0) return 0;
  return Math.exp(
    (alpha - 1) * Math.log(y) -
      y / beta -
      alpha * Math.log(beta) -
      lnGamma(alpha),
  );
}

export function computeGamma(
  params: Record<string, number>,
  threeParam = false,
): {
  stats: StatResults;
  chartData: ChartPoint[];
  ppData: PPPoint[];
  qqData: QQPoint[];
} {
  const { alpha, beta } = params;
  const shift = threeParam ? (params.gamma ?? 0) : 0;

  const mean = shift + alpha * beta;
  const variance = alpha * beta * beta;
  const std = Math.sqrt(variance);
  const mode = alpha >= 1 ? shift + (alpha - 1) * beta : shift;
  const skewness = 2 / Math.sqrt(alpha);
  const kurtosis = 6 / alpha;
  const median = gammaQuantile(0.5, alpha, beta) + shift;
  const q1 = gammaQuantile(0.25, alpha, beta) + shift;
  const q3 = gammaQuantile(0.75, alpha, beta) + shift;

  const stats: StatResults = {
    mean,
    median,
    mode,
    variance,
    skewness,
    kurtosis,
    probabilityDifference:
      gammaCDF(mean + std, alpha, beta, shift) -
      gammaCDF(mean - std, alpha, beta, shift),
    q1,
    q2: median,
    q3,
    q4: "∞ (unbounded upper tail)",
    mgf: `M(t) = (1 − βt)^(−α) for t < 1/β = 1/${beta.toFixed(3)}`,
    momentLine: `E[X] = αβ = ${mean.toFixed(4)}, Var[X] = αβ² = ${variance.toFixed(4)}`,
  };

  const xMin = Math.max(
    shift + 1e-9,
    gammaQuantile(0.001, alpha, beta) + shift,
  );
  const xMax = gammaQuantile(0.999, alpha, beta) + shift;
  const chartData: ChartPoint[] = [];
  const n = 200;
  for (let i = 0; i <= n; i++) {
    const x = xMin + ((xMax - xMin) * i) / n;
    const pdf = gammaPDF(x, alpha, beta, shift);
    const cdf = gammaCDF(x, alpha, beta, shift);
    const sf = 1 - cdf;
    const hf = sf > 1e-12 ? pdf / sf : 0;
    chartData.push({ x: Number.parseFloat(x.toFixed(5)), pdf, cdf, sf, hf });
  }

  const ppData = generatePPData(
    (x: number) => gammaCDF(x, alpha, beta, shift),
    chartData,
  );
  const qqData = generateQQData(
    (p: number) => gammaQuantile(p, alpha, beta) + shift,
    mean,
    std,
  );

  return { stats, chartData, ppData, qqData };
}

export function computeGamma3P(params: Record<string, number>): {
  stats: StatResults;
  chartData: ChartPoint[];
  ppData: PPPoint[];
  qqData: QQPoint[];
} {
  return computeGamma(params, true);
}

// =====================
// PP/QQ Helpers
// =====================

function generatePPData(
  cdf: (x: number) => number,
  chartData: ChartPoint[],
): PPPoint[] {
  const n = 100;
  const step = Math.floor(chartData.length / n);
  const result: PPPoint[] = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.min(i * step, chartData.length - 1);
    const theoretical = cdf(chartData[idx].x);
    const empirical = (i + 1) / n;
    result.push({
      theoretical: Number.parseFloat(theoretical.toFixed(4)),
      empirical: Number.parseFloat(empirical.toFixed(4)),
    });
  }
  return result;
}

function generateQQData(
  quantile: (p: number) => number,
  mean: number,
  std: number,
): QQPoint[] {
  const n = 50;
  const result: QQPoint[] = [];
  for (let i = 1; i <= n; i++) {
    const p = i / (n + 1);
    const theoretical = quantile(p);
    const empirical = mean + std * normInv(p);
    result.push({
      theoretical: Number.parseFloat(theoretical.toFixed(4)),
      empirical: Number.parseFloat(empirical.toFixed(4)),
    });
  }
  return result;
}

// =====================
// Dispatch function
// =====================

export function computeDistribution(
  id: DistributionId,
  params: Record<string, number>,
): {
  stats: StatResults;
  chartData: ChartPoint[];
  ppData: PPPoint[];
  qqData: QQPoint[];
} {
  switch (id) {
    case "fatigue-life-bs":
      return computeFatigueLifeBS(params);
    case "frechet":
      return computeFrechet(params);
    case "fatigue-life-bs-3p":
      return computeFatigueLifeBS3P(params);
    case "frechet-3p":
      return computeFrechet3P(params);
    case "gamma":
      return computeGamma(params);
    case "gamma-3p":
      return computeGamma3P(params);
  }
}
