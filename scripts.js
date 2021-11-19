let n = 1;
let toRun = false;
let count = 0;

//let caption = document.getElementById("caption");

//Position data
const position = [
   0, 0.314, 0.628, 0.942, 1.256, 1.57, 1.884, 2.198, 2.512, 2.826,
   3.14, 3.454, 3.768, 4.082, 4.396, 4.71, 5.024, 5.338, 5.652, 5.966
];


let param = {
    startPosition: 0,
    targetPosition: position[19],
    duration: 350,
    blurAngle: 2.3,
    imgBaraban: './img/baraban.png',
    imgBack: './img/baraban_back.png',
    imgLogo: './img/logo.png',
    imgArrow: './img/arrow.png',
    width: document.getElementById('c').offsetWidth,
    height: document.getElementById('c').offsetHeight
};
setTarget();


//Create scene
let app = new PIXI.Application({
    width: param.width,
    height: param.height,
    backgroundColor: 0xffffff,
    view: document.getElementById('c')
});
document.body.appendChild(app.view);


const container = new PIXI.Container();
app.stage.addChild(container);

//Add Back
const textureBack =  PIXI.Texture.from(param.imgBack);
const wheelBack = new PIXI.Sprite(textureBack);
wheelBack.anchor.set(0.5);
wheelBack.width = param.width;
wheelBack.height = param.height;
container.addChild(wheelBack);

//Add Disk 
const texture =  PIXI.Texture.from(param.imgBaraban);
const wheel = new PIXI.Sprite(texture);
wheel.width = param.width-50;
wheel.height = param.height-50;
wheel.anchor.set(0.5);
container.addChild(wheel);
container.transform.position.set(param.width / 2,param.height / 2);

//Add Logo
const textureLogo =  PIXI.Texture.from(param.imgLogo);
const wheelLogo = new PIXI.Sprite(textureLogo);
wheelLogo.anchor.set(0.5);
wheelLogo.width = 130;
wheelLogo.height = 130;
container.addChild(wheelLogo);

//Add Arrow
const textureArrow =  PIXI.Texture.from(param.imgArrow);
const wheelArrow = new PIXI.Sprite(textureArrow);
wheelArrow.anchor.set(0.5,4);
wheelArrow.scale.set(0.5);
container.addChild(wheelArrow);


//Radial blur
const radialBlur = new PIXI.filters.RadialBlurFilter();
wheel.filters = [radialBlur];
radialBlur.angle = 0;
radialBlur.kernelSize = 120;
radialBlur.center = [param.width / 2,param.height / 2];
radialBlur.radius = param.width / 2;

//Mouse listener
window.addEventListener('mousedown', () => { toRun = true; });
window.addEventListener("touchstart", () => { toRun = true; });

//Loop
let countShift = (1 + param.blurAngle) / param.duration;
app.ticker.add(() => {
    if(toRun){
        if(!isMobileDevice())
        radialBlur.angle = CubicInOut(Math.abs(Math.sin(count)) * param.duration, 0, param.blurAngle, param.duration);
        wheel.rotation = CubicInOut(n, param.startPosition, param.targetPosition - param.startPosition + (Math.PI * 4), param.duration);
        n++;
        count += countShift;
        console.log(radialBlur.angle);
        if(n === param.duration) {
            count = 0;
            toRun = false;
            n = 1;
            updateParam(param.targetPosition);
            setTarget();
        }
    }
});

//Easing
function CubicInOut(t, b, c, d){
	if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
	return c / 2 * ((t -= 2) * t * t + 2) + b;
}

//PopUP 
function setTarget(){
    let pos = Math.floor(Math.random() * 20);
    param.targetPosition = position[pos];
    //let str = 'Кручу на ' + pos;
    //console.log(str);
    //caption.innerHTML = str;
}

function updateParam(target){
    wheel.rotation = target;
    param.startPosition = target;
}

function isMobileDevice(){

	if( /Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		return true;
	}else{
		return false;
	}
}