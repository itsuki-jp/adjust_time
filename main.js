const NAME_INPUT = document.getElementById("name_input");
const SELECT_NAME = document.getElementById("name");
const NAME_ADD_BTN = document.getElementById("name_add_btn");
const SELECT_AREA = document.getElementById("select_area");
const TIME_MANAGE = document.getElementById("manage");

/**
 * 各人の時間を管理するオブジェクト {0:{unique_id_time:x,sets:Set(), 0:a},1:{},..n:{}}
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
 * ユーザー名を記録
 */
const USERNAME = {};

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
    let new_btn = document.createElement("button");
    new_btn.innerText = text;
    appendTo.appendChild(new_btn);
    return new_btn;
}

/**
 * 名前欄の「追加」を押されたときの処理
 * @param {add_name_input} ユーザーの名前
 * @return None
 */
function add_name(add_name_input) {
    if (add_name_input.length === 0) { return; }
    NAME_INPUT.value = "";
    let unique_id_name = id_name;
    TIME_MANAGE_OBJ[unique_id_name] = {};
    TIME_MANAGE_OBJ[unique_id_name].unique_id_time = 0;
    TIME_MANAGE_OBJ[unique_id_name].sets = new Set();
    ID_SET.add(unique_id_name);
    USERNAME[unique_id_name] = add_name_input;

    let new_option = document.createElement("option");
    new_option.innerText = add_name_input;
    new_option.value = unique_id_name;
    SELECT_NAME.appendChild(new_option);

    id_name++;
}

/**
 * selectで要素が選ばれたときの処理
 */
function open_select(unique_id_name) {
    let childElementCount = SELECT_AREA.childElementCount;
    console.log(childElementCount);
    if ((unique_id_name === "-1") && (childElementCount != 1)) {
        SELECT_AREA.removeChild(SELECT_AREA.lastChild);
        TIME_MANAGE.innerHTML = "";
        return;
    }
    if (childElementCount != 1) { SELECT_AREA.removeChild(SELECT_AREA.lastChild) }
    let add_name_input = USERNAME[unique_id_name];

    // 削除ボタン
    let new_del_btn = create_button(SELECT_AREA, "削除");
    new_del_btn.onclick = () => {
        // 色々と管理
        delete TIME_MANAGE_OBJ[unique_id_name];
        ID_SET.delete(unique_id_name);

        // 親要素を削除
        // DISPLAY_NAME.removeChild(new_li.parentNode);
        SELECT_AREA.removeChild(new_del_btn.parentNode);

        if (unique_id_name === name_manage_status) {
            TIME_MANAGE.innerHTML = "";
        }
    }

    // 時間調節
    edit_user_time(unique_id_name, add_name_input);
}


/**
 * 「空いている時間を調節」を押されたときの処理
 * @param {unique_id_name} ユーザーのid
 * @param {add_name_input} ユーザーの名前
 * @return None
 */
function edit_user_time(unique_id_name) {
    let add_name_input = USERNAME[unique_id_name];

    let new_div = document.createElement("div");
    new_div.classList.add("divv")

    console.log(TIME_MANAGE_OBJ);
    // 基本的なUI
    TIME_MANAGE.innerHTML = "";
    name_manage_status = unique_id_name;

    let new_p = document.createElement("p"); // ユーザー名を表示
    new_p.innerText = `名前 : ${add_name_input}`;

    new_div.appendChild(new_p);

    let new_input = document.createElement("input"); // 入力欄
    new_input.placeholder = "空いてる時間を入力";
    new_div.appendChild(new_input);
    // 追加ボタン
    let new_btn_add = create_button(new_div, "追加");

    // 時間を追加する
    let new_ul = document.createElement("ul"); // ユーザーの空いている時間を表示するリスト
    new_div.appendChild(new_ul);

    // ユーザーが今まで入力した時間を表示する
    show_time(unique_id_name, new_ul);

    let id_time = 0; // 何個目の入力か把握する

    // 追加ボタンが押されたときの処理（時間を追加された時）
    new_btn_add.onclick = () => {
        add_time(unique_id_name, new_input, new_ul);
    }
    new_input.onkeydown = event => {
        if (event.key === 'Enter') {
            add_time(unique_id_name, new_input, new_ul);
        }
    }
    TIME_MANAGE.appendChild(new_div);
}
/**
 * 時間調節の「追加」を押されたときの処理
 * @param {unique_id_name} ユーザーのid
 * @param {new_input} 時間の入力欄の要素
 * @param {new_ul} 時間を表示するulの要素
 * @return None
 */
function add_time(unique_id_name, new_input, new_ul) {
    if (!verifier(new_input.value)) {
        new_input.value = "";
        return;
    }
    let unique_id_time = TIME_MANAGE_OBJ[unique_id_name].unique_id_time;
    let input_split = new_input.value.split(",")
    let user_input_time = `${String(convert_time(input_split[0]))},${String(convert_time(input_split[1]))}`;

    // 時間を追加
    TIME_MANAGE_OBJ[unique_id_name][unique_id_time] = user_input_time;

    add_time_co(unique_id_name, unique_id_time, new_ul, user_input_time);

    TIME_MANAGE_OBJ[unique_id_name].sets.add(TIME_MANAGE_OBJ[unique_id_name].unique_id_time);
    TIME_MANAGE_OBJ[unique_id_name].unique_id_time++;
    new_input.value = "";
}

/**
 * 「開いてる時間を編集」が押された時、ユーザーが今まで入力した時間を表示する
 * @param {unique_id_name} ユーザーのid
 * @param {new_ul} 時間を表示するulの要素
 * @return None
 */
function show_time(unique_id_name, new_ul) {
    let lst = Array.from(TIME_MANAGE_OBJ[unique_id_name].sets);
    for (let i = 0; i < lst.length; i++) {
        let unique_id_time = lst[i];
        add_time_co(unique_id_name, unique_id_time, new_ul, TIME_MANAGE_OBJ[unique_id_name][unique_id_time]);
    }
}

/**
 * add_time, show_timeの共通の機能
 * @param {unique_id_name} ユーザーのid
 * @param {unique_id_time} ユーザーのどの時間を扱うか、インデックス的な扱い
 * @param {new_ul} 時間を表示するulの要素
 * @param {text} 表示する時間
 * @return None
 */
function add_time_co(unique_id_name, unique_id_time, new_ul, text) {
    // まとめる
    // new_ulに（li, button）を個別に追加したくない→（li, button）をdivに追加し、divをulに追加する→TIME_MANGEに追加

    // li, button）をdivに追加
    // divを作る
    let new_div = document.createElement("div");
    new_div.classList.add("divv");

    // liを作り、divの子要素にする
    let new_li = document.createElement("li");

    let user_input_time = display_time_neat(text);
    console.log(user_input_time);

    new_li.innerText = user_input_time;
    new_div.appendChild(new_li);

    // 削除buttonを作り、divの子要素にする
    let new_btn_rmv = create_button(new_div, "削除");

    // 削除する
    new_btn_rmv.onclick = () => {
        delete TIME_MANAGE_OBJ[unique_id_name][unique_id_time];
        TIME_MANAGE.removeChild(new_btn_rmv.parentNode);
        TIME_MANAGE_OBJ[unique_id_name].sets.delete(unique_id_time);
        console.log(TIME_MANAGE_OBJ);
    }

    // divをulに追加する
    new_ul.appendChild(new_div);

    // TIME_MANGEに追加
    TIME_MANAGE.appendChild(new_div);
}
/**
 * 
 * @param {String} text 10:20,10:40のような時間
 * @returns 10:20~10:40のようにいい感じにする
 */
function display_time_neat(text) {
    let input_split = text.split(",")
    return `${String(convert2string(input_split[0]))}~${String(convert2string(input_split[1]))}`;
}

/**
 * 文字が何個含まれているか
 * @param {String} text 検索元の文字列
 * @param {String} search 検索する文字列
 * @returns int
 */
function counter(text, search) {
    return (text.match(new RegExp(search, "g")) || []).length;
}
/**
 * 
 * @param {String} time 時間
 * @returns 時間(min)
 */
function convert_time(time) {
    time = time.split(":");
    let hr = parseInt(time[0]);
    let mn = parseInt(time[1]);
    return 60 * hr + mn;
}

/**
 * 
 * @param {Int} time 時間(min)
 * @returns 時間(hr:min)
 */
function convert2string(time) {
    let hr = String(Math.floor(time / 60));
    let mn = String(time % 60);
    return `${hr}:${mn}`;

}
/**
 * 
 * @param {String} user_input_time 入力された時間
 * @returns user_input_timeの形式が正しいか確認
 */
function verifier(user_input_time) {
    if (!check1(user_input_time)) { return false; }
    let se = user_input_time.split(",");

    let start = se[0];
    let end = se[1];
    if (!check2(start)) { return false; }
    if (!check2(end)) { return false; }

    if (!check3(start, end)) { return false };

    return true;
}
/**
 * 入力に開始時間・終了時間が含まれているか（,で分割できるか）（,が一個しか含まれていない）
 * @param {user_input_time} ユーザーが入力した時間
 * @return bool, あってたらtrue
 */
function check1(user_input_time) {
    if ((user_input_time.indexOf(",") != -1) && (counter(user_input_time, ",") === 1)) {
        return true;
    } else {
        return false;
    }
}

/**
 * 入力にの時間が(hr:min)になってるか（:で分割できるか）（:が一個しか含まれていない）
 * @param {user_input_time} ユーザーが入力した時間
 * @return bool, あってたらtrue
 */
function check2(user_input_time) {
    if ((user_input_time.indexOf(":")) && (counter(user_input_time, ":") === 1)) {
        return true;
    } else {
        return false;
    }
}

/**
 * 開始時刻のほうが終了時刻よりも早いか
 * @param {string} start 
 * @param {string} end 
 * @returns 開始時刻 <= 終了時刻 => true
 */
function check3(start, end) {
    if (convert_time(start) <= convert_time(end)) {
        return true;
    } else {
        return false;
    }
}

/**
 * imos法を使って、書いてる時間を調べる
 * @return None
 */
function imos() {
    // いろいろと変数
    let schedule = TIME_MANAGE_OBJ;
    let user_names = Object.keys(TIME_MANAGE_OBJ);
    let n = ID_SET.size;
    ID_SET_ARR = Array.from(ID_SET);

    // 空き時間が入ったSet
    let time_sets = new Set();

    // 各ユーザーの空いている時間をSetに追加
    for (let i = 0; i < n; i++) {
        let user_arr = Array.from(schedule[ID_SET_ARR[i]].sets);
        let arr = schedule[ID_SET_ARR[i]];
        for (let j = 0; j < user_arr.length; j++) {
            let time_sep = schedule[ID_SET_ARR[i]][user_arr[j]].split(",");
            time_sets.add(parseInt(time_sep[0]));
            time_sets.add(parseInt(time_sep[1]));
        }
    }

    // 空き時間がソートされてる配列
    let lst_sch = Array.from(time_sets);
    lst_sch.sort((a, b) => a - b);

    // インデックスと空き時間、空き時間をインデックスを紐づけるやつ
    let idx_sch = {};
    let sch_idx = {};
    for (let i = 0; i < lst_sch.length; i++) {
        idx_sch[i] = lst_sch[i];
        sch_idx[lst_sch[i]] = i;
    }

    // 累積和の配列(人数だけを管理)
    let acc = new Array(lst_sch.length).fill(0);
    // 累積和の配列(開いてる時間の[開始時間],[終了時間]を管理)
    let acc_info = new Array(lst_sch.length);
    for (let _ = 0; _ < lst_sch.length; _++) {
        acc_info[_] = [new Array(), new Array()];
    }

    // 累積和の準備
    for (let i = 0; i < ID_SET_ARR.length; i++) {
        let times = schedule[ID_SET_ARR[i]];
        let time_arrr_temp = Array.from(times.sets);
        for (let j = 0; j < time_arrr_temp.length; j++) {
            let se = times[time_arrr_temp[j]].split(",");
            start = parseInt(se[0]);
            end = parseInt(se[1]);
            acc_info[sch_idx[end]][1].push(i)
            acc_info[sch_idx[start]][0].push(i)
            acc[sch_idx[start]] += 1
            acc[sch_idx[end]] -= 1
        }
    }

    // 累積和を取る
    let res_acc = [0];
    let res_acc_info = [];
    let member = [];
    for (let i = 0; i < acc.length; i++) {
        res_acc.push(res_acc[i] + acc[i]);
        member = [...new Set([...member, ...acc_info[i][0]])];
        member = member.filter((val) => !acc_info[i][1].includes(val));
        res_acc_info.push(member);
    }

    // いい感じに出力
    let time = [];
    let ppl = [];
    for (let i = 0; i < lst_sch.length - 1; i++) {
        time.push([`${convert2string(lst_sch[i])}~${convert2string(lst_sch[i + 1])}`]);
        ppl.push([]);
        for (j of res_acc_info[i]) {
            ppl[i].push(USERNAME[user_names[j]]);
        }
    }
    console.log(time);
    console.log(ppl);
    display_imos(time, ppl);
}

/**
 * imos()によって得られる結果を表示する
 * @return None
 */
function display_imos(time, ppl) {
    TIME_MANAGE.innerHTML = "";
    let new_ul = document.createElement("ul");
    for (let i = 0; i < time.length; i++) {
        let new_p = document.createElement("p");
        new_p.innerText = `${time[i]} -> ${ppl[i]}`;
        new_ul.appendChild(new_p);
    }
    TIME_MANAGE.appendChild(new_ul);
}

function main() {
    NAME_ADD_BTN.onclick = () => {
        add_name(NAME_INPUT.value);
    }

    NAME_INPUT.onkeydown = event => {
        if (event.key === 'Enter') {
            add_name(NAME_INPUT.value);
        }
    }
    document.getElementById("use_imos_btn").onclick = () => {
        imos();
    }

    SELECT_NAME.addEventListener('change', function() { open_select(SELECT_NAME.value) });
}
main();