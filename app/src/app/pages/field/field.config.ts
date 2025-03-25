import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ValidationPatterns,
  ValidationRules,
} from '../../shared/constants/validation.const';

@Injectable({
  providedIn: 'root',
})
export class FieldDetailsFormConfig {
  constructor(private fb: FormBuilder) {}

  createForm(): FormGroup {
    return this.fb.group({
      fieldName: [
        '',
        [
          Validators.required,
          Validators.maxLength(ValidationRules.FIELD_NAME_MAX_LENGTH),
          Validators.pattern('^[a-zA-Z0-9 ]*$'),
        ],
      ],
      address: ['', [Validators.required, Validators.maxLength(100)]],
      area: [
        0,
        [Validators.required, Validators.min(ValidationRules.FIELD_AREA_MIN)],
      ],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(ValidationPatterns.PHONE)],
      ],
      baseRate: [
        0,
        [
          Validators.required,
          Validators.min(ValidationRules.FEILD_BASE_RATE_MIN),
        ],
      ],
      isAvailable: [true, [Validators.required]],
      rulesPolicies: ['', Validators.required],
      description: ['', [Validators.required]],
      documents: [[], [Validators.required]],
      closeDays: [[]],
    });
  }
}
