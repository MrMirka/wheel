let n = 1;
let toRun = false;
let count = 0;

let caption = document.getElementById("caption");

//Position data

const position = [
   0, 0.314, 0.628, 0.942, 1.256, 1.57, 1.884, 2.198, 2.512, 2.826,
   3.14, 3.454, 3.768, 4.082, 4.396, 4.71, 5.024, 5.338, 5.652, 5.966
];

let param = {
    lastPosition: 0,
    startPosition: 0,
    targetPosition: position[19],
    duration: 350
};
setTarget();


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

const texture =  PIXI.Texture.from('./img/wheel2.png');
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
        //radialBlur.angle = Math.abs(Math.sin(count));
        radialBlur.angle = CubicInOut(Math.abs(Math.sin(count)) * param.duration, 0, 2.3, param.duration);
        container.rotation = CubicInOut(n, param.startPosition, param.targetPosition - param.startPosition + (Math.PI * 4), param.duration);
        n += 1;
        count += 0.009;
        if(n === param.duration) {
            count = 0;
            toRun = false;
            n = 1;
            container.rotation = param.targetPosition;
            param.startPosition = param.targetPosition;
            setTarget();
        }
    }
});

//Easing
function CubicInOut(t, b, c, d){
	if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
	return c / 2 * ((t -= 2) * t * t + 2) + b;
}
function setTarget(){
    let pos = Math.floor(Math.random() * 20);
    param.targetPosition = position[pos];
    let str = 'Кручу на ' + pos;
    console.log(str);
    caption.innerHTML = str;
}