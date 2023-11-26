document.addEventListener('DOMContentLoaded', () => {
    /*se carga la imagén guardada si es que anteriormente
      el usuario seleccionó una */
    let image = localStorage.getItem('user-selected-img')
    if(image) {
        document.getElementById('profile-img').src = image;
    }

    let dataArray = document.querySelectorAll('.profile-data');
    console.log(dataArray)
    // ---esto es provicional---
    let dataType = ['Nombre : ','Segundo Nombre : ','Apellido : ','Segundo Apellido : ', 'Correo: ','Teléfono: '] // se usa para que en el bucle la descripción sea coherente con el tipo de dato.

    function setProfile() {
        let userData = localStorage.getItem('user-data'); // se consiguen los datos del registro.
        let userDataArray = userData.split(','); // se separan los datos en un arreglo en lugar de una cadena.
        console.log(userDataArray)

        for(let i = 0; i < dataArray.length ; i++) {
            dataArray[i].textContent = dataType[i] + userDataArray[i];
        }
    }

    function editProfile() {
        //al clickear 'editar perfil' se crea un modal con 4 inputs, uno para cada dato del usuario.
        const mainElement = document.querySelector('main');
        let modal = document.createElement('DIV');
        modal.className = 'modal-input'; 
        mainElement.appendChild(modal)
        let inputsToModify = [];
        //se crean los 4 inputs, con el placeholder del dato editable. 
        for(let i = 0; i < dataArray.length ; i++) {
            let input = document.createElement('INPUT'); 
            modal.appendChild(input)
            /* al input creado de le da como placeholder y value la variable que indica el valor que el
            usuario le asignó en el registro */
            input.placeHolder = dataType[i];
            input.value = dataArray[i].textContent.replace(dataType[i], '');
            inputsToModify.push(input);
        }
        let imgInput = document.createElement('INPUT');
        //let imgText = document.createElement('p');
        //imgText.textContent = 'Imágen de Perfil';
        imgInput.type = 'file';
        imgInput.accept = 'image/*'; 
        //modal.appendChild(imgText)
        modal.appendChild(imgInput)
        editable = true;
        /* 
        se crea un botón para guardar, este botón oculta el modal y 
        guarda los datos de los inputs como los nuevos valores de los 
        datos del perfil
        */
        let saveBtn = document.createElement('BUTTON');
        saveBtn.textContent = 'Guardar';
        modal.appendChild(saveBtn)

        saveBtn.addEventListener('click',()=>{
            modal.style.display = 'none';
            for(let i = 0; i < dataArray.length ; i++) {
                dataArray[i].textContent = dataType[i] + inputsToModify[i].value;
            }
            if (imgInput.files && imgInput.files[0]) {
                var reader = new FileReader();
                
                reader.onload = function(e) {
                    var imageSrc = e.target.result;
                    document.getElementById('profile-img').src = imageSrc;
                    
                    // Guarda la imagen en Local Storage
                    localStorage.setItem('user-selected-img', imageSrc);
                };
                
                reader.readAsDataURL(imgInput.files[0]);
            }
        })
        

    }
    setProfile()
    document.getElementById('edit-profile-btn').addEventListener('click',editProfile);
});