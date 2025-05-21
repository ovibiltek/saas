var toastroptions = {
    success: {
        "closeButton": true,
        "debug": false,
        "progressBar": true,
        "positionClass": "toast-top-full-width",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "2000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    },
    info: {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-top-full-width",
        "preventDuplicates": false,
        "onclick": null,
        "timeOut": "0",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "tapToDismiss": false
    },
    warning: {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-top-full-width",
        "preventDuplicates": false,
        "onclick": null,
        "timeOut": "0",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "tapToDismiss": false
    },
    error: {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-top-full-width",
        "preventDuplicates": false,
        "onclick": null,
        "timeOut": "0",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "tapToDismiss": false
    }
};
var msgs = new function () {
    var funo = new Object();

    function showError(msg, options) {
        toastr.clear();
        toastr.options = $.extend(true, toastroptions.error, options);
        toastr["error"](msg);
    }

    function showSuccess(msg, options) {
        toastr.clear();
        toastr.options = $.extend(true, toastroptions.success, options); 
        toastr["success"](msg);
    }

    function showInfo(msg, options) {
        toastr.clear();
        toastr.options = $.extend(true, toastroptions.info, options); 
        toastr["info"](msg);
    }

    function showWarning(msg, options) {
        toastr.clear();
        toastr.options = $.extend(true, toastroptions.warning, options);
        toastr["warning"](msg);
    }

    return {
        error: showError,
        success: showSuccess,
        info: showInfo,
        warning: showWarning
    };
};