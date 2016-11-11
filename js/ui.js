  function tapEffect(target){     
      var height = target.offsetHeight;
      var width = target.offsetWidth;
      var type = 0;

      var startTx, startTy;
      target.addEventListener( 'touchstart', function( e ){
        var touches = e.touches[0];
        startTx = touches.clientX;
        startTy = touches.clientY;

      
      target.style.overflow = 'hidden';

      var span = document.createElement('span');
        span.className = 'circle';
        span.style.display= 'block';
        span.style.position= 'absolute';
        span.style.top= '50%';
        span.style.left= '50%';
        span.style.background='#000';
        span.style.opacity= 0.1;
        span.style.borderRadius='50%';

      if(width>height){
        span.style.width = 50/(width/height) + '%';
        span.style.height = '50%';
        span.style.marginLeft = -(50/(width/height))/2 + '%';
        span.style.marginTop = -(50/(width/height))/2 + '%';
        type = 1;
      }else if(width<height){
        span.style.height = 50/(height/width) + '%';
        span.style.width = '50%';
        span.style.marginLeft = -(50/(height/width))/2 + '%';
        span.style.marginTop = -(50/(height/width))/2 + '%';
        type = 2;
      }else{
        span.style.width = '50%';
        span.style.height = '50%';
        span.style.marginLeft = '-25%';
        span.style.marginTop = '-25%';
      }
        span.style.transition='all 300ms cubic-bezier(.02,.84,.84,.97)';
        target.appendChild(span);

      }, false );
      target.addEventListener( 'touchend', function( e ){
        var touches = e.changedTouches[0],
          endTx = touches.clientX,
          endTy = touches.clientY;
        // 在部分设备上 touch 事件比较灵敏，导致按下和松开手指时的事件坐标会出现一点点变化
        if( Math.abs(startTx - endTx) < 6 && Math.abs(startTy - endTy) < 6 ){
          //console.log( 'fire tap event' );
          console.log(width + '|||' + height)
          if(type == 1){
            target.querySelector('span').style.transform = 'scale('+150/(50/(width/height))+')';
          }
          else if(type == 2){
            target.querySelector('span').style.transform = 'scale('+150/(50/(height/width))+')';
          }else{
            target.querySelector('span').style.transform = 'scale('+150/50+')';
          }
          setTimeout(function(){
            target.querySelector('span').style.opacity = 0;
            setTimeout(function(){
              target.removeChild(target.children[0]);
              target.style.overflow = '';
              window.history.back();
            },30)
          },300)
        }
      }, false );
    }
  tapEffect(document.querySelector('.backbar i'))