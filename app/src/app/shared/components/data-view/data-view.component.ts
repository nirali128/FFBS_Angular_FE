import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-data-view',
  imports: [CommonModule],
  templateUrl: './data-view.component.html',
  styleUrl: './data-view.component.scss'
})


export class DataViewComponent<T> {
  @Input() items: T[] = [];
  isGridView: boolean = true;

  objectKeys(item: any): string[] {
    return Object.keys(item);
  }

  toggleView(): void {
    this.isGridView = !this.isGridView;
  }
}
