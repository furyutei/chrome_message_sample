( function ( w, d ) {

'use strict';

function log() {
    var args = Array.prototype.slice.call( arguments );
    
    args.unshift( '[background]' );
    console.log.apply( console, args );
} // end of log()


chrome.runtime.onMessage.addListener( function ( message, sender, sendResponse ) {
    var type = message.type,
        response = {};
    
    switch ( type ) {
        case 'GET_OPTIONS':
            // localStorage に格納されているオプションを適切な形に変換の上、返す
            // ※ localStorage は文字列しか格納できないことに注意（例えば true を格納すると"true"になる）
            response.options = {
                flag : ( localStorage[ 'flag' ] === '0' ) ? false : true
            ,   abtest : ( localStorage[ 'abtest' ] === 'B' ) ? 'B' : 'A'
            };
            log( 'options:', response.options );
            response.result = 'OK';
            break;
        default:
            log( 'Unknown message type:', type );
            response.result = 'NG';
            break;
    }
    
    sendResponse( response );
} );

} )( window, document );

// ■ end of file
