import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { BookingDetailsResponseDto } from '../../../../../shared/interfaces/field';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { AuthService } from '../../../../../shared/service/authentication.service';
import { Role } from '../../../../../shared/enum/role';

@Component({
  selector: 'app-booking-details-dialog',
  imports: [MatDialogModule, CommonModule, ButtonComponent],
  templateUrl: './booking-details-dialog.component.html',
  styleUrl: './booking-details-dialog.component.scss',
})
export class BookingDetailsDialogComponent {
  isAdmin: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BookingDetailsResponseDto,
    private dialogRef: MatDialogRef<BookingDetailsDialogComponent>,
    public authService: AuthService
  ) {
    this.isAdmin = this.authService.getRole() == Role.Admin ? true : false
  }

  approveRejectBooking(isApproved: boolean) {
    this.dialogRef.close(isApproved);
  }
}
