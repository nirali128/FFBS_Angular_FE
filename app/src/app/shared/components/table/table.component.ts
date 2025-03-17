import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { GlobalConstant } from '../../constants/global-const';
import { MatDialog } from '@angular/material/dialog';
import { iDialogField } from '../../interfaces/dialog-fields';
import { FilterRequest } from '../../interfaces/filter-request';
import { iTableField } from '../../interfaces/table-fields';
import { ConfirmDialogComponent } from '../dialog/dialog.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-table',
  imports: [MatTableModule, ButtonComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent<T> {
  columns!: string[];
  dataSource = new MatTableDataSource<T>;
  filterRequest!: FilterRequest;
  pageSize!: number;
  pageIndex!: number;
  showPagination?: boolean = true;
  previousFilterValue = '';
  searchEnabled = false;
  searchVal!: string;

  @Input() data!: T[];
  @Input() displayedColumns!: iTableField[];
  @Input() paginationOptions: number[] = [5, 10, 20];
  @Input() totalCount: number = 0;
  @Input() dialogData: iDialogField = {
    message: "Do you want to delete this record?"
  }
  @Input() addFormLink!:string;
  
  @Output() onDelete = new EventEmitter<number>();
  @Output() onToggle = new EventEmitter<T>();
  @Output() onPagination = new EventEmitter<FilterRequest>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.filterRequest = {
      pageSize: this.showPagination ? this.paginationOptions[0] : -1,
      pageNumber: this.showPagination ? 1 : -1
    }
    this.pageEmit(this.filterRequest)
    if (this.displayedColumns) {
      this.columns = this.displayedColumns.map(column => column.name);
    }
  }

  ngOnChanges() {
    if (this.data) {
      this.dataSource = new MatTableDataSource<T>(this.data);
      this.dataSource.sort = this.sort;
    }
  }

  delete(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.onDelete.emit(id)
      }
    });
  }

  toggle(element: T) {
    this.onToggle.emit(element)
  }

  onPageChange(event: PageEvent) {
    if(event.pageSize != this.filterRequest.pageSize) {
      event.pageIndex = 0;
    }
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.filterRequest.pageSize = event.pageSize;
    this.filterRequest.pageNumber = event.pageIndex + 1;
    this.pageEmit(this.filterRequest);
  }

  pageEmit(filterRequest: FilterRequest) {
    this.onPagination.emit(filterRequest);
  }
  onSearch() {
    let searchValue = this.searchVal.trim();

    if (this.previousFilterValue || searchValue) {
      this.filterRequest.search = searchValue;
      this.filterRequest.pageNumber = 1;
      this.pageIndex = 0;
      
      this.pageEmit(this.filterRequest);
    }
    this.previousFilterValue = searchValue;
  }

  enableSearchBtn() {
    if(!this.searchVal.trim())
    {
      this.searchEnabled = false;
    }
    else 
    {
      this.searchEnabled = true;
    }
  }
}
