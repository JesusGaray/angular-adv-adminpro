import { Injectable } from '@angular/core';
import { HttpClient, JsonpInterceptor } from '@angular/common/http';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';
import { Observable, of } from 'rxjs';
import { Usuario } from '../models/usuario.model';

const base_url=environment.base_url;

declare const gapi:any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2:any;
  public usuario:Usuario;

  constructor(private http:HttpClient) { 
    this.googleInit();
  }

  get token():string{

    return localStorage.getItem('token') || '';
  }

  get role():'ADMIN_ROLE'|'USER_ROLE'{
    return this.usuario.role;
  }
  get uid():string{
    return this.usuario.uid || '';
  }

  get headers(){
    return {
      headers:{
        'x-token':this.token
      }
    }
  }

  googleInit(){
    return new Promise<void>(resolve=>{
      gapi.load('auth2', ()=>{
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '65841206213-37dkdoqjlkj6e173tl4gv70n3vhspkq5.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          // Request scopes in addition to 'profile' and 'email'
          //scope: 'additional_scope'
        });

        resolve();
      });
    });
    
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    this.auth2.signOut().then(()=> {
    });
  }

  guardarLocalStorage(token:string,menu:any){
    localStorage.setItem('token',token);
    localStorage.setItem('menu',JSON.stringify(menu));
   
  }

  validarToken():Observable<boolean>{
    return this.http.get(`${base_url}/login/renew`,{
      headers:{
        'x-token':this.token
      }
    }).pipe(
      tap((resp:any)=>{
        const {
          email,
          google,
          nombre,
          role,
          img,
          uid
        }=resp.usuarioDB;

        this.usuario=new Usuario(nombre,email,'',img,google,role,uid);
        
        this.guardarLocalStorage(resp.token,resp.menu);

      }),
      map(resp=>true),
      catchError(error=>of(false))
    );
  }

  crearUsuario(formData:RegisterForm){
    return this.http.post(`${base_url}/usuarios`,formData)
              .pipe(
                tap((resp:any)=>{
                  this.guardarLocalStorage(resp.token,resp.menu);
                })
              );

  }

  actualizarPerfil(data:{email:string, nombre:string, role:string}){
    data={
      ...data,
      role:this.usuario.role
    }
    return this.http.put(`${base_url}/usuarios/${this.uid}`,data,this.headers);
  }

  login(formData:LoginForm){
    return this.http.post(`${base_url}/login`,formData)
      .pipe(
        tap((resp:any)=>{
          this.guardarLocalStorage(resp.token,resp.menu);
        })
      );

    

  }

  loginGoogle(token){
    return this.http.post(`${base_url}/login/google`,{token})
      .pipe(
        tap((resp:any)=>{
          this.guardarLocalStorage(resp.token,resp.menu);
        })
      );

  }
  
  cargarUsuarios(desde:number=0){
    const url=`${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>(url,this.headers)
            .pipe(
              map(resp=>{
                const usuarios=resp.usuarios.map(user=>new Usuario(user.nombre, user.email,'',user.img, user.google,user.role,user.uid));
                return {
                  total:resp.total,
                  usuarios
                };
              })
            )
  }

  eliminarUsuario(usuario:Usuario){
    const url=`${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url,this.headers);
  }

  guardarUsuario(usuario:Usuario){
    
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`,usuario,this.headers);
  }
}
