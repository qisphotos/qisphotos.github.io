function SetupwhenReady(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
};
SetupwhenReady(setUp);

function setUp() {
    // set navigation event listener
    let nav = document.querySelector(".navigation");
    nav.addEventListener("click", showPanel);
}

function showPanel(e) {
    // get everything we need, nav, side panels ect.
    let panel = e.target.dataset.panel;
    let to_be_opened = document.getElementById(panel);
    let navigation = document.getElementById('navigation')
    let allPanels = document.getElementsByClassName('side-panel');
    
    // loop through the panels and remove the active class
    for (let i = 0; i < allPanels.length; i++) {
        allPanels[i].classList.remove('active');
    }
    // if the user has clicked on home, move the nav and hide panels
    // also make the heading visible again
    if (panel === 'home' || panel === 'nav-ul') {
        document.getElementById('heading').style.opacity = '1';
        let allPanels = document.getElementsByClassName('side-panel')
        for (let i = 0; i < allPanels.length; i++) {
            allPanels[i].classList.remove('active');
        }
        navigation.classList.remove('navigation-active');
    } else {
        // otherwise, open the panel requested, activate the nav with it 
        // and hide the heading on the left.
        to_be_opened.classList.add('active');
        navigation.classList.add('navigation-active');
        document.getElementById('heading').style.opacity = '0';
    }
    let leftMainPanel = document.getElementById('leftMainPanel')
    leftMainPanel.addEventListener("click", hideAll);
}

function hideAll(e) {
    console.log('this was run')
    let nav = document.querySelector('.navigation');
    let allPanels = document.getElementsByClassName('side-panel')
    for (let i = 0; i < allPanels.length; i++) {
        allPanels[i].classList.remove('active');
    }
    nav.classList.remove('navigation-active');
    e.stopPropagation(); // I don't think this works yet
}


window.onload = function(){
	var popup = document.getElementById('popup');
    var overlay = document.getElementById('backgroundOverlay');
    var openButton = document.getElementById('openOverlay');
    document.onclick = function(e){
        if(e.target.id == 'backgroundOverlay'){
            popup.style.display = 'none';
            overlay.style.display = 'none';
        }
        if(e.target === openButton){
         	popup.style.display = 'block';
            overlay.style.display = 'block';
        }
    };
};


// list of big facing headings
let headings = [
    "Perfect detail at any scale",
    "Conversions that don't ruffle feathers",
    "I don't know if this is the offical title list",
    "Resize images on-the-fly",
    "Simple color conversion"
]

function updateHeading() {
    let heading = document.getElementById('heading')
    heading.innerHTML = headings[4];
    i = 0;
    setInterval(function () {
        if (i > 4) {
            i = 0
            heading.innerHTML = headings[i];
        } else {
            heading.innerHTML = headings[i];
            i++
        }
    }
        , 3000)
}

// swtich inner sections of panels
function innerPanelView(obj) {
    //getting the obj data from the link clicked 
    let clicked = obj;
    // getting the datainnerpanelcurrent node, the data attached is for the corisponding panel
    let panelToView = clicked.attributes.dataInnerPanelCurrent.nodeValue;
    let panelView = document.getElementById(panelToView);
    panelView.style.display = 'block';
    let panelCurrent = clicked.attributes.dataInnerPanelSwitch.nodeValue;
    let panelHide = document.getElementById(panelCurrent);
    panelHide.style.display = 'none';
    let currentButtonID = clicked.attributes.id.nodeValue;
    let currentButton = document.getElementById(currentButtonID);
    currentButton.style.color = '#fff';
    let otherButtonID = clicked.attributes.dataOppButton.nodeValue;
    let otherButton = document.getElementById(otherButtonID);
    otherButton.style.color = '#333';
}