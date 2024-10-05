
function open_sidebar() {
    document.getElementById("main").style.marginLeft = "25%";
    document.getElementById("mySidebar").style.width = "25%";
    document.getElementById("mySidebar").classList.remove("animate-right");
    document.getElementById("mySidebar").classList.add("animate-left");
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("openNav").style.visibility = 'hidden';
    document.getElementById("openNav").style.pointerEvents = 'none';
}

function close_sidebar() {
    document.getElementById("mySidebar").classList.remove("animate-left");
    // document.getElementById("mySidebar").classList.add("animate-right");
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("main").style.marginLeft = "0%";
    setTimeout(() => {
        document.getElementById("mySidebar").style.display = "none";
    }, 400);
    document.getElementById("openNav").style.visibility = 'visible';
    document.getElementById("openNav").style.pointerEvents = 'auto';

}

function createElement(tag, className = '', textContent = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
}