import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { ListEstudiantesComponent } from './list-estudiantes/list-estudiantes.component';

import { UsuarioComponent } from './usuario/usuario.component';
import { InicioComponent } from './inicio/inicio.component';


const routes: Routes = [
  { path: 'usuario/:id', component: UsuarioComponent },
   { path: '', component:  InicioComponent },
    { path: 'registrar', component: RegisterComponent },
    { path: 'lista_estudiantes', component: ListEstudiantesComponent },

                { path: 'inicio', component:  InicioComponent },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
