import { Routes } from '@angular/router';
import { FieldComponent } from './field.component';
import { FieldBookingComponent } from './booking/field-booking/field-booking.component';
import { AddFieldComponent } from './add-field/add-field.component';
import { EditFieldComponent } from './edit-field/edit-field.component';
import { CalendarEditorComponent } from '../../shared/components/calendar/calendar-editor/calendar-editor.component';
import { FieldBookingRateAvailabilityComponent } from './booking/field-booking-rate-availability/field-booking-rate-availability.component';
import { AdminAuthGuard } from '../../shared/guards/admin-auth.guard';


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
        component: AddFieldComponent,
        canActivate: [AdminAuthGuard]
    },
    {
        path: 'edit/:id',
        component: EditFieldComponent,
        canActivate: [AdminAuthGuard]
    },
    {
        path: 'rate/:id',
        component: FieldBookingRateAvailabilityComponent,
        canActivate: [AdminAuthGuard]
    },
    {
        path: 'availability/:id',
        component: FieldBookingRateAvailabilityComponent,
        canActivate: [AdminAuthGuard]
    }
] as Routes;
