import Swal, { type SweetAlertOptions } from "sweetalert2";

// Enhanced Swal with glassmorphic design
export const GlassSwal = {
  fire: (options: SweetAlertOptions = {}) => {
    return Swal.fire({
      customClass: {
        popup: "glassmorphic-swal-popup",
        title: "glassmorphic-swal-title",
        htmlContainer: "glassmorphic-swal-content",
        confirmButton: "glassmorphic-swal-confirm-btn",
        cancelButton: "glassmorphic-swal-cancel-btn",
        actions: "glassmorphic-swal-actions",
        icon: "glassmorphic-swal-icon",
        ...options.customClass,
      },
      backdrop: "rgba(0, 0, 0, 0.75)",
      showConfirmButton: true,
      confirmButtonText: "OK",
      allowOutsideClick: false,
      allowEscapeKey: true,
      allowEnterKey: true,
      stopKeydownPropagation: false,
      showClass: {
        popup: "animate__animated animate__fadeInDown animate__faster",
        backdrop: "animate__animated animate__fadeIn animate__faster",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp animate__faster",
        backdrop: "animate__animated animate__fadeOut animate__faster",
      },
      ...options,
    });
  },

  // Predefined glassmorphic alerts
  success: (title: string, text?: string) => {
    return GlassSwal.fire({
      title,
      text,
      icon: "success",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  },

  error: (title: string, text?: string) => {
    return GlassSwal.fire({
      title,
      text,
      icon: "error",
      showConfirmButton: true,
    });
  },

  warning: (title: string, text?: string) => {
    return GlassSwal.fire({
      title,
      text,
      icon: "warning",
      showConfirmButton: true,
    });
  },

  info: (title: string, text?: string) => {
    return GlassSwal.fire({
      title,
      text,
      icon: "info",
      showConfirmButton: true,
    });
  },

  confirm: (title: string, text?: string) => {
    return GlassSwal.fire({
      title,
      text,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
  },
};

export default GlassSwal;
