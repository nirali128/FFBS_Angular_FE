import { Component } from '@angular/core';
import { AppLoaderService } from '../../service/app-loader.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule],
  templateUrl: './app-spinner.component.html',
  styleUrl: './app-spinner.component.scss',
})
export class AppSpinnerComponent {
  constructor(public loader: AppLoaderService) { }
}
