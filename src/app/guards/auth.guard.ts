import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate,CanLoad {

  constructor(private usuarioServie:UsuarioService,
              private router:Router){}
  canLoad(route: Route, segments: import("@angular/router").UrlSegment[]): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
    return this.usuarioServie.validarToken()
        .pipe(
          tap(estaAutenticado=>{
            if(!estaAutenticado){
              this.router.navigateByUrl('/login');
            }
          })
        );
  }

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
