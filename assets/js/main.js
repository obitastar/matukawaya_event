/**
 * 松川屋 着物展示会LP - メインスクリプト
 * Vanilla JS / フレームワーク不使用
 */
(function () {
  'use strict';

  console.log('[まつかわや LP] main.js v20260507 loaded');

  // =========================================================
  // ユーティリティ
  // =========================================================

  /** reduced-motion が有効かどうか */
  function prefersReducedMotion() {
    var result = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (result) console.log('[まつかわや LP] reduced-motion が有効です。アニメーションを簡略化します。');
    return result;
  }

  // =========================================================
  // 1. スクロール時のヘッダー背景変化
  // =========================================================
  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    var THRESHOLD = 50;

    window.addEventListener('scroll', function () {
      if (window.scrollY >= THRESHOLD) {
        header.classList.add('site-header--scrolled');
      } else {
        header.classList.remove('site-header--scrolled');
      }
    }, { passive: true });
  }

  // =========================================================
  // 2. モバイル固定下部CTAバーの表示制御
  //    FVセクション (#section-01) が画面外に出たら表示
  // =========================================================
  function initMobileCtaBar() {
    var ctaBar = document.querySelector('.mobile-cta-bar');
    var fvSection = document.getElementById('section-01');
    if (!ctaBar || !fvSection) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        // FV が画面内にある → 非表示 / 画面外 → 表示
        if (entry.isIntersecting) {
          ctaBar.classList.remove('mobile-cta-bar--visible');
        } else {
          ctaBar.classList.add('mobile-cta-bar--visible');
        }
      });
    }, {
      threshold: 0
    });

    observer.observe(fvSection);
  }

  // =========================================================
  // 3. スクロール時フェードイン + 方向別アニメーション
  // =========================================================
  function initFadeIn() {
    var selectors = '.fade-in, .fade-in-left, .fade-in-right, .reveal-image';
    var fadeEls = document.querySelectorAll(selectors);
    if (!fadeEls.length) return;

    // reduced-motion が有効なら即座に全て表示
    if (prefersReducedMotion()) {
      fadeEls.forEach(function (el) {
        if (el.classList.contains('fade-in')) el.classList.add('fade-in--visible');
        if (el.classList.contains('fade-in-left')) el.classList.add('fade-in-left--visible');
        if (el.classList.contains('fade-in-right')) el.classList.add('fade-in-right--visible');
        if (el.classList.contains('reveal-image')) el.classList.add('reveal-image--visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          if (el.classList.contains('fade-in')) el.classList.add('fade-in--visible');
          if (el.classList.contains('fade-in-left')) el.classList.add('fade-in-left--visible');
          if (el.classList.contains('fade-in-right')) el.classList.add('fade-in-right--visible');
          if (el.classList.contains('reveal-image')) el.classList.add('reveal-image--visible');
          obs.unobserve(el);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    fadeEls.forEach(function (el) {
      // 三つの名前カード内は専用関数で制御するので除外
      if (el.closest('.three-card')) return;
      observer.observe(el);
    });
  }

  // =========================================================
  // 3b. 数字カウントアップアニメーション
  // =========================================================
  function initCountUp() {
    var counters = document.querySelectorAll('.count-up');
    if (!counters.length) return;

    if (prefersReducedMotion()) {
      counters.forEach(function (el) {
        el.textContent = el.getAttribute('data-target');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          if (el.getAttribute('data-counted')) return;
          el.setAttribute('data-counted', 'true');

          var target = parseInt(el.getAttribute('data-target'), 10);
          var duration = 2200;
          var startTime = null;

          function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            // ease-out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = target;
            }
          }

          // 少し遅延させて画像リビールの後にカウント開始
          setTimeout(function () {
            requestAnimationFrame(step);
          }, 400);

          obs.unobserve(el);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    counters.forEach(function (el) {
      // 三つの名前カード内は専用関数で制御するので除外
      if (el.closest('.three-card')) return;
      observer.observe(el);
    });
  }

  // =========================================================
  // 3c. 三つの名前カード — 画像リビール + カウントアップ + テキスト
  //     全演出を1つのObserverで制御
  // =========================================================
  function initThreeCardsStagger() {
    var container = document.querySelector('.three-cards');
    if (!container) return;
    var cards = container.querySelectorAll('.three-card');
    if (!cards.length) return;

    if (prefersReducedMotion()) {
      cards.forEach(function (card) {
        var ri = card.querySelector('.reveal-image');
        var fb = card.querySelector('.three-card__body');
        var cu = card.querySelector('.count-up');
        if (ri) ri.classList.add('reveal-image--visible');
        if (fb) fb.classList.add('fade-in--visible');
        if (cu) cu.textContent = cu.getAttribute('data-target');
      });
      return;
    }

    function animateCount(el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var duration = 2200;
      var startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var p = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);

        // 全カードを順番にアニメーション
        cards.forEach(function (card, i) {
          var delay = i * 400;

          // 1) 画像カーテンリビール
          setTimeout(function () {
            var ri = card.querySelector('.reveal-image');
            if (ri) ri.classList.add('reveal-image--visible');
          }, delay);

          // 2) テキストフェードイン（画像の600ms後）
          setTimeout(function () {
            var fb = card.querySelector('.three-card__body');
            if (fb) fb.classList.add('fade-in--visible');
          }, delay + 600);

          // 3) カウントアップ（テキスト表示の200ms後）
          setTimeout(function () {
            var cu = card.querySelector('.count-up');
            if (cu) animateCount(cu);
          }, delay + 800);
        });
      });
    }, {
      threshold: 0.1
    });

    // コンテナ全体を1回だけ監視
    observer.observe(container);
  }

  // =========================================================
  // 3d. パララックススクロール
  // =========================================================
  function initParallax() {
    var parallaxEls = document.querySelectorAll('.parallax-img');
    if (!parallaxEls.length || prefersReducedMotion()) return;

    function updateParallax() {
      parallaxEls.forEach(function (el) {
        var parent = el.closest('.venue-hero') || el.parentElement;
        var rect = parent.getBoundingClientRect();
        var windowH = window.innerHeight;

        // 画面内にあるときだけ計算
        if (rect.bottom > 0 && rect.top < windowH) {
          var scrollRatio = (rect.top + rect.height / 2 - windowH / 2) / windowH;
          var translateY = scrollRatio * -40;
          el.style.transform = 'translateY(' + translateY + 'px)';
        }
      });
    }

    window.addEventListener('scroll', function () {
      requestAnimationFrame(updateParallax);
    }, { passive: true });

    updateParallax();
  }

  // =========================================================
  // 4. スムーズスクロール
  //    scroll-padding-top は CSS 側で設定済みの前提
  // =========================================================
  function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');
    if (!anchors.length) return;

    anchors.forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;

        var targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // =========================================================
  // 5. フォームバリデーション
  // =========================================================
  function initFormValidation() {
    var form = document.querySelector('.reservation-form');
    if (!form) return;

    var submitBtn = form.querySelector('.form-submit');
    var privacyCheckbox = document.getElementById('privacy-agree');

    // --- カスタムバリデーションメッセージ設定 ---
    var validationMessages = {
      name: 'お名前を入力してください',
      tel: '電話番号を入力してください',
      date: 'ご来場希望日を選択してください'
    };

    // 各フィールドに日本語メッセージを設定
    Object.keys(validationMessages).forEach(function (fieldName) {
      var field = form.querySelector('[name="' + fieldName + '"]');
      if (!field) return;

      field.addEventListener('invalid', function () {
        this.setCustomValidity(validationMessages[fieldName]);
      });
      // 入力開始時にリセット（再チェック時に正しく判定させるため）
      field.addEventListener('input', function () {
        this.setCustomValidity('');
      });
    });

    // --- プライバシーポリシー同意チェックボックス ---
    if (privacyCheckbox && submitBtn) {
      // 初期状態: チェックなし → disabled
      submitBtn.disabled = !privacyCheckbox.checked;

      privacyCheckbox.addEventListener('change', function () {
        submitBtn.disabled = !this.checked;
      });
    }

    // --- フォーム送信処理 ---
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // HTML5 バリデーション
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // 電話番号の簡易チェック
      var telField = form.querySelector('[name="tel"]');
      if (telField && telField.value) {
        var telPattern = /^[0-9\-]+$/;
        if (!telPattern.test(telField.value)) {
          telField.setCustomValidity('電話番号は数字とハイフンのみ使用できます');
          form.reportValidity();
          return;
        }
      }

      // 計測イベント出力
      console.log('[計測イベント] reservation_submit', {
        event: 'reservation_submit',
        timestamp: new Date().toISOString()
      });

      // 送信中のUI
      if (submitBtn) {
        submitBtn.textContent = '送信中...';
        submitBtn.disabled = true;
      }

      // PHP へ AJAX 送信
      var formData = new FormData(form);
      fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      })
      .then(function (response) {
        return response.json().then(function (data) {
          data._status = response.ok;
          return data;
        });
      })
      .then(function (data) {
        if (data._status && data.success) {
          if (submitBtn) submitBtn.textContent = '送信しました';
          form.reset();
          if (submitBtn) submitBtn.disabled = true;
        } else {
          throw new Error(data.message || '送信に失敗しました');
        }
      })
      .catch(function (err) {
        if (submitBtn) {
          submitBtn.textContent = err.message || '送信に失敗しました';
          setTimeout(function () {
            submitBtn.textContent = '予約を送信する';
            if (privacyCheckbox) {
              submitBtn.disabled = !privacyCheckbox.checked;
            } else {
              submitBtn.disabled = false;
            }
          }, 3000);
        }
      });
    });
  }

  // =========================================================
  // 6. FVロゴイントロアニメーション
  //    ロゴ表示 → ゴールドライン → タグライン → フェードアウト
  //    → 背景画像リビール → コンテンツ順次表示
  // =========================================================
  function initFvIntro() {
    var intro = document.getElementById('fv-intro');
    var fvBg = document.querySelector('.fv-bg');
    var fvAnims = document.querySelectorAll('.fv-anim');

    // reduced-motion: 即座に全表示
    if (prefersReducedMotion()) {
      if (intro) intro.style.display = 'none';
      if (fvBg) { fvBg.style.opacity = '1'; fvBg.style.transform = 'scale(1)'; }
      fvAnims.forEach(function (el) { el.classList.add('fv-anim--visible'); });
      return;
    }

    if (!intro) return;

    // ロゴ + ライン + タグライン表示後、3秒でイントロをフェードアウト
    setTimeout(function () {
      intro.classList.add('fv-intro--fade-out');

      // 背景画像を劇的にリビール
      if (fvBg) fvBg.classList.add('fv-bg--reveal');

      // コンテンツを映画的に順次表示（間隔を広めに）
      setTimeout(function () {
        fvAnims.forEach(function (el, i) {
          setTimeout(function () {
            el.classList.add('fv-anim--visible');
          }, i * 350);
        });
      }, 1200);
    }, 3000);
  }

  // =========================================================
  // 8. トップへ戻るボタン
  //    スクロール 300px 以上で表示、クリックでスムーズスクロール
  // =========================================================
  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;

    var THRESHOLD = 300;

    window.addEventListener('scroll', function () {
      if (window.scrollY >= THRESHOLD) {
        btn.classList.add('back-to-top--visible');
      } else {
        btn.classList.remove('back-to-top--visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================
  // 7. スクロールインジケーターの非表示
  //    スクロール量 100px 以上で opacity: 0
  // =========================================================
  function initScrollIndicator() {
    var indicator = document.querySelector('.fv-scroll-indicator');
    if (!indicator) return;

    var THRESHOLD = 100;

    window.addEventListener('scroll', function () {
      if (window.scrollY >= THRESHOLD) {
        indicator.style.opacity = '0';
      } else {
        indicator.style.opacity = '';
      }
    }, { passive: true });
  }

  // =========================================================
  // 9. 会場ギャラリー（ボタンナビゲーション）
  // =========================================================
  function initVenueGallery() {
    var track = document.getElementById('venue-gallery-track');
    var prevBtn = document.getElementById('gallery-prev');
    var nextBtn = document.getElementById('gallery-next');
    var counter = document.getElementById('venue-gallery-counter');
    if (!track || !prevBtn || !nextBtn) return;

    var images = track.querySelectorAll('.venue-gallery__img');
    var total = images.length;
    var current = 0;

    function updateGallery() {
      var img = images[current];
      var offset = img.offsetLeft;
      track.style.transform = 'translateX(-' + offset + 'px)';
      if (counter) counter.textContent = (current + 1) + ' / ' + total;
      prevBtn.disabled = (current === 0);
      nextBtn.disabled = (current === total - 1);
    }

    prevBtn.addEventListener('click', function () {
      if (current > 0) { current--; updateGallery(); }
    });

    nextBtn.addEventListener('click', function () {
      if (current < total - 1) { current++; updateGallery(); }
    });

    // スワイプ対応
    var startX = 0;
    var isDragging = false;

    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      if (!isDragging) return;
      isDragging = false;
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0 && current < total - 1) { current++; updateGallery(); }
        else if (diff < 0 && current > 0) { current--; updateGallery(); }
      }
    }, { passive: true });

    updateGallery();
  }

  // =========================================================
  // 初期化
  // =========================================================
  document.addEventListener('DOMContentLoaded', function () {
    initHeaderScroll();
    initMobileCtaBar();
    initFadeIn();
    initCountUp();
    initThreeCardsStagger();
    initParallax();
    initSmoothScroll();
    initFormValidation();
    initFvIntro();
    initScrollIndicator();
    initBackToTop();
    initVenueGallery();
    initNishiharaGallery();
  });

  function initNishiharaGallery() {
    var track = document.getElementById('nishihara-gallery-track');
    var prevBtn = document.getElementById('nishihara-prev');
    var nextBtn = document.getElementById('nishihara-next');
    var counter = document.getElementById('nishihara-counter');
    if (!track || !prevBtn || !nextBtn) return;

    var images = track.querySelectorAll('.nishihara-gallery__img');
    var total = images.length;
    var current = 0;

    function update() {
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      if (counter) counter.textContent = (current + 1) + ' / ' + total;
    }

    prevBtn.addEventListener('click', function () {
      current = (current - 1 + total) % total;
      update();
    });

    nextBtn.addEventListener('click', function () {
      current = (current + 1) % total;
      update();
    });

    // タッチスワイプ
    var startX = 0;
    var diff = 0;
    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
    });
    track.addEventListener('touchmove', function (e) {
      diff = e.touches[0].clientX - startX;
    });
    track.addEventListener('touchend', function () {
      if (Math.abs(diff) > 50) {
        if (diff < 0) { current = (current + 1) % total; }
        else { current = (current - 1 + total) % total; }
        update();
      }
      diff = 0;
    });
  }
})();
