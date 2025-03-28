import { Component } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { InvoiceList } from '../../shared/interfaces/invoice';
import { FilterRequest } from '../../shared/interfaces/filter-request';
import { iTableField } from '../../shared/interfaces/table-fields';
import { InvoiceService } from '../../shared/service/invoice.service';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../shared/components/dialog/dialog.component';
import { SnackbarConfig } from '../../shared/constants/snackbar-config.const';
import { iDialogField } from '../../shared/interfaces/dialog-fields';
import { User } from '../../shared/interfaces/user';
import { SnackbarService } from '../../shared/service/snackbar.service';
import { GlobalConstant } from '../../shared/constants/global-const';

@Component({
  selector: 'app-invoice-list',
  imports: [TableComponent],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss',
})
export class InvoiceListComponent {
  dataSource!: InvoiceList[];
  totalCount!: number;
  filterRequest!: FilterRequest;
  isAdmin: boolean = false;
  displayedColumns!: iTableField[];

  constructor(
    private invoiceService: InvoiceService,
    private router: Router,
    public snackBarService: SnackbarService
  ) {
    this.isAdmin = this.router.url.includes('admin');
    this.displayedColumns = [
      {
        name: 'invoiceNumber',
        label: 'Invoice Number',
        type: 'label',
        sort: true,
      },
      {
        name: 'invoiceDate',
        label: 'Invoice Date',
        type: 'label',
        sort: true,
      },
      {
        name: 'amount',
        label: 'Amount',
        type: 'label',
        sort: true,
      },
      {
        name: 'status',
        label: 'Status',
        type: 'label',
        sort: true,
      },
      {
        name: 'action',
        label: 'Action',
        type: 'button',
        sort: false,
        arr: [
          {
            name: GlobalConstant.VIEW,
            src: 'visibility',
          },
        ],
      },
    ];
  }

  getAll(filterRequest: FilterRequest) {
    this.invoiceService.getPaginatedInvoices(filterRequest).subscribe((res) => {
      if (res.success) {
        this.filterRequest = filterRequest;
        this.dataSource = res.data.map((item) => {
          return { ...item, isActive: true };
        });
        this.totalCount = res.pagination.totalItems;
      }
    });
  }

  onView(element: InvoiceList) {
    const base64String = element.document;
    const binaryString = atob(base64String.split(',')[1]);
    const byteArray = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
}
