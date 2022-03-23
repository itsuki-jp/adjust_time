const NAME_INPUT = document.getElementById("name_input");
const NAME_ADD_BTN = document.getElementById("name_add_btn");
const DISPLAY_NAME = document.getElementById("display_name");
const TIME_MANAGE = document.getElementById("manage");
const TIME_MANAGE_OBJ = {};
const ID_SET = new Set();
let id = 0;

function add_name(add_name_input) {
    let unique_id = id;
    TIME_MANAGE_OBJ[unique_id] = new Array();
    ID_SET.add(unique_id);

    // 大枠
    let new_div = document.createElement("div");

    // 入力された名前を表示するやつ
    let new_li = document.createElement("li");
    new_li.innerText = add_name_input;
    new_div.appendChild(new_li);

    // 削除ボタン
    let new_del_btn = document.createElement("button");
    new_del_btn.innerText = "del";
    new_div.appendChild(new_del_btn);
    new_del_btn.onclick = () => {
        console.log(unique_id);
        // 色々と管理
        delete TIME_MANAGE_OBJ[unique_id];
        ID_SET.delete(unique_id);

        // 親要素を削除
        DISPLAY_NAME.removeChild(new_del_btn.parentNode);
        console.log(TIME_MANAGE_OBJ);
    }

    // 時間調節ボタン
    let new_mng_btn = document.createElement("button");
    new_mng_btn.innerText = "manage";
    new_div.appendChild(new_mng_btn);
    new_mng_btn.onclick = () => {
        console.log("manage");
        let new_p = document.createElement("p");
        new_p.innerText = "oyo-";
        TIME_MANAGE.appendChild(new_p);
    }
    DISPLAY_NAME.appendChild(new_div);
    id++;
    console.log(TIME_MANAGE_OBJ);
}

NAME_ADD_BTN.onclick = () => {
    add_name(NAME_INPUT.value);
}

NAME_INPUT.onkeydown = event => {
    if (event.key === 'Enter') {
        add_name(NAME_INPUT.value);
    }
}