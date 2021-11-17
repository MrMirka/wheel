let count = 0;
let turnOff = false;

//Position data

const position = [
   0, 0.314, 0.628, 0.942, 1.256, 1.57, 1.884, 2.198, 2.512, 2.826,
   3.14, 3.454, 3.768, 4.082, 4.396, 4.71, 5.024, 5.338, 5.652, 5.966
];


const selectPosition = position[19];

console.log(getRotationAngle());

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

//Radial blur
const radialBlur = new PIXI.filters.RadialBlurFilter();
wheel.filters = [radialBlur];

radialBlur.angle = 0;
radialBlur.kernelSize = 120;
radialBlur.center = [370 , 370];
radialBlur.radius = 370;

//window.addEventListener('mousedown', () => {});

/*
let n = 0;
let angle = 0;
while ( n < 20) {
    console.log(angle);
    n++;
    angle +=0.314;
    
}
*/


//Loop
app.ticker.add(() => {
    if(!turnOff) {
        count+=0.0004;
        if(count > 0.15) turnOff = true;
    } else if(turnOff){
        count-=0.0004;
        if(count <= 0) { count = 0; turnOff = false; radialBlur.angle = 0 }
    }
    
    radialBlur.angle = CubicInOut(0,count*0.5,1,0.5) * 30;
    container.rotation += CubicInOut(0,count*0.5,1,0.5);
    
});

//Easing
function CubicInOut(t, b, c, d){
	if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
	return c / 2 * ((t -= 2) * t * t + 2) + b;
}

//n - current engle
function getDelta(n) {
    if (n === 0) return 0;
    return 2 * Math.PI - n;
}

function getRotationAngle(){
    return getDelta(selectPosition) + Math.PI * 6 + selectPosition;
}