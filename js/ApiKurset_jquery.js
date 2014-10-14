$(function() {
    $("#temprange").val(10 + "\u00B0 - " + 30 + "\u00B0 Celsius" );
    $("#tempslider").slider({
        range: true,
        min: -40,
        max: 50,
        values: [ 10, 30 ],
        slide: function( event, ui ) {
            $( "#temprange" ).val(ui.values[ 0 ] + "\u00B0 - " + ui.values[ 1 ] + "\u00B0 Celsius" );
        }
    });
});