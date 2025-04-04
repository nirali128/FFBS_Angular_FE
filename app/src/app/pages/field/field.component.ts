import { Component, ViewChild } from '@angular/core';
import { FIELD_COLUMNS, FieldsDetailList } from '../../shared/interfaces/field';
import { FieldService } from '../../shared/service/field.service';
import {
  ApiPaginatedResponse,
  PaginationRequest,
} from '../../shared/interfaces/api.response';
import { DataViewComponent } from '../../shared/components/data-view/data-view.component';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/service/authentication.service';
import { Role } from '../../shared/enum/role';
import { FilterRequest } from '../../shared/interfaces/filter-request';

@Component({
  selector: 'app-field',
  imports: [DataViewComponent, ButtonComponent, MatPaginatorModule, CommonModule],
  templateUrl: './field.component.html',
  styleUrl: './field.component.scss',
})
export class FieldComponent {
  fields: FieldsDetailList[];
  fieldColumns = FIELD_COLUMNS;
  fieldIcons = {
    address: 'location_on',
    area: 'straighten',
    phone: 'phone',
    rules: 'gavel',
  };
  page = 1;
  pageSize = 3;
  searchQuery = '';
  sortBy = '';
  sortOrder = '';
  totalItems = 0;
  totalPages = 0;
  isAdmin: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public readonly fieldService: FieldService,
    public router: Router,
    public readonly authService: AuthService
  ) {
    this.isAdmin = this.authService.getRole() == Role.Admin ? true : false;
  }

  ngOnInit(): void {
    this.loadFields();
  }

  loadFields(): void {
    const params: FilterRequest = {
      pageNumber: this.page,
      pageSize: this.pageSize,
      search: this.searchQuery,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
    };

    this.fieldService
      .getAllFields(params)
      .subscribe((res: ApiPaginatedResponse<FieldsDetailList[]>) => {
        if (res.success) {
          this.fields = res.data;
          this.totalItems = res.pagination.totalItems;
          this.totalPages = res.pagination.totalPages;
        }
      });
  }

  navigate(guid: string) {
    this.router.navigateByUrl('/field/booking/' + guid);
  }

  navigateToAddField() {
    this.router.navigateByUrl('/field/add');
  }

  edit(guid: string) {
    this.router.navigateByUrl('/field/edit/' + guid);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize; // Update pageSize
    this.page = event.pageIndex + 1;
    this.loadFields();
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.page = 1;
    this.loadFields();
  }

  handleRateAndAvailability(event: [string, boolean]) {
    const [fieldId, isRateView] = event;
    let url = '/field/' + (isRateView ? 'rate/' : 'availability/') + fieldId;
    this.router.navigateByUrl(url);
  }
}
