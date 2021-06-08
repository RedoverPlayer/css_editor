optionsDict = {
    Position: {
        css_editor_margin_left: ["marginLeft", "margin-left", "number"],
        css_editor_margin_right: ["marginRight", "margin-right", "number"],
        css_editor_margin_top: ["marginTop", "margin-top", "number"],
        css_editor_margin_bottom: ["marginBottom", "margin-bottom", "number"]
    },
    Size: {
        css_editor_width: ["width", "width", "number"],
        css_editor_height: ["height", "height", "number"],
        css_editor_padding_left: ["paddingLeft", "padding-left", "number"],
        css_editor_padding_right: ["paddingRight", "padding-right", "number"],
        css_editor_padding_top: ["paddingTop", "padding-top", "number"],
        css_editor_padding_bottom: ["paddingBottom", "padding-bottom", "number"]
    },
    Style: {
        css_editor_border_radius: ["borderRadius", "border-radius", "number"]
    }
}

function addDiv() {
    var div = document.createElement("div");
    div.style.width = "20px";
    div.style.height = "20px";
    div.style.backgroundColor = "rgb(80, 80, 80)";
    if (window.currentElem != null) {
        window.currentElem.appendChild(div);
    } else {
        document.body.appendChild(div);
    } 
}

function toggleBuildMode() {
    if (document.getElementById("css_editor_toggle_build_mode").innerText == "Preview mode") {
        document.getElementById("css_editor_toggle_build_mode").innerText = "Build mode";
    } else {
        document.getElementById("css_editor_toggle_build_mode").innerText = "Preview mode";
    }
}

function tagMenu(elem) {
    if (!elem.className.includes("css_editor") && elem != null) {
        window.currentElem = elem;
        document.getElementById("css_editor_infos_tag_name").innerText = elem.tagName;
        document.getElementById("css_editor_infos_class_name").innerText = elem.className;
        document.getElementById("css_editor_infos_id").innerText = elem.id;

        for (var category of Object.keys(optionsDict)) {
            for (var element of Object.keys(optionsDict[category])) {
                document.getElementById(element).innerText = window.getComputedStyle(elem)[optionsDict[category][element][0]];
            }
        }
    }
}

function getPos(el) {
    if (el != null) {
        return {x: el.offsetLeft, y: el.offsetTop, dx: el.offsetWidth, dy: el.offsetHeight};
    } else {
        return null;
    }
}

function printMousePos(event) {
    tagMenu(event.target);
}

function incrementOrDecrement(elem, property, event) {
    if (elem.style[property] == "") {
        if (event.deltaY > 0) {
            elem.style[property] = "-1px";
            event.target.innerText = "-1px";
        } else {
            elem.style[property] = "1px";
            event.target.innerText = "1px";
        }     
        return
    } else if (elem.style[property].includes("px")) {
        var unit = "px";
    } else if (elem.style[property].includes("%")) {
        var unit = "%";
    }

    if (event.deltaY > 0) {
        var new_property = (parseInt(elem.style[property].replace(unit, ""), 10) - 1).toString(10) + unit;
        elem.style[property] = new_property;
        event.target.innerText = new_property;
    } else {
        var new_property = (parseInt(elem.style[property].replace(unit, ""), 10) + 1).toString(10) + unit;
        elem.style[property] = new_property;
        event.target.innerText = new_property;
    }
}

function wheelEvent(event) {
    if (event.target.className.includes("css_editor_input") && window.currentElem != null) {
        var dict = {};
        for (var category of Object.keys(optionsDict)) {
            for (var elem of Object.keys(optionsDict[category])) {
                dict[elem] = optionsDict[category][elem];
            }
        }

        incrementOrDecrement(window.currentElem, dict[event.target.id][0], event);
    }
}

function genCSSProperties(menu_div) {
    for (var category of Object.keys(optionsDict)) {
        var category_title = document.createElement("h4");
        category_title.className = "css_editor_h4";
        category_title.innerText = category;
        menu_div.appendChild(category_title)
        
        for (var element of Object.keys(optionsDict[category])) {
            var elem_div = document.createElement("div");
            elem_div.className = "css_editor_div";
            elem_div.innerText = optionsDict[category][element][1] + ": ";
            
            if (optionsDict[category][element][2] == "number") {
                var property_div = document.createElement("div");
                property_div.className = "css_editor_input";
                property_div.id = element;
                elem_div.appendChild(property_div)
            }
            menu_div.appendChild(elem_div);
            var br = document.createElement("br");
            menu_div.appendChild(br);
        }
    }
}

function genMenu() {
    var style = document.createElement("style");
    style.innerText = `\
    .css_editor_toolbar {\
        width: 100%;\
        position: absolute;\
        bottom: 0px;\
        left: 0px;\
        height: 50px;\
        background-color: rgb(40, 40, 40);\
    }\
    \
    .css_editor_menu {\
        width: 400px;\
        height: 100%;\
        background-color: rgb(40, 40, 40);\
        position: absolute;\
        top: 0px;\
        right: 0px;\
        overflow-y: scroll;\
        text-align: left;\
    }\
    \
    .css_editor_button {\
        padding-left: 8px;\
        padding-right: 8px;\
        padding-top: 4px;\
        padding-bottom: 4px;\
        color: white;\
        background-color: #3292ff;\
        border-radius: 4px;\
        border: none;\
        font-size: 25px;\
        margin: 5px;\
        transition: 0.5s;
    }\
    \
    .css_editor_button:hover {\
        background-color: rgb(94, 122, 221);\
        box-shadow: 4px 4px 4px 4px rgb(0 0 0 / 42%);\
    }\
    \
    .css_editor_button:active {\
        background-color: rgb(82, 112, 221);\
    }\
    \
    .css_editor_button:focus {\
        outline: none;\
    }\
    \
    .css_editor_h4 {\
        font-family: Arial;\
        color: white;\
        margin-left: 15px;\
    }\
    \
    .css_editor_div {\
        color: white;\
        display: inline;\
        margin-left: 15px;\
    }\
    \
    .css_editor_input {\
        background-color: rgb(80, 80, 80);\
        color:white;\
        display: inline;\
    }`;

    document.body.appendChild(style);
    
    // toolbar
    var div = document.createElement("div");
    div.className = "css_editor_toolbar";
    document.body.appendChild(div);

    var button = document.createElement("button");
    button.className = "css_editor_button";
    button.id = "css_editor_toggle_build_mode";
    button.onclick = toggleBuildMode;
    button.innerText = "Preview mode";
    div.appendChild(button);

    var button = document.createElement("button");
    button.className = "css_editor_button";
    button.onclick = addDiv;
    button.innerText = "div";
    div.appendChild(button);

    // editor menu
    var div = document.createElement("div");
    div.className = "css_editor_menu";
    document.body.appendChild(div);

    var category_title = document.createElement("h4");
    category_title.className = "css_editor_h4";
    category_title.innerText = "Infos";
    div.appendChild(category_title);

    var tag_name = document.createElement("div");
    tag_name.id = "css_editor_infos_tag_name";
    tag_name.className = "css_editor_div";
    div.appendChild(tag_name);

    var class_name = document.createElement("div");
    class_name.id = "css_editor_infos_class_name";
    class_name.className = "css_editor_div";
    div.appendChild(class_name);

    var div_id = document.createElement("div");
    div_id.id = "css_editor_infos_id";
    div_id.className = "css_editor_div";
    div.appendChild(div_id);

    genCSSProperties(div);
}

document.addEventListener("click", printMousePos);
document.addEventListener('wheel', wheelEvent);
genMenu();