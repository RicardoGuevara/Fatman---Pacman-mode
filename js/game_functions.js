var gameProperties = {
  screenWidth: document.getElementById("kill_me_pls").style.pixelWidth,
  screenHeight: document.getElementById("kill_me_pls").style.pixelHeight,
  playerSpeed: 20.0,
};

var SOUND_VOLUME = 0.1;

var graphicAssets = {
    sprites:    'assets/img/pj5.png',
    sprites2:   'assets/img/pj6.png',
    map1:       'assets/maps/catastrophi_level2.csv', 
    map1_img:   'assets/maps/catastrophi_tiles_16.png',
};
var soundAssets = {

};
var fontAssets = {


//FUNCTIONS



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
}

