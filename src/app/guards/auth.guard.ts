import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private usuarioServie:UsuarioService,
              private router:Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){      
    return this.usuarioServie.validarToken()
        .pipe(
          tap(estaAutenticado=>{
            if(!estaAutenticado){
              this.router.navigateByUrl('/login');
            }
          })
        );
  }
  
}
