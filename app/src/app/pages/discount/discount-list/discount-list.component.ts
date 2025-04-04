import { Component } from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { DiscountList } from '../../../shared/interfaces/discount';
import { DiscountService } from '../../../shared/service/discount.service';
import { FilterRequest } from '../../../shared/interfaces/filter-request';
import { iTableField } from '../../../shared/interfaces/table-fields';
import { AuthService } from '../../../shared/service/authentication.service';
import { SnackbarService } from '../../../shared/service/snackbar.service';
import { Role } from '../../../shared/enum/role';
import { GlobalConstant } from '../../../shared/constants/global-const';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-discount-list',
  imports: [TableComponent, ButtonComponent],
  templateUrl: './discount-list.component.html',
  styleUrl: './discount-list.component.scss'
})
export class DiscountListComponent {
dataSource!: DiscountList[];
  totalCount!: number;
  filterRequest!: FilterRequest;
  isAdmin: boolean = false;
  displayedColumns!: iTableField[];
  ADD_ROUTE = GlobalConstant.ADD;

  constructor(public readonly discountService: DiscountService, public readonly snackBarService: SnackbarService, public readonly authService: AuthService, public router: Router) {
    this.displayedColumns = [
      {
        name: 'name',
        label: 'Name',
        type: 'label',
        sort: true,
      },
      {
        name: 'discountType',
        label: 'Discount Type',
        type: 'label',
        sort: true,
      },
      {
        name: 'discountValue',
        label: 'Discount Value',
        type: 'label',
        sort: true,
      },
      {
        name: 'code',
        label: 'Code',
        type: 'label',
        sort: true,
      },
      {
        name: 'startDate',
        label: 'Start Date',
        type: 'label',
        sort: false
      },
      {
        name: 'endDate',
        label: 'End Date',
        type: 'label',
        sort: false
      },
    ];
    this.isAdmin = this.authService.getRole() == Role.Admin ? true : false; 
  }

  getAll(filterRequest: FilterRequest) {
    if(!this.isAdmin)
      filterRequest.search = this.authService.getUsername().split(' ')[1];
    this.discountService
      .getPaginatedDiscounts(filterRequest)
      .subscribe((res) => {
        if (res.success) {
          this.filterRequest = filterRequest;
          this.dataSource = res.data;
          this.totalCount = res.pagination.totalItems;
        }
      });
  }

  navigateToAddField() {
    this.router.navigateByUrl('/discount/add');
  }
}
