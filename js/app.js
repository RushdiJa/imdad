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
      checkpoint: fd.get('checkpoint'),
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
    var colors = { beforeLoading: '#f5b14c', driving: '#f28c28', checkpoint: '#d9480f' };

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

  // Checkpoint preset fills the default delay (still editable).
  $('#f-checkpoint').addEventListener('change', function (e) {
    var preset = Model.CHECKPOINTS[e.target.value];
    if (preset) $('#f-delay').value = preset.delayHours;
    updateCalculator();
  });
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
      t('wa.msg.checkpoint', { cp: t('checkpointName.' + input.checkpoint), temp: fmt(cpStage.temp).replace(/\.0$/, ''), hours: fmtH(cpStage.hours) }),
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
  // Demo 2: allocation
  // =================================================================
  var nextId = 1;
  var batches = [];
  var customers = [];

  function loadSamples() {
    batches = Alloc.SAMPLE_BATCHES.map(function (b) { return { id: nextId++, product: b.product, days: b.days }; });
    customers = Alloc.SAMPLE_CUSTOMERS.map(function (c) { return { id: nextId++, type: c.type, need: c.need }; });
  }

  function customerName(c) { return c.name != null ? c.name : t('cust.' + c.type); }
  function batchLabel(b) {
    var idx = batches.indexOf(b) + 1;
    return Model.PRODUCTS[b.product].emoji + ' ' + t('product.' + b.product) + ' · ' + t('alloc.batchN', { n: idx });
  }

  function productOptions(selected) {
    return Object.keys(Model.PRODUCTS).map(function (k) {
      return '<option value="' + k + '"' + (k === selected ? ' selected' : '') + '>' +
        escapeHtml(t('product.' + k)) + '</option>';
    }).join('');
  }

  /** Rebuild the editable lists (on add/delete/language change only, to keep input focus). */
  function renderLists() {
    $('#batch-list').innerHTML =
      '<div class="edit-row edit-head"><span>' + escapeHtml(t('alloc.product')) + '</span><span>' +
      escapeHtml(t('alloc.days')) + '</span><span></span></div>' +
      batches.map(function (b, i) {
        return '<div class="edit-row" data-id="' + b.id + '">' +
          '<select data-field="product" aria-label="' + escapeHtml(t('alloc.product') + ' ' + (i + 1)) + '">' + productOptions(b.product) + '</select>' +
          '<input data-field="days" type="number" inputmode="decimal" min="0" max="30" step="0.1" value="' + b.days + '" aria-label="' + escapeHtml(t('alloc.days') + ' ' + (i + 1)) + '">' +
          '<button type="button" class="icon-btn" data-action="del-batch" aria-label="' + escapeHtml(t('alloc.deleteBatch', { n: i + 1 })) + '">✕</button>' +
          '</div>';
      }).join('');

    $('#customer-list').innerHTML =
      '<div class="edit-row edit-head"><span>' + escapeHtml(t('alloc.customerName')) + '</span><span>' +
      escapeHtml(t('alloc.need')) + '</span><span></span></div>' +
      customers.map(function (c) {
        var name = customerName(c);
        return '<div class="edit-row" data-id="' + c.id + '">' +
          '<input data-field="name" type="text" maxlength="40" value="' + escapeHtml(name) + '" aria-label="' + escapeHtml(t('alloc.customerName')) + '">' +
          '<input data-field="need" type="number" inputmode="decimal" min="0" max="30" step="0.5" value="' + c.need + '" aria-label="' + escapeHtml(t('alloc.need')) + '">' +
          '<button type="button" class="icon-btn" data-action="del-customer" aria-label="' + escapeHtml(t('alloc.deleteCustomer', { name: name })) + '">✕</button>' +
          '</div>';
      }).join('');
  }

  function renderAllocation() {
    var tbody = $('#alloc-table tbody');
    var summary = $('#alloc-summary');
    var valid = batches.filter(function (b) { return isFinite(parseFloat(b.days)); });

    if (!valid.length || !customers.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty">' + escapeHtml(t('alloc.empty')) + '</td></tr>';
      summary.textContent = '';
      return;
    }

    var result = Alloc.allocate(valid, customers);
    tbody.innerHTML = result.map(function (row, i) {
      var days = parseFloat(row.batch.days);
      var cat = Model.categorize(days);
      var sendTo = row.customer
        ? '<span class="send-ok">' + escapeHtml(customerName(row.customer)) + '</span>'
        : '<span class="send-today">' + escapeHtml(t('alloc.sellToday')) + '</span>';
      var spare = row.slack != null ? '+' + fmt(row.slack) : '–';
      return '<tr class="row-' + (row.customer ? cat : 'red') + '">' +
        '<td>' + (i + 1) + '</td>' +
        '<td>' + escapeHtml(batchLabel(row.batch)) + '</td>' +
        '<td><span class="dot dot-' + cat + '"></span> ' + escapeHtml(t('alloc.daysShort', { d: fmt(days) })) + '</td>' +
        '<td>' + sendTo + '</td>' +
        '<td dir="ltr">' + spare + '</td>' +
        '</tr>';
    }).join('');

    var base = Alloc.naiveBaseline(valid, customers);
    summary.innerHTML = base.mismatches > 0
      ? t('alloc.summary', { x: base.mismatches, n: valid.length })
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
    var b = findById(batches, id);
    var c = findById(customers, id);
    if (b && field === 'product') b.product = e.target.value;
    if (b && field === 'days') b.days = e.target.value === '' ? NaN : parseFloat(e.target.value);
    if (c && field === 'name') { c.name = e.target.value; delete c.type; }
    if (c && field === 'need') c.need = parseFloat(e.target.value) || 0;
    renderAllocation();
  }

  function onListClick(e) {
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    var id = Number(btn.closest('.edit-row').dataset.id);
    if (btn.dataset.action === 'del-batch') batches = batches.filter(function (b) { return b.id !== id; });
    if (btn.dataset.action === 'del-customer') customers = customers.filter(function (c) { return c.id !== id; });
    renderLists();
    renderAllocation();
  }

  ['#batch-list', '#customer-list'].forEach(function (sel) {
    $(sel).addEventListener('input', onListInput);
    $(sel).addEventListener('change', onListInput);
    $(sel).addEventListener('click', onListClick);
  });

  $('#add-batch').addEventListener('click', function () {
    batches.push({ id: nextId++, product: 'tomato', days: 3 });
    renderLists(); renderAllocation();
    var inputs = document.querySelectorAll('#batch-list select');
    if (inputs.length) inputs[inputs.length - 1].focus();
  });
  $('#add-customer').addEventListener('click', function () {
    customers.push({ id: nextId++, name: t('cust.new'), need: 2 });
    renderLists(); renderAllocation();
    var inputs = document.querySelectorAll('#customer-list input[data-field="name"]');
    if (inputs.length) { inputs[inputs.length - 1].focus(); inputs[inputs.length - 1].select(); }
  });
  $('#add-from-demo').addEventListener('click', function () {
    if (!lastResult) return;
    batches.push({ id: nextId++, product: lastInput.product, days: lastResult.remainingDays });
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
