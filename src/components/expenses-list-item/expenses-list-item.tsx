import { Component, ComponentInterface, Prop, State, h } from '@stencil/core';
import { Expense } from '../add-expenses/type';

@Component({
  tag: 'expenses-list-item',
  styleUrl: 'expenses-list-item.css',
  shadow: true,
})
export class ExpensesListItem implements ComponentInterface {
  @Prop() expenseItem: Expense;

  @State() showDesc: boolean;

  formatDate(): string {
    return new Date(this.expenseItem.date).toDateString()
  }

  seeDescription() {
    this.showDesc = !this.showDesc
  }

  render() {
    if (this.expenseItem) {
      return (
        <div class="expenses-list-item">
          <div class="left-container">
            <h3>{this.expenseItem.amount}</h3>
            <span>{this.formatDate()}</span>
          </div>
          <div class="category-container">
            {this.expenseItem.category}
            <span onClick={() => this.seeDescription()}>{!this.showDesc ? 'See' : 'Hide'} Dec</span>
          </div>
          <div>
            <slot></slot>
          </div>
          {
            this.showDesc ? 
            <p class="desc-container">Desc: {this.expenseItem.description ? this.expenseItem.description : '-'}</p>
            : ''
          }
        </div>
      )
    }
    
  }
}
