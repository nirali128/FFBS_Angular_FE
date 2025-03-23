import { Component } from '@angular/core';
import { FIELD_COLUMNS, FieldsDetailList } from '../../shared/interfaces/field';
import { FieldService } from '../../shared/service/field.service';
import { ApiPaginatedResponse } from '../../shared/interfaces/api.response';
import { DataViewComponent } from '../../shared/components/data-view/data-view.component';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-field',
  imports: [DataViewComponent, ButtonComponent],
  templateUrl: './field.component.html',
  styleUrl: './field.component.scss'
})
export class FieldComponent {
  fields: FieldsDetailList[];
  fieldColumns = FIELD_COLUMNS;
  fieldIcons = {
    address: 'location_on',
    area: 'straighten',
    phone: 'phone',
    rules: 'gavel'
  };

  constructor(public fieldService: FieldService, public router: Router) {
    this.fieldService.getAllFields().subscribe((res: ApiPaginatedResponse<FieldsDetailList[]>) => {
      if(res.success) {
        this.fields = res.data;
      }
    });
  }

  navigate(guid: string) {
    this.router.navigateByUrl("/field/booking/" + guid)
  }

  navigateToAddField() {
    this.router.navigateByUrl("/field/add");
  }

  edit(guid: string) {
    this.router.navigateByUrl("/field/edit/" + guid)
  }
}
