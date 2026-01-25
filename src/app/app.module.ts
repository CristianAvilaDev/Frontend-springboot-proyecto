import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http'; // <-- Asegúrate de importar esto
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';

import { ListEstudiantesComponent } from './list-estudiantes/list-estudiantes.component';

import { UsuarioComponent } from './usuario/usuario.component';

import { InicioComponent } from './inicio/inicio.component';
import { FooterComponent } from './footer/footer.component';
import { NotificationComponent } from './components/notification/notification.component';


@NgModule({
  declarations: [
    AppComponent,

    RegisterComponent,

    ListEstudiantesComponent,

    UsuarioComponent,

    InicioComponent,
      FooterComponent,
      NotificationComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule  // <-- Añade esto a los imports
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
