// 在页面加载完毕后运行
function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            oldonload();
            func();
        }
    }
}

// 在之后插入元素
function insertAfter(newElement, targetElement) {
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}

// 添加类
function addClass(element, value) {
    if (!element.className) {
        element.className = value;
    } else {
        newClassName = element.className;
        newClassName += " ";
        newClassName += value;
        element.className = newClassName;
    }
}

// 高亮导航栏的当前页标签
// 为body添加id
function highlightPage(href) {
    // 检查DOM
    if (!document.getElementsByTagName) return false;
    if (!document.getElementById) return false;
    var headers = document.getElementsByTagName('header');
    if (headers.length == 0) return false;
    var navs = headers[0].getElementsByTagName('nav');
    if (navs.length == 0) return false;

    var links = navs[0].getElementsByTagName("a");
    var linkurl;
    for (var i = 0; i < links.length; i++) {
        linkurl = links[i].getAttribute("href");
        // 若href在当前页地址的位置不是-1
        if (window.location.href.indexOf(linkurl) != -1) {
            addClass(links[i], "here");

            // 取得链接最后一个子元素的值（文本）并转换成小写形式
            var linktext = links[i].lastChild.nodeValue.toLowerCase();
            document.body.setAttribute("id", linktext);
        }
    }
}
addLoadEvent(highlightPage);

// 动画
function moveElement(elementID, final_x, final_y, interval) {
    if (!document.getElementById) return false;
    if (!document.getElementById(elementID)) return false;

    var elem = document.getElementById(elementID);
    if (elem.movement) {
        clearTimeout(elem.movement);
    }
    if (!elem.style.left) {
        elem.style.left = "0px";
    }
    if (!elem.style.top) {
        // 写成elem.style.left f**k，找了半天错
        elem.style.top = "0px";
    }

    var xpos = parseInt(elem.style.left);
    var ypos = parseInt(elem.style.top);
    if (xpos == final_x && ypos == final_y) {
        return true;
    }
    if (xpos < final_x) {
        var dist = Math.ceil((final_x - xpos) / 10);
        xpos = xpos + dist;
    }
    if (xpos > final_x) {
        var dist = Math.ceil((xpos - final_x) / 10);
        xpos = xpos - dist;
    }
    if (ypos < final_y) {
        var dist = Math.ceil((final_y - ypos) / 10);
        ypos = ypos + dist;
    }
    if (ypos > final_y) {
        var dist = Math.ceil((ypos - final_y) / 10);
        ypos = ypos - dist;
    }
    elem.style.left = xpos + "px";
    elem.style.top = ypos + "px";

    var repeat = "moveElement('" + elementID + "'," + final_x + "," + final_y + "," + interval + ")";
    elem.movement = setTimeout(repeat, interval);
}

// 幻灯片
function prepareSlideshow() {
    if (!document.getElementsByTagName) return false;
    if (!document.getElementById) return false;
    if (!document.getElementById("intro")) return false;

    var intro = document.getElementById("intro");
    var slideshow = document.createElement("div");
    slideshow.setAttribute("id", "slideshow");

    var frame = document.createElement("img");
    frame.setAttribute("src", "./images/frame.gif");
    frame.setAttribute("alt", "");
    frame.setAttribute("id", "frame");
    slideshow.appendChild(frame);

    var preview = document.createElement("img");
    preview.setAttribute("src", "./images/slideshow.gif");
    preview.setAttribute("alt", "a glimpse of what awaits you");
    preview.setAttribute("id", "preview");
    slideshow.appendChild(preview);
    insertAfter(slideshow, intro);
    // var links = intro.getElementsByTagName("a");
    var links = document.getElementsByTagName("a");
    var destination;
    for (var i = 0; i < links.length; i++) {
        links[i].onmouseover = function () {
            destination = this.getAttribute("href");
            if (destination.indexOf("index.html") != -1) {
                moveElement("preview", 0, 0, 5);
            }
            if (destination.indexOf("about.html") != -1) {
                moveElement("preview", -150, 0, 5);
            }
            if (destination.indexOf("photos.html") != -1) {
                moveElement("preview", -300, 0, 5);
            }
            if (destination.indexOf("live.html") != -1) {
                moveElement("preview", -450, 0, 5);
            }
            if (destination.indexOf("contact.html") != -1) {
                moveElement("preview", -600, 0, 5);
            }
        }
    }
}
addLoadEvent(prepareSlideshow);

// 显示section
function showSection(id) {
    var sections = document.getElementsByTagName("section");
    for (var i = 0; i < sections.length; i++) {
        if (sections[i].getAttribute("id") != id) {
            sections[i].style.display = "none";
        } else {
            sections[i].style.display = "block";
        }
    }
}
function prepareInternalnav() {
    if (!document.getElementsByTagName) return false;
    if (!document.getElementById) return false;
    var articles = document.getElementsByTagName("article");
    if (articles.length == 0) return false;
    var navs = articles[0].getElementsByTagName("nav");
    if (navs.length == 0) return false;
    var nav = navs[0];
    var links = nav.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        // for #jay: .split("#")[0]==""; .split("#")[1]=="jay"; 
        var sectionId = links[i].getAttribute("href").split("#")[1];
        if (!document.getElementById(sectionId)) continue;
        document.getElementById(sectionId).style.display = "none";
        // 若links[i].destination不是全局变量，.onclick开始时他就被销毁了
        links[i].destination = sectionId;
        links[i].onclick = function () {
            showSection(this.destination);
            return false;
        }
    }
}
addLoadEvent(prepareInternalnav);

// gallery
function preparePlaceholder() {
    if (document.createElement) {
        if (document.createTextNode) {
            if (document.getElementsByTagName) {
                var placeholder = document.createElement("img");
                placeholder.setAttribute("id", "placeholder");
                placeholder.setAttribute("src", "./images/placeholder.gif");
                var description = document.createElement("p");
                description.setAttribute("id", "description");
                var desctext = document.createTextNode("Choose an image.");
                description.appendChild(desctext);
                // document.getElementsByTagName("body")[0].appendChild(description);
                // description.parentNode.insertBefore(placeholder, description);
                var gallery = document.getElementById("imagegallery");
                insertAfter(description, gallery);
                insertAfter(placeholder, description);
            }
        }
    }
}
function showPic(whichpic) {
    if (document.getElementById("placeholder")) {
        var placeholder = document.getElementById("placeholder");
        var source = whichpic.getAttribute("href");
        if (placeholder.nodeName = "IMG") {
            placeholder.setAttribute("src", source);
        }
    }
    if (document.getElementById("description")) {
        var description = document.getElementById("description");
        if (whichpic.getAttribute("title")) {
            var text = whichpic.getAttribute("title");
        } else {
            var text = "";
        }
        if (description.childNodes[0].nodeType == 3) {
            description.childNodes[0].nodeValue = text;
        }
    }
    return true;
}
function prepareGallery() {
    if (document.getElementsByTagName) {
        if (document.getElementById) {
            if (document.getElementById("imagegallery")) {
                var gallery = document.getElementById("imagegallery");
                var links = gallery.getElementsByTagName("a");
                for (var i = 0; i < links.length; i++) {
                    links[i].onclick = function () {
                        return !showPic(this);
                    }
                }
            }
        }
    }
}
addLoadEvent(function () {
    var linkurl = window.location.href.indexOf("photos.html");
    if (linkurl != -1) {
        preparePlaceholder();
    }
})
// addLoadEvent(preparePlaceholder);
addLoadEvent(prepareGallery);

// table
function stripeTables(tag1, tag2) {
    if (!document.getElementsByTagName) return false;
    var tables = document.getElementsByTagName(tag1);
    var odd, rows;
    for (var i = 0; i < tables.length; i++) {
        // 建立临时的表格行数奇偶识别变量
        odd = false;
        rows = tables[i].getElementsByTagName(tag2);
        for (var j = 0; j < rows.length; j++) {
            // 若是奇行数
            if (odd == true) {
                // rows[j].style.backgroundColor = "#ffc";
                addClass(rows[j], "odd");
                // 设置为false，下次循环不设置颜色
                odd = false;
            } else {
                // 若不是奇行数，则设置为true，那么下一次循环就会设置颜色
                odd = true;
            }
        }
    }
}

function displayAbbreviations() {
    if (!document.getElementsByTagName || !document.createElement || !document.createTextNode) return false;
    // 取得所有缩略词
    var abbreviations = document.getElementsByTagName("abbr");
    if (abbreviations.length < 1) return false;
    var defs = new Array();
    // 遍历这些缩略词
    for (var i = 0; i < abbreviations.length; i++) {
        var current_abbr = abbreviations[i];
        // 平稳退化IE
        if (current_abbr.childNodes.length < 1) continue;
        var definition = current_abbr.getAttribute("title");
        var key = current_abbr.lastChild.nodeValue;
        defs[key] = definition;
    }
    // 创建定义列表
    var dlist = document.createElement("dl");
    // 遍历定义
    // 将变量key作为数组defs的下标
    for (key in defs) {
        var definition = defs[key];
        // 创建定义标题
        var dtitle = document.createElement("dt");
        var dtitle_text = document.createTextNode(key);
        dtitle.appendChild(dtitle_text);
        // 创建定义描述
        var ddesc = document.createElement("dd");
        var ddesc_text = document.createTextNode(definition);
        ddesc.appendChild(ddesc_text);
        // 把它们添加到定义列表
        dlist.appendChild(dtitle);
        dlist.appendChild(ddesc);
    }
    // 平稳退化IE
    if (dlist.childNodes.length < 1) return false;
    // 创建标题
    var header = document.createElement("h2");
    var header_text = document.createTextNode("Abbreviations");
    header.appendChild(header_text);

    var articles = document.getElementsByTagName("article");
    if (articles.length == 0) return false;
    var container = articles[0];
    // 把标题添加到页面主题
    container.appendChild(header);
    // 把定义列表添加到页面主题
    container.appendChild(dlist);
}

function highlightRows(tag) {
    if (!document.getElementsByTagName) return false;
    var rows = document.getElementsByTagName(tag);
    for (var i = 0; i < rows.length; i++) {
        rows[i].oldClassName = rows[i].className;
        rows[i].onmouseover = function () {
            //     this.style.fontWeight = "bold";
            addClass(this, "highlight");
        }
        rows[i].onmouseout = function () {
            //     this.style.fontWeight = "normal";
            this.className = this.oldClassName;
        }
    }
}
addLoadEvent(function () {
    stripeTables("table", "tr");
});
addLoadEvent(displayAbbreviations);
addLoadEvent(function () {
    highlightRows("tr")
});

//Ajax
function getHTTPObject() {
    if (typeof XMLHttpRequest == "undefined") {
        XMLHttpRequest = function () {
            try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
            catch (e) { }
            try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
            catch (e) { }
            try { return new ActiveXObject("Msxml2.XMLHTTP"); }
            catch (e) { }
            return false;
        }
        return new XMLHttpRequest()
    }
}
function displayAjaxLoading(element) {
    while (element.hasChildNodes()) {
        element.removeChild(element.lastChild);
    }
    var content = document.createElement("img");
    content.setAttribute("src", "./images/ajax-loader.gif");
    content.setAttribute("alt", "Loading...");
    element.appendChild(content);
}
function submitFormWithAjax(whichform, thetarget) {
    var request = getHTTPObject();
    if (!request) return false;
    displayAjaxLoading(thetarget);
    var dataParts = [];
    var element;
    for (var i = 0; i < whichform.elements.length; i++) {
        element = whichform.elements[i];
        dataParts[i] = element.name + '=' + encodeURIComponent(element.value);
    }
    var data = dataParts.join('&');
    request.open('POST', whichform.getAttribute("action"), true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = function () {
        // 0未初始化 1正在加载 2加载完毕 3正在交互 4完成
        if (request.readyState == 4) {
            // 200交易成功
            // 如果状态是UNSENT或者OPENED||如果错误标签被设置，返回0
            if (request.status == 200 || request.status == 0) {
                // \s匹配任意空白字符 \S匹配任意非空白字符 +前面的模式重复一次或多次
                var matches = request.responseText.match(/<article>([\s\S]+)<\/article>/);
                if (matches.length > 0) {
                    // matches[0]是整个模式匹配的部分（包括<article>） || matches[1]是捕获组中的模式匹配部分（即([\s\S]+)里）
                    thetarget.innerHTML = matches[1];
                } else {
                    thetarget.innerHTML = '<p>Oops, there was an error. Sorry.</p>';
                }
            } else {
                thetarget.innerHTML = '<p>' + request.statusText + '</p>';
            }
        }
    };
    request.send(data);
    return true;
};
function prepareForms(){
    for(var i=0;i<document.forms.length;i++){
        var thisform=document.forms[i];
        resetFields
    }
}