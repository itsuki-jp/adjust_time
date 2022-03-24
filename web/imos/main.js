let n = 3; // n = ID_SET.size
let user_name = ["zero", "first", "second"];
let schedule = {
    0: {
        0: "0,3",
        1: "5,10",
        unique_id_time: 2,
        sets: new Set([0, 1])
    },
    1: {
        0: "2,7",
        unique_id_time: 1,
        sets: new Set([0])
    },
    2: {
        0: "5,7",
        unique_id_time: 1,
        sets: new Set([0])
    },
};


let idx_sch = {};
let sch_idx = {};
let acc_info = null;
let acc = null;
let ID_SET_ARR = [0, 1, 2]; // Array.from(ID_SET)



function main() {
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
    console.log(lst_sch);
    for (let i = 0; i < lst_sch.length - 1; i++) {
        time.push([lst_sch[i], lst_sch[i + 1]]);
        ppl.push([]);
        for (j of res_acc_info[i]) {
            ppl[i].push(user_name[j]);
        }
    }
    console.log(time);
    console.log(ppl);
}
main();