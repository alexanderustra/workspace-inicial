document.addEventListener('DOMContentLoaded',()=>{

    //obtiene los datos del formulario
    const formulario = document.getElementById('login-form')
    let logueado = false;
    //mientras el usuario no esté logueado se guarda en el almacenamiento local que no lo está.
    localStorage.setItem('logueado','false');
    //conseguir los datos del registro.
    let userData = localStorage.getItem('user-data').split(',');
    console.log(userData)
    console.log(userData[4])
    console.log(userData[6])

    document.getElementById('iniciar-sesion-btn').addEventListener('click',(e)=>{
        e.preventDefault();
        //al hacer click en el botón iniciar sesión se verifica que ningún campo esté vacío.
        let userNameInput = formulario.querySelector('input[name="user-name"]');
        let passwordInput = formulario.querySelector('input[name="password"]');

        console.log(userNameInput.value + passwordInput.value)
        if(userNameInput.value == userData[4] && passwordInput.value == userData[6] ) {
            
            logueado = true;
            localStorage.setItem('logueado', 'true');
        }
        else {
            alert('datos incorectos')
        }

        //LOGIN 

        const data = {
            username: userNameInput.value,
            password : passwordInput.value
          };
    
          fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
            .then(response => response.json())
            .then(data => {
              console.log(data);
              console.log(data.token)
              localStorage.setItem('token', data.token);
              document.getElementById('modal-container').style.display = 'none';
              generateTasks();
            })
            .catch(error => {
              console.error(error);
            });
      window.location.href = './index.html';
    })
    // no permite cambiar de pestaña si no se loguea primero.
    let listaMenu = document.querySelectorAll('.nav-link');
    listaMenu.forEach(lista => lista.addEventListener('click', (e) => {
        if (!logueado) {
            e.preventDefault()
            alert('Tiene que iniciar sesión');
        }
    }));
})
