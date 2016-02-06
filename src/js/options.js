( function ( w, d ) {

'use strict';

function log() {
    var args = Array.prototype.slice.call( arguments );
    
    args.unshift( '[options]' );
    console.log.apply( console, args );
} // end of log()


var send_update_notification = ( function() {
    var target_url = null;
    
    // manifest.json より、対象となる URL を取得
    $.get( '/manifest.json', function( json ) {
        target_url = json.content_scripts[ 0 ].matches[ 0 ];
        log( 'Target URL:', target_url );
        // TODO: 決め打ちのため、content_scripts や matches が複数あった場合には未対応
    }, 'json' );
    
    return function () {
       if ( ! target_url ) {
            return;
        }
        // 対象となるタブを指定し、メッセージを送信
        chrome.tabs.query( {
            url : target_url
        }, function ( tabs ) {
            $.each( tabs, function( index, tab ) {
                log( 'send to tab.id:', tab.id, tab );
                chrome.tabs.sendMessage( tab.id, {
                    type : "OPTIONS_UPDATE_NOTIFICATION"
                    // ※ ここでは更新を通知するのみで、オプションの内容は送信していない
                    //    実際の各タブにおけるオプションの取得は background.js を介してそれぞれ行う
                }, function ( response ) {
                    log( 'response from tab.id:', tab.id, response );
                } );
            } );
        } );
    };
} )(); // end of send_update_notification()


$( function () {
    var initial_value = {
        flag : ( localStorage[ 'flag' ] === '0' ) ? '0' : '1'
    ,   abtest : ( localStorage[ 'abtest' ] === 'B' ) ? 'B' : 'A'
    };
    
    $.each( [ 'flag', 'abtest' ], function( index, name ) {
        $( 'input[name="' + name + '"]:radio' ).each( function() {
            var radio = $( this );
            
            radio.prop( 'checked', ( radio.val() == initial_value[ name ] ) ? 'checked' : false );
        
        } ).change( function () {
            var radio = $( this ),
                value = radio.val();
            
            log( 'Changed: ' + name + '=', value );
            localStorage[ name ] = value;
            
            // オプションが変更されたタイミングで、対象となるタブに通知
            send_update_notification();
        } );
    } );
    
} );

} )( window, document );

// ■ end of file
