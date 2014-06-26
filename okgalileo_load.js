window.onload = function() { initdata() };

var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1c2ZuB_FYI0uj-f2a_OSG3uK_OsyCpdgeVSXAUrVqkR8/pubhtml';

function initdata() {
    Tabletop.init( { key: public_spreadsheet_url,
                simpleSheet: true } );
    }