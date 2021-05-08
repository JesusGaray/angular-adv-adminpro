import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm:FormGroup;
  public hospitales:Hospital[]=[];
  public medicoSeleccionado:Medico;
  public hospitalSeleccionado:Hospital;

  constructor(private fb:FormBuilder,
              private hospitalServive:HospitalService,
              private medicoService:MedicoService,
              private roter:Router,
              private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.params
      .subscribe(({id})=>{
        this.cargarMedico(id);
      });
    

    this.medicoForm=this.fb.group({
      nombre: ['Jesus',Validators.required],
      hospital:['',Validators.required],
    });
    this.cargarHospitales();

    this.medicoForm.get('hospital').valueChanges
      .subscribe(hospitalid=>{
        this.hospitalSeleccionado=this.hospitales.find(h=>h._id===hospitalid);
        console.log('tick');
      });
  }

  cargarMedico(id:string){
    if(id==='nuevo'){return;}
    this.medicoService.obtenerMedicoPorId(id)
      .pipe(
        delay(100)
      )
      .subscribe(medico=>{
        if(!medico){return this.roter.navigateByUrl(`/dashboard/medicos`);}
        const {nombre,hospital:{_id}} =medico;
        this.medicoSeleccionado=medico;
        this.medicoForm.setValue({nombre,hospital:_id});
      });
  }

  cargarHospitales(){
    this.hospitalServive.cargarHospitales()
      .subscribe((hospitales:Hospital[])=>{
        this.hospitales=hospitales;
      });

  }

  guardarMedico(){
    const {nombre}=this.medicoForm.value;

    if(this.medicoSeleccionado){
      //actualizar
      const data={
        ...this.medicoForm.value,
        _id:this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico(data)
        .subscribe(resp=>{
          Swal.fire('Actualizado gaD',`${nombre} actualizado correctamente`,'success');
          console.log(resp);
        })
    }else{
      //crear
      
      this.medicoService.crearMedico(this.medicoForm.value)
        .subscribe((resp:any)=>{
          Swal.fire('Creado gaD',`${nombre} creado correctamente`,'success');
          this.roter.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
        });
    }
  }

}
