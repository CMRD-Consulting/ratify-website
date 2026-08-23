/**
 * `v-reveal` — add `.is-revealed` when the element first crosses into view.
 *
 * Pair with `class="reveal"`, which holds the hidden initial state in CSS so
 * nothing can flash before the observer attaches. Pass a delay for a stagger:
 * `v-reveal="120"`.
 *
 * One observer for the whole page, and each element is unobserved once it has
 * fired — a landing page reveals once, it does not re-hide on scroll up.
 */
const DELAY = Symbol("reveal-delay");

const reduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let observer = null;

function observerFor() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        observer.unobserve(el);
        const delay = el[DELAY] || 0;
        if (delay) el.style.transitionDelay = `${delay}ms`;
        el.classList.add("is-revealed");
      }
    },
    // Fire a little before the element is fully on screen: by the time the
    // reader's eye arrives the transition is already done.
    { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
  );
  return observer;
}

export default {
  mounted(el, binding) {
    if (reduced) {
      el.classList.add("is-revealed");
      return;
    }
    el[DELAY] = Number(binding.value) || 0;
    observerFor().observe(el);
  },
  unmounted(el) {
    observer?.unobserve(el);
  },
};
