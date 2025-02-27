// ページが読み込まれたときに状態を復元
window.addEventListener('load', loadFormState);
window.addEventListener('load', activateSubmitButton);
window.addEventListener('load', renewNameCardInfo);

// フォームが変更されたときに状態を保存
document.querySelector("form").addEventListener('input', saveFormState);

function loadFormState() {
    let formData = localStorage.getItem('formData');
    if (formData) {
        formData = JSON.parse(formData);
        //formData["courtNum"]を処理
        let loadedCourtNum = formData["courtNum"];
        let courtNum = document.querySelector("#counter");
        if (isNaN(loadedCourtNum)) {
            courtNum.value = 0;
        }
        else {
            courtNum.value = loadedCourtNum;
        }
        console.log("courtNum", courtNum.value)
        delete formData.courtNum;

        //formData["input"]を処理　これがplayerのデータ
        let inputTags = document.querySelectorAll("#name-card-container input");
        console.log("formData:", formData);
        let keys = Object.keys(formData)
        console.log("formData.length:", keys.length);
        //ボタンから追加した分のinputタグを追加
        for (let i = 0; i < (keys.length - inputTags.length); i++) {
            addNameArea();
        }
        scrollToRightEdge();
        //inputTagsの更新
        inputTags = document.querySelectorAll("#name-card-container input");
        inputTags.forEach((input, index) => {
            if (formData[`input${index}`]) {
                input.value = formData[`input${index}`];
            }
        });
    }
}


//ユーザの操作を判断
const interactionEvents = ["click", "scroll", "mousemove", "keydown", "touchstart", "input"];
interactionEvents.forEach(event => {
    document.addEventListener(event, saveFormState);
    document.addEventListener(event, countUpPlayerNum);
    document.addEventListener(event, activateSubmitButton);
    document.addEventListener(event, renewNameCardInfo);
});


//読み込んだときにデータを保存するように
function saveFormState() {
    let inputTags = document.querySelectorAll("#name-card-container input");
    let formData = {};
    inputTags.forEach((input, index) => {
        formData[`input${index}`] = input.value;
    });
    let courtNum = document.querySelector("#counter").value;
    formData["courtNum"] = courtNum;
    localStorage.setItem('formData', JSON.stringify(formData));
}


function increase() {
    let counter = document.getElementById('counter');
    counter.value = parseInt(counter.value) + 1;
}

function decrease() {
    let counter = document.getElementById('counter');
    if (parseInt(counter.value) > 0) {
        counter.value = parseInt(counter.value) - 1;
    }
}


function countUpPlayerNum() {
    let nameAreaNum = document.querySelectorAll(".name-area").length;
    function countupTextContent(id) {
        let counter = document.querySelector("#show-added-player-num");
        counter.textContent = nameAreaNum.toString();
    }
    countupTextContent("#show-added-player-num");
    countupTextContent("#show-player-num");
}

function scrollToRightEdge() {
    let nameAreaNum = document.querySelectorAll(".name-area").length;
    let container = document.querySelector('#name-card-container');
    let scrollAmount = (container.offsetWidth + 10) * nameAreaNum;
    // 現在のスクロール位置を次の位置に変更
    container.scrollTo({
        left: scrollAmount,  // 横にスクロール
        behavior: 'smooth'   // スムーズスクロール
    });
}

//.name-areaを追加するボタン
function addNameArea() {
    let nameAreaNum = document.querySelectorAll(".name-area").length;
    function createNewNameArea() {
        let nameArea = document.createElement("div");
        nameArea.setAttribute("class", "name-area");

        let deleteButton = document.createElement("button");
        deleteButton.setAttribute("class", "delete-button");
        deleteButton.setAttribute("onclick", "deletePlayer(this)");
        deleteButton.setAttribute("type", "button");

        let showMessage = document.createElement("div");
        showMessage.setAttribute("class", "show-message");
        showMessage.textContent = "名前を入力してください";


        let showPlayerNum = document.createElement("div");
        showPlayerNum.setAttribute("class", "show-player-num");
        showPlayerNum.textContent = `player ${nameAreaNum + 1}`;

        let inputNameArea = document.createElement("div");
        inputNameArea.setAttribute("class", "input-name-area");
        let inputTag = document.createElement("input");
        inputTag.setAttribute("type", "text");
        inputTag.setAttribute("class", "input-name-tag");
        inputTag.setAttribute("name", `player${nameAreaNum + 1}`)
        inputNameArea.appendChild(inputTag);

        nameArea.appendChild(deleteButton);
        nameArea.appendChild(showMessage);
        nameArea.appendChild(showPlayerNum);
        nameArea.appendChild(inputNameArea);

        let container = document.querySelector("#name-card-container");
        container.appendChild(nameArea);
    }
    createNewNameArea();
    countUpPlayerNum();
    scrollToRight();
}

const needMorePlayer = document.querySelector("#needMorePlayer");
const needFillBlanc = document.querySelector("#needFillBlanc");
const duplication = document.querySelector("#duplication");
function activateSubmitButton() {
    let courtNum = document.querySelector("#counter");
    courtNum = Number(courtNum.value);
    let playerNum = document.querySelectorAll(".name-area").length;
    let btn = document.querySelector("#register-button");
    let name = document.querySelectorAll(".input-name-area>input");
    let playerFlag = 0;
    let chohuku = new Set();
    let chohukuFlag = 0;
    let checkFlag = 0
    name.forEach(elem => {
        if (elem.value == "") {
            playerFlag += 1;
        }
        // 重複チェック
        if (chohuku.has(elem.value)) {
            chohukuFlag += 1;
        } else {
            chohuku.add(elem.value);
        }
    });
    //コート数 * 4 <= 参加者数
    if (courtNum <= 0 || courtNum * 4 > playerNum) {
        btn.setAttribute("disabled", "true");
        btn.setAttribute("class", "deactive");
        needMorePlayer.hidden = false;
        checkFlag += 1;
        //console.log("人数");
    }
    else{
        needMorePlayer.hidden = true;
    }
    //player名が未入力の場合
    if (playerFlag > 0) {
        btn.setAttribute("disabled", "true");
        btn.setAttribute("class", "deactive");
        needFillBlanc.hidden = false;
        checkFlag += 1;
        //console.log("未入力");
    }
    else{
        needFillBlanc.hidden = true;
    }
    //重複が含まれる場合
    if (chohukuFlag > 0) {
        btn.setAttribute("disabled", "true");
        btn.setAttribute("class", "deactive");
        duplication.hidden = false;
        checkFlag += 1;
        //console.log("重複");
    }
    else{
        duplication.hidden = true;
    }
    if (checkFlag == 0) {
        btn.removeAttribute("disabled");
        btn.setAttribute("class", "active");
        needMorePlayer.hidden = true;
        needFillBlanc.hidden = true;
        duplication.hidden = true;
    }
}


function scrollToLeft() {
    let container = document.querySelector('#name-card-container');
    let scrollAmount = container.offsetWidth;
    console.log(scrollAmount)
    // 現在のスクロール位置を次の位置に変更
    container.scrollBy({
        left: -scrollAmount,  // 横にスクロール
        behavior: 'smooth'   // スムーズスクロール
    });
}
function scrollToRight() {
    let container = document.querySelector('#name-card-container');
    let scrollAmount = container.offsetWidth + 10;

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

    fetch('/newVersion-post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            resetResult();
            //showGroups(data);
            create_result_as_svg(data);
            console.log('Success:', data);
        })
        .catch((error) => {
            console.log('Error:', error);
        });

}

//delete->数字振り直し
function deletePlayer(btn) {
    let parent = btn.parentNode;
    parent.remove();
    //player番号振り直し
    let players = document.querySelectorAll("#name-card-container>div>.show-player-num");
    for (let i = 0; i < players.length; i++) {
        players[i].textContent = `Player ${i + 1}`
    }
    saveFormState();
}

//表示されている#name-card-containerを取得
// →追加ボタンか左ボタンか入れ替え
let container = document.getElementById("name-card-container");
let nameCard = ""
const addButton = document.querySelector("#add-player");
const scrollToLeftButton = document.querySelector("#scrollToLeft");
let width = ""
container.addEventListener("scroll", () => {
    if (container.scrollLeft > 0) {
        if (width * (nameCard.length - 1) < container.scrollLeft) {
            addButton.hidden = false;
            scrollToLeftButton.hidden = true;
        }
        else {
            addButton.hidden = true
            scrollToLeftButton.hidden = false;
        }
    }
});
function renewNameCardInfo() {
    nameCard = document.querySelectorAll(".name-area");
    width = nameCard[0].offsetWidth;
}

function create_show_table(data) {
    let tableNum = data.length;
    const container = document.querySelector("#result");
    function new_table(data, n, m) {
        console.log("テーブル作成");
        let table = document.createElement('table');
        let thead = document.createElement("thead");
        let tbody = document.createElement('tbody');
        // Create header row
        const headerRow = document.createElement('tr');
        let courtHeader = document.createElement("td");
        courtHeader.textContent = `コート番号`;
        headerRow.appendChild(courtHeader);
        for (let j = 1; j < m + 1; j++) {
            const th = document.createElement('th');
            th.textContent = `メンバー ${j}`;
            headerRow.appendChild(th);
        }
        thead.appendChild(headerRow);
        // プレイヤー追加
        for (let i = 1; i < n + 1; i++) {
            const row = document.createElement('tr');
            let courtCell = document.createElement("td");
            courtCell.textContent = `コート${i}`
            row.appendChild(courtCell)
            console.log(`${i}行目 ${data[0][i - 1]}`)
            for (let j = 1; j < m + 1; j++) {
                const cell = document.createElement('td');
                cell.textContent = `${data[0][i - 1][j - 1]}`;
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        }
        // Append thead and tbody to the table
        table.appendChild(thead);
        table.appendChild(tbody);

        // Add table to the container
        container.appendChild(table);

        //休憩の人をpタグで追加
        let kyukeiP = document.createElement("p");
        kyukeiP.setAttribute("class", "kyukei");
        kyukeiP.textContent = data[1].join(", ") + " さんは休憩です";
        container.appendChild(kyukeiP);
    }
    for (let i = 0; i < tableNum; i++) {
        console.log(`new_table(data,${data[i][0].length},${data[i][0][0].length})`)
        new_table(data[i], data[i][0].length, data[i][0][0].length);
    }
    //画像出力ボタンを表示
    let btn = document.querySelector("#downloadAsPng");
    btn.hidden = false;
}
function showGroups(data) {
    data = data.data
    console.log("data in showGroups", data);
    create_show_table(data);
}
function resetResult() {
    let result = document.querySelector("#result-box");
    //console.log(result);
    let children = result.querySelectorAll("*");
    //console.log(children)
    children.forEach(elem => {
        elem.remove();
    })
}

//結果を画像として出力
function captureAsPNG() {
    const element = document.getElementById('result-box');

    modernScreenshot.domToPng(element)
        .then((dataUrl) => {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'capture.png';
            link.click();
            console.log("きゃぷちゃ")
        })
        .catch((error) => {
            console.error('キャプチャに失敗しました:', error);
        });
}





function scrollToLeftt() {
    let container = document.querySelector('#name-card-container');
    let scrollAmount = container.offsetWidth;
    container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
    });
}

/*
window.addEventListener("load", function () {
    let styleSheet = document.createElement("style");
    document.head.appendChild(styleSheet);
    const objectTag = document.querySelector(".badminton-court");
    const resultCourt = document.querySelector(".result-court");
    const rect = objectTag.getBoundingClientRect();
    let width = rect.width;
    let height = rect.height;
    console.log("表示されている幅:", rect.width);
    console.log("表示されている高さ:", rect.height);

    console.log(width, height);
    if (width && height) {
        resultCourt.style.width = width + "px";
        resultCourt.style.height = height + "px";

        styleSheet.innerHTML += `
                .result-court {
                    width: ${width}px;
                    height: ${height}px;
                }
            `;

    }
});
*/


function create_result_as_svg(data) {
    read_badminton_svg();
    //array = ["player1","player2","player3","player4"]
    function create_result_court(array) {
        let result_court = document.createElement("div");
        result_court.setAttribute("class", "result-court");

        let badminton_court = document.createElement("svg");
        badminton_court.setAttribute("class", "badminton-court");
        badminton_court.setAttribute("viewBox", "0 0 63 136");
        let useTag = document.createElement("use");
        useTag.setAttribute("xlink:href", "#badminton-court-svg");
        badminton_court.appendChild(useTag);
        result_court.appendChild(badminton_court);

        for (let i = 0; i < array.length; i++) {
            let textTag = document.createElement("text");
            textTag.setAttribute("class", `player-${i + 1}-place player-card`);
            textTag.textContent = array[i];
            result_court.appendChild(textTag);
        }
        return result_court
    }
    //console.log("create_result_as_svg_1:::", data);
    //console.log("data.data", data.data)
    //console.log("data.data[0]:", data.data[0]);
    let weeks = data.data;

    let result_box = document.querySelector("#result-box");
    for (let i = 0; i < weeks.length; i++) {
        let week = weeks[i]
        let player = week[0];
        let rest = week[1];



        let result_as_svg = document.createElement("div");
        result_as_svg.setAttribute("class", "result-as-svg");

        let result_per_week = document.createElement("div");
        result_per_week.setAttribute("class", "result-per-week");


        let headerDiv = document.createElement("div");
        headerDiv.setAttribute("class", "header-container");

        let p = document.createElement("p");
        p.textContent = `${i + 1}周目`
        p.setAttribute("class", "weeks_p");
        headerDiv.appendChild(p);

        let kyukei = document.createElement("text");
        kyukei.textContent = rest.join("さん ") + "さん は休憩です";
        kyukei.setAttribute("class", "player-who-rest");
        headerDiv.appendChild(kyukei);
        result_per_week.appendChild(headerDiv);



        for (let court of player) {
            //console.log(court)
            let result_court = create_result_court(court);
            result_as_svg.appendChild(result_court);
        }
        result_per_week.appendChild(result_as_svg);
        result_box.appendChild(result_per_week);
    }
    let btn = document.querySelector("#downloadAsPng");
    btn.hidden = false;
}

//svgファイルを読み込んでbodyにねじ込む
function read_badminton_svg() {
    // SVGファイルのURLを指定
    const svgUrl = 'static/img/badmintonCourt.svg';

    // fetchでSVGファイルを非同期で読み込む
    fetch(svgUrl)
        .then(response => response.text())  // SVGをテキストとして取得
        .then(svgText => {
            // SVGの内容をDOMに追加
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
            console.log(svgText);
            let def = document.querySelector("#result-box");
            def.innerHTML += svgText;
        })
        .catch(error => {
            console.error('Error loading SVG:', error);
        });
}