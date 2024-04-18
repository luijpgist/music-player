function parseLrc() {
    var lines = lrc.split('\n');
    var result = [];
    for (var i = 0; i < lines.length; i++) {
        var str = lines[i];
        var parts = str.split(']');
        var timeStr = parts[0].substring(1);

        var obj = {
            time: parseTime(timeStr), words: parts[1],
        };
        result.push(obj);
    }
    return result;
}

function parseTime(timeStr) {
    var parts = timeStr.split(':');
    return +parts[0] * 60 + +parts[1];
}

var doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector('.container ul'),
    container: document.querySelector('.container'),
}

function findIndex() {
    var currentTime = doms.audio.currentTime;

    for (var i = 0; i < lrcData.length; i++) {
        if (currentTime < lrcData[i].time) {
            return i - 1;
        }
    }
    return lrcData.length - 1;
}

var lrcData = parseLrc();

function createLrcElements() {
    for (var i = 0; i < lrcData.length; i++) {
        var li = document.createElement('li');
        li.textContent = lrcData[i].words;
        doms.ul.appendChild(li);
    }
}

createLrcElements();

var containerHeight = doms.container.clientHeight;
var liHeight = doms.ul.children[0].clientHeight;
var maxOffSet = doms.ul.clientHeight - containerHeight;

function setOffset() {
    var index = findIndex();
    var offSet = liHeight * index + liHeight * 0.5 - containerHeight * 0.5;

    if (offSet < 0) {
        offSet = 0;
    }

    if (offSet > maxOffSet) {
        offSet = maxOffSet;
    }
    doms.ul.style.transform = `translateY(-${offSet}px)`;
    var li = doms.ul.querySelector('.active');
    if (li) {
        li.classList.remove('active');
    }
    var li = doms.ul.children[index];
    if (li) {
        li.classList.add('active');
    }

}

doms.audio.addEventListener('timeupdate',setOffset);