function increase() {
    let counter = document.getElementById('counter');
    counter.value = parseInt(counter.value) + 1;
    activateSubmitButton();
}

function decrease() {
    let counter = document.getElementById('counter');
    if (parseInt(counter.value) > 0) {
        counter.value = parseInt(counter.value) - 1;
    }
    activateSubmitButton();
}

//.name-areaを追加するボタン
function addNameArea() {
    let nameAreaNum = document.querySelectorAll(".name-area").length;
    function createNewNameArea() {
        let nameArea = document.createElement("div");
        nameArea.setAttribute("class", "name-area");

        let showMessage = document.createElement("div");
        showMessage.setAttribute("class", "show-message");
        showMessage.textContent = "名前を入力してください";


        let showPlayerNum = document.createElement("div");
        showPlayerNum.setAttribute("class", "show-player-num");
        showPlayerNum.textContent = `player${nameAreaNum + 1}`;

        let inputNameArea = document.createElement("div");
        inputNameArea.setAttribute("class", "input-name-area");
        let inputTag = document.createElement("input");
        inputTag.setAttribute("type", "text");
        inputTag.setAttribute("name", `player${nameAreaNum + 1}`)
        inputNameArea.appendChild(inputTag);

        nameArea.appendChild(showMessage);
        nameArea.appendChild(showPlayerNum);
        nameArea.appendChild(inputNameArea);

        let container = document.querySelector("#name-card-container");
        container.appendChild(nameArea);
    }
    function countUpPlayerNum() {



        function countupTextContent(id) {
            let counter = document.querySelector("#show-added-player-num");
            counter.textContent = (nameAreaNum + 1).toString();
        }
        countupTextContent("#show-added-player-num");
        countupTextContent("#show-player-num");
    }
    function scrollToRight() {
        const container = document.querySelector('#name-card-container');
        const scrollAmount = container.offsetWidth * nameAreaNum;  // スクロール可能な幅

        // 現在のスクロール位置を次の位置に変更
        container.scrollBy({
            left: scrollAmount,  // 横にスクロール
            behavior: 'smooth'   // スムーズスクロール
        });
    }
    createNewNameArea();
    countUpPlayerNum();
    scrollToRight();
    activateSubmitButton();
}

function activateSubmitButton() {
    let courtNum = document.querySelector("#counter");
    courtNum = Number(courtNum.value);
    let playerNum = document.querySelectorAll(".name-area").length;
    //コート数 * 4 <= 参加者数
    if (courtNum > 0 && courtNum * 4 <= playerNum) {
        let btn = document.querySelector("#register-button");
        btn.removeAttribute("disabled");
        btn.setAttribute("class", "active");
    }
    else {
        let btn = document.querySelector("#register-button");
        btn.setAttribute("disabled", "true");
        btn.setAttribute("class", "deactive");
    }
}

function scrollToRight() {
    const container = document.querySelector('#name-card-container');
    const scrollAmount = container.offsetWidth * -1;

    // 現在のスクロール位置を次の位置に変更
    container.scrollBy({
        left: scrollAmount,  // 横にスクロール
        behavior: 'smooth'   // スムーズスクロール
    });
}
