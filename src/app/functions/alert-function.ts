import Swal from 'sweetalert2';


export function alert_confirm(_title: string, _subtitle: string) {
    Swal.fire({
        title: _title,
        text: _subtitle,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Borrar!'
    }).then(result => {
        if (result.value) {
            return true;
        }
        else {
            return false;
        }
    });
}

export function alert_delete() {
    Swal.fire('Eliminado!', 'El registro fue eliminado.', 'success');
}


export function alert_success(title: string, timer?: number) {
    Swal.fire({
      icon: 'success',
      title: title,
      position: 'top-end',
      showConfirmButton: false,
      timer: timer == null || timer == undefined ? 1500 : timer
    });
  }
