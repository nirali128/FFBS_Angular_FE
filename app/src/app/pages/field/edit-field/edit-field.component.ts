import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import {
  ValidationPatterns,
} from '../../../shared/constants/validation.const';
import { FieldDetail, FieldDocument } from '../../../shared/interfaces/field';
import { FieldService } from '../../../shared/service/field.service';
import { TextareaComponent } from '../../../shared/components/text-area/text-area.component';
import {
  convertDocumentsToFiles,
  convertFilesToDocuments,
  mapDayToDropdown,
} from '../../../shared/utility/utilitty';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.component';
import { CheckboxComponent } from '../../../shared/components/checkbox/checkbox.component';
import { MultiSelectCheckboxComponent } from '../../../shared/components/multi-select-checkbox/multi-select-checkbox.component';
import { DropdownOption } from '../../../shared/interfaces/dropdown.options';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { MatError } from '@angular/material/form-field';
import { FieldDetailsFormConfig } from '../field.config';
import { SuccessMessages } from '../../../shared/constants/messages-const';
import { SnackbarConfig } from '../../../shared/constants/snackbar-config.const';
import { SnackbarService } from '../../../shared/service/snackbar.service';

@Component({
  selector: 'app-edit-field-booking',
  imports: [
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    MatCardModule,
    TextareaComponent,
    ImageUploadComponent,
    CheckboxComponent,
    MultiSelectCheckboxComponent,
    CommonModule,
    MatError,
  ],
  templateUrl: './edit-field.component.html',
  styleUrl: './edit-field.component.scss',
})
export class EditFieldComponent {
  editFieldDetailsForm: FormGroup;
  files: File[] = [];
  fieldId: string;
  uploadedFiles: File[];
  dropdownData: DropdownOption[];
  closeDays: string[] = [];
  documentsData: FieldDocument[];
  submitted: boolean = false;

  constructor(
    private formConfig: FieldDetailsFormConfig,
    public fieldService: FieldService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService
  ) {
    this.editFieldDetailsForm = this.formConfig.createForm();
    this.route.params.subscribe((params) => {
      this.fieldId = params['id'];
    });
  }

  ngOnInit() {
    if (this.fieldId) {
      forkJoin({
        days: this.fieldService.getAllDays(),
        fieldData: this.fieldService.getFieldById(this.fieldId),
      }).subscribe((res) => {
        if (res.days.success)
          this.dropdownData = mapDayToDropdown(res.days.data);
        if (res.fieldData.success) {
          this.documentsData = res.fieldData.data.documents;
          convertDocumentsToFiles(res.fieldData.data.documents).then(
            (documents) => {
              this.uploadedFiles = documents;
              this.editFieldDetailsForm.patchValue(res.fieldData.data);

              if (
                res.fieldData.data.closeDays &&
                res.fieldData.data.closeDays.length
              )
                res.fieldData.data.closeDays.forEach((x) => {
                  let a = this.dropdownData.find((y) => y.label == x);
                  this.closeDays.push(a.value as string);
                });
            }
          );
        }
      });
    }
  }

  getFormControl(controlName: string): FormControl {
    return this.editFieldDetailsForm.get(controlName) as FormControl;
  }

  onFilesUploaded(files: File[]): void {
    this.files = files;
    if (!files.length) {
      this.uploadedFiles = [];
    }
  }

  selectionChange(event: any) {
    this.closeDays = event;
  }

  showError(): boolean {
    if (
      this.submitted &&
      !this.files.length &&
      this.uploadedFiles.length != this.documentsData.length
    ) {
      return true;
    }
    return false;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.files.length) {
      convertFilesToDocuments(this.files).then((documents) => {
        this.editFieldDetailsForm.controls['documents'].setValue(documents);
        this.submitForm();
      });
    } else if (this.uploadedFiles.length == this.documentsData.length) {
      this.editFieldDetailsForm.controls['documents'].setValue(
        this.documentsData
      );
      this.submitForm();
    }
  }

  submitForm() {
    this.editFieldDetailsForm.controls['closeDays'].setValue(this.closeDays);
    if (
      this.editFieldDetailsForm.valid &&
      (this.files.length || this.documentsData.length)
    ) {
      const formValue = {
        ...this.editFieldDetailsForm.value,
        area: parseFloat(this.editFieldDetailsForm.controls['area'].value),
        baseRate: parseFloat(
          this.editFieldDetailsForm.controls['baseRate'].value
        ),
      };
      this.fieldService
        .editField(this.fieldId, formValue as FieldDetail)
        .subscribe((res) => {
          if(res.success) {
            this.snackbarService.show(
              new SnackbarConfig({ message: res.message })
            );
            this.back();
          }
        });
    } else {
      this.editFieldDetailsForm.markAllAsTouched();
    }
  }

  restrictPhoneInput(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (
      ValidationPatterns.PHONE.test(event.key) &&
      !allowedKeys.includes(event.key)
    ) {
      event.preventDefault();
    }
  }

  back() {
    this.router.navigateByUrl('field');
  }
}