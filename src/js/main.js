( function ( w, d ) {

'use strict';

function log() {
    var args = Array.prototype.slice.call( arguments );
    
    args.unshift( '[chrome_message_sample#main]' );
    console.log.apply( console, args );

} // end of log()


var OPTIONS = {};

function update_options() {
    log( 'update_options()' );
    
    chrome.runtime.sendMessage( {
        type : 'GET_OPTIONS'
    }, function ( response ) {
        OPTIONS = response.options;
        log( 'options:', OPTIONS );
    } );
    
} // end of update_options()


function initialize() {
    // オプションの変更が通知された時にのみ更新を行えるよう、メッセージを監視
    chrome.runtime.onMessage.addListener( function ( message, sender, sendResponse ) {
        var type = message.type,
            response = {};
        
        switch ( type ) {
            case 'OPTIONS_UPDATE_NOTIFICATION':
                // 変更通知により、オプションを更新
                update_options();
                log( 'Message received:', type );
                response.result = 'OK';
                break;
            default:
                log( 'Unknown message type:', type );
                response.result = 'NG';
                break;
        }
        
        sendResponse( response );
    } );
    
    // 起動時オプションを取得
    update_options();
    
} // end of initialize()


initialize();

} )( window, document );

// ■ end of file
