import { Routes } from '@angular/router';
import { FieldComponent } from './field.component';
import { FieldBookingComponent } from './booking/field-booking/field-booking.component';
import { AddFieldComponent } from './add-field/add-field.component';
import { EditFieldComponent } from './edit-field/edit-field.component';

export default [
    {
        path: '',
        component: FieldComponent,
    },
    {
        path: 'booking/:id',
        component: FieldBookingComponent
    },
    {
        path: 'add',
        component: AddFieldComponent
    },
    {
        path: 'edit/:id',
        component: EditFieldComponent
    }
] as Routes;
