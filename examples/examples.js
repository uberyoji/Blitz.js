// setup demo list
var demoList = [
    { name:"Boot", file:"/examples/boot.js" },
    { name:"Raycast", file:"/examples/raycast.js" },
    { name:"Rectcast", file:"/examples/rectcast.js" },
    { name:"Circlecast", file:"/examples/circlecast.js" },
    { name:"Ray Marching", file:"/examples/raymarch.js" },
    { name:"Ray Marching", file:"/examples/collisions.js" },
    { name:"Keyframe Animation", file:"/examples/anim.js" },
  ];

const demoListNode = document.getElementById("demoList")
for( let index=0; index<demoList.length; index++ )
{
    let entry = document.createElement('li');
    entry.innerHTML = `<a href="javascript:updateFrame(${index})">${demoList[index].name}</a>`;
    demoListNode.appendChild(entry);
}

// htmt template for iframe (ghetto solution until i know how to build libraries properly)
const htmlTemplate = `
<!DOCTYPE html>
  <html>
  <head>
    <meta http-Equiv="Cache-Control" Content="no-cache" />
    <meta http-Equiv="Pragma" Content="no-cache" />
    <meta http-Equiv="Expires" Content="0" />
  </head>
  <body>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/5.1.2/pixi.min.js"></script>
  <script src="/src/keyboard.js"></script>
  <script src="/src/Vector.js"></script>
  <script src="/src/Transform.js"></script>  
  <script src="/src/physics.js"></script>
  <script src="/src/Entity.js"></script>
  <script src="/src/component.js"></script>
  <script src="/src/animation.js"></script>
  <script src="/src/Collider.js"></script>
  <script src="/src/raymarcher.js"></script>
  <script src="/src/RigidBody.js"></script>
  <script src="/src/Think.js"></script>
  <script src="/src/pixi/gfx.js"></script>
  <script src="/src/pixi/text.js"></script>
  <script src="/src/pixi/sprite.js"></script>
  <script src="/src/Blitz.js"></script> 
  <script src="?"></script>
  </body>
  </html>`;

var iframe = undefined;
  
function updateFrame( demoIndex ) {

    if( iframe != undefined )
        iframe.parentNode.removeChild(iframe);

    iframe = document.createElement('iframe');
    iframe.className += " resp-iframe";
    document.getElementById("diviFrame").appendChild(iframe);

    var htmlDemoContent = htmlTemplate.replace( '?', demoList[demoIndex].file );
    iframe.contentWindow.document.open();    
    iframe.contentWindow.document.write(htmlDemoContent);
    iframe.contentWindow.document.close();
}

// updateFrame(0);

/*
var newScript = document.createElement("script");
newScript.src = "http://www.example.com/my-script.js";
target.appendChild(newScript);
*/