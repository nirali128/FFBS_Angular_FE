import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';
import { SnackbarConfig } from '../constants/snackbar-config.const';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private statusConfigs = {
    success: { panelClass: 'bg-success', icon: 'done' },
    error: { panelClass: 'bg-error', icon: 'report-problem' },
    warning: { panelClass: 'bg-warning', icon: 'warning_amber' },
    info: { panelClass: 'bg-info', icon: 'info' },
  };

  constructor(private snackbar: MatSnackBar) {}

  show(config: SnackbarConfig) {
    const {
      status,
      message,
      action,
      duration,
      horizontalPosition,
      verticalPosition,
    } = config;
    config._snackbar = this.snackbar;
    const statusConfig = this.statusConfigs[status ?? 'success'];
    const { panelClass, icon } = statusConfig;

    this.snackbar.openFromComponent(SnackbarComponent, {
      data: config,
      duration,
      horizontalPosition,
      verticalPosition,
      panelClass,
    });
  }
}
