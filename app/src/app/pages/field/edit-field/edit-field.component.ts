import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ValidationRules, ValidationPatterns } from '../../../shared/constants/validation.const';
import { FieldDetail } from '../../../shared/interfaces/field';
import { FieldService } from '../../../shared/service/field.service';


@Component({
  selector: 'app-edit-field-booking',
  imports: [
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    MatCardModule,
    //    TextareaComponent,
    NgxEditorModule,
  ],
  templateUrl: './edit-field.component.html',
  styleUrl: './edit-field.component.scss',
})
export class EditFieldComponent {
  editFieldDetailsForm: FormGroup;
  editor: Editor;
  html = '';
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor(
    private fb: FormBuilder,
    public fieldService: FieldService,
    private router: Router
  ) {
    this.editFieldDetailsForm = this.fb.group({
      fieldName: [
        '',
        [
          Validators.required,
          Validators.maxLength(ValidationRules.FIELD_NAME_MAX_LENGTH),
          Validators.pattern('^[a-zA-Z0-9 ]*$'),
        ],
      ],
      address: ['', [Validators.required, Validators.maxLength(100)]],
      area: ['', [Validators.required]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(ValidationPatterns.PHONE)],
      ],
      rulesPolicies: ['', Validators.required],
      description: ['', [Validators.required]],
    });
    this.editor = new Editor();
  }

  getFormControl(controlName: string): FormControl {
    return this.editFieldDetailsForm.get(controlName) as FormControl;
  }

  onSubmit(): void {
    if (this.editFieldDetailsForm.valid) {
      this.fieldService
        .editField(this.editFieldDetailsForm.value as FieldDetail)
        .subscribe((res) => {
          this.router.navigateByUrl('field');
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
