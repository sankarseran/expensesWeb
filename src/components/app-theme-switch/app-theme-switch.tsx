import { Component, ComponentInterface, State, h } from '@stencil/core';

@Component({
  tag: 'app-theme-switch',
  styleUrl: 'app-theme-switch.css',
  shadow: true,
})
export class AppThemeSwitch implements ComponentInterface {
  @State() toggleSwitch: boolean

  componentWillLoad(): void | Promise<void> {
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
      
        if (currentTheme === 'dark') {
          this.toggleSwitch = true;
        }
    }
  }

  switchTheme(e) {
      if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }    
  }

  render() {
    return (
      <div class="app-theme-switch">
        <div class="toggleWrapper">
          <input type="checkbox" checked={this.toggleSwitch} onChange={(e) => this.switchTheme(e)} class="dn" id="dn"/>
          <label htmlFor="dn" class="toggle">
            <span class="toggle__handler">
              <span class="crater crater--1"></span>
              <span class="crater crater--2"></span>
              <span class="crater crater--3"></span>
            </span>
            <span class="star star--1"></span>
            <span class="star star--2"></span>
            <span class="star star--3"></span>
            <span class="star star--4"></span>
            <span class="star star--5"></span>
            <span class="star star--6"></span>
          </label>
        </div>
      </div>
    )
  }
}
