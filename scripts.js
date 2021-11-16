let count = 0;
let turnOff = false;
let app = new PIXI.Application({
    width: 740,
    height: 740,
    backgroundColor: 0xffffff,
    view: document.getElementById('c')
});
document.body.appendChild(app.view);




const container = new PIXI.Container();

app.stage.addChild(container);

const texture =  PIXI.Texture.from('./img/wheel.png');

const wheel = new PIXI.Sprite(texture);
wheel.anchor.set(0.5);

container.addChild(wheel);



container.transform.position.set(370,370);
 
const radialBlur = new PIXI.filters.RadialBlurFilter();
container.filters = [radialBlur];

radialBlur.angle = 0;
radialBlur.kernelSize = 120;
radialBlur.center = [370 , 370];
radialBlur.radius = 370;

//window.addEventListener('mousedown', () => {});


app.ticker.add(() => {
    if(!turnOff) {
        count+=0.0004;
        if(count > 0.15) turnOff = true;
    } else if(turnOff){
        count-=0.0004;
        if(count <= 0) {count = 0; turnOff = false; radialBlur.angle=0}
    }
    
    radialBlur.angle = CubicInOut(0,count*0.5,1,0.5) * 30;
    container.rotation += CubicInOut(0,count*0.5,1,0.5);
    console.log(radialBlur.angle);
    
});


function CubicInOut(t, b, c, d){
	if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
	return c / 2 * ((t -= 2) * t * t + 2) + b;
}