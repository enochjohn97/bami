(function () {
  "use strict";

  /* Header scroll state */
  var header = document.getElementById("siteHeader");
  var toTop = document.getElementById("toTop");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle("scrolled", y > 40);
    toTop.classList.toggle("show", y > 700);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* Mobile nav toggle */
  var navToggle = document.getElementById("navToggle");
  var primaryNav = document.getElementById("primaryNav");

  function updateNavToggleAria() {
    var isOpen = primaryNav.classList.contains("open");
    navToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu",
    );
  }

  navToggle.addEventListener("click", function () {
    var open = primaryNav.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
    updateNavToggleAria();
  });
  document.querySelectorAll("[data-nav]").forEach(function (a) {
    a.addEventListener("click", function () {
      primaryNav.classList.remove("open");
      navToggle.classList.remove("open");
      document.body.style.overflow = "";
      updateNavToggleAria();
    });
  });
  updateNavToggleAria();

  /* Scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  /* Animated counters */
  var counters = document.querySelectorAll("[data-count]");

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1400;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var val = Math.round(target * eased);
      el.textContent = val + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 },
    );
    counters.forEach(function (el) {
      cio.observe(el);
    });
  }

  /* Palm field rows in hero SVG */
  var palmField = document.getElementById("palmField");
  if (palmField) {
    var rows = [
      { y: 330, count: 9, scale: 0.16, colorA: "#1B5C44", colorB: "#134B37" },
      { y: 300, count: 8, scale: 0.13, colorA: "#134B37", colorB: "#0E3A2B" },
      { y: 275, count: 7, scale: 0.1, colorA: "#0E3A2B", colorB: "#134B37" },
    ];
    var svgHtml = "";
    rows.forEach(function (row, ri) {
      for (var i = 0; i < row.count; i++) {
        var x = 60 + i * (400 / row.count) + (ri % 2 === 0 ? 10 : 0);
        svgHtml +=
          '<g transform="translate(' +
          x +
          "," +
          row.y +
          ") scale(" +
          row.scale +
          ')">' +
          '<rect x="-6" y="-140" width="12" height="140" rx="6" fill="#0E3A2B"/>' +
          '<path d="M0 -140 C -70 -160 -110 -120 -130 -80 C -80 -100 -40 -110 0 -140" fill="' +
          row.colorA +
          '"/>' +
          '<path d="M0 -140 C 70 -160 110 -120 130 -80 C 80 -100 40 -110 0 -140" fill="' +
          row.colorA +
          '"/>' +
          '<path d="M0 -140 C -50 -180 -20 -210 0 -230 C 20 -210 50 -180 0 -140" fill="' +
          row.colorB +
          '"/>' +
          "</g>";
      }
    });
    palmField.innerHTML = svgHtml;
  }

  /* Truck driving animation */
  var truck = document.getElementById("truck");
  if (truck) {
    var tx = 0,
      dir = 1;

    function driveTruck() {
      tx += dir * 0.35;
      if (tx > 60) dir = -1;
      if (tx < 0) dir = 1;
      truck.setAttribute("transform", "translate(" + (70 + tx) + ",455)");
      requestAnimationFrame(driveTruck);
    }
    requestAnimationFrame(driveTruck);
  }

  /* Gentle palm sway on hero */
  var centerPalm = document.querySelector("#centerPalm .frond-group");
  if (centerPalm) {
    var t0 = performance.now();

    function sway(now) {
      var t = (now - t0) / 1000;
      var angle = Math.sin(t * 0.8) * 2.2;
      centerPalm.setAttribute("transform", "rotate(" + angle + " 0 -140)");
      requestAnimationFrame(sway);
    }
    requestAnimationFrame(sway);
  }

  /* ---------------- Growth journey scrollytelling ---------------- */
  var journeySection = document.getElementById("journey");
  var journeyTrack = document.getElementById("journeyTrack");
  var journeyFill = document.getElementById("journeyFill");
  var growthPlant = document.getElementById("growthPlant");
  var stages = journeyTrack
    ? journeyTrack.querySelectorAll(".journey-stage")
    : [];

  var plantStages = [
    '<g><rect x="-2" y="-14" width="4" height="14" fill="#134B37"/><path d="M0 -14 C -10 -20 -12 -8 -6 -4" fill="#1B5C44"/><path d="M0 -14 C 10 -20 12 -8 6 -4" fill="#1B5C44"/></g>',
    '<g><rect x="-3" y="-40" width="6" height="40" rx="3" fill="#134B37"/><path d="M0 -40 C -22 -50 -30 -30 -20 -18 C -10 -26 -4 -32 0 -40" fill="#1B5C44"/><path d="M0 -40 C 22 -50 30 -30 20 -18 C 10 -26 4 -32 0 -40" fill="#1B5C44"/></g>',
    '<g><rect x="-4" y="-72" width="8" height="72" rx="4" fill="#0E3A2B"/>' +
      '<path d="M0 -72 C -40 -90 -60 -55 -50 -30 C -30 -45 -12 -55 0 -72" fill="#1B5C44"/>' +
      '<path d="M0 -72 C 40 -90 60 -55 50 -30 C 30 -45 12 -55 0 -72" fill="#1B5C44"/>' +
      '<path d="M0 -72 C -25 -100 -8 -115 0 -125 C 8 -115 25 -100 0 -72" fill="#134B37"/></g>',
    '<g><rect x="-5" y="-100" width="10" height="100" rx="5" fill="#0E3A2B"/>' +
      '<path d="M0 -100 C -55 -120 -85 -80 -72 -48 C -46 -66 -18 -80 0 -100" fill="#1B5C44"/>' +
      '<path d="M0 -100 C 55 -120 85 -80 72 -48 C 46 -66 18 -80 0 -100" fill="#1B5C44"/>' +
      '<path d="M0 -100 C -34 -140 -12 -160 0 -172 C 12 -160 34 -140 0 -100" fill="#134B37"/>' +
      '<circle cx="0" cy="-96" r="7" fill="#A9271F"/></g>',
    '<g><rect x="-6" y="-135" width="12" height="135" rx="6" fill="#0E3A2B"/>' +
      '<path d="M0 -135 C -68 -155 -105 -110 -95 -70 C -60 -92 -25 -108 0 -135" fill="#1B5C44"/>' +
      '<path d="M0 -135 C 68 -155 105 -110 95 -70 C 60 -92 25 -108 0 -135" fill="#1B5C44"/>' +
      '<path d="M0 -135 C -46 -185 -16 -210 0 -225 C 16 -210 46 -185 0 -135" fill="#134B37"/>' +
      '<path d="M0 -135 C -85 -145 -120 -105 -140 -55 C -90 -85 -42 -95 0 -135" fill="#0E3A2B"/>' +
      '<path d="M0 -135 C 85 -145 120 -105 140 -55 C 90 -85 42 -95 0 -135" fill="#0E3A2B"/>' +
      '<circle cx="0" cy="-132" r="11" fill="#8C1E1E"/><circle cx="9" cy="-122" r="9" fill="#A9271F"/><circle cx="-9" cy="-122" r="9" fill="#A9271F"/></g>',
    '<g><rect x="-6" y="-138" width="12" height="138" rx="6" fill="#0E3A2B"/>' +
      '<path d="M0 -138 C -70 -160 -108 -112 -98 -70 C -62 -94 -26 -110 0 -138" fill="#1B5C44"/>' +
      '<path d="M0 -138 C 70 -160 108 -112 98 -70 C 62 -94 26 -110 0 -138" fill="#1B5C44"/>' +
      '<path d="M0 -138 C -48 -190 -16 -216 0 -232 C 16 -216 48 -190 0 -138" fill="#134B37"/>' +
      '<path d="M0 -138 C -88 -148 -124 -108 -146 -56 C -94 -88 -44 -98 0 -138" fill="#0E3A2B"/>' +
      '<path d="M0 -138 C 88 -148 124 -108 146 -56 C 94 -88 44 -98 0 -138" fill="#0E3A2B"/>' +
      '<circle cx="0" cy="-135" r="12" fill="#8C1E1E"/><circle cx="10" cy="-124" r="10" fill="#A9271F"/><circle cx="-10" cy="-124" r="10" fill="#A9271F"/><circle cx="0" cy="-112" r="9" fill="#C1361F"/></g>',
  ];

  var currentStage = -1;

  function setStage(idx) {
    if (idx === currentStage || !growthPlant) return;
    currentStage = idx;
    growthPlant.innerHTML = plantStages[idx];
    growthPlant.style.opacity = 0;
    requestAnimationFrame(function () {
      growthPlant.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      growthPlant.style.opacity = 1;
    });
    stages.forEach(function (s) {
      s.classList.toggle(
        "active",
        parseInt(s.getAttribute("data-stage"), 10) === idx,
      );
    });
  }

  function updateJourney() {
    if (!journeySection) return;
    var rect = journeySection.getBoundingClientRect();
    var vh = window.innerHeight;
    var total = rect.height - vh;
    var scrolled = -rect.top;
    var progress = total > 0 ? Math.min(Math.max(scrolled / total, 0), 1) : 0;
    journeyFill.style.width = progress * 100 + "%";
    var idx = Math.min(5, Math.floor(progress * 6));
    if (rect.top > 0) idx = 0;
    setStage(idx);
  }
  document.addEventListener("scroll", updateJourney, { passive: true });
  window.addEventListener("resize", updateJourney);
  updateJourney();

  /* ---------------- Investment Returns Calculator ---------------- */
  function formatNaira(num) {
    return "₦" + num.toLocaleString("en-NG");
  }

  function updateCalculator() {
    var trees = parseInt(document.getElementById("treeCount").value, 10);
    var bunches = parseInt(document.getElementById("bunchesPerTree").value, 10);
    var bunchKg = parseInt(document.getElementById("bunchWeight").value, 10);
    var extraction = parseFloat(
      document.getElementById("extractionRate").value,
    );
    var pricePerGallon = parseInt(
      document.getElementById("pricePerGallon").value,
      10,
    );
    var costPerTree = parseInt(
      document.getElementById("costPerTree").value,
      10,
    );

    document.getElementById("treeCountVal").textContent = trees;
    document.getElementById("bunchesPerTreeVal").textContent = bunches;
    document.getElementById("bunchWeightVal").textContent = bunchKg;
    document.getElementById("extractionRateVal").textContent = extraction;
    document.getElementById("pricePerGallonVal").textContent =
      formatNaira(pricePerGallon);
    document.getElementById("costPerTreeVal").textContent =
      formatNaira(costPerTree);

    var totalFFBtons = (trees * bunches * bunchKg) / 1000;
    var cpoLitres = totalFFBtons * extraction * 10;
    var gallons20L = cpoLitres / 20;
    var revenue = gallons20L * pricePerGallon;
    var annualCost = trees * costPerTree;
    var netProfit = revenue - annualCost;

    document.getElementById("ffbTotal").textContent = totalFFBtons.toFixed(1);
    document.getElementById("cpoLitres").textContent =
      Math.round(cpoLitres).toLocaleString();
    document.getElementById("gallons20L").textContent =
      Math.round(gallons20L).toLocaleString();
    document.getElementById("revenue").textContent = formatNaira(
      Math.round(revenue),
    );
    document.getElementById("annualCost").textContent = formatNaira(
      Math.round(annualCost),
    );
    document.getElementById("netProfit").textContent = formatNaira(
      Math.round(netProfit),
    );
  }

  var calcInputs = document.querySelectorAll('#returns input[type="range"]');
  if (calcInputs.length) {
    calcInputs.forEach(function (input) {
      input.addEventListener("input", updateCalculator);
    });
    updateCalculator();
  }
})();
