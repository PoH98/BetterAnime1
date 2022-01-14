// ==UserScript==
// @name         Better Anime1
// @namespace    http://tampermonkey.net/
// @version      1.41
// @description  Provides better Anime1 UI experience
// @author       PoH98
// @match        https://anime1.me/*
// @match        https://anime1.pw/*
// @icon         https://anime1.me/favicon-32x32.png
// @grant        none
// @run-at       document-body
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';
    function httpGet(url)
    {
        fetch(url).then(function(response) {
            return response.text();
        }).then(function(data) {
            let parser = new DOMParser();
            let doc = parser.parseFromString(data, 'text/html');
            let content = doc.querySelector('#main');
            let item = content.querySelectorAll("*");
            item.forEach(function(el){
                if(el.id.includes("ad") && !el.id.includes("head") && !el.id.includes("thread")){
                    el.remove();
                    return;
                }
                if(el.className === 'nav-next'){
                    el.remove();
                }
                if(el.className === 'pagination'){
                    el.style.display = "none";
                    return;
                }
                if(el.className === 'loadvideo'){
                    let iframe = document.createElement("iframe");
                    iframe.setAttribute("src", el.dataset.src);
                    iframe.width = 1280;
                    iframe.height = 720;
                    el.replaceWith(iframe);
                    return;
                }
                el.style.color = "#fff"
                el.style.backgroundColor = "#444";
            });
            content.className = "";
            Array.prototype.slice.call(content.childNodes).forEach(el =>{
                document.getElementById("main").appendChild(el);
            })
            let prev = content.querySelectorAll(".nav-previous a");
            if(prev.length > 0){
                httpGet(prev[0].href);
                prev.forEach(el =>{
                    el.remove();
                })
            }
        })
    }
    function fetchAnimeList(api){
        var http_request;
        try{
            // Opera 8.0+, Firefox, Chrome, Safari
            http_request = new XMLHttpRequest();
        }catch (e) {
            // Internet Explorer Browsers
            try{
                http_request = new ActiveXObject("Msxml2.XMLHTTP");
            }catch (e) {
                try{
                    http_request = new ActiveXObject("Microsoft.XMLHTTP");
                }catch (e) {
                    // Something went wrong
                    alert("Your browser broke!");
                    return;
                }
            }
        }
        http_request.onreadystatechange = function() {
            if (http_request.readyState == 4  ) {
                var jsonObj = JSON.parse(http_request.responseText);
                jsonObj.forEach(el =>{
                    let row = document.getElementById("betteranime1").insertRow();
                    let name = row.insertCell();
                    if(el[0] === 0){
                        name.innerHTML = el[1];
                        name.style.backgroundColor = "rgb(68, 68, 68)";
                        name.style.color = "#fff";
                    }
                    else{
                        name.innerHTML = "<a href='https://anime1.me/?cat="+el[0]+"'>" + el[1] + "</a>";
                        name.style.backgroundColor = "rgb(68, 68, 68)";
                        name.style.color = "#fff";
                    }
                    el.slice(2).forEach(cell => {
                        let c = row.insertCell();
                        c.innerHTML = cell;
                        c.style.backgroundColor = "rgb(68, 68, 68)";
                        c.style.color = "#fff";
                    });
                })
            }
        }
        http_request.open("GET", api, true);
        http_request.send();
    }
    let head = document.head || document.getElementsByTagName('head')[0];
    let style = document.createElement('style');
    head.appendChild(style);
    style.type = 'text/css';
    if (style.styleSheet){
        // This is required for IE8 and below.
        style.styleSheet.cssText = ".site-content a { color: white !important; }";
    } else {
        style.appendChild(document.createTextNode(".site-content a { color: white !important; }"));
    }
    let useNewAPI = false;
    let tableIds = ["tablepress-1", "table-list"]
    tableIds.forEach(el =>{
        let table = document.getElementById(el);
        if(table != null){
            if(el == "table-list"){
                useNewAPI = true;
            }
            table.id = "betteranime1";
            table.className = "";
        }
    })
    if(useNewAPI){
        //new logic for anime1
        fetchAnimeList("https://d1zquzjgwo9yb.cloudfront.net/");
    }
    let side = document.getElementById("secondary");
    if(side != null){
        side.remove();
    }
    let main = document.getElementById("primary");
    if(main != null){
        main.style.width = "100%";
    }
    let content = document.getElementById("content");
    if(content != null){
        content.style.minHeight = "calc(100vh - 238px)";
    }
    document.body.style.backgroundColor = "#000";
    document.body.style.color = "#fff"
    let prev = document.querySelectorAll(".nav-previous a");
    if(prev.length > 0){
        httpGet(prev[0].href);
        prev.forEach(el =>{
            el.remove();
        })
    }
    let page = document.getElementById("page");
    let item = page.querySelectorAll("*");
    item.forEach(function(el){
        if(el.id.includes("ad") && !el.id.includes("head") && !el.id.includes("thread")){
            el.remove();
            return;
        }
        if(el.className === 'player-space'){
            el.style.height = "100%";
        }
        if(el.id === 'disqus_thread'){
            el.style.backgroundColor = "#999";
            el.style.padding = "10px";
            el.style.margin = "-10px";
            return;
        }
        if(el.id === 'dcl_comment_btn'){
            el.click();
        }
        if(el.className === 'pagination'){
            el.style.display = "none";
            return;
        }
        if(el.className === 'loadvideo'){
            let iframe = document.createElement("iframe");
            iframe.setAttribute("src", el.dataset.src);
            iframe.width = 1280;
            iframe.height = 720;
            iframe.style.border = "none";
            el.replaceWith(iframe);
            return;
        }
        el.style.color = "#fff"
        el.style.backgroundColor = "#444";
    });
    if(window.innerWidth > 1280){
        let img = document.createElement("img");
        img.style.position = "fixed";
        img.style.bottom = "10px";
        img.style.right = "10px";
        img.src = "https://i.pinimg.com/originals/1c/79/ac/1c79ac50b06bb42a24058bf13c162a3e.gif";
        page.appendChild(img);
    }
    var tick = setInterval(
        function(){
            let frame = document.querySelectorAll("iframe");
            frame.forEach(el => {
                el.height = 720;
                el.width = 1280;
            })
        }, 2000)

    })();
