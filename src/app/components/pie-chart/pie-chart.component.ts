import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  standalone: true,
  selector: 'app-pie-chart',
  template: `
    <div style="display: block">
      <canvas
        baseChart
        [data]="pieChartData"
        [labels]="pieChartLabels"
        [type]="'pie'"
      ></canvas>
    </div>
  `,
  imports: [NgChartsModule],
})
export class ChartPieComponent implements OnChanges {
  @Input() yesVotes: number = 0;
  @Input() noVotes: number = 0;

  pieChartLabels = ['Sim', 'Não'];

  pieChartData: ChartData<'pie', number[], string>;

  constructor() {
    this.pieChartData = {
      labels: this.pieChartLabels,
      datasets: [
        {
          data: [this.yesVotes, this.noVotes],
        },
      ],
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['yesVotes'] || changes['noVotes']) {
      this.updateChartData();
    }
  }

  private updateChartData() {
    this.pieChartData = {
      labels: this.pieChartLabels,
      datasets: [
        {
          data: [this.yesVotes, this.noVotes],
        },
      ],
    };
  }
}
