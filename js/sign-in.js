document.addEventListener('DOMContentLoaded', () => {
    
    document.getElementById('sign-in-btn').addEventListener('click',(e)=>{
        e.preventDefault();
        //al hacer click en iniciar sesión se guarda en el local storage que está logueado, para que en el index no redirija.
        let empty = false;
        let logueado = localStorage.setItem('logueado','true');
        const inputs = document.getElementsByTagName('input');
        const userData = [];
        
        for (let i = 0; i < inputs.length; i++) {
            if(inputs[i].value === '') {  // se verifica que ningún campo esté vacío.
                alert('complete todos los campos')
                empty = true;
                break;
            }
        }
        if (!empty) {
            // si se completan todos los campos, se le agregan los valores de los inputs al arreglo 'userData'.
            for (let i = 0; i < inputs.length; i++) {
              userData.push(inputs[i].value);
            }
            // se guardan los datos que el usuario colocó en el registro para luego usarlos en su perfil.
            localStorage.setItem('user-data', userData);
            localStorage.setItem('nombreUsuario',userData[0])
            window.location.href = './login.html';
          }
    });
});