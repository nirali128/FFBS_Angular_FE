import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ColumnField } from '../../interfaces/data.view';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-data-view',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, ButtonComponent],
  templateUrl: './data-view.component.html',
  styleUrl: './data-view.component.scss',
})
export class DataViewComponent<T> {
  @Input() items: T[] = [];
  @Input() fieldIcons: { [key: string]: string } = {};
  @Input() columns: ColumnField<T>[] = [];
  isGridView: boolean = true;
  searchQuery: string = '';
  sortOption: string = 'title';
  showAvailableOnly: boolean = false;
  @Output() buttonEvent = new EventEmitter<string>();
  @Output() editEvent = new EventEmitter<string>();
  @Output() searchEvent = new EventEmitter<string>();
  @Input() isAdmin = false;

  onSearchChange() {
    this.searchEvent.emit(this.searchQuery);
  }

  toggleView(): void {
    this.isGridView = !this.isGridView;
  }

  getFieldValue<K extends keyof T>(item: T, key: K): any {
    return item[key] ?? 'N/A';
  }

  filteredItems() {
    let filtered = this.items;

    if (this.showAvailableOnly) {
      filtered = filtered.filter((item) => (item as any).isAvailable);
    }
    return filtered;
  }

  buttonClick(item: T) {
    this.buttonEvent.emit((item as any).guid);
  }

  disability(item: T) {
    return !(item as any).isAvailable;
  }

  getImageUrl(imageData: string): string {
    if (!imageData) {
      return 'assets/images/grass-2616911_1280.jpg';
    }
    return imageData.startsWith('data:image')
      ? imageData
      : 'data:image/jpeg;base64,' + imageData;
  }
  edit(item: T) {
    this.editEvent.emit((item as any).guid);
  }
}
