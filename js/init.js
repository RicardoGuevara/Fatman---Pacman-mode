mainState.prototype = {
    preload: function() {
        game.load.image('loading','assets/img/ProgressBar.png');
        game.load.image('marca','assets/img/logo.png')
    },

    create: function() {

        clave_iden = prompt('Ingrese el nombre de la sala, si esta no existe será creada');        
        socket.emit('identifier',clave_iden);

        game.state.add('SplashScreen',online);
        game.state.start('SplashScreen');
    },

}

function evaluate_move(pj,key_order)
    {
        if(key_order.right && !key_order.up && !key_order.left && !key_order.down){
                 pj.animations.play("wright", 10, true); 
                 pj.idleFrame = 24; 
                 pj.x++;  
            }
            else{
                 
                if(!key_order.right && !key_order.up && key_order.left && !key_order.down){
                   pj.animations.play("wleft", 10, true); 
                   pj.idleFrame = 8;      
                   pj.x--;
                }else{
                    if(!key_order.right && key_order.up && !key_order.left && !key_order.down){
                        pj.animations.play("wup", 10, true); 
                        pj.idleFrame = 0; 
                        pj.y--;
                    }else{
                        if(!key_order.right && !key_order.up && !key_order.left && key_order.down){
                        pj.animations.play("wdown", 10, true); 
                        pj.idleFrame = 16; 
                        pj.y++;
                        }else{
                            pj.frame = pj.idleFrame;  
                        }       
                    }
                }
                 
            }
    };


game.state.add('main', mainState);
game.state.start('main');

