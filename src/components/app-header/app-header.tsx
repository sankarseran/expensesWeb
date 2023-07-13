import { Component, ComponentInterface, Prop, h } from '@stencil/core';

@Component({
  tag: 'app-header',
  styleUrl: 'app-header.css',
  shadow: true,
})
export class AppHeader implements ComponentInterface {
  @Prop() name: string;

  normalize(name: string): string {
    if (name) {
      return name.substr(0, 1).toUpperCase() + name.substr(1).toLowerCase();
    }
    return '';
  }

  render() {
    return (
      <div class="app-header">
        <h2>Tack Expenses</h2>
        <app-theme-switch></app-theme-switch>
      </div>
    )
  }
}
