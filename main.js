/***此处的 x y 均代表触摸或者点击处的坐标***/


const cavans = document.querySelector('#pannel')
// 获取渲染上下文
const context = cavans.getContext('2d')


// 设置一些全局状态
let isWorking = false  // 是否进行绘图
let isEraserWorking = false  // 橡皮擦是否工作
let oldPoint = { x: undefined, y: undefined }
let lineWidth = 3

// 重置画布尺寸
autoSetCavansSize(cavans)

// 响应用户动作
listenToUser(cavans)


function listenToUser(cavans) {
  // 获取橡皮和画笔清屏和下载
  const eraser = document.querySelector('#eraser')
  const pen = document.querySelector('#pen')
  const clear = document.querySelector('#clear')
  const download = document.querySelector('#download')

  // 功能区绑定点击事件
  // 设置画笔和橡皮是否工作
  eraser.addEventListener('click', () => {
    isEraserWorking = true

    clear.classList.remove('click')
    pen.classList.remove('click')
    eraser.classList.add('click')
  })

  pen.addEventListener('click', () => {
    isEraserWorking = false

    pen.classList.add('click')
    eraser.classList.remove('click')
    clear.classList.remove('click')
  })

  clear.addEventListener('click', () => {
    context.clearRect(0, 0, cavans.width, cavans.height);
    pen.classList.add('click')
    eraser.classList.remove('click')
    isEraserWorking = false
  })

  // 下载图片
  download.addEventListener('click', () => {
    let link = document.createElement('a');
    link.download = 'filename.png';
    link.href = cavans.toDataURL()
    link.click();
  })


  // 设置画笔颜色

  let colorArray = document.querySelectorAll('.color>li')

  colorArray.forEach(pen => {
    pen.addEventListener('click', (event) => {
      let color = event.target.className
      colorArray.forEach(pen => {
        pen.classList.remove('active')
      })
      event.target.classList.add('active')
      context.strokeStyle = color
    })
  })


  // 设置画笔粗细

  let lineArray = document.querySelectorAll('.line>li')

  lineArray.forEach(line => {
    line.addEventListener('click', (event) => {
      lineArray.forEach(pen => {
        pen.classList.remove('active')
      })
      let lineSize = window.getComputedStyle(event.target, null).getPropertyValue("height")
      event.target.classList.add('active')

      lineWidth = parseInt(lineSize, 10)
    })
  })

  // 设置起点

  // 特性检测是否触屏设备
  if (document.ontouchstart !== undefined) {

    // 触屏设备逻辑
    cavans.addEventListener('touchstart', (event) => {

      let x = event.touches[0].clientX
      let y = event.touches[0].clientY

      clickOrTouch(x, y)
    })

    cavans.addEventListener('touchmove', (event) => {
      let x = event.touches[0].clientX
      let y = event.touches[0].clientY

      startDrawOrClear(x, y)
    })

    cavans.addEventListener('touchend', () => {
      isWorking = false
    })

  } else {
    // 非触屏设备逻辑
    // 设置画线或者橡皮擦的起点

    // 鼠标按下将初始坐标传递给画笔或者橡皮擦
    cavans.addEventListener('mousedown', (event) => {
      let x = event.clientX
      let y = event.clientY

      clickOrTouch(x, y)
    })
  }

  // 鼠标移动传递新坐标
  cavans.addEventListener('mousemove', (event) => {

    let x = event.clientX
    let y = event.clientY
    startDrawOrClear(x, y)

  })

  cavans.addEventListener('mouseup', () => {
    isWorking = false
  })

}





/******画板尺寸设置******/

function autoSetCavansSize(cavans) {
  function resizeCavans() {
    let deviceWidth = document.documentElement.clientWidth
    let deviceHeight = document.documentElement.clientHeight

    cavans.width = deviceWidth
    cavans.height = deviceHeight
    context.fillStyle = "rgba(255,255,255)";
    context.fillRect(0, 0, deviceWidth, deviceHeight);
  }

  // 设置画板全屏
  resizeCavans()

  // 跟随页面尺寸变化
  window.onresize = function () {
    resizeCavans()
  }
}


/******画线函数******/
function drawLine(x1, y1, x2, y2) {
  context.beginPath()
  context.moveTo(x1, y1)   // 起点
  context.lineTo(x2, y2);     // 终点
  context.stroke()
}


/***按下鼠标或触屏时逻辑***/

function clickOrTouch(x, y) {
  // 获取初始坐标
  isWorking = true
  oldPoint.x = x
  oldPoint.y = y

  // 橡皮擦逻辑
  if (isEraserWorking) {
    context.clearRect(x - 8, y - 8, 10, 10)
  }
}

/***鼠标或手指移动的逻辑***/
function startDrawOrClear(x, y) {
  // 新坐标
  let newPoint = {
    x,
    y
  }


  // 绘制函数
  if (isWorking) {
    if (isEraserWorking) {
      context.clearRect(x - 8, y - 8, 16, 16) // 前两个是坐标，后两个是尺寸
    } else {
      context.lineWidth = lineWidth
      drawLine(oldPoint.x, oldPoint.y, newPoint.x, newPoint.y)
      oldPoint = newPoint
    }
  }
}

