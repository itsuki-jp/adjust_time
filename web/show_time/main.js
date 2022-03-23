const NAME_INPUT = document.getElementById("name_input");
const NAME_ADD_BTN = document.getElementById("name_add_btn");
const DISPLAY_NAME = document.getElementById("display_name");
const TIME_MANAGE = document.getElementById("manage");

/**
 * 各人の時間を管理するオブジェクト {0:{unique_id_time:x, 0:a},1:{},..n:{}}
 * @type {Object}
 */
const TIME_MANAGE_OBJ = {};

/**
 * 今誰の時間を編集しているか。これがないと、編集中の人間の名前を消しても、編集できる
 * @type {int}
 */
let name_manage_status = -1;

/**
 * よくわからない、必要？
 * @type {Set}
 */
const ID_SET = new Set();

/**
 * 各人のid, これがないと、TIME_MANAGE_OBJ使えない
 * @type {id}
 */
let id_name = 0;

/**
 * ボタンを作成し、それを子要素にする
 * @param {appendTo} 親要素
 * @param {text} ボタンに表示する文字
 * @return 作成されたボタン, (HTMLButtonElement)
 */
function create_button(appendTo, text) {
    let new_del_btn = document.createElement("button");
    new_del_btn.innerText = text;
    appendTo.appendChild(new_del_btn);
    return new_del_btn;
}

/**
 * 名前欄の「追加」を押されたときの処理
 * @param {add_name_input} ユーザーの名前
 * @return None
 */
function add_name(add_name_input) {
    let unique_id_name = id_name;
    TIME_MANAGE_OBJ[unique_id_name] = {};
    TIME_MANAGE_OBJ[unique_id_name].unique_id_time = 0;
    ID_SET.add(unique_id_name);

    // 大枠
    let new_div = document.createElement("div");

    // 入力された名前を表示するやつ
    let new_li = document.createElement("li");
    new_li.innerText = add_name_input;
    new_div.appendChild(new_li);

    // 削除ボタン
    let new_del_btn = create_button(new_div, "削除");
    new_del_btn.onclick = () => {
        // 色々と管理
        delete TIME_MANAGE_OBJ[unique_id_name];
        ID_SET.delete(unique_id_name);

        // 親要素を削除
        // DISPLAY_NAME.removeChild(new_li.parentNode);
        DISPLAY_NAME.removeChild(new_del_btn.parentNode);

        if (unique_id_name === name_manage_status) {
            TIME_MANAGE.innerHTML = "";
        }
    }

    // 時間調節ボタン
    let new_mng_btn = document.createElement("button");
    new_mng_btn.innerText = "空いてる時間を編集";
    new_div.appendChild(new_mng_btn);
    new_mng_btn.onclick = () => {
        edit_time(unique_id_name, add_name_input);
    }

    // 子要素にする
    DISPLAY_NAME.appendChild(new_div);
    id_name++;
}

/**
 * 削除ボタンが押されたときの処理をまとめたい
 */
function del() {}

/**
 * 「空いている時間を調節」を押されたときの処理
 * @param {unique_id_name} ユーザーのid
 * @param {add_name_input} ユーザーの名前
 * @return None
 */
function edit_time(unique_id_name, add_name_input) {
    // 基本的なUI
    TIME_MANAGE.innerHTML = "";
    name_manage_status = unique_id_name;

    let new_p = document.createElement("p"); // ユーザー名を表示
    new_p.innerText = add_name_input;
    TIME_MANAGE.appendChild(new_p);

    let new_input = document.createElement("input"); // 入力欄
    TIME_MANAGE.appendChild(new_input);
    let new_btn_add = document.createElement("button"); // 追加ボタン
    new_btn_add.innerText = "追加";
    TIME_MANAGE.appendChild(new_btn_add);

    // 時間を追加する
    let new_ul = document.createElement("ul"); // ユーザーの空いている時間を表示するリスト
    TIME_MANAGE.appendChild(new_ul);

    let id_time = 0; // 何個目の入力か把握する

    // 追加ボタンが押されたときの処理（時間を追加された時）
    new_btn_add.onclick = () => {
        let unique_id_time = TIME_MANAGE_OBJ[unique_id_name].unique_id_time;
        let user_input_time = new_input.value;

        // 時間を追加
        TIME_MANAGE_OBJ[unique_id_name][unique_id_time] = user_input_time;

        // まとめる
        // new_ulに（li, button）を個別に追加したくない→（li, button）をdivに追加し、divをulに追加する→TIME_MANGEに追加

        // li, button）をdivに追加
        // divを作る
        let new_div = document.createElement("div");

        // liを作り、divの子要素にする
        let new_li = document.createElement("li");
        new_li.innerText = user_input_time;
        new_div.appendChild(new_li);

        // buttonを作り、divの子要素にする
        let new_btn_rmv = create_button(new_div, "削除");
        new_btn_rmv.onclick = () => {
            delete TIME_MANAGE_OBJ[unique_id_name][unique_id_time];
            TIME_MANAGE.removeChild(new_btn_rmv.parentNode);
            console.log(TIME_MANAGE_OBJ);
        }

        // divをulに追加する
        new_ul.appendChild(new_div);

        // TIME_MANGEに追加
        TIME_MANAGE.appendChild(new_div);
        console.log(TIME_MANAGE_OBJ);
        TIME_MANAGE_OBJ[unique_id_name].unique_id_time++;
    }
}



NAME_ADD_BTN.onclick = () => {
    add_name(NAME_INPUT.value);
}

NAME_INPUT.onkeydown = event => {
    if (event.key === 'Enter') {
        add_name(NAME_INPUT.value);
    }
}