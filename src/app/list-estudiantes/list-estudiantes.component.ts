import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { NotificationService } from '../services/notification.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-list-estudiantes',
  standalone: false,
  templateUrl: './list-estudiantes.component.html',
  styleUrls: ['./list-estudiantes.component.css']
})
export class ListEstudiantesComponent implements OnInit {

  datosTodosEstudiantes: any[] = [];  // Lista completa de estudiantes
  estudiantesFiltrados: any[] = [];   // Lista filtrada y ordenada
  currentPage: number = 1;
  itemsPerPage: number = 6;
  paginatedEstudiantes: any[] = [];
  totalPages: number = 0;
  itemsPerPageOptions: number[] = [6, 10, 20, 50];
  
  // Variables para búsqueda y filtrado
  searchTerm: string = '';
  sortBy: string = 'nombre-asc'; // nombre-asc, nombre-desc, email-asc, email-desc, id-asc, id-desc
  filterBy: string = 'todos'; // todos, nombre, email, id
  isLoading: boolean = false;
  
  // Subject para debounce en búsqueda
  private searchSubject = new Subject<string>();

  constructor(
    private backendService: BackendService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Configurar debounce para búsqueda (300ms de espera)
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.aplicarFiltrosYOrdenamiento();
    });

    this.obtenerDatosTOdosLosUsuarios();  // Cargar los datos al iniciar el componente
  }

  // Método para refrescar datos (útil después de crear/actualizar/eliminar)
  refrescarDatos(): void {
    // No refrescar automáticamente para evitar llamadas innecesarias a la BD
    // El usuario debe recargar manualmente si necesita datos actualizados
    this.notificationService.showInfo('Para ver cambios recientes, recarga la página manualmente');
  }

  // Método para ordenar por fecha de registro (más reciente primero)
  ordenarPorFechaRegistro(): void {
    this.sortBy = 'id-desc'; // Asumiendo que el ID incrementa con cada registro
    this.aplicarFiltrosYOrdenamiento();
  }
verMasEstudiante(estudiante: any): void {
  console.log(estudiante.studentId);  // Imprime el ID del estudiante
}


  // Obtiene todos los estudiantes desde el backend
  private obtenerDatosTOdosLosUsuarios(forceRefresh: boolean = false): void {
    this.isLoading = true;
    this.backendService.getDatosTOdosUsuarios(forceRefresh).subscribe({
      next: (response) => {
        this.datosTodosEstudiantes = response;
        console.log('Datos recibidos de todos los estudiantes:', this.datosTodosEstudiantes);
        this.isLoading = false;
        this.aplicarFiltrosYOrdenamiento();
      },
      error: (error) => {
        console.error('Error al obtener estudiantes:', error);
        this.isLoading = false;
        this.datosTodosEstudiantes = [];
        this.estudiantesFiltrados = [];
        const errorMessage = error?.message || 'Error al cargar los estudiantes. Por favor, intenta nuevamente.';
        this.notificationService.showError(errorMessage);
      }
    });
  }

  // Función para aplicar búsqueda, filtros y ordenamiento
  aplicarFiltrosYOrdenamiento(): void {
    // Evitar procesamiento si no hay datos cargados
    if (!this.datosTodosEstudiantes || this.datosTodosEstudiantes.length === 0) {
      this.estudiantesFiltrados = [];
      this.paginatedEstudiantes = [];
      this.totalPages = 0;
      return;
    }

    let resultado = [...this.datosTodosEstudiantes];
    
    // Aplicar búsqueda
    if (this.searchTerm.trim() !== '') {
      const termino = this.searchTerm.toLowerCase().trim();
      resultado = resultado.filter(estudiante => {
        const nombre = (estudiante.firstName || '').toLowerCase();
        const apellido = (estudiante.lastName || '').toLowerCase();
        const email = (estudiante.email || '').toLowerCase();
        const id = (estudiante.studentId || '').toString().toLowerCase();
        const nombreCompleto = `${nombre} ${apellido}`.trim();
        
        // Buscar según el filtro seleccionado
        if (this.filterBy === 'nombre') {
          return nombreCompleto.includes(termino) || nombre.includes(termino) || apellido.includes(termino);
        } else if (this.filterBy === 'email') {
          return email.includes(termino);
        } else if (this.filterBy === 'id') {
          return id.includes(termino);
        } else {
          // Buscar en todos los campos
          return nombreCompleto.includes(termino) || 
                 email.includes(termino) || 
                 id.includes(termino);
        }
      });
    }
    
    // Aplicar ordenamiento
    resultado = this.ordenarEstudiantes(resultado);
    
    this.estudiantesFiltrados = resultado;
    this.currentPage = 1; // Resetear a la primera página
    this.paginarEstudiantes();
  }
  
  // Función para ordenar estudiantes
  private ordenarEstudiantes(estudiantes: any[]): any[] {
    const copia = [...estudiantes];
    
    switch (this.sortBy) {
      case 'nombre-asc':
        return copia.sort((a, b) => {
          const nombreA = (a.firstName || '').toLowerCase();
          const nombreB = (b.firstName || '').toLowerCase();
          return nombreA.localeCompare(nombreB);
        });
      
      case 'nombre-desc':
        return copia.sort((a, b) => {
          const nombreA = (a.firstName || '').toLowerCase();
          const nombreB = (b.firstName || '').toLowerCase();
          return nombreB.localeCompare(nombreA);
        });
      
      case 'email-asc':
        return copia.sort((a, b) => {
          const emailA = (a.email || '').toLowerCase();
          const emailB = (b.email || '').toLowerCase();
          return emailA.localeCompare(emailB);
        });
      
      case 'email-desc':
        return copia.sort((a, b) => {
          const emailA = (a.email || '').toLowerCase();
          const emailB = (b.email || '').toLowerCase();
          return emailB.localeCompare(emailA);
        });
      
      case 'id-asc':
        return copia.sort((a, b) => {
          const idA = (a.studentId || '').toString();
          const idB = (b.studentId || '').toString();
          return idA.localeCompare(idB);
        });
      
      case 'id-desc':
        return copia.sort((a, b) => {
          const idA = (a.studentId || '').toString();
          const idB = (b.studentId || '').toString();
          return idB.localeCompare(idA);
        });
      
      default:
        return copia;
    }
  }
  
  // Función para paginar los estudiantes
  private paginarEstudiantes(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = this.currentPage * this.itemsPerPage;
    this.paginatedEstudiantes = this.estudiantesFiltrados.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.estudiantesFiltrados.length / this.itemsPerPage);
  }

  // Cambio de página hacia adelante
  siguientePagina(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginarEstudiantes();
    }
  }

  // Cambio de página hacia atrás
  anteriorPagina(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginarEstudiantes();
    }
  }

  // Ir a una página específica
  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.currentPage = pagina;
      this.paginarEstudiantes();
    }
  }

  // Cambiar items por página
  cambiarItemsPorPagina(): void {
    this.currentPage = 1; // Resetear a la primera página
    this.paginarEstudiantes();
  }
  
  // Limpiar búsqueda
  limpiarBusqueda(): void {
    this.searchTerm = '';
    this.aplicarFiltrosYOrdenamiento();
  }

  // Método para manejar input de búsqueda (para debounce)
  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
  }
  
  // Cambiar ordenamiento
  cambiarOrdenamiento(): void {
    this.aplicarFiltrosYOrdenamiento();
  }
  
  // Cambiar filtro
  cambiarFiltro(): void {
    this.aplicarFiltrosYOrdenamiento();
  }

  // Obtener números de página para mostrar
  obtenerPaginasParaMostrar(): number[] {
    const paginas: number[] = [];
    const maxPaginas = 5; // Mostrar máximo 5 números de página
    
    if (this.totalPages <= maxPaginas) {
      for (let i = 1; i <= this.totalPages; i++) {
        paginas.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          paginas.push(i);
        }
      } else if (this.currentPage >= this.totalPages - 2) {
        for (let i = this.totalPages - 4; i <= this.totalPages; i++) {
          paginas.push(i);
        }
      } else {
        for (let i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
          paginas.push(i);
        }
      }
    }
    return paginas;
  }
  
  // Obtener total de estudiantes filtrados
  getTotalFiltrados(): number {
    return this.estudiantesFiltrados.length;
  }

  // Exportar a CSV (exporta los datos filtrados)
  exportarCSV(): void {
    const headers = ['ID', 'Primer Nombre', 'Segundo Nombre', 'Email'];
    const rows = this.estudiantesFiltrados.map(est => [
      est.studentId || '',
      est.firstName || '',
      est.lastName || '',
      est.email || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `estudiantes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Exportar a Excel (formato CSV con extensión .xlsx)
  exportarExcel(): void {
    this.exportarCSV(); // Por simplicidad, usamos CSV que Excel puede abrir
  }

  // Imprimir lista
  imprimirLista(): void {
    window.print();
  }
}
