// ページが読み込まれたときに状態を復元
window.addEventListener('load', loadFormState);

// フォームが変更されたときに状態を保存
document.querySelector("form").addEventListener('input', saveFormState);

function loadFormState() {
    let formData = localStorage.getItem('formData');
    if (formData) {
        formData = JSON.parse(formData);
        let inputTags = document.querySelectorAll("#name-card-container input");
        console.log("formData:", formData);
        let keys = Object.keys(formData)
        console.log("formData.length:", keys.length);
        //ボタンから追加した分のinputタグを追加
        for (let i = 0; i < (keys.length - inputTags.length); i++) {
            addNameArea();
        }
        //inputTagsの更新
        inputTags = document.querySelectorAll("#name-card-container input");
        inputTags.forEach((input, index) => {
            if (formData[`input${index}`]) {
                input.value = formData[`input${index}`];
            }
        });
    }
}

//読み込んだときにデータを保存するように
function saveFormState() {
    let inputTags = document.querySelectorAll("#name-card-container input");
    let formData = {};
    inputTags.forEach((input, index) => {
        formData[`input${index}`] = input.value;
    });
    localStorage.setItem('formData', JSON.stringify(formData));
}


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

function arrayShuffle(array) {
    for (let i = (array.length - 1); 0 < i; i--) {

        // 0〜(i+1)の範囲で値を取得
        let r = Math.floor(Math.random() * (i + 1));

        // 要素の並び替えを実行
        let tmp = array[i];
        array[i] = array[r];
        array[r] = tmp;
    }
    return array;
}

function submitData() {
    let inputTags = document.querySelector("form").querySelectorAll("input");
    console.log(inputTags)
    let values = { "members": [] };
    inputTags.forEach(elem => {
        let name = elem.getAttribute("name");
        if (name == "groups_per_week") {
            values["groups_per_week"] = Number(elem.value);
        }
        else {
            values["members"].push(elem.value);
        }

    })
    values["members"] = values["members"].filter(value => value != "")
    console.log(values["groups_per_week"], values["members"].length)
    let tmp = [...new Set(values["members"])]; /*名前の重複判断用 */
    //コート数が多すぎる場合、エラーを表示

    values["members"] = values["members"].filter(value => value != "")
    values["members"] = arrayShuffle(values["members"])
    console.log(values)
    
    fetch('/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    })
        .then(response => response.json())
        .then(data => {
            resetResult();
            showGroups(data);
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

}

