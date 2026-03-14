export class HomeModel {
  isPopoverOpen = $state(false);
  isTutorialFinished = $state(false);
  isOptimizing = $state(false);

  togglePopover() {
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  toggleTutorial() {
    // 1. Hint: Prepare browser for change
    this.isOptimizing = true;

    // 2. Wait: Double RAF to ensure style is applied and painted
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // 3. Switch: Trigger the animation
        this.isTutorialFinished = !this.isTutorialFinished;

        // 4. Cleanup: Remove hint after animation (2s duration)
        setTimeout(() => {
          this.isOptimizing = false;
        }, 2000);
      });
    });
  }
}
