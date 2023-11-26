document.addEventListener("DOMContentLoaded", () => {
  // catID se guarda al dar click en una categoría.
  let endPoint = localStorage.getItem("catID");
  const url = `./json/cats_products/${endPoint}.json`;
  const token = localStorage.getItem('token')
  console.log(localStorage.getItem('token'))

  const headers = {
    'Content-Type': 'application/json',
    'access-token' : token
  }

  fetch(url,{
    headers: headers
  })
    .then((response) => response.json())
    .then((data) => {
      const productsList = document.getElementById("container");
      const productNames = [];
      const productDescriptions = [];
      //si no hay datos se crea un modal indicando que no hay stock;
      if (data.products.length == 0) {
        let noStockH1 = document.createElement("h1");
        noStockH1.textContent = "No hay stock brodeell";
        noStockH1.className = "no-stock-h1";
        productsList.appendChild(noStockH1);
      }
      /*en caso de que se encuentren datos, se crea una lista y
    se coloca dentro los datos, luego esa lista se muestra en el 
    DOM.
    */
      data.products.forEach((product) => {
        const li = document.createElement("li");
        li.className = "conteinerProduct";
        li.setAttribute("list-id", product.id);
        li.innerHTML = `
          <div class="card">
            <img src="${product.image}" class="card-img-top" alt="${product.name}">

            <div class="card-body">
              <h5 class="card-title product-name">${product.name}</h5>
              <p class="card-text product-cost">${product.cost} ${product.currency}</p>
              
              <p class="card-text product-description">${product.description}</p>
              <p class="sold-count card-text">${product.soldCount}</p>
              <a href="#" class="btn btn-primary cart" id = 'add-to-cart'> <span class="material-symbols-outlined">
              add_shopping_cart
            </span></a>
            </div>
          </div>
        `;

        productsList.appendChild(li);

        productNames.push(product.name.toLowerCase());
        productDescriptions.push(product.description.toLowerCase());

        //redirección a la info del producto
        let productId = product.id;
        li.addEventListener("click", (e) => {
          e.stopPropagation();
          localStorage.setItem("productID", productId);
          window.location = "product-info.html";
        });

        //BUSCADOR

        /* Con cada cambio en el buscador se verifica si el valor concuerda
      con los valores del nombre o descripción de cada lista, las listas cuyo 
      valores no concuerdan se las oculta mediante un cambio de clase.
      */
        document.getElementById("search-input")
          .addEventListener("keyup", () => {
            const inputValue = document
              .getElementById("search-input")
              .value.toLowerCase();
            const productList = Array.from(
              document.querySelectorAll(".conteinerProduct")
            );

            productList.forEach((matchedProduct) => {
              // se toma el nombre y descriptción de los productos.
              const productName = Array.from(
                matchedProduct.querySelectorAll(".product-name")
              );
              const productDescription = Array.from(
                matchedProduct.querySelectorAll(".product-description")
              );
              // se verifica si el valor del input concuerda con el nombre o descripción de algún producto.
              const productMatches =
                productName.some((name) =>
                  name.textContent.toLowerCase().includes(inputValue)
                ) ||
                productDescription.some((description) =>
                  description.textContent.toLowerCase().includes(inputValue)
                );
              //si el producto concuerda con el buscador se lo mantiene.
              if (productMatches) {
                matchedProduct.style.display = 'inline-block';
              } else {
                // si no concuerda se lo oculta.
                matchedProduct.style.display = 'none';
              }
            });
          });

        //FILTROS

        // menú filtros 
        document.getElementById("showMenu").addEventListener("click", function() {
          var menu = document.getElementById("menu");
          if (menu.style.display === "block") {
            menu.style.display = "none";
          } else {
            menu.style.display = "block";
          }
        });
        
        //limpiar pantalla cada vez que se filtra, para no repetir objetos.
        function clearScreen(product) {
          productsList.innerHTML = "";
          product.forEach((product) => {
            productsList.appendChild(product);
          });
        }

        const sortProducts = (selector, ascending) => {
          const productList = document.querySelectorAll(".conteinerProduct");
          const sortedProducts = Array.from(productList).sort((a, b) => {
            const valueA = parseInt(a.querySelector(selector).textContent);
            const valueB = parseInt(b.querySelector(selector).textContent);
            return ascending ? valueA - valueB : valueB - valueA;
          });

          clearScreen(sortedProducts);
        };

        document
          .getElementById("sort-sales-asc-btn")
          .addEventListener("click", () => {
            sortProducts(".sold-count", true);
          });
        document
          .getElementById("sort-sales-desc-btn")
          .addEventListener("click", () => {
            sortProducts(".sold-count", false);
          });
        document
          .getElementById("sort-price-asc")
          .addEventListener("click", () => {
            sortProducts(".product-cost", true);
          });
        document
          .getElementById("sort-price-desc")
          .addEventListener("click", () => {
            sortProducts(".product-cost", false);
          });
      });

      //---------------------------------añadiendo al carrito sin entrar al producto----------------------------------//

      //let cartArray = JSON.parse(localStorage.getItem("cartArray")) || [];
      const addBtns = document.querySelectorAll(".cart");

      addBtns.forEach((addBtn) => {
        addBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          e.preventDefault();
          const idOfList = addBtn
            .closest(".conteinerProduct")
            .getAttribute("list-id");
          //cartArray.push(idOfList);
          //localStorage.setItem("cartArray", JSON.stringify(cartArray));
          //alert("Producto Añadido");
          //console.log(cartArray)
          


              fetch(`./json/products/${idOfList}.json`,
                  {
                    headers: headers,
                  })
              .then((response) => response.json())
              .then((data) => {
                if (data.currency === "UYU") {
                  let dolar = data.cost / 40;
                  data.cost = dolar;
                  data.currency = "USD";
                }
                console.log(data)

                //---------------- Añadiendo al json ------------------- //
                // Suponiendo que ya tienes el objeto del producto que deseas agregar al carrito
                 // console.log('CARRO '+ cart)
                 
                  // Realizar la solicitud fetch para agregar el producto al carrito
                  
                  fetch('http://localhost:3000/agregar-al-carrito', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({  
                      name: data.name,
                      soldCount: data.soldCount,
                      count: 1,
                      unitCost: data.cost,
                      image: data.images[0] ,
                      id: data.id,
                      currency: "USD"
                    }),
                  })
                    .then((response) => response.json())
                    .then((result) => {
                      console.log('Headers:', headers);
                      console.log(result.message);
                      alert('Producto Agregado Correctamente')
                    })
                    .catch((error) => {
                      console.error('Error al realizar la solicitud fetch:', error);
                      console.log('Response Status:', error.response.status);
                      console.log('Response Text:', error.response.text());
                    });
                   
              })
              .catch((error) => console.log(error));
            });
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
    

  //FILTRO POR RANGO DE PRECIO.
  document.getElementById("filter-btn").addEventListener("click", function () {
    let productPrices = document.querySelectorAll(".product-cost");
    let minPrice = document.getElementById("rangeFilterPriceMin").value;
    let maxPrice = document.getElementById("rangeFilterPriceMax").value;

    productPrices.forEach((product) => {
      let productCost = parseFloat(product.textContent);
      let productItem = product.closest(".conteinerProduct");
      /*si un campo se mantiene vacío se le asigna un valor predeterminado,
            ya sea 0, para el minimo o infinito para el maximo*/
      if (minPrice === "" || minPrice === undefined) {
        minPrice = 0;
      }
      if (maxPrice === "" || maxPrice === undefined) {
        maxPrice = Infinity;
      }
      /*si el precio del producto está entre los valores de los inputs se
            mantiene la lista en pantalla*/
      if (productCost >= minPrice && productCost <= maxPrice) {
        productItem.style.display = 'inline-block';
      } else {
        productItem.style.display = 'none';
      }
    });
  });
});