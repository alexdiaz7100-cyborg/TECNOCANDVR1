//PARA CREAR EL MENU MOVIL
const openMenu=document.querySelector("#open-menu");
const closeMenu=document.querySelector("#close-menu");
const aside=document.querySelector("aside");

//para que funcione el botón menu movil y se muestre el menu lateral
openMenu.addEventListener("click", ()=>{
    aside.classList.add("aside-visible");
})

//para que funcione el botón cerrar menu movil y se oculte el menu lateral
closeMenu.addEventListener("click", ()=>{
    aside.classList.remove("aside-visible");
})

//para que no aparezca en los submenu de ropa
const botonesCategorias = document.querySelectorAll(".boton-categoria");

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        // Tu lógica de menú aquí
    });
});