import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ValidationRules, ValidationPatterns } from '../../../shared/constants/validation.const';
import { FieldDetail } from '../../../shared/interfaces/field';
import { FieldService } from '../../../shared/service/field.service';
import { TextareaComponent } from '../../../shared/components/text-area/text-area.component';


@Component({
  selector: 'app-add-field-booking',
  imports: [
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    NgxEditorModule,
    TextareaComponent
  ],
  templateUrl: './add-field.component.html',
  styleUrl: './add-field.component.scss',
})
export class AddFieldComponent {
  addFieldDetailsForm: FormGroup;
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
    this.addFieldDetailsForm = this.fb.group({
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
    return this.addFieldDetailsForm.get(controlName) as FormControl;
  }

  onSubmit(): void {
    if (this.addFieldDetailsForm.valid) {
      this.fieldService
        .addField(this.addFieldDetailsForm.value as FieldDetail)
        .subscribe((res) => {
          this.router.navigateByUrl('field');
        });
    } else {
      this.addFieldDetailsForm.markAllAsTouched();
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

  back(){
    this.router.navigateByUrl("field");
  }
}
