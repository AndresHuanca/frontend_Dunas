    //Register Manual    
    // variables of form Register
    const  miFormulario01 = document.querySelector('#formRegister');

    const url01 = ( window.location.hostname.includes('localhost') )
                ? 'http://localhost:8080/api/usuarios/'
                : 'https://backen-hospedajelasdunas-production.up.railway.app/api/usuarios/';
                

    miFormulario01.addEventListener( 'submit', event => {
        // evita el refersh del navegador
        event.preventDefault();
        // Reinicia los alerts
        document.getElementById('messageError01').innerHTML = '';
        document.getElementById('messageError02').innerHTML = '';
        
        const formData = {};
        // Asignando Rol
        formData.rol= 'USER-ROL';
        
        // leer formulario - mediante el name en el form
        for( let el of miFormulario01.elements ) {

            // +1 para que en el lugar 0 ingrese el USER-ROL
            if( el.name.length  > 0 ) {
                formData[el.name] = el.value;
            }         
        }        
        
        // Validacíon de contraseñas
        valPassword(formData)

        fetch( url01 , { 
            method: 'POST',
            body: JSON.stringify( formData ),
            headers: { 'Content-type': 'application/JSON' },
            
        })
        .then( resp => resp.json())
        .then( ({errors, msg}) => {

            // Mostrar los errores del backend
            if( errors ) {        
                displayAlert01(errors);
                return console.error( errors );
            }
            if( msg ) {
                displayAlert01(msg);
                return console.error( msg );
            }
            alert("Usuario Creado");
            // A vez autenticado - redireccionar
            window.location = '.././../index.html';

        })
        .catch( err => {
            console.log(err);
        });


    });
    
    // Validación de existencia de email y password
    function displayAlert01(value) {
        let  message = '';
        let message02 = '';

        for (let index = 0; index < value.length; index++) {
                message02 = value[index].msg;
                console.log(message02);  
                
            }
            message = `
                <div class="alert alert-danger" role="alert">
                    <div class="text-center ">
                        ${message02}   
                    </div>
                </div> 
            `;
            document.getElementById('messageError01').innerHTML = message;
            
    }
    
    // Validación de confirmacion de contraseñas
    function valPassword(value) {
        let  message01 = '';

        if(value.password != value.repeatPassword){
            message01 = `
                <div class="alert alert-danger" role="alert">
                    <div class="text-center ">
                        Contraseñas diferentes
                    </div>
                </div> 
                `;
            document.getElementById('messageError02').innerHTML = message01;
                
        }
    
    }
