import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-inicio',
  standalone: false,
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {
  totalEstudiantes: number = 0;
  isLoading: boolean = true;

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.isLoading = true;
    this.backendService.getDatosTOdosUsuarios().subscribe({
      next: (response) => {
        this.totalEstudiantes = Array.isArray(response) ? response.length : 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        this.isLoading = false;
        this.totalEstudiantes = 0;
      }
    });
  }
}
