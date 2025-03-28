import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import {
  ValidationRules,
  ValidationPatterns,
} from '../../../shared/constants/validation.const';
import { FieldDetail } from '../../../shared/interfaces/field';
import { FieldService } from '../../../shared/service/field.service';
import { TextareaComponent } from '../../../shared/components/text-area/text-area.component';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.component';
import {
  convertFilesToDocuments,
  mapDayToDropdown,
} from '../../../shared/utility/utilitty';
import { CheckboxComponent } from '../../../shared/components/checkbox/checkbox.component';
import { MultiSelectCheckboxComponent } from '../../../shared/components/multi-select-checkbox/multi-select-checkbox.component';
import { DropdownOption } from '../../../shared/interfaces/dropdown.options';
import { CommonModule } from '@angular/common';
import { MatError } from '@angular/material/form-field';
import { FieldDetailsFormConfig } from '../field.config';
import { SnackbarConfig } from '../../../shared/constants/snackbar-config.const';
import { SuccessMessages } from '../../../shared/constants/messages-const';
import { SnackbarService } from '../../../shared/service/snackbar.service';

@Component({
  selector: 'app-add-field-booking',
  imports: [
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    NgxEditorModule,
    TextareaComponent,
    ImageUploadComponent,
    CheckboxComponent,
    MultiSelectCheckboxComponent,
    CommonModule,
    MatError,
  ],
  templateUrl: './add-field.component.html',
  styleUrl: './add-field.component.scss',
})
export class AddFieldComponent {
  addFieldDetailsForm: FormGroup;
  files: File[] = [];
  dropdownData: DropdownOption[];
  closeDays: string[] = [];
  submitted: boolean = false;

  constructor(
    private formConfig: FieldDetailsFormConfig,
    private fb: FormBuilder,
    public fieldService: FieldService,
    private router: Router,
    private snackbarService: SnackbarService
  ) {
    this.fieldService.getAllDays().subscribe((res) => {
      if (res.success) {
        this.dropdownData = mapDayToDropdown(res.data);
      }
    });
  }

  ngOnInit(): void {
    this.addFieldDetailsForm = this.formConfig.createForm();
  }

  getFormControl(controlName: string): FormControl {
    return this.addFieldDetailsForm.get(controlName) as FormControl;
  }

  onFilesUploaded(files: File[]): void {
    this.files = files;
  }

  selectionChange(event: any) {
    this.closeDays = event;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.files.length) {
      convertFilesToDocuments(this.files).then((documents) => {
        this.addFieldDetailsForm.controls['documents'].setValue(documents);
        this.addFieldDetailsForm.controls['closeDays'].setValue(this.closeDays);
        if (this.addFieldDetailsForm.valid) {
          const formValue = {
            ...this.addFieldDetailsForm.value,
            area: parseFloat(this.addFieldDetailsForm.controls['area'].value),
            baseRate: parseFloat(
              this.addFieldDetailsForm.controls['baseRate'].value
            ),
          };
          this.fieldService
            .addField(formValue as FieldDetail)
            .subscribe((res) => {
              if(res.success) {
                this.snackbarService.show(
                  new SnackbarConfig({ message: res.message })
                );
                this.back();
              }
            });
        } else {
          this.addFieldDetailsForm.markAllAsTouched();
        }
      });
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