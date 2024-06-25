var msg = `This website is an archive. <a href="https://suffolklitlab.org">Click here to visit the current Suffolk LIT Lab website.</a>`

// function close_msg() {
//     document.body.style["background-position"] = "top -65px center";
//     document.getElementById('msg_bar').style.display='none';
//     localStorage.setItem('msg',msg)
// }

document.addEventListener('DOMContentLoaded', function () {

    // if (localStorage.msg != msg) {
    //     document.getElementById('msg_bar').innerHTML = `<a href="javascript:close_msg();" class="ex">X</a>`+ msg;
    //     document.getElementById('msg_bar').style.display='block';
    //     document.getElementById('msg_bar').style.display='block';    
    //     document.body.style["background-position"] = "top -24px center";
    // }

    document.getElementById('msg_bar').innerHTML = msg;
    document.getElementById('msg_bar').style.display='block';    
    document.body.style["background-position"] = "top -24px center";

});
