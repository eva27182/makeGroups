function arrayShuffle(array) {
    for(let i = (array.length - 1); 0 < i; i--){
  
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
    divArea.appendChild(newRow);
}

//delete->数字振り直し
function deletePlayer(btn){
    let parent = btn.parentNode;
    parent.remove();
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
        else if (name == "weeks") {
            values["weeks"] = Number(elem.value);
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
    else if(values["members"].length > tmp.length){
        
        alertMessage.textContent = "名前に重複しているものがあります！！"
    }
    else {
        alertMessage.textContent = "";
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
}

function showGroups(data) {
    data = data.data
    console.log("data in showGroups", data);
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
}
function resetResult() {
    let result = document.querySelector("#result");
    console.log(result);
    let children = result.querySelectorAll("div");
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
        console.log("formData:",formData);
        let keys = Object.keys(formData)
        console.log("formData.length:", keys.length);
        //ボタンから追加した分のinputタグを追加
        for(let i = 0; i < (keys.length - inputTags.length); i++){
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
