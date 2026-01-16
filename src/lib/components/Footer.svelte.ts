export class FooterModel {
  isPopoverOpen = $state(false);
  isMuted = $state(false);

  toggleIsPopoverOpen() {
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  toggleIsMuted() {
    this.isMuted = !this.isMuted;
  }
}
