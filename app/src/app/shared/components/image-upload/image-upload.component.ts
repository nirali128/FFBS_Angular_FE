import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-image-upload',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss'
})
export class ImageUploadComponent {
  files: File[] = [];
  @Input() uploadedFiles: File[] = [];
  @Output() filesUploaded = new EventEmitter<File[]>();
  previewUrls: string[] = []; 

  ngOnChanges() {
    if (this.uploadedFiles) {
      this.files.push(...this.uploadedFiles);
      this.generatePreviews();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.files = [...this.files, ...Array.from(input.files)];
      this.generatePreviews();
      this.filesUploaded.emit(this.files);
    }
  }

  removeFile(index: number): void {
    URL.revokeObjectURL(this.previewUrls[index]);
    this.files.splice(index, 1);
    this.previewUrls.splice(index, 1);
    this.filesUploaded.emit(this.files);
  }

  clearFiles(): void {
    this.previewUrls.forEach((url) => URL.revokeObjectURL(url));
    this.files = [];
    this.previewUrls = [];
    this.filesUploaded.emit(this.files);
  }

  isImage(file: File): boolean {
    return file.type.startsWith('image/');
  }

  private generatePreviews(): void {
    this.previewUrls.forEach((url) => URL.revokeObjectURL(url));
    this.previewUrls = this.files.map((file) => URL.createObjectURL(file));
  }
}
