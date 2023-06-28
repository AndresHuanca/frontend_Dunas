    //Auth Manual    
    // variables of form
    const  miFormulario = document.querySelector('#formLogin');

    const url = ( window.location.hostname.includes('localhost') )
                ? 'http://localhost:8080/api/auth/'
                : 'https://backend-nodejs-postgresql.up.railway.app/api/auth/';
    
    // validarAdmin url para local y produccion 
    const urlAdmin = ( window.location.hostname.includes('localhost') )
                ? 'http://localhost:8080/api/usuarios/'
                : 'https://backend-nodejs-postgresql.up.railway.app/api/usuarios/';
                

   miFormulario.addEventListener( 'submit', event => {
        // evita el refersh del navegador
        event.preventDefault();
        // Reinicia los alerts
        document.getElementById('messageError').innerHTML = '';
        
        const formData = {};
        // leer formulario - mediante el name en el form
        for( let el of miFormulario.elements ) {
            if( el.name.length > 0 ) {
                formData[el.name] = el.value;
            }         
        }
        
        fetch( url + 'login', { 
            method: 'POST',
            body: JSON.stringify( formData ),
            headers: { 'Content-type': 'application/JSON' },
            
        })
        .then( resp => resp.json())
        .then( ({errors, token, msg}) => {
            // Mostrar los errores del backend
            // console.log( errors );

            if( errors ) {        
                displayAlert(errors);
                return console.error( errors );
            }
            if( msg ) {
                displayAlert(msg);
                console.log( errors );
                return console.error( msg );
            }

            // Guardo el token en localStorage
            localStorage.setItem( 'token', token );
            // console.log(token );
            // A vez autenticado - redireccionar
            window.location = '../../index.html';

        })
        .catch( err => {
            console.log(err);
        });


    });
    
    // Validación de existencia de email y password
    function displayAlert(value) {
        let  message = '';

                message = `
                    <div class="alert alert-danger" role="alert">
                        <div class="text-center ">
                            ${value}
                        </div>
                    </div> 
                    `;
                document.getElementById('messageError').innerHTML = message;
        
            // console.log(value);  
    
    }

    // Para permanencia
    //  Validar el token del localStorage
    const validarJWT = async() => {
    // extrayendo token
    const token1 = localStorage.getItem('token' || '' );
    // html logout
    
    // Url of production or  developer
    // Extraigo en token del backen de la route auth/
    const resp = await fetch( url, { 
        headers: { 'x-token': token1 }
    });
    
    // Validación de estancia en los html
    if( resp.status >= 300 ){     
        // login
        const logout = `<li class="nav-item">
                            <a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#miModal">
                            Iniciar Sesión
                            </a>
                        </li>`;
        document.getElementById('login/logout').innerHTML = logout;

        // reservas
        const reserva = `<li class="nav-item">
                            <a class="nav-link" href="#" id="openModalButton">Reservas</a>
                        </li>`;
        document.getElementById('reserva').innerHTML = reserva;
        
        // Modal
        const modal =   `<div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">
                                    <div class="modal-body text-center">
                                        <p>Solo se puede hacer reservas Iniciando Sesión</p>
                                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
                                    </div>
                                </div>
                            </div>
                        </div>`;

        document.getElementById('modal').innerHTML = modal;
        
        document.getElementById('openModalButton').addEventListener('click', function() {
            var myModal = new bootstrap.Modal(document.getElementById('myModal'));
            myModal.show();
        });
        //Modal 
        
    }else{
        
        // Cerrar Sesión
        const start =   `<li class="nav-item">
                            <a class="nav-link" href="#" id="cerrarSesion">Cerrar Sesión</a>
                        </li>`;
        document.getElementById('login/logout').innerHTML = start;
        const button = document.getElementById("cerrarSesion");
            button.onclick = () => {
            // Borrar información del localStorage
                localStorage.clear();
                location.reload();
                window.location.href = "../../index.html";
        };
        // Cerrar Sesión

        // Ingresar reservas
        const reservaIngreso = `<li class="nav-item">
                            <a class="nav-link" href="../../views/reservations/customer.html" >Reservas</a>
                        </li>`;
        document.getElementById('reserva').innerHTML = reservaIngreso;
        // Ingresar reservas
    }    

    //Obtengo toda la información del route y controller auth 
    // const datosUserAuth = await resp.json();
    // console.log(datosUserAuth);

    const { usuario: userDb, token: tokenDb } = await resp.json();
    // establezco el nuevo JWT 
    localStorage.setItem( 'token', tokenDb );
    // Save information of user
    usuario = userDb;
    // Title in page
    document.title = usuario.nombre;

    // Validar Admin
    validarAdmin(userDb);
    
}


    // Validar Admin
const validarAdmin = async(user) => {

    const resp = await fetch( urlAdmin, { 
    });
    //Obtengo toda la información del route y controller auth 
    const  {usuarios}  = await resp.json();
    // Search user Admin
    for (let index = 0; index < usuarios.length; index++) {
        
        //User Admin
        if( user.id_usuario == usuarios[index].id_usuario ){
            if ( usuarios[index].rols.rol === 'ADMIN-ROL'  ) {
                // View for Admin
                let itemAdminAccount = `<li class="nav-item">
                                            <a class="nav-link" href="./views/login/administrador.html">Gestión de Habitaciones</a>
                                        </li>`;

                document.getElementById('gestionHabitacion').innerHTML = itemAdminAccount;

            };

        }

    }

};

// Para logout
const main = async() => {
    // Validar JWT
    await validarJWT();
        
};
        
main();