import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const service = inject(AuthService);
  const toastr = inject(ToastrService);

  if (service.IsLoggedIn()) {
    if (route.url.length > 0) {
      let menu = route.url[0].path;
      if (menu == 'user' || 'home' || 'home2' || 'home3') {
        if (service.getUserRole() == 'admin') {
          return true;
        } else {
          toastr.warning('Acceso restringido, no es administrador');
          router.navigate(['']);
          return false;
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  } else {
    router.navigate(['login']);
    return false;
  }
};
