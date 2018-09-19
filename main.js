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
    let allPanels = document.getElementsByClassName('side-panel')
    // loop through the panels and remove the active class
    for (let i = 0; i < allPanels.length; i++) {
        allPanels[i].classList.remove('active');
    }
    // if the user has clicked on home, move the nav and hide panels
    // also make the heading visible again
    if (panel === 'home') {
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
}

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
    setInterval(function() {         
        if (i > 4) {
            i = 0            
            heading.innerHTML = headings[i];                    
        } else {
            heading.innerHTML = headings[i];            
            i++
        }       
    }
     ,6000)
}
updateHeading();