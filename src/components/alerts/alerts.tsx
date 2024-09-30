import Swal from 'sweetalert2';

export const successAlert = (title: string, text: string) => {
  Swal.fire({
    icon: 'success',
    title,
    text,
  });
}

export const errorAlert = (title: string, text: string) => {
  Swal.fire({
    icon: 'error',
    title,
    text,
  });
}

export const warningAlert = (title: string, text: string) => {
  Swal.fire({
    icon: 'warning',
    title,
    text,
  });
}

export const infoAlert = (title: string, text: string) => {
  Swal.fire({
    icon: 'info',
    title,
    text,
  });
}

export const questionAlert = (title: string, text: string) => {
    Swal.fire({
        icon: 'question',
        title,
        text,
    });
    }