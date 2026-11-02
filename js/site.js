/* Southcoates Car Sales - Main Site JavaScript (vanilla, no jQuery) */
document.addEventListener('DOMContentLoaded', function() {
    // Header scroll behaviour
    var onScroll = function() {
        document.body.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Search toggle (offcanvas)
    var searchToggle = document.getElementById('searchToggle');
    if (searchToggle) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            var el = document.getElementById('offcanvasSearch');
            if (el && window.bootstrap) {
                var inst = bootstrap.Offcanvas.getInstance(el) || new bootstrap.Offcanvas(el);
                inst.show();
            }
        });
    }

    // Mobile bar: "Filter Results" jumps to the vehicle selector (or opens the search panel)
    var jumpFilters = document.querySelector('[data-jump-filters]');
    if (jumpFilters) {
        jumpFilters.addEventListener('click', function(e) {
            var target = document.getElementById('quickSearch') || document.getElementById('search-wrap');
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                var sel = target.querySelector('select');
                if (sel) {
                    setTimeout(function() { sel.focus({ preventScroll: true }); }, 500);
                }
            } else if (window.bootstrap && document.getElementById('offcanvasSearch')) {
                e.preventDefault();
                var el = document.getElementById('offcanvasSearch');
                var inst = bootstrap.Offcanvas.getInstance(el) || new bootstrap.Offcanvas(el);
                inst.show();
            }
        });
    }

    // Homepage hero background slideshow (assets/hero*.jpg, cross-fade every 2s)
    var heroEl = document.getElementById('hero');
    if (heroEl && heroEl.getAttribute('data-hero-slides')) {
        var heroSlides = null;
        try {
            heroSlides = JSON.parse(heroEl.getAttribute('data-hero-slides'));
        } catch (err) {
            heroSlides = null;
        }
        if (heroSlides && heroSlides.length > 1) {
            var heroSmall = window.matchMedia('(max-width: 991.98px)').matches;
            var heroSrc = function(src) {
                return heroSmall ? src.replace('-1920.webp', '-1280.webp') : src;
            };
            var heroLayers = [];
            for (var hl = 0; hl < 2; hl++) {
                var heroLayer = document.createElement('div');
                heroLayer.className = 'hero-slide';
                heroEl.appendChild(heroLayer);
                heroLayers.push(heroLayer);
            }
            heroLayers[0].style.backgroundImage = 'url("' + heroSrc(heroSlides[0]) + '")';
            heroLayers[0].classList.add('is-active');
            heroSlides.forEach(function(src) {
                var pre = new Image();
                pre.src = heroSrc(src);
            });
            var heroIndex = 0;
            var heroFront = 0;
            setInterval(function() {
                heroIndex = (heroIndex + 1) % heroSlides.length;
                var back = heroFront === 0 ? 1 : 0;
                heroLayers[back].style.backgroundImage = 'url("' + heroSrc(heroSlides[heroIndex]) + '")';
                heroLayers[back].classList.add('is-active');
                heroLayers[heroFront].classList.remove('is-active');
                heroFront = back;
            }, 2000);
        }
    }

    // Scroll to top
    var scrollTop = document.getElementById('scroll-to-top');
    if (scrollTop) {
        scrollTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Tooltips
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function(el) {
        if (window.bootstrap) new bootstrap.Tooltip(el);
    });

    // Cookie consent
    var banner = document.getElementById('cookie-consent-banner');
    function readConsent() {
        try { return JSON.parse(localStorage.getItem('consentMode') || 'null') || {}; }
        catch (e) { return {}; }
    }
    function hideBanner() { if (banner) banner.style.display = 'none'; }
    function writeConsent(obj) {
        try { localStorage.setItem('consentMode', JSON.stringify(obj)); } catch (e) {}
        hideBanner();
        notifyConsent(obj);
    }
    function notifyConsent(obj) {
        var ev = new CustomEvent('southcoates-consent', { detail: obj });
        document.dispatchEvent(ev);
    }
    var startDataLayer = function() { window.dataLayer = window.dataLayer || []; };

    if (banner) {
        banner.style.display = 'none';
        if (!localStorage.getItem('consentMode')) banner.style.display = '';
    }
    var acceptAll = document.getElementById('accept-all-cookies');
    if (acceptAll) {
        acceptAll.addEventListener('click', function() { writeConsent({ granted: true, analytics: true, preferences: true, marketing: true }); });
    }
    var rejectAll = document.getElementById('reject-all-cookies');
    if (rejectAll) {
        rejectAll.addEventListener('click', function() { writeConsent({ granted: false, analytics: false, preferences: false, marketing: false }); });
    }
    var acceptSome = document.getElementById('accept-some-cookies');
    if (acceptSome) {
        acceptSome.addEventListener('click', function() {
            var analytics = !!(document.getElementById('consent-analytics') && document.getElementById('consent-analytics').checked);
            var preferences = !!(document.getElementById('consent-preferences') && document.getElementById('consent-preferences').checked);
            var marketing = !!(document.getElementById('consent-marketing') && document.getElementById('consent-marketing').checked);
            writeConsent({ granted: analytics || preferences || marketing, analytics: analytics, preferences: preferences, marketing: marketing });
        });
    }
    var showCookie = document.getElementById('show-cookie-popup');
    if (showCookie) {
        showCookie.addEventListener('click', function(e) { e.preventDefault(); if (banner) banner.style.display = ''; });
    }

    // Consent-gated analytics load (mirrors the head loader for headless/edge cases)
    var consent = readConsent();
    startDataLayer();

    // Swipers - only initialised when the elements + library both exist
    function initSwiper(selector, opts) {
        var el = document.querySelector(selector);
        if (el && window.Swiper) return new Swiper(el, opts);
        return null;
    }

    initSwiper('.hero-caption.swiper', {
        speed: 1000, loop: true, grabCursor: true,
        autoplay: { delay: 5000, disableOnInteraction: false },
        effect: 'fade', fadeEffect: { crossFade: true }
    });

    initSwiper('#stock-scroller.swiper', {
        speed: 1000, loop: true, grabCursor: true, spaceBetween: 15, slidesPerView: 1.15,
        autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
        navigation: { nextEl: '#stock-scroller .swiper-button-next', prevEl: '#stock-scroller .swiper-button-prev' },
        breakpoints: { 576: { slidesPerView: 2.15 }, 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }
    });

    initSwiper('#review-scroller.swiper', {
        speed: 1000, loop: true, grabCursor: true, spaceBetween: 15, slidesPerView: 1,
        autoplay: { delay: 6000, disableOnInteraction: false },
        navigation: { nextEl: '#review-scroller .swiper-button-next', prevEl: '#review-scroller .swiper-button-prev' },
        breakpoints: { 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }
    });

    // LazyLoad - images marked with class "lazyload" and data-src
    if (window.LazyLoad) {
        var ll = new LazyLoad({ elements_selector: '.lazyload', class_loaded: 'lazyloaded', threshold: 300 });
        setTimeout(function() { ll.update(); }, 200);
    }

    // Dependent model dropdowns (header search / mobile filters)
    var mmJson = document.getElementById('makes-models-json');
    var mmMap = {};
    if (mmJson) {
        try { mmMap = JSON.parse(mmJson.textContent) || {}; } catch (e) { mmMap = {}; }
    }
    function modelsHaveNoOptions(sel) {
        var opts = sel.querySelectorAll('option');
        for (var i = 0; i < opts.length; i++) {
            if (opts[i].value !== '') return false;
        }
        return true;
    }
    document.querySelectorAll('.search-form').forEach(function(form) {
        var makeSel = form.querySelector('select[name="make"]');
        var modelSel = form.querySelector('select[name="model"]');
        if (!makeSel || !modelSel) return;
        var stockOption = modelSel.querySelector('option[value=""]') || null;
        var params = new URLSearchParams(window.location.search);
        var applyModels = function() {
            var m = makeSel.value;
            var models = (mmMap[m] || []);
            modelSel.innerHTML = '';
            if (stockOption) modelSel.appendChild(stockOption.cloneNode(true));
            var currentMake = params.get('make') || '';
            var current = params.get('model');
            models.forEach(function(c) {
                var opt = document.createElement('option');
                opt.value = c;
                opt.textContent = c;
                if (current === c && m === currentMake) opt.selected = true;
                modelSel.appendChild(opt);
            });
        };
        if (makeSel.selectedIndex === 0 && modelsHaveNoOptions(modelSel)) applyModels();
        makeSel.addEventListener('change', applyModels);
    });

    // reCAPTCHA v3 - inject token into every POST form before submit
    var rcKey = document.documentElement.getAttribute('data-recaptcha-key') || '';
    if (rcKey) {
        var rcLoaded = false;
        function loadRecaptcha() {
            if (rcLoaded || window.grecaptcha || document.querySelector('script[src*="recaptcha/api.js"]')) return;
            rcLoaded = true;
            var s = document.createElement('script');
            s.async = true;
            s.src = 'https://www.google.com/recaptcha/api.js?render=' + rcKey;
            document.head.appendChild(s);
        }
        document.querySelectorAll('form[method="post"]').forEach(function(form) {
            form.addEventListener('submit', function(e) {
                var btn = form.querySelector('button[type="submit"]');
                if (btn) btn.disabled = true;
                e.preventDefault();
                var f = form;
                loadRecaptcha();
                // Give the reCAPTCHA library a moment to arrive. If it never does
                // (blocked, offline, slow) submit anyway - reloading the page here
                // threw away everything the visitor had typed.
                var waited = 0;
                (function whenRecaptchaReady() {
                    if (window.grecaptcha) {
                        window.grecaptcha.ready(function() {
                            window.grecaptcha.execute(rcKey, { action: 'form_submit' }).then(function(token) {
                                var inp = f.querySelector('input[name="g-recaptcha-response"]');
                                if (!inp) {
                                    inp = document.createElement('input');
                                    inp.type = 'hidden';
                                    inp.name = 'g-recaptcha-response';
                                    f.appendChild(inp);
                                }
                                inp.value = token;
                                if (btn) btn.disabled = false;
                                HTMLFormElement.prototype.submit.call(f);
                            }).catch(function() {
                                if (btn) btn.disabled = false;
                                HTMLFormElement.prototype.submit.call(f);
                            });
                        });
                        return;
                    }
                    if (waited >= 3000) {
                        if (btn) btn.disabled = false;
                        HTMLFormElement.prototype.submit.call(f);
                        return;
                    }
                    waited += 500;
                    window.setTimeout(whenRecaptchaReady, 500);
                })();
            });
        });
        var firstField = document.querySelector('form[method="post"] input, form[method="post"] textarea, form[method="post"] select');
        if (firstField) firstField.addEventListener('focus', loadRecaptcha, { once: true });
    }
});