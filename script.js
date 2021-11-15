//Необходимые переменные
const inputs = document.querySelectorAll('.filters input');
const outputs = document.querySelectorAll('.filters output');
const resetBtn = document.querySelector('.btn-reset');
const image = document.querySelector('.editor img');
const nextBtn = document.querySelector('.btn-next');
const loadInput = document.getElementById('btnInput');
const canvas = document.querySelector('.canvas');
const fullScreenBtn = document.querySelector('.fullscreen');

//Создание изображения canvas
function drawImage() {
    let img = new Image();
    img.src = image.src;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
        const ctx = canvas.getContext("2d");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
    };     
}
drawImage();

//Применение css-фильтров с изменением значений
function filterChange() {
    const sizing = this.dataset.sizing || '';
    document.documentElement.style.setProperty(`--${this.name}`, this.value + sizing);
    for (let i = 0; i < outputs.length; i++){
        if (outputs[i].parentNode === this.parentNode){
            outputs[i].value = this.value;
        }
    }
}
function drawFilteredImage() {
    let img = new Image();
    img.src = image.src;
    img.crossOrigin = "Anonymous";
    const ctx = canvas.getContext("2d");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    //Нужно объявлять промежуточную переменную за циклом. Иначе ctx.filter имеет значение none
    let str = '';
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].name == 'hue') {
            str += `hue-rotate(${inputs[i].value}${inputs[i].dataset.sizing})`;
        } else {
            str += `${inputs[i].name}(${inputs[i].value}${inputs[i].dataset.sizing})`;
        }      
    }
    ctx.filter = str; 
    ctx.drawImage(img, 0, 0); 
}
inputs.forEach(input => input.addEventListener('input', filterChange));
inputs.forEach(input => input.addEventListener('input', drawFilteredImage));

//Листание изображений в зависимости от времени суток
const now = new Date();
const times = [
    {
    name: 'morning',
        hoursStart: 6,
        hoursEnd: 12
},
    {
    name: 'day',
        hoursStart: 12,
        hoursEnd: 18
},
    {
    name: 'evening',
        hoursStart: 18,
        hoursEnd: 24
},
    {
    name: 'night',
        hoursStart: 0,
        hoursEnd: 6
    }];
let step = 1;
function imgScrolling() {
    for (let i = 0; i < times.length; i++) {
        if (now.getHours() >= times[i].hoursStart && now.getHours() < times[i].hoursEnd)
        {
            let step2 = (step++).toString().padStart(2, '0');
            image.src = `assets/images/${times[i].name}/${step2}.jpg`;
            if (step2 == 20) {step = 1;}
        }
    }
}
function canvasScrolling() {
    let img = new Image();
    img.src = image.src;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
        const ctx = canvas.getContext("2d");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
    }
}
nextBtn.addEventListener('click', imgScrolling);
nextBtn.addEventListener('click', canvasScrolling);

//Загрузка изображений с компьютера
function imgLoading() {
    if (this.files && this.files[0]) {
        image.src = URL.createObjectURL(this.files[0]);
    }
    drawImage();
}
loadInput.addEventListener('change', imgLoading);

//Кнопка сброса
function resetAll() {
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = inputs[i].defaultValue;
        outputs[i].value = outputs[i].defaultValue;
        document.documentElement.style.removeProperty(`--${inputs[i].name}`);
    }
}
function resetCanvas() {
    let img = new Image();
    img.src = image.src;
    img.crossOrigin = "Anonymous";
    const ctx = canvas.getContext("2d");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.filter = "none";
    ctx.drawImage(img, 0, 0);
}
resetBtn.addEventListener('click', resetAll);
resetBtn.addEventListener('click', resetCanvas);

//Сохранение изображения
const download = document.querySelector('.btn-save');
download.addEventListener('click', function(e) {
  var link = document.createElement('a');
  link.download = 'download.png';
  link.href = canvas.toDataURL();
  link.click();
  link.delete;
});

//Полноэкранный режим on
fullScreenBtn.addEventListener('click', () => {
    if (document.body.requestFullscreen) {
    document.body.requestFullscreen();
  }
}
);
//Полноэкранный режим off
fullScreenBtn.addEventListener('click', () => {
    if (document.fullscreenElement) {
    document.exitFullscreen();
  }
});