// list of big facing headings
let headings = [
	"Perfect detail at any scale",
	"Conversions that don't ruffle feathers",
	"Resize images on-the-fly",
	"Simple colour conversion"
]

// pause boolean for background and title rotation
let pause = false; 

function updateHeading() {
	let heading = document.getElementById('heading')
	heading.innerHTML = headings[0];
	heading.style.opacity = 1;
	i = 1;
	if (!pause) {
		setInterval(function () {
			if (i > 2) {
				heading.style.opacity = 0;
				setTimeout(function(){
					heading.innerHTML = headings[i];
				heading.style.opacity = 1;
				}, 500); 
				i = 0;
			} else {
				heading.style.opacity = 0;
				setTimeout(function(){
					heading.innerHTML = headings[i];
				heading.style.opacity = 1;
				}, 500); 
				i++
			}
		}	,8000)
	}
}

function changeBackground(){
	let backgrounds = document.getElementsByClassName('background-image');
	let i = 3;
	if (!pause) {
		setInterval(function () {
			if (i > 0) {
				backgrounds[i].style.opacity = 0;			
					setTimeout(function(){
						backgrounds[i].style.opacity = 1;
					}, 1000);
					i = i - 1;
				} else {				
					setTimeout(function(){
						i = 3;	
						backgrounds[i].style.opacity = 1;	
						backgrounds[0].style.opacity = 1;
						backgrounds[1].style.opacity = 1;
						backgrounds[2].style.opacity = 1;
						backgrounds[3].style.opacity = 1;					
					}, 1000);
					
				}
			} ,8000)
	}
}

function SetupwhenReady(fn) {
	if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
};

SetupwhenReady(setUp);
changeBackground();
updateHeading();

function setUp() {
	// set navigation event listener
	let nav = document.querySelector(".navigation");
	nav.addEventListener("click", showPanel);
}

function showPanel(e) {
	// get everything we need, nav, side panels ect.
	let panel = e.target.dataset.panel;
	let menu_tag = e.target.id;
	let li_ele = document.getElementById(menu_tag);
	let all_menu_li = document.getElementsByClassName('menu-option')
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
		document.getElementById('main_heading').style.opacity = '1';
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
		pause = false;
		changeBackground();
		updateHeading();
	} else {
		// otherwise, open the panel requested, activate the nav with it 
		// and hide the heading on the left.
		pause = true;
		changeBackground();
		updateHeading();
		to_be_opened.classList.add('active');
		navigation.classList.add('navigation-active');
		document.getElementById('main_heading').style.opacity = '0';
		for (let i = 0; i < all_menu_li.length; i++) {
			all_menu_li[i].classList.remove('li_active');
		}
		li_ele.classList.add('li_active');
	}
	let leftMainPanel = document.getElementById('leftMainPanel')
	leftMainPanel.addEventListener("click", hideAll);
}

function hideAll(e) {
	console.log('this was run')
	let all_menu_li = document.getElementsByClassName('menu-option')
	let heading = document.getElementById('main_heading');
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
	document.getElementById('menu_li_home').classList.add('li_active');
	pause = false;
	changeBackground();
	updateHeading();
	e.stopPropagation(); // I don't think this works yet
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
	setTimeout(function() {panelView.style.opacity = 1;}, 300)
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

function tryItNow(){
	let icons = document.getElementById('try_it_now_icons');
	let status = icons.style.opacity;
	console.log(icons)
	console.log(icons.style.opacity)
	if (status == 0) {
		icons.style.opacity = 1;
	} else {
		icons.style.opacity = 0;
	}
}

function externalFeaturesNav(relate, link) {
	let allTheFeatures = document.getElementsByClassName('ext-features-content');
	let allTheMenuItems = document.getElementsByClassName('extra-features-ul-li');
	for (i = 0; i < allTheFeatures.length; i++)	 {
		allTheFeatures[i].style.display = 'none';
		console.log(allTheFeatures[i])
	}
	for (i = 0; i < allTheMenuItems.length; i++)	 {
		allTheMenuItems[i].classList.remove('extra-features-li-active');
	}
	let activeLink = document.getElementById(link);
	activeLink.classList.add('extra-features-li-active');

	let openFeature = document.getElementById(relate);
	openFeature.style.display = 'block';
}