(function($) {
    "use strict"
    // MAterial Date picker
    $('#start_time').bootstrapMaterialDatePicker({
        weekStart: 0,
        time: true
    });

    // MAterial Date picker
    $('#end_time').bootstrapMaterialDatePicker({
        weekStart: 0,
        time: true
    });
    $('#timepicker').bootstrapMaterialDatePicker({
        format: 'HH:mm',
        time: true,
        date: false
    });
    $('#date-format').bootstrapMaterialDatePicker({
        format: 'dddd DD MMMM YYYY - HH:mm'
    });

    $('#min-date').bootstrapMaterialDatePicker({
        format: 'DD/MM/YYYY HH:mm',
        minDate: new Date()
    });

})(jQuery);