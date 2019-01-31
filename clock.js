'floor|round|abs|sqrt|PI|sin|cos|pow|max|min'
.split('|')
    .forEach(function (p) {
        window[p] = Math[p];
    });


$("h1").css("font-weight", "bold");

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext('2d'),
    height = canvas.height = window.innerHeight,
    width = canvas.width = window.innerWidth;

ctx.lineJoin = 'round';

window.onresize = function () {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    cx = width / 2;
    cy = height / 2;
    r = min(width / 2.1, height / 2.1);

}

function padleft(s, v, n) {
    while (s.length < n) {
        s = v + s;
    }
    return s;
}

function rgb(hsl) {
    var h = hsl[0] / 60,
        s = hsl[1],
        l = hsl[2],
        c = s * (1 - abs(2 * l - 1)),
        x = c * (1 - abs(h % 2 - 1)),
        m = l - c / 2,
        rgb;
    if (isNaN(h)) {
        rgb = [0, 0, 0];
    } else if (h < 1) {
        rgb = [c, x, 0];
    } else if (h < 2) {
        rgb = [x, c, 0];
    } else if (h < 3) {
        rgb = [0, c, x];
    } else if (h < 4) {
        rgb = [0, x, c];
    } else if (h < 5) {
        rgb = [x, 0, c];
    } else {
        rgb = [c, 0, x];
    }
    return [floor((rgb[0] + m) * 255), floor((rgb[1] + m) * 255), floor((rgb[2] + m) * 255)];
}

function hexa(rgb) {
    return "#" + padleft(rgb[0].toString(16), "0", 2) + padleft(rgb[1].toString(16), "0", 2) + padleft(rgb[2].toString(16), "0", 2);
}

function line(cx, cy, r0, r1, a) {
    ctx.moveTo(cx + r0 * cos(a), cy + r0 * sin(a));
    ctx.lineTo(cx + r1 * cos(a), cy + r1 * sin(a));
}

function loop() {

    var date = new Date(Date.now()),
        t = date.getTime(),
        h = date.getHours() % 12,
        m = date.getMinutes(),
        s = date.getSeconds(),
        mi = date.getMilliseconds(),
        ha = (h + m / 60 + s / 3600) * 2 * PI / 12 - PI / 2,
        ma = (m + s / 60 + mi / 60000) * 2 * PI / 60 - PI / 2,
        sa = (s + mi / 1000) * 2 * PI / 60 - PI / 2,
        k, i, delta = 0,
        color = hexa(rgb([(t * 6 / 10000 + delta) % 360, 1, 0.5])),
        invcolor = hexa(rgb([(t * 6 / 10000 + 180 + delta) % 360, 1, 0.5]));

    if (abs(sa - ma) <= PI / 200 && abs(ma - ha) <= PI / 200) {
        delta = 180;
    }

    ctx.lineWidth = 1 + floor(min(width, height) / 40);
    ctx.strokeStyle = invcolor;
    ctx.fillStyle = color;
    $(".colored").css("color", invcolor);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    for (k = 1; k <= 3; k++) {
        ctx.moveTo(cx + k * r / 3, cy);
        ctx.arc(cx, cy, k * r / 3, 0, PI * 2);
    }


    line(cx, cy, 0, r / 3, ha);
    line(cx, cy, r / 3, 2 * r / 3, ma);
    line(cx, cy, 2 * r / 3, r, sa);
    ctx.stroke();
    ctx.closePath();
    ctx.lineWidth = 1 + floor(min(width, height) / 80);
    ctx.beginPath();
    for (i = 0; i < 3; i += 1) {
        if (i === c0 && c[i] < 1) {
            c[i] += 0.1;
        } else if (i !== c0 && c[i] > 0) {
            c[i] -= 0.1;
        }
        for (k = 0; k <= 12; k++) {
            line(cx, cy, (i + 1 - 0.4 * c[i]) * r / 3, (i + 1) * r / 3, k * 2 * PI / 12)
        }
        if (i > 0) {
            for (k = 0; k <= 60; k++) {
                line(cx, cy, (i + 1 - 0.2 * c[i]) * r / 3, (i + 1) * r / 3, k * 2 * PI / 60)
            }
        }
    }

    ctx.stroke();
    ctx.closePath();
}

function move(e) {
    var x = e.clientX,
        y = e.clientY,
        r2 = sqrt(pow(x - cx, 2) + pow(y - cy, 2));
    c0 = floor(3 * r2 / r);
}

var c = [0, 0, 0],
    c0 = 3,
    cx = width / 2,
    cy = height / 2,
    r = min(width / 2.1, height / 2.1),
    myInterval = setInterval(loop, 1000 / 30);

$(document).ready(function () {
    $('.preview').hover(function (event) { //Open on hover 
            if (event.currentTarget.id != undefined) {
                $("#preview img").attr("src", "");
                $("#preview img").attr("src", "img/" + event.currentTarget.id + ".jpg");
                $("#preview").stop();
                $("#preview").animate({
                    width: '100%',
                    opacity: '1'
                }, 200)
            }
        },
        function (event) { //Close when not hovered
            if (event.currentTarget.id != undefined) {
                $("#preview").stop();
                $("#preview").animate({
                    width: '0%',
                    opacity: '0'
                }, 200)
            }
        });

    document.addEventListener("mousemove", move);
});
