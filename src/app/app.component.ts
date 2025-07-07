import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  cedula = '';
  showResult = false;
  inputError: string | null = null;
  baseSocios: { [key: string]: any } = {};

  private sociosDict: Record<string, any> = {};

  result: any = {};

  consultar(cedula: string): void {
    if (!cedula || cedula.trim() === '') {
      this.inputError = 'Por favor ingrese un número de cédula válido.';
      return;
    }

    this.inputError = null;

    const socio = this.sociosDict[cedula.trim()];

    if (!socio) {
      alert('Socio no encontrado');
      return;
    }

    this.cedula = cedula;

    this.result = {
      nombre: socio.APELLIDOSYNOMBRES,
      cedula: socio.IDENTIFICACION,
      recinto: socio.RECINTO,
      junta: String(socio.JUNTA),
      direccion: socio.DIRECCION,
      provincia: socio.PROVINCIA,
      canton: socio.CANTON,
    };

    this.showResult = true;
  }

  nuevaConsulta(): void {
    this.showResult = false;
    this.cedula = '';
    this.inputError = null;
  }

  ngOnInit() {
    fetch('/assets/socios.json')
      .then((res) => res.json())
      .then((data: any[]) => {
        data.forEach((s) => {
          this.sociosDict[s.IDENTIFICACION] = s;
        });
      })
      .catch((err) => console.error('Error cargando socios.json', err));
  }
}
