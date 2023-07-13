import { Component, ComponentInterface, Prop, State, Watch, h } from '@stencil/core';
import { Expense } from '../add-expenses/type';
import * as chartjs from 'chart.js';
const { Chart, registerables } = chartjs;
Chart.register(...registerables);

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

const colors = [
  "#caf270",
  "#45c490",
  "#008d93",
  "#2e5468",
  "#682e2e",
  "#352e68",
  "#682e68",
  '#685f2e',
  "#652e68",
  "#36682e"
]

@Component({
  tag: 'expenses-chart',
  styleUrl: 'expenses-chart.css',
  shadow: true,
})
export class ExpensesChart implements ComponentInterface {
  @State() container: HTMLCanvasElement;
  @State() dataSet: any;

  @Prop() expenses: Expense[];
  protected myChartInstance: any;
  
  async componentDidLoad(): Promise<void> {
    const ctx = this.container.getContext('2d');
    const data = await this.prepareDataSet(this.expenses)
    this.myChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: MONTHS,
        datasets: data,
      },
      options: {
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true
          }
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }

  prepareDataSet(expenses: Expense[]) {
    if(expenses && expenses.length) {
      return expenses.reduce((result, expense) => {
        const expenseDate = new Date(expense.date);
        const monthIndex = expenseDate.getMonth();
        const label = expense.category;
        const backgroundColor = colors[Math.floor(Math.random() * 10)]; // Specify the background color for each category
      
        const existingData = result.find((data) => data?.label === label);
        if (existingData) {
          existingData.data[monthIndex] += expense.amount;
        } else {
          const newData = {
            label,
            backgroundColor,
            data: Array(12).fill(0),
          };
          newData.data[monthIndex] = expense.amount;
          result.push(newData);
        }
      
        return result;
      }, []);
    } else {
      return [];
    }
  }

  @Watch('expenses')
  async watchPropHandler(newValue: Expense[]) {
    const data = await this.prepareDataSet(newValue)
    this.myChartInstance.data.datasets = data;
    this.myChartInstance.update();
  }

  render() {
    return (
      <div class="expenses-chart">
        <div>
          <canvas ref={el => this.container = el} id="expensesChart"></canvas>
        </div>
      </div>
    )
  }
}
