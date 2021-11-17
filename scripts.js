let count = 0;
let toRun = false;
let index = 2;

//Position data

const position = [
   0, 0.314, 0.628, 0.942, 1.256, 1.57, 1.884, 2.198, 2.512, 2.826,
   3.14, 3.454, 3.768, 4.082, 4.396, 4.71, 5.024, 5.338, 5.652, 5.966
];

let startPosition = position[0];
let toPosition = position[19];
let rotationAngle = getRotationAngle();

//Create scene
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

window.addEventListener('mousedown', () => { toRun = true; });



//Loop
app.ticker.add(() => {
    if(toRun){
     console.log(rotationAngle);   
     container.rotation += 0.01;
     if (container.rotation >= toPosition + Math.PI * index) {
             container.rotation = toPosition; 
             startPosition = toPosition; 
             toPosition = position [Math.floor(Math.random() * 20)];
             if(toPosition < startPosition) {
                 index = 4;
             } else {
                index = 2;
             }
             rotationAngle = getRotationAngle();
             toRun = false;
        }
    }
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
    
    return getDelta(startPosition) + Math.PI * 2 +  toPosition;
}