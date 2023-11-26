document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'access-token': token
  };

  //--------------------------- añadiendo productos desde el local storage ---------------------------//
  function generateCart() {
    // por las dudas no tocar xd
    generateProduct();
  }

  function generateProduct() {
    fetch(`http://localhost:3000/carrito`, {
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        data.articles.forEach((article) => {
          console.log(article)
          const li = document.createElement("li");
          li.classList.add("conteinerProduct");
          li.classList.add("conteinerProduct-cart");
          li.innerHTML = `
                    <div class="card">
                        <img src="${article.image}" class="card-img-top" alt="${article.name}">
    
                        <div class="card-body">
                        <h5 class="card-title">${article.name}</h5>
                        <p class="card-text">${article.unitCost} ${article.currency}</p>
                        
                        <p class="card-text">${article.soldCount} Vendidos</p>
                        <input type='number' placeholder='1' min='1' class='amount-inp'/>
                        <h2 style="color:  #222222; font-size: 20px"> Total : <span class='total-amount'> ${article.unitCost} </span>${article.currency}</h2>
                        <a href="#" class="btn btn-primary cart delete-btns" product-id='${article.id}' id='add-to-cart'>
                          <span class="material-symbols-outlined">delete</span>
                        </a>
                        </div>
                    </div>
                    `;
          document.getElementById("container").appendChild(li);
          //----------------------Eliminando productos del carrito----------------------/
          deleteProduct(li, article.id);
          // ------------- total costo ---------------------/
          totalCost(li, article);
        });
      })
      .catch((error) => console.log(error));
  }

  function totalCost(li, article) {
    let amountInput = li.querySelector(".amount-inp");
    let totalAmountSpan = li.querySelector(".total-amount");
    totalAmountSpan.innerHTML = article.unitCost;
    amountInput.addEventListener("input", () => {
      let amount = parseInt(amountInput.value, 10);
      let totalAmount = article.unitCost * amount;
      if (isNaN(totalAmount)) {
        totalAmount = article.unitCost;
      }
      totalAmountSpan.textContent = `${totalAmount}`;
      updateTotal();
    });
  }

   //------mostrando total del total totalitario totalista-----------//

     function updateSummary() {
      const subTotal = Array.from(document.querySelectorAll(".total-amount")).reduce((total, element) => {
        return total + parseFloat(element.textContent);
      }, 0);
  
      const flatShippingCost = 0; // Tarifa plana de envío
  
      const totalAmount = subTotal + flatShippingCost;
  
      document.getElementById("subtotal-amount").textContent = `${subTotal.toFixed(2)} USD`;
      document.getElementById("shipping-amount").textContent = `${flatShippingCost.toFixed(2)} USD`;
      document.getElementById("total-amount").textContent = `${totalAmount.toFixed(2)} USD`;
    }
  
    // Llamar a la función para calcular el resumen al cargar la página
    updateSummary();
  
  
    // Agrega un evento de escucha a los elementos de radio para capturar el cambio
    const premiumRadioButtons = document.querySelectorAll('input[name="premium"]');
    premiumRadioButtons.forEach((radio) => {
      radio.addEventListener("change", () => {
        updateTotal(); // Llama a la función para actualizar el total
      });
    });
  
    // Función para actualizar el total
    function updateTotal() {
      let subTotal = 0;
      document.querySelectorAll(".total-amount").forEach((totalAmountSpan) => {
        subTotal += parseFloat(totalAmountSpan.textContent);
      });
  
      let selectedShippingPercentage = 0;
      premiumRadioButtons.forEach((radio) => {
        if (radio.checked) {
          selectedShippingPercentage = parseInt(radio.value, 10);
        }
      });
  
      // Calcular el costo de envío en función del porcentaje seleccionado
      const shippingCost = (subTotal * selectedShippingPercentage) / 100;
  
      // Calcular el total a pagar
      const totalAmount = subTotal + shippingCost;
  
      // Actualizar los elementos HTML con los valores calculados
      document.getElementById("subtotal-amount").textContent = `${subTotal.toFixed(2)} USD`;
      document.getElementById("shipping-amount").textContent = `${shippingCost.toFixed(2)} USD`;
      document.getElementById("total-amount").textContent = `${totalAmount.toFixed(2)} USD`;
    }
  
    // Llamar a la función para calcular el resumen al cargar la página
    updateTotal(); 
  

    function deleteProduct(li, productId) {
      let deleteBtn = li.querySelector(".delete-btns");
      deleteBtn.addEventListener("click", () => {
        li.remove();
        fetch(`http://localhost:3000/eliminar-del-carrito/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'access-token': token
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`Error al eliminar el producto del carrito: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log('eliminao paaa')
            console.log(data.message);
            // Puedes realizar acciones adicionales después de eliminar con éxito, si es necesario
          })
          .catch(error => {
            console.error('Error al eliminar el producto del carrito:', error);
          });
      });
    }
  
                  //-------------------GENERANDO CARRITO -----------------//

  //---------------------- Formularios y validaciones ------------------------//

          // ----------------- Limpiar Carrito ------------------ //


          // ----------------- Limpiar Carrito ------------------ //
/*
function clearCart(cart) {
  cart = []
  JSON.stringify(localStorage.setItem("cartArray",cart));
  document.getElementById('container').innerHTML = '';
  console.log(cart)
} */

  // Función para mostrar un modal
function showModal(modalId) {
  const modal = new bootstrap.Modal(document.getElementById(modalId));
  modal.show();
}

// Función para ocultar un modal
function hideModal(modalId) {
  const modal = new bootstrap.Modal(document.getElementById(modalId));
  modal.hide();
  document.getElementById(modalId).style.display = 'none';

  const backdrop = document.querySelector('.modal-backdrop');
  backdrop.remove()
  location.reload()
}

// Función para mostrar un mensaje de éxito temporal
function showSuccessMessage(messageElement, duration = 2000) {
  messageElement.style.display = "block";
  setTimeout(() => {
    messageElement.style.display = "none";
  }, duration);
}

// Función para mostrar un mensaje de error temporal
function showErrorMessage(messageElement, duration = 2000) {
  messageElement.style.display = "block";
  setTimeout(() => {
    messageElement.style.display = "none";
  }, duration);
}

// Función para validar un formulario de tarjeta de crédito
function isCreditCardValid(creditCardNumber, expirationDate, cvv) {
  // Validar que el número de tarjeta tenga 16 dígitos numéricos
  return /^\d{16}$/.test(creditCardNumber);
}

// Manejador del botón "Finalizar compra"
function handleFinishBuyButtonClick() {
  showModal("myModal");
  updateTotal();
}
// -------------- Parte 2 ----------------//
// Manejador del botón "Transferencia bancaria"
function handleWireTransferButtonClick() {
  const streetForm = document.getElementById("street-form");
  if (streetForm.checkValidity()) {
    showModal("bankAccountModal");
  } else {
    streetForm.classList.add("was-validated");
  }
}
// Manejador del botón "tarjeta crédito"
function handlePaymentButtonClick() {
  const streetForm = document.getElementById("street-form");
  if (streetForm.checkValidity()) {
    showModal("creditCardModal");
  } else {
    streetForm.classList.add("was-validated");
  }
}

// Función para validar un formulario de tarjeta de crédito
function isBankAccountValid() {
  const bankAccountForm = document.getElementById('bankAccountForm');
  const accountInputs = bankAccountForm.querySelectorAll('.account-info');
  return Array.from(accountInputs).every(input => input.value !== null && input.value !== '');
}

// Manejador del botón "Finalizar compra" en el botón de tarjeta de crédito
function handleSubmitCreditCardButtonClick() {
  const creditCardNumberInput = document.getElementById("creditCardNumber");
  const expirationDateInput = document.getElementById("expirationDate");
  const cvvInput = document.getElementById("cvv");
  const errorMessage = document.querySelector("#error-message");
  const successMessage = document.querySelector("#success-message");

  const creditCardNumber = creditCardNumberInput.value;
  const expirationDate = expirationDateInput.value;
  const cvv = cvvInput.value;

  if (isCreditCardValid(creditCardNumber, expirationDate, cvv)) {
    hideModal("creditCardModal");
    //miloco
    document.getElementById('myModal').style.display = 'none';
    errorMessage.style.display = "none";
    showSuccessMessage(successMessage);
  } else {
    showErrorMessage(errorMessage);
  }
}

// Manejador del botón "Finalizar compra" en el modal de cuenta bancaria
function handleSubmitBankAccountButtonClick() {
  if (isBankAccountValid()) {
    hideModal("bankAccountModal");
    //miloco
    document.getElementById('myModal').style.display = 'none';
    showSuccessMessage(document.querySelector("#success-message"));
  } else {
    showErrorMessage(document.querySelector("#error-message"));
  }
}
// Agregar event listeners a los botones
document.getElementById("finish-buy").addEventListener("click", handleFinishBuyButtonClick);
document.getElementById("payment-btn").addEventListener("click", handlePaymentButtonClick);
document.getElementById("close-modal").addEventListener("click", () => hideModal("myModal"));
document.getElementById("submitCreditCard").addEventListener("click", handleSubmitCreditCardButtonClick);
document.getElementById("wire-transfer").addEventListener("click", handleWireTransferButtonClick);
document.getElementById("submitBankAccount").addEventListener("click", handleSubmitBankAccountButtonClick);

generateCart()
});