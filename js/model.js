/**
 * Amdad — Shelf-life model (runs entirely in the browser)
 * ------------------------------------------------------------------
 * A simplified temperature–time model based on the Q10 rule:
 * the rate of quality loss in fresh produce speeds up roughly
 * 2–3x for every +10 °C. We use Q10 = 2.5 around a reference of 20 °C.
 *
 *   rate(T)        = Q10 ^ ((T - T_REF) / 10)
 *   consumed_days  = hours * rate(T) / 24
 *   remaining_days = base_shelf_life_days * quality_factor - Σ consumed_days
 *
 * Because there is no physical sensor in this demo, the truck's inside
 * temperature is estimated from the outside temperature ("virtual sensor").
 *
 * IMPORTANT: all numbers here are SAMPLE VALUES for demonstration only.
 * The real product will be calibrated with sensor data from Palestinian trips.
 * See docs/model.md for the full explanation and limitations.
 */
(function (global) {
  'use strict';

  /** Reference temperature (°C) at which base shelf life is defined. */
  var T_REF = 20;

  /** Q10 coefficient: spoilage speeds up 2.5x per +10 °C. */
  var Q10 = 2.5;

  /**
   * Base shelf life in days at 20 °C — SAMPLE VALUES.
   * `emoji` is used in the UI and in the WhatsApp preview.
   */
  var PRODUCTS = {
    tomato:     { baseDays: 9, emoji: '🍅' },
    cucumber:   { baseDays: 6, emoji: '🥒' },
    pepper:     { baseDays: 8, emoji: '🫑' },
    grapes:     { baseDays: 6, emoji: '🍇' },
    lettuce:    { baseDays: 3, emoji: '🥬' },
    strawberry: { baseDays: 2, emoji: '🍓' }
  };

  /**
   * Initial quality factor — stands in for a photo-based quality check.
   */
  var QUALITY = {
    excellent: 1.0,
    good: 0.85,
    fair: 0.65
  };

  /**
   * Checkpoint presets with a default waiting time in hours — SAMPLE VALUES.
   * The user can always override the delay manually.
   */
  var CHECKPOINTS = {
    hamra:     { delayHours: 2 },
    tayasir:   { delayHours: 1.5 },
    container: { delayHours: 1 },   // Container / Wadi al-Nar
    other:     { delayHours: 1 }
  };

  /**
   * Temperature offsets (°C) for the "virtual sensor".
   * Inside temperature = outside temperature + offset.
   */
  var OFFSETS = {
    drivingClosed: 2,      // closed unrefrigerated truck while moving
    drivingCovered: 1,     // open truck with a cover while moving
    stopSunClosed: 8,      // parked in the sun, closed box heats up fast
    stopSunCovered: 5,     // parked in the sun, covered
    stopShade: 3,          // parked in the shade (any truck)
    closedRespiration: 1   // extra heat trapped from produce respiration (closed trucks only)
  };

  /** Category thresholds (days). */
  var THRESHOLDS = { red: 2, yellow: 4 };

  /**
   * Relative spoilage rate at temperature T compared to T_REF.
   * e.g. rate(20) = 1, rate(30) = 2.5, rate(40) = 6.25
   */
  function rate(tempC) {
    return Math.pow(Q10, (tempC - T_REF) / 10);
  }

  /**
   * Days of shelf life consumed by spending `hours` at `tempC`.
   */
  function consumedDays(hours, tempC) {
    var h = Math.max(0, Number(hours) || 0);
    return (h * rate(tempC)) / 24;
  }

  /** Round to one decimal place. */
  function round1(x) {
    return Math.round(x * 10) / 10;
  }

  /**
   * Virtual sensor: estimated temperature inside the truck for each stage.
   * @param {number} outsideC  outside temperature
   * @param {'closed'|'covered'} truck
   * @param {boolean} inSun    parked in the sun while waiting at the checkpoint?
   */
  function estimateTemps(outsideC, truck, inSun) {
    var closed = truck === 'closed';
    var extra = closed ? OFFSETS.closedRespiration : 0;

    var driving = outsideC + (closed ? OFFSETS.drivingClosed : OFFSETS.drivingCovered) + extra;

    var stopOffset;
    if (!inSun) stopOffset = OFFSETS.stopShade;
    else stopOffset = closed ? OFFSETS.stopSunClosed : OFFSETS.stopSunCovered;
    var checkpoint = outsideC + stopOffset + extra;

    return {
      beforeLoading: outsideC, // produce waits outside before it is loaded
      driving: driving,
      checkpoint: checkpoint
    };
  }

  /** Map remaining days to a traffic-light category. */
  function categorize(days) {
    if (days < THRESHOLDS.red) return 'red';       // 🔴 sell today
    if (days < THRESHOLDS.yellow) return 'yellow'; // 🟡 2–3 days
    return 'green';                                // 🟢 4+ days
  }

  /**
   * Main entry point: estimate the remaining shelf life of one batch.
   *
   * @param {Object} input
   * @param {string} input.product        key of PRODUCTS
   * @param {string} input.quality        key of QUALITY
   * @param {number} input.hoursBeforeLoading
   * @param {number} input.outsideTemp    °C
   * @param {number} input.drivingHours
   * @param {number} input.delayHours     checkpoint waiting time
   * @param {boolean} input.inSun         parked in the sun while waiting?
   * @param {'closed'|'covered'} input.truck
   * @returns {Object} result with remaining days, category, per-stage breakdown
   *                   and a "what if it had waited in the shade" comparison.
   */
  function estimate(input) {
    var product = PRODUCTS[input.product] || PRODUCTS.tomato;
    var q = QUALITY[input.quality] != null ? QUALITY[input.quality] : QUALITY.good;
    var outside = Number(input.outsideTemp);
    if (!isFinite(outside)) outside = 32;

    var startDays = product.baseDays * q;
    var temps = estimateTemps(outside, input.truck, !!input.inSun);

    var stages = [
      { key: 'beforeLoading', hours: input.hoursBeforeLoading, temp: temps.beforeLoading },
      { key: 'driving',       hours: input.drivingHours,       temp: temps.driving },
      { key: 'checkpoint',    hours: input.delayHours,         temp: temps.checkpoint }
    ].map(function (s) {
      var h = Math.max(0, Number(s.hours) || 0);
      return { key: s.key, hours: h, temp: s.temp, rate: rate(s.temp), consumed: consumedDays(h, s.temp) };
    });

    var totalConsumed = stages.reduce(function (sum, s) { return sum + s.consumed; }, 0);
    var remaining = round1(Math.max(0, startDays - totalConsumed));

    // Comparison: identical trip, but the truck waited in the shade.
    var shadeTemp = estimateTemps(outside, input.truck, false).checkpoint;
    var shadeConsumed = totalConsumed - stages[2].consumed + consumedDays(stages[2].hours, shadeTemp);
    var remainingShade = round1(Math.max(0, startDays - shadeConsumed));

    return {
      startDays: round1(startDays),
      remainingDays: remaining,
      category: categorize(remaining),
      stages: stages,
      totalConsumed: totalConsumed,
      remainingIfShade: remainingShade,
      shadeCheckpointTemp: shadeTemp,
      emoji: product.emoji
    };
  }

  global.AmdadModel = {
    T_REF: T_REF,
    Q10: Q10,
    PRODUCTS: PRODUCTS,
    QUALITY: QUALITY,
    CHECKPOINTS: CHECKPOINTS,
    OFFSETS: OFFSETS,
    THRESHOLDS: THRESHOLDS,
    rate: rate,
    consumedDays: consumedDays,
    estimateTemps: estimateTemps,
    categorize: categorize,
    estimate: estimate,
    round1: round1
  };
})(window);
