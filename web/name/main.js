const NAME_INPUT = document.getElementById("name_input");
const NAME_ADD_BTN = document.getElementById("name_add_btn");
const DISPLAY_NAME = document.getElementById("display_name");

function add_name(add_name_input) {

    let new_div = document.createElement("div");

    let new_li = document.createElement("li");
    new_li.innerText = add_name_input;
    new_div.appendChild(new_li);

    let new_btn = document.createElement("button");
    new_btn.innerText = "del";
    new_div.appendChild(new_btn);
    new_btn.onclick = () => {
        DISPLAY_NAME.removeChild(new_btn.parentNode)
    }

    DISPLAY_NAME.appendChild(new_div);
}

NAME_ADD_BTN.onclick = () => {
    add_name(NAME_INPUT.value);
}

NAME_INPUT.onkeydown = event => {
    console.log("keydown");
    if (event.key === 'Enter') {
        console.log("enter");
        add_name(NAME_INPUT.value);
    }
}