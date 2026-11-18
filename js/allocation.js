/**
 * Imdad — Batch allocation (FEFO: First Expired, First Out)
 * ------------------------------------------------------------------
 * Goal: send each batch to a customer who ordered THE SAME PRODUCT and
 * who will sell it BEFORE it spoils, in the right quantity (kg).
 *
 * Stock batch: { product, kg, days }   days = remaining shelf life
 * Order:       { customer, product, kg, need }
 *              need = how many days the customer typically keeps produce
 *              before selling it (restaurant ≈ 1, grocery ≈ 3, supermarket ≈ 5).
 *
 * A batch can serve an order only if:
 *   - it is the same product, and
 *   - remaining_days ≥ need (it will still be good when the customer sells it).
 *
 * Algorithm:
 *   1. Sort batches by remaining days, ascending (the ones expiring first go first).
 *   2. For each batch, look at same-product orders it can satisfy, LONGEST storage
 *      need first, and fill their remaining kg. A batch may be split across orders.
 *      Long-life batches are kept for the customers who really need them
 *      (supermarkets, distant governorates); short-life ones go to fast sellers.
 *   3. Leftover kg of a batch:
 *        < 2 days left → sell today at the central market / at a discount
 *        otherwise     → extra stock, offer it to other customers
 *   4. Orders that could not be fully filled are reported as shortfalls.
 *
 * Baseline ("without Imdad"): the distributor does not know each batch's
 * remaining life, so orders are filled in list order from same-product stock
 * in arrival order. We count the kg that would reach a customer who stores it
 * longer than its remaining life (i.e. likely returns).
 *
 * All values in the demo are SAMPLE VALUES.
 */
(function (global) {
  'use strict';

  /** Below this many remaining days, leftovers should be sold today. */
  var SELL_TODAY_DAYS = 2;

  /** Sample stock: product key, quantity (kg), remaining shelf life (days). */
  var SAMPLE_BATCHES = [
    { product: 'tomato', kg: 300, days: 5.8 },
    { product: 'tomato', kg: 200, days: 1.5 },
    { product: 'cucumber', kg: 150, days: 3.4 },
    { product: 'cucumber', kg: 100, days: 0.8 }
  ];

  /** Sample orders: `type` is a translation key for the customer name. */
  var SAMPLE_ORDERS = [
    { type: 'restaurant', product: 'tomato', kg: 150, need: 1 },
    { type: 'grocery', product: 'tomato', kg: 100, need: 3 },
    { type: 'grocery', product: 'cucumber', kg: 80, need: 3 },
    { type: 'supermarket', product: 'tomato', kg: 250, need: 5 },
    { type: 'supermarket', product: 'cucumber', kg: 100, need: 5 }
  ];

  function num(x) {
    var n = Number(x);
    return isFinite(n) ? n : 0;
  }
  function round1(x) { return Math.round(x * 10) / 10; }

  /**
   * FEFO allocation with quantities and same-product matching.
   * @param {Array<{id:*, product:string, kg:number, days:number}>} batches
   * @param {Array<{id:*, product:string, kg:number, need:number}>} orders
   * @returns {{
   *   assignments: Array<{batch:Object, order:Object, kg:number, slack:number}>,
   *   leftovers:   Array<{batch:Object, kg:number, sellToday:boolean}>,
   *   shortfalls:  Array<{order:Object, kg:number}>
   * }}  assignments are in FEFO order.
   */
  function allocate(batches, orders) {
    var open = orders.map(function (o) { return { order: o, left: Math.max(0, num(o.kg)) }; });
    var sorted = batches.slice().sort(function (a, b) { return num(a.days) - num(b.days); });
    var assignments = [], leftovers = [];

    sorted.forEach(function (batch) {
      var days = num(batch.days);
      var stock = Math.max(0, num(batch.kg));

      // Same product, still good when the customer sells it, longest need first.
      var fits = open
        .filter(function (o) { return o.order.product === batch.product && o.left > 0 && days >= num(o.order.need); })
        .sort(function (a, b) { return num(b.order.need) - num(a.order.need); });

      for (var i = 0; i < fits.length && stock > 0; i++) {
        var take = Math.min(stock, fits[i].left);
        fits[i].left -= take;
        stock -= take;
        assignments.push({ batch: batch, order: fits[i].order, kg: take, slack: round1(days - num(fits[i].order.need)) });
      }
      if (stock > 0) leftovers.push({ batch: batch, kg: stock, sellToday: days < SELL_TODAY_DAYS });
    });

    var shortfalls = open
      .filter(function (o) { return o.left > 0; })
      .map(function (o) { return { order: o.order, kg: o.left }; });

    return { assignments: assignments, leftovers: leftovers, shortfalls: shortfalls };
  }

  /**
   * Baseline without remaining-life information: fill orders in list order
   * from same-product stock in arrival order.
   * @returns {{badKg:number, totalKg:number}} kg that would reach a customer
   *          who stores it longer than its remaining life, out of kg delivered.
   */
  function naiveBaseline(batches, orders) {
    var stock = batches.map(function (b) { return { batch: b, left: Math.max(0, num(b.kg)) }; });
    var badKg = 0, totalKg = 0;
    orders.forEach(function (o) {
      var need = Math.max(0, num(o.kg));
      stock.forEach(function (s) {
        if (need <= 0 || s.left <= 0 || s.batch.product !== o.product) return;
        var take = Math.min(need, s.left);
        s.left -= take;
        need -= take;
        totalKg += take;
        if (num(s.batch.days) < num(o.need)) badKg += take;
      });
    });
    return { badKg: badKg, totalKg: totalKg };
  }

  global.ImdadAllocation = {
    SELL_TODAY_DAYS: SELL_TODAY_DAYS,
    SAMPLE_BATCHES: SAMPLE_BATCHES,
    SAMPLE_ORDERS: SAMPLE_ORDERS,
    allocate: allocate,
    naiveBaseline: naiveBaseline
  };
})(window);
