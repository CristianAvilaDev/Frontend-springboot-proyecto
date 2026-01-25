import { Component, OnInit } from '@angular/core';
import { BackendService } from './services/backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  // Método ejecutado al iniciar el componente, útil para configuraciones iniciales
  ngOnInit(): void {

  }
}
