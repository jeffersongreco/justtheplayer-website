# Attention Requester — Accessibility Audit Checklist

Audit the component as consumed in a real page (e.g., HomeHero), not the dev page.

---

## 1. Automated Scan (axe-core)

- [ ] Run axe-core on a page using the component
- [ ] No critical or serious violations related to animation
- [ ] No missing ARIA roles or labels on animated elements

## 2. Keyboard Navigation

- [ ] Animated elements remain focusable during animation
- [ ] Tab order is not disrupted by animation
- [ ] No focus traps created by the component

## 3. Screen Reader (VoiceOver)

- [ ] Animation does not generate spurious announcements
- [ ] Animated element content is still announced correctly
- [ ] No `aria-live` regions inadvertently triggered by animation state changes

## 4. `prefers-reduced-motion` Verification

- [ ] Enable `prefers-reduced-motion: reduce` in system settings
- [ ] Confirm: `request()` produces no animation (component stays idle)
- [ ] Confirm: toggling the setting dynamically updates behavior without page reload
- [ ] Confirm: an already-running animation is not interrupted when the setting changes mid-animation

## 5. Visual Review

- [ ] Animation does not obscure content
- [ ] Animation does not cause layout shifts
- [ ] No flashing faster than 3Hz
- [ ] Animated element remains interactive (clickable, selectable) during animation
