import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
})
export class AnalyticsPage implements OnInit {
  constructor(private firestore: AngularFirestore) { }

  ngOnInit() {
    this.fetchChartData();
  }

  fetchChartData() {
    this.firestore.collection('stock').valueChanges().subscribe((data: any[]) => {
      const labels = data.map(item => item.itemName);
      const quantities = data.map(item => item.quantity);
      this.renderChart(labels, quantities);
    });
  }

  renderChart(labels: string[], quantities: number[]) {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    const backgroundColors = quantities.map(quantity => {
      return quantity < 10 ? 'rgba(255, 99, 132, 0.5)' : 'rgba(54, 162, 235, 0.5)';
    });

    const borderColors = quantities.map(quantity => {
      return quantity < 10 ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)';
    });

    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Items quantity',
          data: quantities,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: borderColors,
          pointBorderColor: 'rgba(255, 255, 255, 1)',
          pointBorderWidth: 2
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: 'rgba(0, 0, 0, 0.8)',
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderColor: 'rgba(0, 0, 0, 0.5)',
            borderWidth: 1,
            titleColor: 'rgba(0, 0, 0, 0.8)',
            bodyColor: 'rgba(0, 0, 0, 0.6)',
            footerColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 12
            },
            footerFont: {
              size: 12,
              weight: 'bold'
            }
          }
        }
      }
    });
  }
}
