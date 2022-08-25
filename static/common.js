export var Feux = Feux || {};
Feux.Processes = {};

export function initFeux() {
    Feux.Page.ready()
    return Feux
}
export function showModal(propObj) {
    Feux.Modal.show(propObj)
}
export function select2FocusInput() {
    var inputContainers = document.getElementsByClassName("css-b8ldur-Input")
    for (var i = 0; i < inputContainers.length; i++) {

        inputContainers[i].querySelector("input").addEventListener('focus', (event) => {
            var element = event.srcElement.closest(".css-2b097c-container").querySelector(".css-1wa3eu0-placeholder")
            var element2 = event.srcElement.closest(".css-2b097c-container").querySelector(".css-1uccc91-singleValue")
            if (element) {
                element.style.display = "none"
            }
            if (element2) {
                element2.style.display = "none"
            }

        });
        inputContainers[i].querySelector("input").addEventListener('blur', (event) => {
            var element = event.srcElement.closest(".css-2b097c-container").querySelector(".css-1wa3eu0-placeholder")
            var element2 = event.srcElement.closest(".css-2b097c-container").querySelector(".css-1uccc91-singleValue")
            if (element) {
                element.style.display = "block"
            }
            if (element2) {
                element2.style.display = "block"
            }
        });


    }
}
export function drawPatternLines(dotContainerId, userPatternNumbers) {
    Feux.UX.DrawPatternLines.init(dotContainerId, userPatternNumbers);
}
export function changeDrawLineStatus(propObj) {
    Feux.UX.DrawPatternLines.changeDrawLineStatus(propObj)
}
export function overlayclick() {
    Feux.UX.overlayclick()
}
export function hideModal(value) {
    Feux.Modal.hide(value)
}
export function refreshToolTips() {
    Feux.Page.tooltip();
}
//bir element(parentClassName) altındaki, istenilen class adına(childrenClassNames) sahip  tüm elemanların offsetheight'larının toplamını döndüren foksiyon
export function getElementsOffsetHeight(parentClassName, childrenClassNames) {

    var parentElement = document.getElementsByClassName(parentClassName)[0]
    var sumOfOffsetHeight = 0

    for (var i = 0; i < childrenClassNames.split("|").length; i++) {
        var childElementList = parentElement.getElementsByClassName(childrenClassNames.split("|")[i])

        for (var j = 0; j < childElementList.length; j++) {
            sumOfOffsetHeight = sumOfOffsetHeight + childElementList[j].offsetHeight
        }
    }
    //15 i mobilde ve tablette yukarı tranform olan elemtin alt kısmı görümemesi için ekledim
    return sumOfOffsetHeight + 15
}

function jsonKeyByValue(obj, valueToCheck) {
    var ret = '';

    for (var key in obj) {
        var keyVal = obj[key];

        if (keyVal === valueToCheck) {
            ret = key;
            break;
        }
    }

    return ret;
}

/// End
Feux.Page = {
    Props: {
        isTouchDevice: false,
        MediaQ: {
            Curr: {}
        },
        Scroll: {
            X: {
                lastVal: 0,
                currval: 0
            },
            Y: {
                lastVal: 0,
                currval: 0
            }
        },
        Window: {},
        Screen: {}
    },

    //-> Functions to call as DOM ready
    ready: function () {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            Feux.Page.Props.isTouchDevice = true;
        }
        Feux.Page.mediaQ("ready");
        Feux.Page.tooltip();
        Feux.Page.bodyclass();

    },

    //-> Determine page media query value
    mediaQ: function (action) {
        if (action === "ready") {
            //-> Retrieve media query ranges
            var xs1Val = document.getElementById("mq-xs1").offsetWidth;
            var xs2Val = document.getElementById("mq-xs2").offsetWidth;
            var sm1Val = document.getElementById("mq-sm1").offsetWidth;
            var sm2Val = document.getElementById("mq-sm2").offsetWidth;
            var mdVal = document.getElementById("mq-md").offsetWidth;
            var lgVal = document.getElementById("mq-lg").offsetWidth;

            //-> Remove media query reference container from DOM
            var mqValues = document.getElementById("mq-values");
            //document.getElementsByTagName('body')[0].removeChild(mqValues);


            Feux.Page.Props.MediaQ.Res = {
                xs1: xs1Val,
                xs2: xs2Val,
                sm1: sm1Val,
                sm2: sm2Val,
                md: mdVal,
                lg: lgVal
            };
        }

        //-> Retrieve current media query value
        var mqEl = document.createElement("div");
        mqEl.setAttribute("id", 'mq-info');
        document.getElementsByTagName('body')[0].appendChild(mqEl);
        Feux.Page.Props.MediaQ.Curr.key = jsonKeyByValue(Feux.Page.Props.MediaQ.Res, mqEl.offsetWidth);
        Feux.Page.Props.MediaQ.Curr.val = mqEl.offsetWidth;
        document.getElementsByTagName('body')[0].removeChild(mqEl);
    },

    //-> Setup tooltip elements
    tooltip: function () {
        //-> Get all element collection having f-tooltip class prefix
        var elems = document.querySelectorAll('[class*=f-tooltip]');

        //-> Loop through them and setup tooltip containers based on type
        for (var i = 0; i < elems.length; i++) {
            var elem = elems[i]
            var classNames = elem.className

            if (elems[i].getElementsByClassName("tt-icon").length == 0) {
                if (classNames.indexOf("f-tooltip-A") > -1) {
                    // create tooltip icon
                    var tooltipIcon = document.createElement("div");
                    tooltipIcon.classList.add("tt-icon");

                    // create tooltip-content and append as child of tooltip-icon
                    var tooltipText = elem.dataset.tooltipText;
                    var tooltipContent = document.createElement("div");
                    tooltipContent.innerHTML = tooltipText;
                    tooltipContent.classList.add("tt-content");
                    tooltipIcon.appendChild(tooltipContent);

                    // append tooltip-icon onto current element in loop
                    elem.appendChild(tooltipIcon);
                }
            }

        }

    },

    // //-> Add class for body tag in layout view
    bodyclass: function () {
        
        if (document.getElementsByTagName('main').length > 0) {
            var className = document.getElementsByTagName('main')[0].getAttribute("data-body-class");
            var classNameforHtml = document.getElementsByTagName('main')[0].getAttribute("data-html-class");
            if (className) {
                document.getElementsByTagName('body')[0].classList.remove(...document.getElementsByTagName('body')[0].classList);
                var classNames = className.split(" ")
                for (var i = 0; i < classNames.length; i++) {
                    document.getElementsByTagName('body')[0].classList.add(classNames[i]);
                }

            }
            if (classNameforHtml) {
                document.getElementsByTagName('html')[0].classList.remove(...document.getElementsByTagName('html')[0].classList);
                var classNamesforHtml = classNameforHtml.split(" ")
                for (var i = 0; i < classNamesforHtml.length; i++) {
                    document.getElementsByTagName('html')[0].classList.add(classNamesforHtml[i]);
                }

            }
        }

    }
};

Feux.UX = {

    DrawPatternLines: {
        Props: {
            dotPoints: []
        },
        Status: {
            drawLines: true,
        },
        init: function (dotContainerId, userPatternNumbers) {
            if (Feux.UX.DrawPatternLines.Status.drawLines) {
                Feux.UX.DrawPatternLines.Status.drawLines = false
                Feux.UX.DrawPatternLines.Props.dotContainerElement = document.getElementById(dotContainerId);
                
                var dotContainerChilds = Feux.UX.DrawPatternLines.Props.dotContainerElement.children;
                var userPatternCast = userPatternNumbers.toString();
                //123456789 numaralarının bulunduğu koordinatlar
                for (let i = 0; i < dotContainerChilds.length; i++) {

                    var points = { x: 0, y: 0 };
                    points.x = dotContainerChilds[i].offsetLeft;
                    points.y = dotContainerChilds[i].offsetTop;
                    Feux.UX.DrawPatternLines.Props.dotPoints.push(points);
                }

                //pattern number'lar sırayla çiziliyor
                for (var i = 0; i < userPatternCast.length - 1; i++) {
                    var firstNumber = Number(userPatternCast.charAt(i));
                    var secondNumber = Number(userPatternCast.charAt(i + 1));
                    dotContainerChilds[firstNumber - 1].classList.add("active")
                    dotContainerChilds[secondNumber - 1].classList.add("active")
                    Feux.UX.DrawPatternLines.createLine(Feux.UX.DrawPatternLines.Props.dotPoints[firstNumber - 1].x, Feux.UX.DrawPatternLines.Props.dotPoints[firstNumber - 1].y, Feux.UX.DrawPatternLines.Props.dotPoints[secondNumber - 1].x, Feux.UX.DrawPatternLines.Props.dotPoints[secondNumber - 1].y, i);

                }
            }
        },
        createLine: function (x1, y1, x2, y2, id) {

            //koordinatları belli olan iki nokta arasındaki uzaklık
            let distance = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

            let leftValue = (x1 + x2) / 2 - distance / 2; //line left değeri
            let topValue = (y1 + y2) / 2;                //line top değeri

            //koordinatları belli olan iki nokta arasındaki açı
            let degree = Math.atan2(y1 - y2, x1 - x2) * 180 / Math.PI;

            let lineElement = document.createElement("div");
            Feux.UX.DrawPatternLines.Props.dotContainerElement.appendChild(lineElement);
            lineElement.setAttribute("class", "line-" + (id + 1));
            lineElement.style.width = distance + 3 + "px";
            lineElement.style.left = leftValue + "px";
            lineElement.style.top = topValue + "px";
            lineElement.style.transform = "rotate(" + degree + "deg)";
        },
        changeDrawLineStatus: function (drawLines) {
            Feux.UX.DrawPatternLines.Status.drawLines = drawLines
        },

    }
};

/// End



