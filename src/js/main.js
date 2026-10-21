/* MX-5 Mk4 Trophy
   Everything here is progressive: the page reads correctly with JS switched
   off. This only sharpens it, mainly by working out which round is next
   straight from the calendar markup so nothing has to be edited by hand. */

(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var DAY = 86400000;

  function midnight(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  }

  function parseISO(s) {
    var p = String(s || '').split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }

  /* ---------------------------------------------------------- mobile nav */
  var burger = document.querySelector('.nav__burger');
  var navList = document.getElementById('nav-list');

  if (burger && navList) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      navList.setAttribute('data-open', String(!open));
    });

    navList.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        burger.setAttribute('aria-expanded', 'false');
        navList.setAttribute('data-open', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        burger.setAttribute('aria-expanded', 'false');
        navList.setAttribute('data-open', 'false');
        burger.focus();
      }
    });
  }

  /* --------------------------------------------------- season state ---- */
  var rows = Array.prototype.slice.call(
    document.querySelectorAll('[data-calendar] .cal__row')
  );

  if (rows.length) {
    var today = midnight(new Date());
    var total = rows.length;
    var nextRow = null;
    var completed = 0;

    rows.forEach(function (row) {
      var start = midnight(parseISO(row.getAttribute('data-start')));
      var end = midnight(parseISO(row.getAttribute('data-end') || row.getAttribute('data-start')));
      var pill = row.querySelector('[data-status]');

      row.classList.remove('is-done', 'is-next');

      if (end < today) {
        completed += 1;
        row.classList.add('is-done');
        if (pill) pill.textContent = 'Results';
      } else if (!nextRow) {
        nextRow = row;
        row.classList.add('is-next');
        if (pill) {
          pill.textContent = start <= today ? 'Racing now' : 'Next up';
        }
      } else if (pill) {
        pill.textContent = row.hasAttribute('data-finale') ? 'Finale' : 'Upcoming';
      }
    });

    /* --------------------------------------------------- hero next card */
    var card = document.querySelector('[data-next-card]');

    if (card) {
      var elLabel = card.querySelector('[data-next-label]');
      var elCount = card.querySelector('[data-next-count]');
      var elCircuit = card.querySelector('[data-next-circuit]');
      var elDate = card.querySelector('[data-next-date]');
      var elIndex = card.querySelector('[data-next-index]');

      if (nextRow) {
        var round = nextRow.getAttribute('data-round');
        var start2 = parseISO(nextRow.getAttribute('data-start'));
        var end2 = parseISO(nextRow.getAttribute('data-end') || nextRow.getAttribute('data-start'));
        var days = Math.round((midnight(start2) - today) / DAY);

        if (elLabel) elLabel.textContent = 'Next round · R' + round;
        if (elCircuit) elCircuit.textContent = nextRow.querySelector('.cal__ct').textContent;
        if (elDate) elDate.textContent = formatSpan(start2, end2);
        if (elIndex) elIndex.textContent = round + '/' + total;

        if (elCount) {
          elCount.hidden = false;
          if (days <= 0) elCount.textContent = 'Racing now';
          else if (days === 1) elCount.textContent = 'Tomorrow';
          else elCount.textContent = days + ' days';
        }
      } else {
        if (elLabel) elLabel.textContent = 'Season complete';
        if (elCircuit) elCircuit.textContent = 'That is 2026';
        if (elDate) elDate.textContent = 'The 2027 calendar lands soon';
        if (elIndex) elIndex.textContent = total + '/' + total;
        if (elCount) elCount.hidden = true;
      }
    }

    /* ---------------------------------------------- standings sub-head */
    // The standings heading is driven by standings.js now, not the calendar,
    // because the two can legitimately disagree: the calendar is the
    // SuperCup's, the standings are the Trophy's.
    var after = document.querySelector('[data-standings-after]');
    if (after) {
      after.textContent = completed
        ? 'After ' + completed + ' of ' + total + ' rounds'
        : 'Season opens soon';
    }

    /* The ticker carries the car specification, set in the template from
       car.js, so nothing here rewrites it. */
  }

  function formatSpan(start, end) {
    var month = { month: 'long' };
    var wd = { weekday: 'short' };
    var sameDay = start.getTime() === end.getTime();

    if (sameDay) {
      return start.toLocaleDateString('en-GB', wd) + ' ' + start.getDate() +
             ' ' + start.toLocaleDateString('en-GB', month);
    }
    return start.toLocaleDateString('en-GB', wd) + ' ' + start.getDate() +
           ' to ' + end.toLocaleDateString('en-GB', wd) + ' ' + end.getDate() +
           ' ' + end.toLocaleDateString('en-GB', month);
  }

  /* ------------------------------------------------------------ reveals */
  var reveals = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    Array.prototype.forEach.call(reveals, function (el) {
      el.classList.add('is-in');
    });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
  }

  /* --------------------------------------------------------------- year */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
}());

/* News index: client-side category chips and search.
   Everything is rendered server side, so this only narrows what is already
   on the page. With JS off you get the full list, which is the right
   fallback. */
(function () {
  'use strict';

  var grid = document.querySelector('[data-news-grid]');
  if (!grid) return;

  var posts = Array.prototype.slice.call(document.querySelectorAll('[data-post]'));
  var chips = Array.prototype.slice.call(document.querySelectorAll('[data-cat]'));
  var search = document.querySelector('[data-news-search]');
  var count = document.querySelector('[data-result-count]');
  var empty = document.querySelector('[data-news-empty]');
  var reset = document.querySelector('[data-news-reset]');

  var cat = 'all';
  var term = '';

  function apply() {
    var shown = 0;

    posts.forEach(function (post) {
      var haystack = (
        (post.getAttribute('data-title') || '') + ' ' +
        (post.getAttribute('data-excerpt') || '') + ' ' +
        (post.getAttribute('data-cat') || '')
      ).toLowerCase();

      var matchCat = cat === 'all' || post.getAttribute('data-cat') === cat;
      var matchTerm = !term || haystack.indexOf(term) !== -1;
      var on = matchCat && matchTerm;

      post.hidden = !on;
      if (on) shown += 1;
    });

    if (count) count.textContent = String(shown);
    if (empty) empty.hidden = shown !== 0;
  }

  chips.forEach(function (chip) {
    if (chip.tagName !== 'BUTTON') return;
    chip.addEventListener('click', function () {
      cat = chip.getAttribute('data-cat');
      chips.forEach(function (c) {
        if (c.tagName === 'BUTTON') c.classList.toggle('is-on', c === chip);
      });
      apply();
    });
  });

  if (search) {
    search.addEventListener('input', function () {
      term = search.value.trim().toLowerCase();
      apply();
    });
  }

  if (reset) {
    reset.addEventListener('click', function () {
      cat = 'all';
      term = '';
      if (search) search.value = '';
      chips.forEach(function (c) {
        if (c.tagName === 'BUTTON') c.classList.toggle('is-on', c.getAttribute('data-cat') === 'all');
      });
      apply();
    });
  }
}());
