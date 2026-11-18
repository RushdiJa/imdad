/**
 * Imdad — Batch allocation (FEFO: First Expired, First Out)
 * ------------------------------------------------------------------
 * Goal: send each batch to a customer who will sell it BEFORE it spoils.
 *
 * Each customer has a "storage need": how many days they typically keep
 * produce before selling it (restaurant ≈ 1 day, grocery ≈ 3, supermarket ≈ 5).
 * A batch fits a customer when remaining_days ≥ need.
 *
 * Algorithm:
 *   1. Sort batches by remaining days, ascending (the ones expiring first go first).
 *   2. For each batch, pick the customer with the LONGEST storage need that the
 *      batch can still satisfy. This keeps the long-life batches for the
 *      customers who really need them (supermarkets, distant governorates)
 *      and pushes short-life batches to fast sellers (restaurants).
 *   3. If no customer fits, recommend: sell today at the central market / discount.
 *
 * Baseline ("without allocation"): the distributor does not know each batch's
 * remaining life, so batches are dispatched blindly in the order they arrived,
 * rotating through the customer list (round-robin). We count how many batches
 * would land at a customer who stores them longer than their remaining life.
 *
 * All values in the demo are SAMPLE VALUES.
 */
(function (global) {
  'use strict';

  /** Sample batches (product key + remaining shelf life in days). */
  var SAMPLE_BATCHES = [
    { product: 'tomato', days: 5.8 },
    { product: 'grapes', days: 3.4 },
    { product: 'cucumber', days: 1.6 },
    { product: 'strawberry', days: 0.7 }
  ];

  /** Sample customers: `type` is a translation key, `need` is storage days. */
  var SAMPLE_CUSTOMERS = [
    { type: 'restaurant', need: 1 },
    { type: 'grocery', need: 3 },
    { type: 'supermarket', need: 5 }
  ];

  function num(x) {
    var n = Number(x);
    return isFinite(n) ? n : 0;
  }

  /**
   * FEFO allocation.
   * @param {Array<{id:*, product:string, days:number}>} batches
   * @param {Array<{id:*, name:string, need:number}>} customers
   * @returns {Array<{batch:Object, customer:Object|null, slack:number|null}>}
   *          in FEFO order; customer === null means "sell today / discount".
   */
  function allocate(batches, customers) {
    var sortedBatches = batches.slice().sort(function (a, b) { return num(a.days) - num(b.days); });
    // Customers sorted by storage need, longest first, so the first fit is the best fit.
    var byNeedDesc = customers.slice().sort(function (a, b) { return num(b.need) - num(a.need); });

    return sortedBatches.map(function (batch) {
      var days = num(batch.days);
      var match = null;
      for (var i = 0; i < byNeedDesc.length; i++) {
        if (days >= num(byNeedDesc[i].need)) { match = byNeedDesc[i]; break; }
      }
      return {
        batch: batch,
        customer: match,
        // slack = spare days after the customer's storage period
        slack: match ? Math.round((days - num(match.need)) * 10) / 10 : null
      };
    });
  }

  /**
   * Baseline without allocation: round-robin in arrival order.
   * @returns {{assignments: Array, mismatches: number}}
   */
  function naiveBaseline(batches, customers) {
    if (!customers.length) return { assignments: [], mismatches: 0 };
    var mismatches = 0;
    var assignments = batches.map(function (batch, i) {
      var c = customers[i % customers.length];
      var bad = num(batch.days) < num(c.need);
      if (bad) mismatches++;
      return { batch: batch, customer: c, mismatch: bad };
    });
    return { assignments: assignments, mismatches: mismatches };
  }

  global.ImdadAllocation = {
    SAMPLE_BATCHES: SAMPLE_BATCHES,
    SAMPLE_CUSTOMERS: SAMPLE_CUSTOMERS,
    allocate: allocate,
    naiveBaseline: naiveBaseline
  };
})(window);
