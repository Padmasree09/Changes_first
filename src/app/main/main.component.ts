import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent {
  isSidebarOpen = false;
  selectedChart: string = '';

  

  onChartSelected(chart: string) {
    this.selectedChart = chart;
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen; // Toggle the sidebar state

  }
}
