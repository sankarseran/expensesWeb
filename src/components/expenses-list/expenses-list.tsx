import { Component, ComponentInterface, State, h, Listen, Watch } from '@stencil/core';
import { Expense } from '../add-expenses/type';

@Component({
  tag: 'expenses-list',
  styleUrl: 'expenses-list.css',
  shadow: true,
})
export class ExpensesList implements ComponentInterface {
  @State() expenses: {
    id: string,
    date: string,
    category: string,
    description: string,
    amount: number
  }[];
  @State() total: number;
  @State() editExpense: Expense;
  @State() chartExpenses: Expense[];
  @State() disabled: boolean;

  async getExpenses() {
    const data = await fetch('https://expenses-api-j148.onrender.com/expenses', {
      headers: {
        "Authorization": localStorage.getItem('token')
      }
    });
    if (data) {
      const expense: Expense[] = await data.json()
      if (expense) {
        this.expenses = expense.filter((data) => {
          this.total = data && !isNaN(data?.amount) ? (Number(this.total.toFixed(2)) + Number(data?.amount)) : this.total + 0
          return  data && data?.amount
        }).sort()
        this.chartExpenses = [...this.expenses];
      }
    }
  }

  deleteItem(expense: Expense) {
    this.disabled = true;
    fetch('https://expenses-api-j148.onrender.com/expenses/' + expense.id, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem('token')
      }
    }).then(async res => {
      const data = await res.json()
      if (res.status === 200) {
        const idx = this.expenses.findIndex((val) => val.id === expense.id)
        if (idx !== -1) this.expenses.splice(idx, 1);
        this.doTotal();
      } else {
        console.log('error', data.message)
      }
      this.disabled = false;
    }).catch(err => {
      console.log('error', err)
      this.disabled = false;
    })
  }

  doTotal() {
    this.chartExpenses = [...this.expenses]
    this.total = Number(this.expenses.reduce( (a, b) => {
      return a + b.amount;
  }, 0).toFixed(2));

  }

  @Listen('expenseAddedOrUpdated')
  expenseAddedOrUpdatedHandler(event: CustomEvent<{type: 'edit' | 'add', data: Expense}>) {
    if (event.detail.type === 'add') {
      this.expenses.push(event.detail.data)
    } else {
      this.editExpense = null;
      const idx = this.expenses.findIndex((expense) => expense.id === event.detail.data.id)
      if (idx !== -1) this.expenses[idx] = event.detail.data
    }
    this.doTotal()
  }

  componentWillLoad(): void | Promise<void> {
    this.total = 0
    this.getExpenses()
  }

  @Watch('expenses')
  updateChartExpenses() {
    this.chartExpenses = this.expenses.map(data => data);
  }

  render() {
    return (
      <div class="expenses-list">
        <div>
          <expenses-chart expenses={this.chartExpenses}></expenses-chart>
        </div>
        <div>
          <add-expenses editExpense={this.editExpense}></add-expenses>
        </div>
        <div class="expenses-list-container">
          <h3 class="list-title">Transactions <span>Total: {this.total}</span></h3>
          <div class="expense-item-container">
            {this.expenses?.length > 0 ? this.expenses.map(expense => {
              return <expenses-list-item expenseItem={expense}>
                <div class="button-container">
                  <button disabled={this.disabled} onClick={() => this.editExpense = expense}>Edit</button>
                  <button disabled={this.disabled} onClick={() => this.deleteItem(expense)}>Delete</button>
                </div>
              </expenses-list-item>;
            }): <span class="no-data">No Expense Available !!</span>}
          </div>
        </div>
      </div>
    )
  }
}
