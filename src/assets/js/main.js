$(window).ready(function(){
// START:: ==================== >> Menu Dropdown << ===================
$('[id$="dropdown-trigger"]').click(function(e){
    e.stopPropagation();
    if($(this).hasClass('active')){
        $(this).removeClass('active');
        $(this).parent().find('[id$="dropdown"]').slideUp(300);
    } else {
        $(this).addClass('active');
        $(this).parent().find('[id$="dropdown"]').slideDown(300);
    }
});

// START:: ============ >>> Logout Button <<< =============
$('#--logout-button').click(function(e){ // Make Menu hide not slideUp when click logout
    e.stopPropagation();
    if($(this).parent().parent().parent().find('[id$="dropdown-trigger"]').hasClass('active')){
        $(this).parent().parent().parent().find('[id$="dropdown"]').hide();
        $(this).parent().parent().parent().find('[id$="dropdown-trigger"]').removeClass('active');
    }
});
// END:: ============ >>> Logout Button <<< =============
// END:: ==================== >> Menu Dropdown << ===================


$(window).keyup(function(e){
    
    if(e.keyCode == '27'){ // keyCode 27 is 'ESC'
        /* naming convension any dropdown id will end by 'dropdown' string
            and its trigger button id will end with 'dropdown-trigger'.
            if any dropdown has class 'active', when press on ESC key
            dropdown will slidUp(). 
        */
        if($('[id$="dropdown-trigger"').hasClass('active')){
            $('[id$="dropdown"]').slideUp();
            $('[id$="dropdown-trigger"').removeClass('active');
        }
    }
});

$(document).click(function(e){
    e.stopPropagation();
    let isNotDocument = false;
    if(e.target != document.getElementById('--logout-button'))
        if($('[id$="dropdown-trigger"').hasClass('active')){ // !isNotDocument && 
            $('[id$="dropdown"]').slideUp();
            $('[id$="dropdown-trigger"').removeClass('active');
        }
});

// START:: set all forms inputs error-container parent position: relative
// END:: set all forms inputs error-container parent position: relative

$('.--have-sub-menu .--main-menu, .--have-sub-menu .--sub-menu').hide();


const setupNestedMenu = (menuContainerClass, isMainMenu = true) => {
    let menuId;
    isMainMenu ? menuId = '#--main-menu-container-' : menuId = '#--sub-menu-container-';

    let subCats = Array.from(document.querySelectorAll(menuContainerClass));
    subCats.forEach(function (item, i) {
        $(menuId + (i+1) +' > .--plus-icon').click(function(e){
            if($(this).hasClass('--active')) {
                $(this).removeClass('--active');
                $(menuId + (i+1) +' > ul').slideUp()
                this.textContent = '+';
            } else {
                $(this).addClass('--active');
                $(menuId + (i+1) +' > ul').slideDown()
                this.textContent = '-';
            }
    });
});
}

setupNestedMenu('.--sub-menu-container', false);
setupNestedMenu('.--main-menu-container', true);

$('body, html').click((function(e){
    let checkbox = $('#--nav-trigger-checkbox')[0];
    let label = $('#--nav-trigger-checkbox + #--responsive-navbar-container label:first-child')[0];
    
    let menuIcons = Array.from($('.--toggler-icon'));
    let isMenuIcon = false;
    menuIcons.forEach( function (item) {
        if(e.target == item) isMenuIcon = true;
    });

    let plusIcons = Array.from($('.--plus-icon'));
    let isPlusIcon = false;
    plusIcons.forEach( function (item) {
        if(e.target == item) isPlusIcon = true;
    });


    if(e.target == label) return; 
    if(e.target == checkbox) return; 
    if(isMenuIcon) return;
    if(isPlusIcon) return;
    // console.log('dont match label -- target is ::', e.target)

  
    if(checkbox.checked) {
        // console.log('checked ? ::', checkbox.checked);
        checkbox.checked = false;
    }
}))

});