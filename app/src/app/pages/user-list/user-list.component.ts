import { Component } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { FilterRequest } from '../../shared/interfaces/filter-request';
import { iTableField } from '../../shared/interfaces/table-fields';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/dialog/dialog.component';
import {
  DialogResponse,
  iDialogField,
} from '../../shared/interfaces/dialog-fields';
import { SnackbarService } from '../../shared/service/snackbar.service';
import { SnackbarConfig } from '../../shared/constants/snackbar-config.const';
import { UserService } from '../../shared/service/user.service';
import { User, BlockUser } from '../../shared/interfaces/user';
import { Role } from '../../shared/enum/role';

@Component({
  selector: 'app-user-list',
  imports: [TableComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  dataSource!: User[];
  totalCount!: number;
  filterRequest!: FilterRequest;
  isAdmin: boolean = false;
  displayedColumns!: iTableField[];

  constructor(
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    public snackBarService: SnackbarService
  ) {
    this.isAdmin = this.router.url.includes('admin');
    this.displayedColumns = [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'label',
        sort: true,
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'label',
        sort: true,
      },
      {
        name: 'email',
        label: 'Email',
        type: 'label',
        sort: true,
      },
      {
        name: 'phoneNumber',
        label: 'Phone Number',
        type: 'label',
        sort: true,
      },
      {
        name: 'dob',
        label: 'Date of Birth',
        type: 'label',
        sort: true,
      },
      {
        name: 'isActive',
        label: 'Block/Unblock',
        type: 'switch',
        sort: false,
      },
    ];
  }

  getAll(filterRequest: FilterRequest) {
    filterRequest.search = Role.Customer;
    this.userService.getPaginatedUsers(filterRequest).subscribe((res) => {
      if (res.success) {
        this.filterRequest = filterRequest;
        this.dataSource = res.data;
        this.totalCount = res.pagination.totalItems;
      }
    });
  }

  toggle(element: User) {
    const title = "Reason for " + (element.isActive ? "unblocking" : "blocking");
    let dialogData: iDialogField = {
      title: title,
      requiresReason: true,
      btnCancelText: 'Cancel',
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult: DialogResponse) => {
      if (dialogResult.reason && dialogResult.confirmed) {
        let data: BlockUser = {
          reason: dialogResult.reason,
          userId: element.userId,
          isActive: element.isActive
        };
        this.userService.blockUser(data).subscribe((res) => {
          if (res.success) {
            this.snackBarService.show(
              new SnackbarConfig({
                message: res.message,
              })
            );
          } else {
            this.snackBarService.show(
              new SnackbarConfig({
                message: res.message,
                status: 'error',
                icon: 'warning_amber',
              })
            );
            element.isActive = !element.isActive;
          }
        });
      } else {
        element.isActive = !element.isActive;
      }
    });
  }
}
