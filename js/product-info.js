document.addEventListener('DOMContentLoaded', () => {
    const logueado = localStorage.getItem('logueado');
    if (logueado === 'false' || logueado === null) {
        window.location.href = '../login.html';
    }

    const token = localStorage.getItem('token')
    console.log(localStorage.getItem('token'))

    const headers = {
        'Content-Type': 'application/json',
        'access-token' : token
    }


    document.getElementById('perfil-a').textContent = localStorage.getItem('nombreUsuario');
    //---------------------------------consiguiendo el producto-----------------------------//
    let productId = localStorage.getItem('productID');
    let urlPoducto = `./json/products/${productId}.json`;
    fetch(urlPoducto,{
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        }
      })
    .then(response => response.json())
    .then(data => { 
        console.log(data)
        let container = document.createElement('DIV');

        let relatedProductsHtml = data.relatedProducts.map(product => `
            <div class="related-product" data-product-id="${product.id}">
                <h3>${product.name}</h3>
                <img src="${product.image}">
            </div>
        `).join('');

         // finalmente se muestran el pantalla todos los datos.
        container.innerHTML = `
            <h1>${data.name}</h1>
            <section id = 'img-and-seller-container'>
                <div id="img-container">

                    <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
                        </div>
                        <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img src="${data.images[0]}" class="d-block w-100" alt="...">
                        </div>
                        <div class="carousel-item">
                            <img src="${data.images[1]}" class="d-block w-100" alt="...">
                        </div>
                        <div class="carousel-item">
                            <img src="${data.images[2]}" class="d-block w-100" alt="...">
                        </div>
                        <div class="carousel-item">
                            <img src="${data.images[3]}" class="d-block w-100" alt="...">
                        </div>
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                    
                </div>
                <div id = 'aside-container'> 
                    <div id="buy-info">
                    <p class="price-and-sold">${data.cost} ${data.currency}</p>
                    <p class="price-and-sold">Vendidos: ${data.soldCount}</p>
                    <button id = 'add-to-cart'>Añadir al carrito</button>

                    <div id = 'seller-info'>
                        <h4>Nombre Vendedor</H4>
                        <h5>Categoría prémium</H5>
                        <h4>Valoración</H4>
                        <h4>⭐⭐⭐⭐</H4>
                        <h5>Productos Vendidos</H5>
                        <h5>294</H5>
                        <input type = 'text'>
                        <button>Preguntar</button>
                    </div>
                </div>
                </div>
            </section>
            <h2>Descripción del producto</h2>
            <p>${data.description}</p>
            <h2>Productos similares</h2>
            <div id="related-products-container">
                ${relatedProductsHtml}
            </div>
        `

        document.getElementById('container').appendChild(container);

        // Al hacer clic en un producto relacionado, se almacena su ID en la variable selectedProductId.
        document.getElementById('related-products-container').addEventListener('click', (event) => {
            const clickedProduct = event.target.closest('.related-product');
            if (clickedProduct) {
                const selectedProductId = clickedProduct.getAttribute('data-product-id');
                // se recarga la página con los datos el producto.
                localStorage.setItem('productID',selectedProductId)
                location.reload()
            }
        });
        //----------------------- Agregando al carrito ----------------//
        const addToCart = () => {
            // Construct the request body with the product details
            const cartProduct = {
                name: data.name,
                soldCount: data.soldCount,
                count: 1,
                unitCost: data.cost,
                image: data.images[0],
                id: data.id,
                currency: "USD"
            };
            // Make a POST request to add the product to the cart
            fetch('http://localhost:3000/agregar-al-carrito', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(cartProduct),
            })
            .then((response) => response.json())
            .then((result) => {
                console.log(result.message);
                alert('Producto Agregado Correctamente');
            })
            .catch((error) => {
                console.error('Error al realizar la solicitud fetch:', error);
                console.log('Response Status:', error.response.status);
                console.log('Response Text:', error.response.text());
            });
        };
        
        // Event listener for the "Añadir al carrito" button
        document.getElementById('add-to-cart').addEventListener('click', addToCart);

        //quitar pantalla de carga
        document.getElementById('loading-screen').style.display = 'none';
    })
    .catch(error => console.error('Error fetching data:', error));
    
    //-------------------------- consiguiendo comentarios ---------------------------------//
    let urlComentarios = `https://japceibal.github.io/emercado-api/products_comments/${productId}.json`
    fetch(urlComentarios)
    .then(response => response.json())
    .then(data => { 

        //generando estrellas
        function starGenerator(score) {
            const maxStars = 5; // El número máximo de estrellas
            const fullStar = '⭐';
            const starRating = fullStar.repeat(score);
            return starRating;
        }

        // lo mismo, usar .map para generar una lista con el comentario.
        let commentsArray = data.map(comment => 
            `<li class = 'comment'>
                    <div class ='title-container'>
                        <h4>${comment.user}</h4>
                        <h4>${comment.dateTime}</h4>
                    </div>
                    <p>${comment.description}</p>
                    <h4>${starGenerator(comment.score)}</h4>
                </li>`
        ).join('');
        document.getElementById('coment-container').innerHTML = commentsArray
    })
    .catch(error => console.error('Error fetching data:', error));

    //mostrando en pantalla el comentario del ususario.
    document.getElementById('enviar-btn').addEventListener('click',()=>{
        const input = document.getElementById('user-text').value;
        const select = document.getElementById('puntaje').value;
        let actualDate = new Date();
        let day = actualDate.getDate();
        let month = actualDate.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por eso se suma 1
        let year = actualDate.getFullYear();

        const coment = document.createElement('li');
        coment.className = 'comment'
        coment.innerHTML = `
            <div class = 'title-container'> 
                <h4>${localStorage.getItem('nombreUsuario')}</h4>
                <h4>${year}-${month}-${day}</h4>
                <h5 id = 'edited'></h5>
            </div>
            <p id = 'comment-text'>${input}</p>
            <h4>${select}</h4>
            <button id = 'edit-comment-btn'>Editar</button>
        `
        document.getElementById('user-text').value = '';
        document.getElementById('coment-container').appendChild(coment)
        document.getElementById('comment-inputs-container').style.display = 'none';

        //guardando en el localStorage el comentario.
        // no terminado.
        localStorage.setItem('userComment',coment.innerHTML);
       

        //editar comentario
        let editable = false;;
        document.getElementById('edit-comment-btn').addEventListener('click',()=>{
            document.getElementById('edited').textContent = 'editado';
            if(!editable) {
                document.getElementById('comment-text').contentEditable = 'true';
                document.getElementById('edit-comment-btn').textContent = 'guardar';
                editable = true;
            }
            else {
                document.getElementById('comment-text').contentEditable = 'false';
                document.getElementById('edit-comment-btn').textContent = 'editar';
                editable = false;
            }
        })
    })
    
});