import { Component, ComponentInterface, Prop, State, h, Event, EventEmitter, Watch } from '@stencil/core';
import { Expense } from './type';

@Component({
  tag: 'add-expenses',
  styleUrl: 'add-expenses.css',
  shadow: true,
})
export class AddExpenses implements ComponentInterface {
  @Prop() editExpense: Expense;
  @Event() expenseAddedOrUpdated: EventEmitter<{
    type: 'edit' | 'add';
    data: Expense;
  }>;
  
  @State() date: string;
  @State() category: string;
  @State() description: string;
  @State() amount: number;
  @State() disabled: boolean;
  @State() error: string;
  @State() editingExpenseId: string;

  @Watch('editExpense')
  watchPropHandler(newValue: Expense) {
    if(newValue) {
      this.editingExpenseId = newValue.id;
      this.amount = newValue.amount;
      this.category = newValue.category;
      this.description = newValue.description;
      const date = new Date(newValue.date);
      this.date = `${date.getFullYear()}-${date.getMonth() > 9  ? date.getMonth() : '0' + date.getMonth()}-${date.getDate()}`.toString()  
    } else {
      this.editingExpenseId = null;
    }
  }

  setDefaultValues() {
    const today = new Date();
    this.amount = 0
    this.category = ''
    this.description = ''
    this.date = `${today.getFullYear()}-${today.getMonth() > 9  ? today.getMonth() : '0' + today.getMonth()}-${today.getDate()}`.toString()
    this.editingExpenseId = null;
    this.error = '';
  }

  handleSubmit(e) {
    e.preventDefault();
    this.error = '';
    if (!this.amount || !this.category || !this.description || !this.date) {
      this.error = 'Please fill all required field';
    } else {
      this.disabled = true;
      const expense = {
        amount: this.amount, 
        category: this.category,
        description: this.description, 
        date: this.date
      }
      
      const method = this.editingExpenseId ? 'PUT': 'POST';
      const url = this.editingExpenseId 
        ? 'https://expenses-api-j148.onrender.com/expenses/' + this.editingExpenseId
        : 'https://expenses-api-j148.onrender.com/expenses'
      fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem('token')
        },
        body: JSON.stringify(expense),
      }).then(async res => {
        const data = await res.json()
        if (res.status === 201 || res.status === 200) {
          this.expenseAddedOrUpdated.emit({
            type: this.editingExpenseId ? 'edit' : 'add',
            data: Object.assign({}, data)
          })
          this.setDefaultValues();
        } else {
          this.error = data.message;
        }
        this.disabled = false;
      }).catch(err => {
        this.disabled = false;
        this.error = err.message;
      })
    }

  }

  onlyNumberKey(evt) {
    // Only ASCII character in that range allowed
    const aCode = (evt.which) ? evt.which : evt.keyCode
    if (aCode > 31 && (aCode < 48 || aCode > 57) && 
      (aCode < 96 || aCode > 105) && 
      (aCode !== 110 && aCode !== 190 && aCode !== 46))
      evt.preventDefault()
    return true;
}

  
  componentWillLoad(): void {
    const today = new Date();
    this.date = `${today.getFullYear()}-${today.getMonth() > 9  ? today.getMonth() : '0' + today.getMonth()}-${today.getDate()}`.toString()
    this.amount = 0;
  }

  handleChange(type: string, event) {
    switch (type) {
      case 'date': 
        this.date = event.target.value?.trim();
        break;
        case 'amount': 
        this.amount = Number(event.target.value) ? Number(Number(event.target.value).toFixed(2)) : 0;
        break;
        case 'category': 
        this.category = event.target.value?.trim();
        break;
        case 'description': 
        this.description = event.target.value?.trim();
        break;
    }
  }

  render() {
    return (
      <div class="add-expenses">
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <div class="form-group">
            <label>Start date
              <input type="date" id="expenses-date" name="trip-start"
                onChange={(event) => this.handleChange('date', event)}
                min="2023-01-01" max="2023-12-31" value={this.date} />
            </label>
          </div>
          <div class="form-group">
            <label>
              Category
              <input type="text" value={this.category} onInput={(event) => this.handleChange('category', event)} />
            </label>
          </div>
          <div class="form-group">
            <label>
              Description
              <input type="text" value={this.description} onInput={(event) => this.handleChange('description', event)} />
            </label>
          </div>
          <div class="form-group">
            <label>
              Amount
              <input type="text" value={this.amount} 
                onKeyDown={(e) => this.onlyNumberKey(e)}
                onInput={(event) => this.handleChange('amount', event)} />
            </label>
          </div>
          <div class="submit-btn-container">
            <input type="submit" disabled={this.disabled} value="Save" class="submit-btn" />
            <input type="button" onClick={() => this.setDefaultValues()} value="Cancel" class="cancel-btn" />
          </div>
        </form>
        <span class="error">{this.error}</span>
      </div>
    )
  }
}
