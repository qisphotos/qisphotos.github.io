"use strict";

// list of big facing headings, should match the bg images in the html
let headings = [
	"Perfect detail at any scale",
	"Conversions that don't ruffle feathers",
	"Resize images on-the-fly",
	"Simple colour conversion"
];

// record the background image load stats
let imageStats = {};

function rotate(hIndex) {
	let heading = document.getElementById('heading'),
	    images = document.querySelectorAll('.backgrounds img'),
		newIndex = hIndex,
		prevIndex = newIndex - 1;

	if (prevIndex < 0) {
		prevIndex = images.length - 1;
	}

	let newImage = images[newIndex],
	    prevImage = images[prevIndex];

	// Fade out heading and bring in the next background image (but still hidden)
	heading.style.opacity = 0;      // Takes 0.5s (see the css)
	newImage.style.zIndex = -2;
	newImage.style.display = 'block';
	newImage.style.opacity = 1;

	setTimeout(function () {        // so do this after 0.5s
		// Fade in the heading, fade out the old background image
		heading.innerHTML = headings[newIndex];
		heading.style.opacity = 1;
		prevImage.style.opacity = 0;
		// Show stats for new image
		if (imageStats[newIndex] !== undefined) {
			ToolboxUI.showImageStats(imageStats[newIndex]);
		}
		setTimeout(function () {
			// Hide the old background image and make the new one top
			prevImage.style.display = 'none';
			newImage.style.zIndex = -1;
		}, 500);
	}, 500);

	// Then schedule the next rotation
	hIndex++;
	if (hIndex >= headings.length) {
		hIndex = 0;
	}
	setTimeout(function() { rotate(hIndex); }, 8000);
}

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
	let nav = document.getElementById("mainNavUl");
	nav.addEventListener("click", showPanel);
}

function showPanel(e) {
	// get everything we need, nav, side panels ect.
    var panel;
    var menu_tag;
    if (typeof e === 'string') {
        panel = e;
        menu_tag = e + "-menu-tag";
    }
    else {
        panel = e.target.dataset.panel;
        menu_tag = e.target.id;
    }
	let li_ele = document.getElementById(menu_tag);
	let all_menu_li = document.getElementsByClassName('menu-option')
	let to_be_opened = document.getElementById(panel);
	let navigation = document.getElementById('navigation')
	let allPanels = document.getElementsByClassName('side-panel')
	let heading = document.getElementById('main_heading')

	// loop through the panels and remove the active class
	for (let i = 0; i < allPanels.length; i++) {
		allPanels[i].classList.remove('active');
	}
	// if the user has clicked on home, move the nav and hide panels
	// also make the heading visible again
	if (panel === 'home' || panel === 'nav-ul') {
		heading.style.opacity = '1';
		let allPanels = document.getElementsByClassName('side-panel')
		for (let i = 0; i < allPanels.length; i++) {
			allPanels[i].classList.remove('active');
		}
		navigation.classList.remove('navigation-active');

		let all_menu_li = document.getElementsByClassName('menu-option')
		for (let i = 0; i < all_menu_li.length; i++) {
			all_menu_li[i].classList.remove('li_active');
		}
		document.getElementById('menu_li_home').classList.add('li_active');
	} else {
		// otherwise, open the panel requested, activate the nav with it 
		// and hide the heading on the left.
		to_be_opened.classList.add('active');
		navigation.classList.add('navigation-active');
		heading.style.opacity = '0';
		for (let i = 0; i < all_menu_li.length; i++) {
			all_menu_li[i].classList.remove('li_active');
		}
		li_ele.classList.add('li_active');	
		// Send page data to Google Analytics
		let page_path = '?' + panel;
		history.pushState(null, page_path, page_path);
		gtag('config', 'UA-127421453-1', {page_path : page_path});
		
	}
	let leftMainPanel = document.getElementById('leftMainPanel')
	leftMainPanel.addEventListener("click", hideAll);
}

function hideAll(e) {
	let all_menu_li = document.getElementsByClassName('menu-option')
	let heading = document.getElementById('main_heading')
	let nav = document.querySelector('.navigation');
	let allPanels = document.getElementsByClassName('side-panel')
	for (let i = 0; i < allPanels.length; i++) {
		allPanels[i].classList.remove('active');
	}
	heading.style.opacity = '1';
	nav.classList.remove('navigation-active');
	for (let i = 0; i < all_menu_li.length; i++) {
		all_menu_li[i].classList.remove('li_active');
	}
	history.pushState(null, '?home', '?home');
	document.getElementById('menu_li_home').classList.add('li_active');
	e.stopPropagation(); // I don't think this works yet
}

function buttonClosePanel() {
	let nav = document.querySelector('.navigation');
	let all_menu_li = document.getElementsByClassName('menu-option')
	let allPanels = document.getElementsByClassName('side-panel')
	history.pushState(null, '?home', '?home');
	for (let i = 0; i < allPanels.length; i++) {
		allPanels[i].classList.remove('active');
	}
	nav.classList.remove('navigation-active');
	for (let i = 0; i < all_menu_li.length; i++) {
		all_menu_li[i].classList.remove('li_active');
	}
	document.getElementById('menu_li_home').classList.add('li_active');
}

// Press Escape to close panel and nav
document.onkeydown = function escPress(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) {
		buttonClosePanel();
    }
}



// swtich inner sections of panels
function innerPanelView(obj) {
	//getting the obj data from the link clicked 
	let clicked = obj;
	// getting the datainnerpanelcurrent node, the data attached is for the corisponding panel
	let panelToView = clicked.attributes.dataInnerPanelCurrent.nodeValue;
	let panelView = document.getElementById(panelToView);
	panelView.style.opacity = 0;
	panelView.style.display = 'block';
	setTimeout(function () { panelView.style.opacity = 1; }, 200)
	let panelCurrent = clicked.attributes.dataInnerPanelSwitch.nodeValue;
	let panelHide = document.getElementById(panelCurrent);
	panelHide.style.display = 'none';
	let currentButtonID = clicked.attributes.id.nodeValue;
	let currentButton = document.getElementById(currentButtonID);
	currentButton.style.color = '#fff';
	let otherButtonID = clicked.attributes.dataOppButton.nodeValue;
	let otherButton = document.getElementById(otherButtonID);
	otherButton.style.color = '#666';
}

function tryItNow() {
	let icons = document.getElementById('try_it_now_icons');
	let status = icons.style.opacity;
	if (status == 0) {
		icons.style.opacity = 1;
	} else {
		icons.style.opacity = 0;
	}
}

// onload fires when all resources (including images) have loaded
window.onload = function() {
	// start rotations
	rotate(0);
	// download replacement images + stats in the background
	let images = document.querySelectorAll('.backgrounds img');
	for (let i = 0; i < images.length; i++)	{
		let imageNo = i;
		images[i]._qistools = new QISToolbox(
			images[i],
			window.innerWidth,
			window.innerHeight,
			'black',
			{
				// 'loading': function() { },
				'complete': function(stats) {
					imageStats[imageNo] = stats;
					// Show stats for the first image (if the 1st image took more
					// than 8 seconds to load, this may *briefly* show the stats
					// on the wrong image, just once)
					if (imageNo === 0) {
						ToolboxUI.showImageStats(stats);
					}
				}
			}
		);
	}
}
