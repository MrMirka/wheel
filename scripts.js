let n = 1; //Счетчик кадров 
let toRun = false;
let count = 0; //Счетчик блур (нужен для рассчета размития)
let radialBlur;
let loaderS;

const sprites = {}; //Хранилище текстур

//Угол поворота в радианах
const position = [
   {name: 'Купон на BMW_1',position: 0},
   {name: '50F_1', position: 0.314},
   {name: '2000F_1', position: 0.628},
   {name: '200F_1', position: 0.942,},
   {name: '50F_2', position: 1.256},
   {name: 'Гаджет', position: 1.57},
   {name: '100F_1', position: 1.884},
   {name: '200F_2', position: 2.198},
   {name: '500F_1', position: 2.512},
   {name: '50F_3', position: 2.826},
   {name: 'Купон на BMW_2', position: 3.14},
   {name: '200F_3', position: 3.454},
   {name: '2000F_2', position: 3.768},
   {name: '500F_2', position: 4.082},
   {name: '50F_4', position: 4.396},
   {name: 'Купон на BMW_3', position: 4.71},
   {name: '200F_4', position: 5.024},
   {name: '500F_3', position:5.338},
   {name: '100F_2', position: 5.652},
   {name: '5000F', position: 5.966}
];

//Базовые параметры скрипта
let param = {
    startPosition: 0, //From
    targetPosition: position[19].position, //To
    duration: 350,
    blurAngle: 2.3,
    imgBaraban: './img/baraban.png',
    imgBack: './img/barabanback.png',
    imgLogo: './img/logo.png',
    imgArrow: './img/arrow.png',
    width: document.getElementById('c').offsetWidth *  window.devicePixelRatio,
    height: document.getElementById('c').offsetHeight *  window.devicePixelRatio
};
//Установливает рандомную цель (тестовая)
setTarget();


//Create scene
let app = new PIXI.Application({
    width: param.width,
    height: param.height,
    //backgroundColor: 0xffffff,
    backgroundAlpha: 0,
    antialias: true,
    view: document.getElementById('c')
});
document.body.appendChild(app.view);

const container = new PIXI.Container();
const loaderBlock = new PIXI.Container();
loaderBlock.position.x = param.width / 2;
loaderBlock.position.y = param.height / 2;
loaderBlock.pivot.x = loaderBlock.width / 2;
loaderBlock.pivot.y = loaderBlock.height / 2;
app.stage.addChild(container, loaderBlock);

//Запуск лупа
initLoop();
initLoader();

//Loaders
const loader = new PIXI.Loader();
loader.add('wheelBack', param.imgBack)
      .add('wheel', param.imgBaraban)
      .add('wheelLogo', param.imgLogo)
      .add('wheelArrow', param.imgArrow);

loader.load((loader, resources) => {
    //Код выполняется после загрузки изображений
    sprites.wheel = new PIXI.Sprite(resources.wheel.texture);
    sprites.wheelLogo = new PIXI.Sprite(resources.wheelLogo.texture);
    sprites.wheelArrow = new PIXI.Sprite(resources.wheelArrow.texture);
    sprites.wheelBack = new PIXI.Sprite(resources.wheelBack.texture);

    //Задний фон
    sprites.wheelBack.anchor.set(0.5);
    sprites.wheelBack.width = param.width;
    sprites.wheelBack.height = param.height;
    container.addChild(sprites.wheelBack);

    //Барабан
    sprites.wheel.width = param.width * 0.94;
    sprites.wheel.height = param.height * 0.94;
    sprites.wheel.anchor.set(0.5);
    container.addChild(sprites.wheel);

    //Логотип
    sprites.wheelLogo.anchor.set(0.5);
    sprites.wheelLogo.width = param.width * 0.22;
    sprites.wheelLogo.height = param.height * 0.22;
    container.addChild(sprites.wheelLogo);

    //Стрелка
    sprites.wheelArrow.anchor.set(0.5);
    sprites.wheelArrow.width = param.width;
    sprites.wheelArrow.height = param.height;
    container.addChild(sprites.wheelArrow);

    //Радиальный блур
    radialBlur = new PIXI.filters.RadialBlurFilter();
    sprites.wheel.filters = [radialBlur];
    radialBlur.angle = 0;
    radialBlur.kernelSize = 120;
    radialBlur.center = [param.width / 2,param.height / 2];
    radialBlur.radius = param.width / 2;
    container.transform.position.set(param.width / 2,param.height / 2);

    removeLoader();

    //Mouse listener
    window.addEventListener('mousedown', () => { toRun = true; });
    window.addEventListener("touchstart", () => { toRun = true; });
});      




//Инициализируем анимацию, движение колеса когда toRun = true
function initLoop() {
    let countShift = (1 + param.blurAngle) / param.duration;
    app.ticker.add(() => {
           //Loader
        if(loaderBlock != undefined){
            loaderBlock.rotation += 0.25;
         }
        if(toRun){
            if(!isMobileDevice())
            radialBlur.angle = CubicInOut(Math.abs(Math.sin(count)) * param.duration, 0, param.blurAngle, param.duration);
            sprites.wheel.rotation = CubicInOut(n, param.startPosition, param.targetPosition - param.startPosition + (Math.PI * 4), param.duration);
            n++;
            count += countShift;
            if(n === param.duration) {
                count = 0;
                toRun = false;
                n = 1;
                updateParam(param.targetPosition);
                setTarget();
            }
        }
    });
}

//Изинг
function CubicInOut(t, b, c, d){
	if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
	return c / 2 * ((t -= 2) * t * t + 2) + b;
}

//Тестовая функция для рандомного положения барабана (заменить на нужное поведение) 
function setTarget(){
    let pos = Math.floor(Math.random() * 20);
    param.targetPosition = position[pos].position;

    let str = 'Кручу на ' + position[pos].name;
    console.log(str);
}

function updateParam(target){
    sprites.wheel.rotation = target; //Обнуляем количесво оборотов колеса (чтобы счисление было в пределах 0 - 2PI)
    param.startPosition = target; //Устанавливаем текущее положение в стартовое
}

//Проверка на мобильные устройства
//Блур включаем только на десктопах и айфонах
function isMobileDevice(){

	if( /Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		return true;
	}else{
		return false;
	}
}



function initLoader(){
    let size = param.width * 0.06;
    loaderS = new PIXI.Graphics();
    loaderS.beginFill(0xFF0025);
    loaderS.drawRect(0, 0, size, size);
    loaderS.beginFill(0xF7E800);
    loaderS.drawRect(size * 1.2, 0, size, size);
    loaderS.beginFill(0xF7E800);
    loaderS.drawRect(0, size * 1.2, size, size);
    loaderS.beginFill(0xFF0025);
    loaderS.drawRect(size * 1.2, size * 1.2, size, size);
    loaderS.pivot.x = loaderS.width / 2;
    loaderS.pivot.y = loaderS.height / 2;
    loaderBlock.addChild(loaderS);
}

function removeLoader(){
    app.stage.removeChild(loaderBlock);
}