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

function addPlayer() {
    let divArea = document.querySelector("#inputPlayerArea");
    console.log(divArea);
    //新規inputタグのname属性のナンバリング用の数字取得
    let num = divArea.querySelectorAll("input").length;
    console.log(num);
    //新規row作成
    let newRow = document.createElement("div");
    newRow.setAttribute("class", "row");
    //新規pタグ作成
    let newP = document.createElement("p");
    newP.textContent = `Player ${num + 1}`
    newRow.appendChild(newP);
    //新規inputタグ作成
    let newPlayer = document.createElement("input");
    newPlayer.setAttribute("name", `player${num + 1}`);
    newPlayer.setAttribute("type", "text");
    newRow.appendChild(newPlayer);
    //削除ボタン作成
    let deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("type", "button");
    deleteBtn.setAttribute("onclick", "deletePlayer(this)");
    deleteBtn.textContent = "削除";
    newRow.appendChild(deleteBtn);

    divArea.appendChild(newRow);
}

function clearPlayers(){
    console.log("入力のクリア開始");
    let inputArea = document.querySelectorAll("#inputPlayerArea>div>input");
    inputArea.forEach(elem => {
        console.log(elem.value)
        elem.value = "";
    })
}

//delete->数字振り直し
function deletePlayer(btn) {
    let parent = btn.parentNode;
    parent.remove();
    //player番号振り直し
    let players = document.querySelectorAll("#inputPlayerArea>div>p");
    console.log(players);
    for(let i = 0; i < players.length; i++){
        players[i].textContent = `Player ${i+1}`
    }
    saveFormState();
}

function get_member_array() {
    let inputTags = document.querySelector("#inputArea").querySelectorAll("input");
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
    let alertMessage = document.querySelector("#alert");
    if (values["groups_per_week"] * 4 > values["members"].length) {
        //alert("コートの数に対して参加者が少なすぎます！！！");

        alertMessage.textContent = "コート数 * 4 <= 参加者数　となるように追加してください！"
    }
    //名前の重複がある場合
    else if (values["members"].length > tmp.length) {

        alertMessage.textContent = "名前に重複しているものがあります！！"
    }
    else {
        alertMessage.textContent = "";
        values["members"] = values["members"].filter(value => value != "")
        values["members"] = arrayShuffle(values["members"])
        console.log(values)
        console.log("これからfetchするよ")
        fetch('/post', {
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
                showGroups(data);
                
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}

//dataは[l][m][n][o]の4次元配列
//m*nのテーブルをl個作成
//data[グループ数][0 or 1(プレイヤー or 休憩)][コート数][メンバー0~4]
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
            console.log(`${i}行目 ${data[0][i-1]}`)
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
        new_table(data[i],data[i][0].length, data[i][0][0].length);
    }
}

function showGroups(data) {
    data = data.data
    console.log("data in showGroups", data);
    /*テキスト形式ではなくテーブルで表示することにしたから一旦コメントアウト
    let showResultArea = document.querySelector("#result");
    for (let i = 0; i < data.length; i++) {
        //グループ分けの結果を表示するためのdiv
        //周別div>グループ別div&休む人
        let resultRow = document.createElement("div");
        resultRow.setAttribute("class", "resultRow");
        resultRow.textContent = `${i + 1}周目`;
        console.log(`${i + 1}周目`);
        for (let j = 0; j < data[i][0].length; j++) {
            let groupRow = document.createElement("div");
            groupRow.setAttribute("class", "groupRow");
            groupRow.textContent = `コート${j + 1}`;
            let p = document.createElement("p");
            p.textContent = data[i][0][j].join(", ")
            groupRow.appendChild(p);
            console.log(`コート${j + 1}`);
            console.log(data[i][0][j]);
            resultRow.appendChild(groupRow);
        }
        console.log(`休む人： ${data[i][1]}`);
        let kyukei = document.createElement("div");
        kyukei.textContent = `${data[i][1]} さんは休憩です`;
        resultRow.appendChild(kyukei);
        showResultArea.appendChild(resultRow);

        console.log("_____________")
    }
    */
    create_show_table(data);
}
function resetResult() {
    let result = document.querySelector("#result");
    console.log(result);
    let children = result.querySelectorAll("*");
    console.log(children)
    children.forEach(elem => {
        elem.remove();
    })
}



//読み込んだときにデータを保存するように
function saveFormState() {
    let inputTags = document.querySelectorAll("#inputArea input");
    let formData = {};
    inputTags.forEach((input, index) => {
        formData[`input${index}`] = input.value;
    });
    localStorage.setItem('formData', JSON.stringify(formData));
}

function loadFormState() {
    let formData = localStorage.getItem('formData');
    if (formData) {
        formData = JSON.parse(formData);
        let inputTags = document.querySelectorAll("#inputArea input");
        console.log("formData:", formData);
        let keys = Object.keys(formData)
        console.log("formData.length:", keys.length);
        //ボタンから追加した分のinputタグを追加
        for (let i = 0; i < (keys.length - inputTags.length); i++) {
            addPlayer();
        }
        //inputTagsの更新
        inputTags = document.querySelectorAll("#inputArea input");
        inputTags.forEach((input, index) => {
            if (formData[`input${index}`]) {
                input.value = formData[`input${index}`];
            }
        });
    }
}

// ページが読み込まれたときに状態を復元
window.addEventListener('load', loadFormState);

// フォームが変更されたときに状態を保存
document.querySelector("#inputArea").addEventListener('input', saveFormState);
