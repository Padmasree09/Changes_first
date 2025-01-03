import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Output() chartSelected = new EventEmitter<string>();

  onChartSelect(chartType: string) {
    this.chartSelected.emit(chartType);
  }

}
