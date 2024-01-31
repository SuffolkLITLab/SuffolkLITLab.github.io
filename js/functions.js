var msg = `The Lab is hosting a <a href="https://suffolklitlab.org/LITCon/2024/" target="_blank">hybrid event at Suffolk Law</a> on April 8th on AI and law practice. Join us!`

function close_msg() {
    document.body.style["background-position"] = "top -65px center";
    document.getElementById('msg_bar').style.display='none';
    localStorage.setItem('msg',msg)
}

document.addEventListener('DOMContentLoaded', function () {

    if (localStorage.msg != msg) {
        document.getElementById('msg_bar').innerHTML = `<a href="javascript:close_msg();" class="ex">X</a>`+ msg;
        document.getElementById('msg_bar').style.display='block';
        document.getElementById('msg_bar').style.display='block';    
        document.body.style["background-position"] = "top -24px center";
    }

});
