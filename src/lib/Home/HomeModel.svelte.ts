export class HomeModel {
  isPopoverOpen = $state(false);

  togglePopover() {
    this.isPopoverOpen = !this.isPopoverOpen;
  }
}
