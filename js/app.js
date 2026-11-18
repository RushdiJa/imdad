/**
 * Imdad — UI wiring
 * ------------------------------------------------------------------
 * Connects the form inputs to the model (js/model.js), renders the
 * results, the SVG bar chart, the allocation demo (js/allocation.js)
 * and the live WhatsApp preview. No frameworks, no external APIs.
 */
(function () {
  'use strict';

  var I18n = window.ImdadI18n;
  var Model = window.ImdadModel;
  var Alloc = window.ImdadAllocation;
  var t = I18n.t;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };

  /** Format a number with one decimal place (Western digits in both languages). */
  function fmt(x) { return (Math.round(x * 10) / 10).toFixed(1); }
  /** Hours: drop the trailing ".0" (2 → "2", 1.5 → "1.5"). */
  function fmtH(x) { return String(Math.round(x * 100) / 100); }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var CAT_DOT = { red: '🔴', yellow: '🟡', green: '🟢' };
  var SVG_NS = 'http://www.w3.org/2000/svg';

  // =================================================================
  // Demo 1: shelf-life calculator
  // =================================================================
  var form = $('#calc-form');
  var lastInput = null;
  var lastResult = null;

  function readForm() {
    var fd = new FormData(form);
    return {
      product: fd.get('product'),
      quality: fd.get('quality'),
      hoursBeforeLoading: parseFloat(fd.get('hoursBeforeLoading')) || 0,
      outsideTemp: parseFloat(fd.get('outsideTemp')),
      drivingHours: parseFloat(fd.get('drivingHours')) || 0,
      delayHours: parseFloat(fd.get('delayHours')) || 0,
      inSun: fd.get('inSun') === 'yes',
      truck: fd.get('truck')
    };
  }

  function updateCalculator() {
    var input = readForm();
    var r = Model.estimate(input);
    lastInput = input;
    lastResult = r;

    $('#r-days').textContent = fmt(r.remainingDays);
    $('#r-of').textContent = t('calc.of', { start: fmt(r.startDays) });

    var pill = $('#r-cat');
    pill.className = 'pill pill-' + r.category;
    pill.textContent = CAT_DOT[r.category] + ' ' + t('cat.' + r.category);

    var meter = $('#r-meter');
    var pct = r.startDays > 0 ? Math.min(100, (r.remainingDays / r.startDays) * 100) : 0;
    meter.style.width = pct.toFixed(1) + '%';
    meter.className = 'meter-' + r.category;

    $('#r-rec').textContent = t('rec.' + r.category);
    $('#calc-result').setAttribute('data-cat', r.category);

    renderChart(r);

    var diff = r.remainingIfShade - r.remainingDays;
    $('#r-shade').innerHTML = input.inSun
      ? t('calc.shade', { days: fmt(r.remainingIfShade), diff: fmt(diff) })
      : escapeHtml(t('calc.shadeSame'));

    renderWhatsApp();
  }

  /**
   * Plain SVG horizontal bar chart: days consumed per stage.
   * Bars grow from the reading-start side (right in Arabic, left in English).
   */
  function renderChart(r) {
    var svg = $('#r-chart');
    var rtl = document.documentElement.dir === 'rtl';
    var W = 340, rowH = 54, top = 4;
    var H = top + rowH * r.stages.length;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    var max = Math.max.apply(null, r.stages.map(function (s) { return s.consumed; }).concat([0.1]));
    var valueSpace = 64;            // room for the value label after the bar
    var maxBar = W - valueSpace;
    var colors = { beforeLoading: '#e3c565', driving: '#c9a227', checkpoint: '#4a2a7a' };

    function el(name, attrs, text) {
      var n = document.createElementNS(SVG_NS, name);
      Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
      if (text != null) n.textContent = text;
      svg.appendChild(n);
      return n;
    }
    // x position helper: mirror for RTL
    function X(x, w) { return rtl ? W - x - (w || 0) : x; }

    r.stages.forEach(function (s, i) {
      var y = top + i * rowH;
      var labelAnchor = rtl ? 'end' : 'start';
      var otherAnchor = rtl ? 'start' : 'end';

      // All text uses direction="ltr" so text-anchor keeps its physical meaning
      // (in RTL, SVG would otherwise flip "start"/"end"); Arabic glyphs still shape correctly.
      el('text', { x: X(0), y: y + 14, 'text-anchor': labelAnchor, 'class': 'chart-label', direction: 'ltr' },
        t('stage.' + s.key));
      el('text', { x: X(W), y: y + 14, 'text-anchor': otherAnchor, 'class': 'chart-meta', direction: 'ltr' },
        t('calc.tempLine', { temp: fmt(s.temp).replace(/\.0$/, ''), hours: fmtH(s.hours) }));

      // track + bar
      el('rect', { x: 0, y: y + 22, width: W, height: 20, rx: 6, 'class': 'chart-track' });
      var w = Math.max(s.consumed > 0 ? 4 : 0, (s.consumed / max) * maxBar);
      el('rect', { x: X(0, w), y: y + 22, width: w, height: 20, rx: 6, fill: colors[s.key] });
      el('text', {
        x: rtl ? W - w - 8 : w + 8, y: y + 37,
        'text-anchor': rtl ? 'end' : 'start', 'class': 'chart-value', direction: 'ltr'
      }, fmt(s.consumed));
    });
  }

  form.addEventListener('input', updateCalculator);
  form.addEventListener('change', updateCalculator);
  form.addEventListener('submit', function (e) { e.preventDefault(); });

  // =================================================================
  // WhatsApp preview (mirrors the calculator batch)
  // =================================================================
  function renderWhatsApp() {
    if (!lastResult) return;
    var r = lastResult, input = lastInput;
    var cpStage = r.stages[2];
    var lines = [
      t('wa.msg.header'),
      '',
      t('wa.msg.product', { emoji: r.emoji, product: t('product.' + input.product), quality: t('quality.' + input.quality) }),
      t('wa.msg.remaining', { days: fmt(r.remainingDays), dot: CAT_DOT[r.category], cat: t('cat.' + r.category) }),
      t('wa.msg.checkpoint', { temp: fmt(cpStage.temp).replace(/\.0$/, ''), hours: fmtH(cpStage.hours) }),
      t('wa.msg.recommend', { rec: t('rec.' + r.category) })
    ];
    if (input.inSun && r.remainingIfShade > r.remainingDays) {
      lines.push(t('wa.msg.shade', { days: fmt(r.remainingIfShade) }));
    }
    lines.push('', t('wa.msg.footer'));

    // Escape, then turn WhatsApp-style *bold* into <strong>.
    var html = lines.map(function (l) {
      return escapeHtml(l).replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
    }).join('<br>');

    var now = new Date();
    var time = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    $('#wa-message').innerHTML = html +
      '<span class="wa-meta" dir="ltr">' + time + ' <span class="wa-ticks">✓✓</span></span>';
  }

  // =================================================================
  // Demo 2: allocation (stock batches → customer orders, same product, kg)
  // =================================================================
  var nextId = 1;
  var batches = [];   // stock: { id, product, kg, days }
  var orders = [];    // orders: { id, type|name, product, kg, need }

  function loadSamples() {
    batches = Alloc.SAMPLE_BATCHES.map(function (b) { return { id: nextId++, product: b.product, kg: b.kg, days: b.days }; });
    orders = Alloc.SAMPLE_ORDERS.map(function (o) { return { id: nextId++, type: o.type, product: o.product, kg: o.kg, need: o.need }; });
  }

  function customerName(o) { return o.name != null ? o.name : t('cust.' + o.type); }
  function productLabel(p) { return Model.PRODUCTS[p].emoji + ' ' + t('product.' + p); }
  function batchLabel(b) {
    return productLabel(b.product) + ' · ' + t('alloc.batchN', { n: batches.indexOf(b) + 1 });
  }
  function kgLabel(kg) { return t('alloc.kgShort', { kg: Math.round(kg) }); }

  function productOptions(selected) {
    return Object.keys(Model.PRODUCTS).map(function (k) {
      return '<option value="' + k + '"' + (k === selected ? ' selected' : '') + '>' +
        escapeHtml(t('product.' + k)) + '</option>';
    }).join('');
  }

  function numInput(field, value, label, step, max) {
    return '<input data-field="' + field + '" type="number" inputmode="decimal" min="0" max="' + max + '" step="' + step +
      '" value="' + value + '" aria-label="' + escapeHtml(label) + '">';
  }
  function delButton(action, label) {
    return '<button type="button" class="icon-btn" data-action="' + action + '" aria-label="' + escapeHtml(label) + '">✕</button>';
  }

  /** Rebuild the editable lists (on add/delete/language change only, to keep input focus). */
  function renderLists() {
    $('#batch-list').innerHTML =
      '<div class="edit-row edit-row-stock edit-head"><span>' + escapeHtml(t('alloc.product')) + '</span><span>' +
      escapeHtml(t('alloc.kg')) + '</span><span>' + escapeHtml(t('alloc.days')) + '</span><span></span></div>' +
      batches.map(function (b, i) {
        var n = i + 1;
        return '<div class="edit-row edit-row-stock" data-id="' + b.id + '">' +
          '<select data-field="product" aria-label="' + escapeHtml(t('alloc.product') + ' ' + n) + '">' + productOptions(b.product) + '</select>' +
          numInput('kg', b.kg, t('alloc.kg') + ' ' + n, 10, 100000) +
          numInput('days', b.days, t('alloc.days') + ' ' + n, 0.1, 30) +
          delButton('del-batch', t('alloc.deleteBatch', { n: n })) +
          '</div>';
      }).join('');

    $('#customer-list').innerHTML =
      '<div class="edit-row edit-row-order edit-head"><span class="cell-name">' + escapeHtml(t('alloc.customerName')) + '</span><span>' +
      escapeHtml(t('alloc.product')) + '</span><span>' + escapeHtml(t('alloc.kg')) + '</span><span>' +
      escapeHtml(t('alloc.need')) + '</span><span></span></div>' +
      orders.map(function (o) {
        var name = customerName(o);
        return '<div class="edit-row edit-row-order" data-id="' + o.id + '">' +
          '<input class="cell-name" data-field="name" type="text" maxlength="40" value="' + escapeHtml(name) + '" aria-label="' + escapeHtml(t('alloc.customerName')) + '">' +
          '<select data-field="product" aria-label="' + escapeHtml(t('alloc.product') + ' · ' + name) + '">' + productOptions(o.product) + '</select>' +
          numInput('kg', o.kg, t('alloc.kg') + ' · ' + name, 10, 100000) +
          numInput('need', o.need, t('alloc.need') + ' · ' + name, 0.5, 30) +
          delButton('del-customer', t('alloc.deleteCustomer', { name: name })) +
          '</div>';
      }).join('');
  }

  function renderAllocation() {
    var tbody = $('#alloc-table tbody');
    var summary = $('#alloc-summary');
    var shortBox = $('#alloc-shortfalls');
    var valid = batches.filter(function (b) { return isFinite(parseFloat(b.days)) && parseFloat(b.kg) > 0; });
    var validOrders = orders.filter(function (o) { return parseFloat(o.kg) > 0; });

    if (!valid.length || !validOrders.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty">' + escapeHtml(t('alloc.empty')) + '</td></tr>';
      summary.textContent = '';
      shortBox.innerHTML = '';
      return;
    }

    var result = Alloc.allocate(valid, validOrders);

    // One table: assignments and leftovers, grouped by batch in FEFO order.
    var rows = [];
    var fefo = valid.slice().sort(function (a, b) { return parseFloat(a.days) - parseFloat(b.days); });
    fefo.forEach(function (b) {
      result.assignments.filter(function (a) { return a.batch === b; }).forEach(function (a) { rows.push({ kind: 'send', a: a }); });
      result.leftovers.filter(function (l) { return l.batch === b; }).forEach(function (l) { rows.push({ kind: 'left', l: l }); });
    });

    tbody.innerHTML = rows.map(function (row, i) {
      var b = row.kind === 'send' ? row.a.batch : row.l.batch;
      var days = parseFloat(b.days);
      var cat = Model.categorize(days);
      var kg = row.kind === 'send' ? row.a.kg : row.l.kg;
      var sendTo, spare, rowClass;
      if (row.kind === 'send') {
        sendTo = '<span class="send-ok">' + escapeHtml(customerName(row.a.order)) + '</span>' +
          ' <span class="hint">' + escapeHtml(t('alloc.storesFor', { d: row.a.order.need })) + '</span>';
        spare = '+' + fmt(row.a.slack);
        rowClass = 'row-' + cat;
      } else if (row.l.sellToday) {
        sendTo = '<span class="send-today">' + escapeHtml(t('alloc.sellToday')) + '</span>';
        spare = '–';
        rowClass = 'row-red';
      } else {
        sendTo = '<span class="send-extra">' + escapeHtml(t('alloc.extraStock')) + '</span>';
        spare = '–';
        rowClass = 'row-extra';
      }
      return '<tr class="' + rowClass + '">' +
        '<td>' + (i + 1) + '</td>' +
        '<td>' + escapeHtml(batchLabel(b)) + '<br><span class="hint"><span class="dot dot-' + cat + '"></span> ' +
          escapeHtml(t('alloc.daysLeft', { d: fmt(days) })) + '</span></td>' +
        '<td class="cell-kg">' + escapeHtml(kgLabel(kg)) + '</td>' +
        '<td>' + sendTo + '</td>' +
        '<td dir="ltr">' + spare + '</td>' +
        '</tr>';
    }).join('');

    shortBox.innerHTML = result.shortfalls.length
      ? '<h4>' + escapeHtml(t('alloc.shortfalls')) + '</h4><ul>' + result.shortfalls.map(function (s) {
          return '<li>' + escapeHtml(t('alloc.shortfallItem', {
            customer: customerName(s.order), product: productLabel(s.order.product),
            kg: Math.round(s.kg), d: s.order.need
          })) + '</li>';
        }).join('') + '</ul>'
      : '';

    var base = Alloc.naiveBaseline(valid, validOrders);
    summary.innerHTML = base.badKg > 0
      ? t('alloc.summary', { x: Math.round(base.badKg), n: Math.round(base.totalKg) })
      : escapeHtml(t('alloc.summaryNone'));
  }

  function findById(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function onListInput(e) {
    var row = e.target.closest('.edit-row');
    if (!row || !row.dataset.id) return;
    var id = Number(row.dataset.id);
    var field = e.target.dataset.field;
    var item = findById(batches, id) || findById(orders, id);
    if (!item || !field) return;
    if (field === 'product') item.product = e.target.value;
    else if (field === 'name') { item.name = e.target.value; delete item.type; }
    else if (field === 'days') item.days = e.target.value === '' ? NaN : parseFloat(e.target.value);
    else item[field] = parseFloat(e.target.value) || 0;   // kg, need
    renderAllocation();
  }

  function onListClick(e) {
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    var id = Number(btn.closest('.edit-row').dataset.id);
    if (btn.dataset.action === 'del-batch') batches = batches.filter(function (b) { return b.id !== id; });
    if (btn.dataset.action === 'del-customer') orders = orders.filter(function (o) { return o.id !== id; });
    renderLists();
    renderAllocation();
  }

  ['#batch-list', '#customer-list'].forEach(function (sel) {
    $(sel).addEventListener('input', onListInput);
    $(sel).addEventListener('change', onListInput);
    $(sel).addEventListener('click', onListClick);
  });

  $('#add-batch').addEventListener('click', function () {
    batches.push({ id: nextId++, product: 'tomato', kg: 100, days: 3 });
    renderLists(); renderAllocation();
    var inputs = document.querySelectorAll('#batch-list select');
    if (inputs.length) inputs[inputs.length - 1].focus();
  });
  $('#add-customer').addEventListener('click', function () {
    orders.push({ id: nextId++, name: t('cust.new'), product: 'tomato', kg: 50, need: 2 });
    renderLists(); renderAllocation();
    var inputs = document.querySelectorAll('#customer-list input[data-field="name"]');
    if (inputs.length) { inputs[inputs.length - 1].focus(); inputs[inputs.length - 1].select(); }
  });
  $('#add-from-demo').addEventListener('click', function () {
    if (!lastResult) return;
    batches.push({ id: nextId++, product: lastInput.product, kg: 100, days: lastResult.remainingDays });
    renderLists(); renderAllocation();
  });
  $('#reset-alloc').addEventListener('click', function () {
    loadSamples(); renderLists(); renderAllocation();
  });

  // =================================================================
  // Language toggle + mobile menu
  // =================================================================
  function renderAll() {
    updateCalculator();
    renderLists();
    renderAllocation();
  }

  $('#lang-toggle').addEventListener('click', function () {
    I18n.setLang(I18n.getLang() === 'ar' ? 'en' : 'ar');
    $('#lang-toggle').setAttribute('lang', I18n.getLang() === 'ar' ? 'en' : 'ar');
    renderAll();
  });

  var menuBtn = $('#menu-toggle');
  var nav = $('#main-nav');
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // =================================================================
  // Init
  // =================================================================
  I18n.setLang(I18n.getLang());
  $('#lang-toggle').setAttribute('lang', I18n.getLang() === 'ar' ? 'en' : 'ar');
  loadSamples();
  renderAll();
})();
