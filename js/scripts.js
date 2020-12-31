
//-------------------  JAVASCRIPT ---------------------------

// Dropdown para el carrito
document.body.addEventListener('click', openDropD);

//Alterna entre mostrar y esconder el contenido del dropdown al clickear botón y logo carro, o botón de añadir producto.
function openDropD(evento) {

  let event = evento.target.matches('.btn-cart') || evento.target.matches('.logo-cart') || evento.target.matches('.btn-prod1') || evento.target.matches('.btn-prod2') || evento.target.matches('.btn-prod3') || evento.target.matches('.btn-prod4') || evento.target.matches('.btn-prod5'); 

  if (event) {
  document.getElementById("cartDropdown").classList.toggle("show");
  }
}

//Despliega y mantiene el Dropdown al añadir productos consecutivamente
document.body.addEventListener('click', btnProdDropdown);

function btnProdDropdown(evento) {

    let event = evento.target.matches('.btn-prod1') || evento.target.matches('.btn-prod2') || evento.target.matches('.btn-prod3') || evento.target.matches('.btn-prod4') || evento.target.matches('.btn-prod5');

    if (event) {

        document.getElementById("cartDropdown").classList.add("show");
    }
}

// Cierra el dropdown si el usuario hace click fuera de él
window.addEventListener('click', cierreDropdown);

function cierreDropdown(evento) {

  let event = evento.target.matches('.btn-cart') || evento.target.matches('.logo-cart') || evento.target.matches('.btn-prod1') || evento.target.matches('.btn-prod2') || evento.target.matches('.btn-prod3') || evento.target.matches('.btn-prod4') || evento.target.matches('.btn-prod5') || evento.target.matches('.btn-remove-prod');
  
  if (!event) {

    let dropdown = document.getElementById("cartDropdown");
    
    if (dropdown.classList.contains('show')) {
      dropdown.classList.remove('show');
    }
  }
}


//----------------------- VUE --------------------------------

// Templates
const templates = {

    emptyCart: `<p>No se han añadido productos.</p>`, 

    tableProd:`
        <table class="table-dropdown">
            <thead>
                <tr>
                    <th>Detalle</th>
                    <th>Unidades</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for = "producto in prod">   
                    <td class="producto">{{producto.detalle}}</td>
                    <td class="unidades">{{producto.unidades}}</td>
                    <td><button class="btn-remove-prod" @click="removeProd">Eliminar</button></td>
                </tr>
            </tbody>
        </table>`
};       


// ******     HEADER     ********************************

//trae contador de productos de localStorage
let contadorProductos = localStorage.getItem("contador");
contadorProductos = JSON.parse(contadorProductos);

// Muestra número del contador del carro en el DOM
const headerCarro = new Vue({

    el: '.header-cart',
    data: {
        contador: ""
    },
});

// borra 0 del contador
if (contadorProductos == 0) {
    contadorProductos = "";
}

// pasa contador a la instancia Vue
headerCarro.contador = contadorProductos; 

// ********    PRODUCTOS    **************************

// trae productos de localStorage
let productos = localStorage.getItem("items");
productos = JSON.parse(productos);

if (productos == null) {
    productos = [];
};

// Agrrega producto y cambia template
const vueCart = new Vue ({

    el: '.vue-cart',
    data: {
        view: 'carroVacio',
    },

    components: {
        carroVacio: {
            template: templates.emptyCart
        },
        carroConProductos: {
            data:function () {      
                return { 
                    prod: productos           
            }},
            methods: {
                removeProd(evento) {
                    const tableProd = evento.target.parentNode.parentNode;

                    const nomProd = tableProd.querySelector(".producto").textContent;

                    for (let i of productos) { 

                        if(i.detalle == nomProd) {

                            if (i.unidades > 1) {
                            i.unidades--;    

                            } else {
                                //elimina producto de la tabla
                                productos.splice(productos.indexOf(i), 1);
                            }                       
                            contadorProductos--;
                            headerCarro.contador--;
                        }
                    };   

                    // cambia la vista del contador si el carro se queda sin productos
                    if(headerCarro.contador == 0) {
                        vueCart.view='carroVacio';
                        headerCarro.contador = "";
                    }

                    // guarda items y contador en local storage
                    localStorage.setItem("items", JSON.stringify(productos));
                    localStorage.setItem("contador", JSON.stringify(contadorProductos));
                    
                }
            },
            template: templates.tableProd
        }    
    },

    methods: {
        addProd(evento) {

            // despliega vista carro al agregar primer producto
            vueCart.view='carroConProductos';
            
            if (headerCarro.contador < 10) {

                //extrae div del producto del DOM
                const divProducto = evento.target.parentNode;

                //extrae nombre producto
                const nombreProd = divProducto.querySelector(".nombre-prod").textContent;

                // guarda detalle prod y unidades
                let encontrado = false;

                if (productos == "") { 

                    productos.push(
                        {detalle: nombreProd, unidades: 1}
                    );

                    contadorProductos++;
                        
                } else {

                    for (let i of productos) {

                        if(i.detalle == nombreProd) {
                            
                            i.unidades++;                           
                            
                            encontrado = true;
                            contadorProductos++;
                        }
                    };   

                    if(!encontrado) {

                        productos.push({detalle: nombreProd, unidades: 1});
                        contadorProductos++;
                    };
                    
                };
                
                //suma contador
                headerCarro.contador++;

                // guarda items y contador en local storage
                localStorage.setItem("items", JSON.stringify(productos));
                localStorage.setItem("contador", JSON.stringify(contadorProductos));

            } else {
                alert("Máximo de productos por carro: 10 productos.\nPor favor, finalice el proceso de compra para crear otro carro.");
            }    
        },
    }    
});

// si LocalStorage contiene productos, los muestra cambiando la vista de la instancia Vue (vista por defecto sin productos).
if (contadorProductos > 0) {
    vueCart.view = 'carroConProductos';
}


