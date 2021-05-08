import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { DashoardComponent } from './dashoard/dashoard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { MedicoComponent } from './mantenimientos/medicos/medico.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { PagesComponent } from './pages.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ProgressComponent } from './progress/progress.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';

const routes:Routes=[
    {
        path:'dashboard',
        component:PagesComponent,
        canActivate:[AuthGuard],
        children:[
        {path:'', component:DashoardComponent,data:{titulo:'Dashboard'}},
        {path:'account-settings', component:AccountSettingsComponent,data:{titulo:'Ajustes de cuentas'}},
        {path:'grafica1', component:Grafica1Component,data:{titulo:'Grafica #1'}},
        {path:'progress', component:ProgressComponent,data:{titulo:'Progress'}},
        {path:'promesas', component:PromesasComponent,data:{titulo:'Promesas'}},
        {path:'rxjs', component:RxjsComponent,data:{titulo:'RxJs'}},
        {path:'perfil', component:PerfilComponent,data:{titulo:'Perfil de usuario gaD'}},

        //Mantenimientos
        {path:'usuarios', component:UsuariosComponent,data:{titulo:'Usuarios de aplicacion gaD'}},
        {path:'hospitales', component:HospitalesComponent,data:{titulo:'Hospitales de aplicacion gaD'}},
        {path:'medicos', component:MedicosComponent,data:{titulo:'Mantenimiento de medicos gaD'}},
        {path:'medico/:id', component:MedicoComponent,data:{titulo:'Mantenimiento de medicos gaD'}},
    ]

    },
];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class PagesRoutingModule{}