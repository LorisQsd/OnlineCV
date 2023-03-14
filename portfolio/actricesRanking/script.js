$(function(){

    var $mainMenuItems = $("#main-menu ul").children("li"),//Sélection de tous les li dans ul
        totalMainMenuItems = $mainMenuItems.length, //On détermine le nombre de li dans ul (5)
        openedIndex = 2,//Initialise OpenedIndex à 2 soit Jessica Alba
        init = function(){
            bindEvent();

                if(validIndex(openedIndex)){// Permet d'ouvrir la fiche de Jessica Alba au chargement de la page.
                    animateItem($mainMenuItems.eq(openedIndex), true, 700);
                }
        },

        bindEvent = function(){
            $mainMenuItems.children(".images").click(function(){//Revient à écrire ul li .images en CSS. Donc Sélection de toutes les classes images après li. On ajoute une fonction au click
                var newIndex = $(this).parent().index();
                checkAndAnimateItem(newIndex);
            });
                $(".button").hover(//C'est un manière de simuler la pseudo class css :hover
                function(){
                    $(this).addClass("hovered");
                },
                function(){
                    $(this).removeClass("hovered");
                }
                );

                $(".button").click(function(){
                    var newIndex = $(this).index();
                    checkAndAnimateItem(newIndex);
                });
        }

        validIndex = function(indexToCheck){

            return (indexToCheck >= 0) && (indexToCheck < totalMainMenuItems);
        },

        animateItem = function($item, toOpen, speed){
            var $colorImage = $item.find(".color"),
            itemParam = toOpen ?{width: "420px"}: {width: "140px"}
            colorImageParam= toOpen ?{left: "0px"}: {left: "140px"}

            $colorImage.animate(colorImageParam, speed);
            $item.animate(itemParam, speed);
        };

        checkAndAnimateItem = function(indexToCheckAndAnimate){
            if(openedIndex === indexToCheckAndAnimate){
                animateItem($mainMenuItems.eq(indexToCheckAndAnimate), false, 250);
                openedIndex = -1;
            }else{
                if(validIndex(indexToCheckAndAnimate)){
                    animateItem($mainMenuItems.eq(openedIndex), false, 250);
                    openedIndex = indexToCheckAndAnimate;
                    animateItem($mainMenuItems.eq(openedIndex), true, 250);
                }
            }
        };

        init();
});