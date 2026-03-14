export class HomeModel {
  isMuted = $state(true);
  isPopoverOpen = $state(false);
  hasReturned = $state(false);

  sensor?: HTMLDivElement;

  toggleSound() {
    this.isMuted = !this.isMuted;
  }

  togglePopover() {
    this.isPopoverOpen = !this.isPopoverOpen;
  }
}
