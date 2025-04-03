// Elementor theme integration
class ElementorThemeHandler {
  constructor() {
    this.initSettings();
    this.initElements();
    this.bindEvents();
  }

  initSettings() {
    this.settings = {
      selectors: {
        menuToggle: '.site-header .site-navigation-toggle',
        menuToggleHolder: '.site-header .site-navigation-toggle-holder',
        dropdownMenu: '.site-header .site-navigation-dropdown'
      }
    };
  }

  initElements() {
    this.elements = {
      window,
      menuToggle: document.querySelector(this.settings.selectors.menuToggle),
      menuToggleHolder: document.querySelector(this.settings.selectors.menuToggleHolder),
      dropdownMenu: document.querySelector(this.settings.selectors.dropdownMenu)
    };
  }

  bindEvents() {
    if (!this.elements.menuToggleHolder || this.elements.menuToggleHolder?.classList.contains('hide')) {
      return;
    }

    this.elements.menuToggle.addEventListener('click', () => this.handleMenuToggle());
    this.elements.dropdownMenu.querySelectorAll('.menu-item-has-children > a')
      .forEach(item => item.addEventListener('click', (e) => this.handleMenuChildren(e)));
  }

  closeMenuItems() {
    this.elements.menuToggleHolder.classList.remove('elementor-active');
    this.elements.window.removeEventListener('resize', () => this.closeMenuItems());
  }

  handleMenuToggle() {
    const isActive = !this.elements.menuToggleHolder.classList.contains('elementor-active');
    
    this.elements.menuToggle.setAttribute('aria-expanded', isActive);
    this.elements.dropdownMenu.setAttribute('aria-hidden', !isActive);
    this.elements.dropdownMenu.inert = !isActive;
    this.elements.menuToggleHolder.classList.toggle('elementor-active', isActive);
    
    this.elements.dropdownMenu.querySelectorAll('.elementor-active')
      .forEach(el => el.classList.remove('elementor-active'));

    if (isActive) {
      this.elements.window.addEventListener('resize', () => this.closeMenuItems());
    } else {
      this.elements.window.removeEventListener('resize', () => this.closeMenuItems());
    }
  }

  handleMenuChildren(event) {
    const parent = event.currentTarget.parentElement;
    parent?.classList?.toggle('elementor-active');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ElementorThemeHandler();
});