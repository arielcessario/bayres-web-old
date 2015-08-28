'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'ngAnimate',
    'login.login',
    'acCarrito',
    'acLoginCarritoIngresar'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/commerce/main'});
        $routeProvider.when('/commerce/:parameter', {
            controller: 'MainController'
        });
    }])
    .controller('MainController', MainController)
    .factory('MainService', MainService);


MainController.$inject = ['acAngularProductosService', 'acAngularCarritoServiceAcciones', '$scope', '$document',
    'LoginService', 'acAngularSucursalesService', '$timeout', '$routeParams', '$location', '$interval',
    'acAngularCategoriasService', 'MainService', 'acAngularCarritoTotalService', '$window'];
MainService.$inject = ['$http'];

function MainController(acAngularProductosService, acAngularCarritoServiceAcciones, $scope, $document,
                        LoginService, acAngularSucursalesService, $timeout, $routeParams, $location, $interval,
                        acAngularCategoriasService, MainService, acAngularCarritoTotalService, $window) {
    var vm = this;
    vm.ofertas = [];
    vm.destacados = [];
    vm.vendidos = [];
    vm.productos = [];
    vm.search = '';
    vm.ejecuta = '';
    vm.details = false;
    vm.detalle = {};
    vm.mail = '';
    vm.password = '';
    vm.sucursales = [];
    vm.sucursal = {};
    vm.tipo = 0;
    vm.envios = 'Gran Buenos Aires';
    vm.cliente = {};

    //vm.active_form = 'main';
    vm.active_form = ($routeParams.parameter === undefined) ? 'main' : $routeParams.parameter;
    vm.active_form_before = '';

    vm.addProducto = addProducto;
    vm.agregarProducto = agregarProducto;
    vm.agregarOferta = agregarOferta;
    vm.searchByName = searchByName;
    vm.showDetails = showDetails;
    vm.showDetailsOferta = showDetailsOferta;
    vm.hideDetails = hideDetails;
    vm.finalizarCompra = finalizarCompra;
    vm.comprar = comprar;
    vm.cuenta = cuenta;
    vm.carritoCompras = carritoCompras;
    vm.mostrarCategorias = mostrarCategorias;
    vm.modificarPass = modificarPass;
    vm.ingresar = ingresar;
    vm.nuevoCliente = nuevoCliente;
    vm.crearCliente = crearCliente;
    vm.ingresarCliente = ingresarCliente;
    vm.logout = logout;
    vm.inicio = inicio;
    vm.top = 0;
    vm.top_before = 0;
    vm.debug = false;
    vm.usuario_creado = 0;
    vm.user_is_logged = false;
    vm.creaCliente = false;
    vm.compraTerminada = false;
    vm.slider_nro = 1;
    //Agregado por mateo
    vm.actualizarCliente = actualizarCliente;
    vm.repetirCarrito = repetirCarrito;
    vm.selectDetalle = selectDetalle;
    vm.borrarCarrito = borrarCarrito;
    vm.masVendidosForm = masVendidosForm;
    vm.destacadosForm = destacadosForm;
    vm.sucursalesForm = sucursalesForm;
    vm.ofertasForm = ofertasForm;
    vm.contacto = contacto;
    vm.mapa = mapa;
    vm.getByCategoria = getByCategoria;
    vm.aceptoAgreement = false;
    vm.detalles = [];
    vm.pass_old = '';
    vm.pass_new = '';
    vm.sucursal_contacto = 1;
    vm.enviarConsulta = enviarConsulta;
    vm.nombreContacto = '';
    vm.apellidoContacto = '';
    vm.emailContacto = '';
    vm.consulta = '';
    vm.mapa_sucursal = '';
    vm.menu_selected = '';
    vm.agregarCarrito = agregarCarrito;
    vm.ingresarClienteEnter = ingresarClienteEnter;
    vm.goToResultado = goToResultado;
    vm.goToCrearCliente = goToCrearCliente;
    vm.goToIngresar = goToIngresar;
    vm.error_code = 0;
    vm.noAcepto = noAcepto;
    vm.recovery_pwd = 0;
    vm.recoveryPwd = recoveryPwd;
    vm.searchTitle = 'RESULTADOS';
    vm.info_envio = '';
    vm.verLegales = verLegales;
    vm.textoLegales = '';
    vm.newsLetter = true;
    vm.newsLetterToUpdate = true;
    vm.volverLegales = volverLegales;

    //Manejo de errores
    vm.message_error = '';
    vm.update_error = '0';
    vm.change_pwd_error = '0';
    vm.carrito_mensaje = '0';
    vm.contacto_enviado = '0';

    vm.menu_mobile = false;
    vm.menu_mobile_open = false;
    vm.categorias = [];
    vm.with_products = false;

    vm.scrollTo = scrollTo;
    vm.cambiarSlide = cambiarSlide;


    vm.intervalo = $interval(cambiarSlide, 7000);

    vm.intervalo;

    function cambiarSlide(){
        vm.slider_nro = (vm.slider_nro == 4) ? vm.slider_nro = 1 : vm.slider_nro += 1;
        //vm.slider_nro = 2;
    }

    function noAcepto() {
        $window.location.href = 'http://www.google.com';
    }

    acAngularCategoriasService.getCategorias(function(data){
        //console.log(data);
        vm.categorias = data;
    });

    function getByCategoria(categoria_id){
        acAngularProductosService.getProductosByCategoria(categoria_id, function(data){
            scrollTo(700);
            $location.path('/commerce/search');
            vm.productos = data;
            if(vm.menu_mobile_open)
                vm.menu_mobile_open = false;
        });

        if(vm.showCategorias)
            vm.showCategorias = false;
    }


    var pos_origin = 0;
    function scrollTo(pos) {

        //var cantidad = pos;
        var timer = 0;
        var speed = 20;

        var is_end = false;
        var pos_actual = document.getElementById('parallax').scrollTop;
        var pos_next = pos_actual + (pos / 25);


        if (pos_origin == 0){
            pos_origin = pos_actual;
        }

        if((pos_actual<pos && pos_next > pos) ||
            (pos_actual>pos && pos_next < pos)){

            is_end = true;
            pos_origin = 0;
        }



        //for(var i = 0; i<cantidad/8; i++){
        if (document.getElementById('parallax').scrollTop != pos) {
            setTimeout(function () {
                    //console.log(document.getElementById('parallax').scrollTop);

                if(pos < document.getElementById('parallax').scrollTop){

                    document.getElementById('parallax').scrollTop -= pos_origin / 25;

                }else{
                    document.getElementById('parallax').scrollTop += pos / 25;

                }
                //console.log(document.getElementById('parallax').scrollTop);
                //timer += 1;
                if(!is_end){
                    vm.scrollTo(pos);
                }
            }, 10);

        }
    }


    //console.log(window.innerWidth);

    $scope.$on('$routeChangeSuccess', function (next, current) {
        //console.log($routeParams);
        vm.active_form = ($routeParams.parameter === undefined) ? 'main' : $routeParams.parameter;
        //vm.active_form =(next === undefined)?'main':next;
        if(vm.active_form != 'search')
            vm.search = '';
    });


    window.addEventListener('resize', function () {
        vm.menu_mobile = (window.innerWidth < 800);

        //if (window.innerWidth < 800) {
        //    vm.menu_mobile = true;
        //} else {
        //    vm.menu_mobile = false;
        //
        //}
        $scope.$apply();
    });

    if (window.innerWidth < 800) {
        vm.menu_mobile = true;
    }


    if (!LoginService.checkLogged()) {

    } else {
        vm.user_is_logged = true;

        vm.cliente = LoginService.checkLogged().cliente[0];
        //console.log(vm.cliente);
    }


    acAngularSucursalesService.getSucursales(function (data) {
        vm.sucursales = data;
        vm.sucursal = data[0];
    });

    function contacto(sucursal_id) {
        vm.menu_selected = 'contacto';
        vm.sucursal_contacto = sucursal_id;
        scrollTo(0);
        //document.getElementById("parallax").scrollTop = 0;
        //vm.active_form = 'main';
        $location.path('/commerce/contact');

        if(vm.showCategorias)
            vm.showCategorias = false;

        if(vm.menu_mobile_open)
            vm.menu_mobile_open = false;

        inicializarVariables();
        limpiarDatosContacto();
    }

    function limpiarDatosContacto() {
        vm.nombreContacto = '';
        vm.apellidoContacto = '';
        vm.emailContacto = '';
        vm.consulta = '';
    }

    function mapa(sucursal_id) {
        vm.sucursal_contacto = sucursal_id;
        scrollTo(0);
        //document.getElementById("parallax").scrollTop = 0;
        //vm.active_form = 'main';
        $location.path('/commerce/mapa');
    }

    function verLegales(option) {
        scrollTo(0);
        $location.path('/commerce/legales');

        if(vm.showCategorias)
            vm.showCategorias = false;

        if(vm.menu_mobile_open)
            vm.menu_mobile_open = false;

        if(option == 1){
            vm.tituloLegales = 'Envios / Devoluciones';
            vm.textoLegales = 'Falta información';
        }else if(option == 2) {
            vm.tituloLegales = 'Confidencialidad';
            vm.textoLegales = 'Falta información';
        }else if(option == 3) {
            vm.tituloLegales = 'Condiciones de Uso';
            vm.textoLegales = 'Falta información';
        }else {
            vm.tituloLegales = '¿Quienes Somos?';
            vm.textoLegales = 'Somos una empresa joven dedicada a la distribucion mayorista y minorista de articulos de cultivo.' +
                            'Como principal objetivo buscamos la satisfaccion de nuestros clientes, para conseguirlo brindamos ' +
                            'el mejor asesoramiento personalizado, respondiendo a todas tus consultas pre y post venta. ' +
                            'Contamos con un showroom con mas de 400 articulos para el cultivo, en el podras encontrar los ' +
                            'productos que buscas para hacer rendir al maximo tus cosechas. ' +
                            'Trabajamos con las marcas lideres del mercado, tanto nacional como importadas. ' +
                            'En pocas palabras, brindamos soluciones. Porque para eso estamos. ' +
                            'Te damos las gracias por dedicarle un minuto a leer nuestra muy resumida historia y te invitamos a ' +
                            'registrarte en nuestro sitio';
        }
    }

    function volverLegales() {
        vm.menu_selected = 'inicio';
        scrollTo(2000);
        //document.getElementById("parallax").scrollTop = 0;
        //vm.active_form = 'main';
        $location.path('/commerce/main');
        if(vm.menu_mobile_open)
            vm.menu_mobile_open = false;

        if(vm.showCategorias)
            vm.showCategorias = false;
    }

    function inicio() {
        vm.menu_selected = 'inicio';
        scrollTo(0);
        //document.getElementById("parallax").scrollTop = 0;
        //vm.active_form = 'main';
        $location.path('/commerce/main');
        if(vm.menu_mobile_open)
            vm.menu_mobile_open = false;

        if(vm.showCategorias)
            vm.showCategorias = false;
    }

    function destacadosForm() {
        scrollTo(1036);
        //document.getElementById("parallax").scrollTop = 1036;
        //vm.active_form = 'main';
        $location.path('/commerce/main');
    }

    function masVendidosForm() {
        scrollTo(1536);
        //document.getElementById("parallax").scrollTop = 1536;
        //vm.active_form = 'main';
        $location.path('/commerce/main');
    }

    function sucursalesForm() {
        scrollTo(0);
        //document.getElementById("parallax").scrollTop = 0;
        //vm.active_form = 'main';
        $location.path('/commerce/main');
    }


    function ofertasForm() {
        scrollTo(636);
        //document.getElementById("parallax").scrollTop = 636;
        //vm.active_form = 'main';
        $location.path('/commerce/main');
    }

    function ingresarClienteEnter(event) {
        if(event.keyCode == 13) {
            ingresar();
        }
    }

    //Estas 2 funciones solo sirven para el link del login
    function ingresarCliente() {
        inicializarVariables();
        //vm.active_form = 'login';
        scrollTo(363);
        $location.path('/commerce/login');
        vm.creaCliente = false;
        //document.getElementById("parallax").scrollTop = 636;
        if(vm.showCategorias)
            vm.showCategorias = false;
    }

    function goToIngresar() {
        vm.creaCliente = false;
        vm.message_error = '';
        vm.error_code = 0;
    }

    function goToCrearCliente() {
        vm.creaCliente = true;
        vm.message_error = '';
        vm.error_code = 0;
    }

    function crearCliente() {
        vm.message_error = '';
        //vm.active_form = 'login';
        $location.path('/commerce/login');
        vm.creaCliente = true;
        scrollTo(636);
        //document.getElementById("parallax").scrollTop = 636;

        if(vm.showCategorias)
            vm.showCategorias = false;
    }

    function modificarPass() {
        inicializarVariables();

        if (!LoginService.checkLogged()) {

        } else {
            if (vm.pass_old.trim().length > 0 && vm.pass_new.trim().length > 0) {
                //if((vm.pass_old.trim().length >= 5 && vm.pass_old.trim().length <= 25)
                //    && (vm.pass_new.trim().length >= 5 && vm.pass_new.trim().length <= 25)) {

                vm.user_is_logged = true;
                vm.cliente_id = LoginService.checkLogged().cliente[0].cliente_id;

                LoginService.changePassword(vm.cliente_id, vm.pass_old, vm.pass_new,
                    function (data) {
                        vm.change_pwd_error = '1';
                        if (data == 1) {
                            vm.pass_new = '';
                            vm.pass_old = '';
                            vm.message_error = 'La contrase単a se modifico satisfactoriamente';
                        }
                        else {
                            vm.change_pwd_error = '1';
                            vm.message_error = 'Error modificando la contrase単a';
                        }
                        //console.log(data);
                    });
                /*}
                 else {
                 vm.change_pwd_error = '1';
                 vm.message_error = 'Las contrase単as deben contener de 5 a 25 caracteres';
                 }*/
            }
            else {
                vm.change_pwd_error = '1';
                vm.message_error = 'Las contrase単as no pueden ser vacias';
            }
        }
    }

    /**
     *
     */
    function inicializarVariables() {
        vm.update_error = '0';
        vm.change_pwd_error = '0';
        vm.message_error = '';
        vm.carrito_mensaje = '0';
        vm.contacto_enviado = '0';
        vm.recovery_pwd = 0;
    }

    function actualizarCliente() {
        inicializarVariables();

        if (!LoginService.checkLogged()) {
            //Si no esta logueado lo pongo en false
            vm.user_is_logged = false;
            //lo mando al formulario para logueo
            //vm.active_form = 'login';
            $location.path('/commerce/login');
            //limpio el objeto cliente
            vm.cliente = {};
        } else {
            vm.user_is_logged = true;
            if (vm.cliente.apellido.trim().length > 0 && vm.cliente.nombre.trim().length > 0 && vm.cliente.mail.trim().length > 0) {
                if (ValidateEmail(vm.cliente.mail.trim())) {
                    LoginService.getClienteByEmail(vm.cliente.mail.trim(), function (data) {
                        //console.log(vm.cliente);

                        if (data.user != null) {
                            if (vm.cliente.cliente_id == data.user.cliente_id) {
                                //Si no encontro dentro de la db otro cliente
                                //con el email ingresado, actualizo los datos
                                vm.cliente.news_letter = (vm.newsLetterToUpdate) ? 1 : 0;
                                LoginService.updateCliente(vm.cliente, function (data) {
                                        if (data.result) {
                                            vm.update_error = '1';
                                            vm.message_error = 'Los datos se actualizaron satisfactoriamente';
                                        }
                                        else {
                                            vm.update_error = '1';
                                            vm.message_error = 'Error modificando los datos 1';
                                        }
                                    });
                            }
                            else {
                                vm.update_error = '1';
                                vm.message_error = 'Ya existe otro cliente con el email ingresado';
                            }
                        }
                        else {
                            //Si no encontro dentro de la db otro cliente
                            //con el email ingresado, actualizo los datos
                            vm.cliente.news_letter = (vm.newsLetterToUpdate) ? 1 : 0;
                            LoginService.updateCliente(vm.cliente, function (data) {
                                    //console.log(data.result);
                                    //console.log((data.result) ? 1 : 0);
                                    if (data.result) {
                                        vm.update_error = '1';
                                        vm.message_error = 'Los datos se actualizaron satisfactoriamente';
                                    }
                                    else {
                                        vm.update_error = '1';
                                        vm.message_error = 'Error modificando los datos 2';
                                    }
                                });
                        }
                    });
                }
                else {
                    vm.update_error = '1';
                    vm.message_error = 'El mail no es valido';
                }
            }
            else {
                vm.update_error = '1';
                vm.message_error = 'Los campos no deben estar vacios';
            }
        }
    }

    /**
     *
     * @param email
     * @returns {boolean}
     */
    function ValidateEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email)
    }

    function enviarConsulta() {
        inicializarVariables();

        if((vm.nombreContacto.trim().length == 0) || (vm.apellidoContacto.trim().length == 0) ||
            (vm.emailContacto.trim().length == 0) || (vm.consulta.trim().length == 0)) {
            //console.log('Por favor ingrese todos los datos para poder enviar el Mail');
            vm.contacto_enviado = '1';
            vm.message_error = 'Por favor ingrese todos los datos para poder enviar el Mail';
        }
        else {
            if (ValidateEmail(vm.emailContacto.trim())) {
                MainService.sendMail(vm.nombreContacto.trim().capitalize(),
                                    vm.apellidoContacto.trim().capitalize(),
                                    vm.emailContacto.toLowerCase().trim(),
                                    vm.consulta.trim(),
                                    function(enviado) {
                    //console.log(enviado);
                    if(enviado == "true") {
                        limpiarDatosContacto();
                        //console.log('Su consulta fue enviada. Gracias por contactarse');
                        vm.contacto_enviado = '1';
                        vm.message_error = 'Su consulta fue enviada. Gracias por contactarse';
                        inicio();
                    }
                    else {
                        //console.log('Se produjo un error al enviar el mail');
                        vm.contacto_enviado = '1';
                        vm.message_error = 'Se produjo un error al enviar el mail';
                    }
                });
            }
            else {
                //console.log('El mail ingresado no es valido');
                vm.contacto_enviado = '1';
                vm.message_error = 'El mail ingresado no es valido';
            }
        }
    }

    /**
     * Función que pone en mayuscula la primera letra de cada palabra
     * @returns {string}
     */
    String.prototype.capitalize = function(){
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    function finalizarCompra() {
        var envio_retira = (vm.tipo == 0) ? vm.envios : vm.sucursal.nombre;

        var ret_comprar = acAngularCarritoServiceAcciones.comprar(envio_retira, function (data) {
            vm.info_envio = '';
            vm.compraTerminada = true;
            $timeout(function () {

                vm.compraTerminada = false;
                //vm.active_form = 'main';
                $location.path('/commerce/main');

                vm.historico_pedidos = [];
                LoginService.getHistoricoPedidos(LoginService.checkLogged().cliente[0].cliente_id,
                    function (data2) {
                        vm.historico_pedidos = data2;
                        var select_one = {pedido_id:-1, fecha:'Seleccione un pedido'};

                        vm.historico_pedidos.unshift(select_one);
                        vm.pedido = vm.historico_pedidos[0];
                        //$scope.$apply();
                    });

            }, 2000);
        });

        if (ret_comprar === false) {
            //console.log('Mensaje de Carrito Vacío');
        }
    }


    function logout() {
        LoginService.logout();
        vm.user_is_logged = false;
        //vm.active_form = 'main';
        $location.path('/commerce/main');
    }

    function validarFormatoFecha(campo) {
        var RegExPattern = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
        if ((campo.match(RegExPattern)) && (campo!='')) {
            return true;
        } else {
            return false;
        }
    }


    function nuevoCliente() {
        vm.message_error = '';
        //vm.usuario_creado = 0;
        vm.usuario_creado = -1;

        scrollTo(636);
        //document.getElementById("parallax").scrollTop = 636;

        if(vm.nombre === undefined) {
            vm.message_error = "El Nombre es Obligatorio";
            vm.error_code = 1;
        }else if(vm.nombre.trim().length == 0) {
            vm.message_error = "El Nombre es Obligatorio";
            vm.error_code = 1;
        }else if(vm.apellido === undefined) {
            vm.message_error = "El Apellido es Obligatorio";
            vm.error_code = 2;
        }else if(vm.apellido.trim().length == 0) {
            vm.message_error = "El Apellido es Obligatorio";
            vm.error_code = 2;
        }else if(vm.fecha_nacimiento === undefined) {
            vm.message_error = "La Fecha de Nacimiento es Obligatoria";
            vm.error_code = 3;
        }else if(vm.fecha_nacimiento.trim().length == 0) {
            vm.message_error = "La Fecha de Nacimiento es Obligatoria";
            vm.error_code = 3;
        }else if(!validarFormatoFecha(vm.fecha_nacimiento)) {
            vm.message_error = "La Fecha de Nacimiento no tiene el formato correcto dd/mm/aaaa";
            vm.error_code = 3;
        }else if(vm.telefono === undefined) {
            vm.message_error = "El Teléfono es Obligatorio";
            vm.error_code = 4;
        }else if(vm.telefono.trim().length == 0) {
            vm.message_error = "El Teléfono es Obligatorio";
            vm.error_code = 4;
        }else if(vm.direccion === undefined) {
            vm.message_error = "La Dirección es Oblicatoria";
            vm.error_code = 5;
        }else if(vm.direccion.trim().length == 0) {
            vm.message_error = "La Dirección es Oblicatoria";
            vm.error_code = 5;
        }else if(vm.mail === undefined) {
            vm.message_error = "El Mail es Obligatorio";
            vm.error_code = 6;
        }else if(vm.mail.trim().length == 0) {
            vm.message_error = "El Mail es Obligatorio";
            vm.error_code = 6;
        }else if(vm.mail_repeat === undefined) {
            vm.message_error = "Debe Repetir el mismo mail";
            vm.error_code = 7;
        }else if(vm.mail_repeat.trim().length == 0) {
            vm.message_error = "Debe Repetir el mismo mail";
            vm.error_code = 7;
        }else if(vm.password === undefined) {
            vm.message_error = "La Contraseña es Obligatoria";
            vm.error_code = 8;
        }else if(vm.password.trim().length == 0) {
            vm.message_error = "La Contraseña es Obligatoria";
            vm.error_code = 8;
        }else if (!ValidateEmail(vm.mail.trim())) {
            vm.message_error = "El mail ingresado no es valido";
            vm.error_code = 6;
        }else if (!ValidateEmail(vm.mail_repeat.trim())) {
            vm.message_error = "El segundo mail ingresado no es valido";
            vm.error_code = 7;
        }else {
            LoginService.existeCliente(vm.mail, function (data) {
                if (data == 'true') {
                    vm.message_error = 'El mail ya se encuentra en uso. En caso de no recordar la contraseña, solicitela a través de la página.';
                    vm.usuario_creado = -1;
                    vm.error_code = 6;
                    return;
                }

                if (vm.mail.trim().length > 0 && vm.mail_repeat.trim().length > 0) {
                    if (vm.mail.trim() === vm.mail_repeat.trim()) {
                        //console.log('llamando al create');
                        var cliente = {};
                        cliente.nombre = vm.nombre;
                        cliente.apellido = vm.apellido;
                        cliente.mail = vm.mail;
                        cliente.password = vm.password;
                        cliente.fecha_nacimiento = vm.fecha_nacimiento;
                        cliente.telefono = vm.telefono;
                        cliente.direccion = vm.direccion;
                        cliente.news_letter = (vm.newsLetter) ? 1 : 0;
                        //console.log(cliente);

                        /*LoginService.create(vm.nombre, vm.apellido, vm.mail, vm.password, vm.fecha_nacimiento,
                            vm.telefono, vm.direccion, function (data) {*/
                        LoginService.create(cliente, function (data) {
                                if (data == 'true') {
                                    ingresar();

                                    $location.path('/commerce/main');
                                    vm.nombre = '';
                                    vm.apellido = '';
                                    vm.mail = '';
                                    vm.password = '';
                                    vm.fecha_nacimiento = '';
                                    vm.telefono = '';
                                    vm.direccion = '';
                                    vm.mail_repeat = '';
                                    vm.error_code = 0;
                                    vm.newsLetter = true;
                                }
                                else {
                                    vm.message_error = 'Ocurrio un error creando el usuario';
                                    //vm.usuario_creado = -1;
                                }
                            });
                    }
                    else {
                        vm.message_error = 'Los correos deben ser iguales';
                        //vm.usuario_creado = -1;
                    }
                }
                else {
                    vm.message_error = 'Los correos son obligatorios';
                    //vm.usuario_creado = -1;
                }
            });
        }
    }

    function recoveryPwd() {
        if(vm.mail != undefined) {
            if(vm.mail.trim().length > 0) {
                if (ValidateEmail(vm.mail.trim())) {
                    LoginService.getClienteByEmail(vm.mail.trim(), function (data){
                        if(data.cliente != "null") {
                            var new_password = LoginService.generateRandomPassword();
                            //console.log(new_password);
                            //console.log(data.cliente_id);
                            LoginService.resetPassword(data.cliente_id, new_password, function(data2){
                                //console.log(data2);
                                if(data2.result) {
                                    //console.log('envio mail');
                                    LoginService.sendPassword(vm.mail.trim(), new_password, function(enviado) {
                                        //console.log(enviado);
                                        if(enviado == "true") {
                                            vm.mail = '';
                                            vm.message_error = 'Se envio una nueva contraseña';
                                            vm.error_code = 6;
                                        }
                                        else {
                                            vm.message_error = 'Se produjo un error al enviar el mail';
                                            vm.error_code = 6;
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            vm.message_error = 'El mail ingresado no existe';
                            vm.error_code = 6;
                        }
                    });
                }
                else {
                    vm.message_error = 'El mail no tiene un formato valido';
                    vm.error_code = 6;
                }
            }
            else {
                vm.message_error = 'Ingrese un mail';
                vm.error_code = 6;
            }
        }
        else {
            vm.message_error = 'Error al pasar el mail';
            vm.error_code = 6;
        }
    }

    function ingresar() {
        vm.usuario_creado = -1;

        if(vm.mail === undefined) {
            vm.message_error = 'Ingrese un Mail';
            vm.error_code = 6;
        }else if(vm.mail.trim().length == 0) {
            vm.message_error = 'Ingrese un Mail';
            vm.error_code = 6;
        }else if(vm.password === undefined) {
            vm.message_error = 'Ingrese una contraseña';
            vm.error_code = 8;
        }else if(vm.password.trim().length == 0) {
            vm.message_error = 'Ingrese una contraseña';
            vm.error_code = 8;
        }else if (!ValidateEmail(vm.mail.trim())) {
            vm.message_error = 'El mail ingresado no es valido';
            vm.error_code = 6;
        }else{
            scrollTo(636);
            //document.getElementById("parallax").scrollTop = 636;
            LoginService.login(vm.mail.trim(), vm.password.trim(), function (data) {
                if (data[0].nombre != null && data[0].nombre.trim().length > 0) {
                    //vm.active_form = 'carrito';
                    //$location.path('/commerce/carrito');
                    $location.path('/commerce/main');
                    //vm.nombre = data[0].nombre;
                    vm.user_is_logged = true;
                    //console.log(data[0]);
                    vm.cliente = data[0];
                    vm.newsLetterToUpdate = (vm.cliente.news_letter == 1) ? true : false;
                    vm.mail = '';
                    vm.password = '';
                    vm.error_code = 0;

                    LoginService.getHistoricoPedidos(LoginService.checkLogged().cliente[0].cliente_id,
                        function (data2) {
                            //console.log(data2);
                            vm.historico_pedidos = data2;
                            var select_one = {pedido_id:-1, fecha:'Seleccione un pedido'};

                            vm.historico_pedidos.unshift(select_one);
                            vm.pedido = vm.historico_pedidos[0];
                            //vm.usuario_creado = -1;
                        });

                } else {
                    vm.message_error = 'Mail o password incorrectos';
                    vm.usuario_creado = data;
                    vm.nombre = '';
                    vm.user_is_logged = false;
                    vm.recovery_pwd = 1;
                }
            });
        }
        //console.log(vm.message_error);
    }

    if (LoginService.checkLogged()) {
        LoginService.getHistoricoPedidos(LoginService.checkLogged().cliente[0].cliente_id,
            function (data) {
                //console.log(data);
                vm.historico_pedidos = data;
                var select_one = {pedido_id:-1, fecha:'Seleccione un pedido'};

                vm.historico_pedidos.unshift(select_one);
                vm.pedido = vm.historico_pedidos[0];
            });
    }

    function carritoCompras() {
        vm.menu_selected = 'compras';
    }

    function mostrarCategorias() {
        vm.menu_selected = 'categorias';
        vm.showCategorias = !vm.showCategorias;
    }

    function comprar(opcion) {
        vm.menu_selected = opcion;

        scrollTo(636);
        //document.getElementById("parallax").scrollTop = 636;
        if (!LoginService.checkLogged()) {
            //vm.active_form = 'login';
            $location.path('/commerce/login');
        } else {
            //vm.active_form = 'carrito';
            $location.path('/commerce/carrito');
            vm.info_envio = 'Los envios se realizan por medio de cadeteria, según el tamaño y peso del pedido. El costo del mismo es a cargo del comprador, previo coordinacion con el vendedor';
        }
        if(vm.menu_mobile_open)
            vm.menu_mobile_open = false;
        //if (!acAngularCarritoServiceAcciones.comprar()) {
        //    vm.active_form = 'login';
        //} else {
        //    vm.active_form = 'carrito';
        //}
        if(vm.showCategorias)
            vm.showCategorias = false;
    }

    function cuenta() {
        vm.menu_selected = 'cuenta';
        inicializarVariables();

        scrollTo(636);
        //document.getElementById("parallax").scrollTop = 636;
        if (!LoginService.checkLogged()) {
            //vm.active_form = 'login';
            $location.path('/commerce/login');
        } else {
            //vm.active_form = 'cuenta';
            $location.path('/commerce/cuenta');
        }
        if(vm.menu_mobile_open)
            vm.menu_mobile_open = false;

        if(vm.showCategorias)
            vm.showCategorias = false;
    }

    function showDetailsOferta(oferta) {
        var prod_oferta = {};
        prod_oferta["producto_id"] = -1;
        prod_oferta.precios = [];
        var precio = {precio: 0};
        prod_oferta.precios.push(precio);
        prod_oferta.precios[0].precio = oferta.precio;
        prod_oferta.cantidad = 1;

        prod_oferta.fotos = [];
        var foto = {nombre: ''};
        prod_oferta.fotos.push(foto);
        prod_oferta.fotos[0].nombre = oferta.imagen;

        prod_oferta.oferta_id = oferta.oferta_id;
        prod_oferta.nombre = oferta.titulo;
        prod_oferta.descripcion = oferta.descripcion;


        showDetails(prod_oferta);
    }

    function showDetails(detalle) {
        vm.active_form_before = vm.active_form;
        //vm.active_form = 'details';
        $location.path('/commerce/details');

        vm.detalle = detalle;
        vm.details = true;
        vm.top_before = document.getElementById("parallax").scrollTop;
        scrollTo(636);
        //document.getElementById("parallax").scrollTop = 636;

        //console.log(vm.detalle);

        //for(var i = vm.top; i <= 636; i++){
        //    console.log(i);
        //    document.getElementById("parallax").scrollTop = i;
        //    $scope.$apply();
        //}


    }

    function hideDetails(detalle) {
        //console.log(detalle);
        if(detalle.destacado == 1) {
            vm.active_form = vm.active_form_before;
            vm.detalle = {};
            vm.details = false;
            scrollTo(vm.top_before);
            $location.path('/commerce/main');
        }
        else {
            getByCategoria(detalle.categoria_id);
        }
    }

    function goToResultado(event) {
        if(event.keyCode == 13) {
            scrollTo(700);
        }
    }

    function searchByName() {
        //console.log(vm.search);
        if (vm.search.length > 2) {
            //vm.active_form = 'search';
            $location.path('/commerce/search');
            acAngularProductosService.getProductoByName(vm.search, function (data) {
                if(data.length > 0) {
                    vm.searchTitle = 'RESULTADOS';
                }
                else {
                    vm.searchTitle = 'No se encontro resultado';
                }
                vm.productos = data;
            });
        } else {
            //vm.active_form = 'main';
            $location.path('/commerce/main');
        }
    }

    function repetirCarrito(pedido) {
        inicializarVariables();

        if(pedido === undefined) {
            vm.carrito_mensaje = '1';
            vm.message_error = 'Por favor seleccione un pedido del listado';
        }else {
            pedido.detalles.forEach(function(producto) {
                for(var i = 1; i <= producto.cantidad; i++ ){
                    var prod = {};

                    prod.oferta_id = -1;
                    prod.precios = [];
                    var precio = {precio: 0};
                    prod.precios.push(precio);
                    prod.precios[0].precio = producto.precio;
                    prod.cantidad = producto.cantidad;
                    prod.producto_id = producto.producto_id;
                    prod.nombre = producto.nombre;

                    addProducto(prod);
                }
            });
        }
    }

    function agregarCarrito(detalle) {
        var prod = {};

        prod.oferta_id = -1;
        prod.precios = [];
        var precio = {precio: 0};
        prod.precios.push(precio);
        prod.precios[0].precio = detalle.precio;
        prod.cantidad = detalle.cantidad;
        prod.producto_id = detalle.producto_id;
        prod.nombre = detalle.nombre;

        addProducto(prod);
    }

    function borrarCarrito() {
        inicializarVariables();

        vm.carrito_mensaje = '1';
        vm.message_error = 'El carrito se borro satisfactoriamente';
    }

    function selectDetalle() {
        vm.detalles = vm.historico_pedidos[2].detalles;
    }

    acAngularProductosService.getOfertas(function (data) {
        //console.log(data);
        vm.ofertas = data;
    });

    acAngularProductosService.getProductosDestacados(function (data) {
        vm.destacados = data;
        //console.log(data);
    });
    acAngularProductosService.getProductosMasVendidos(function (data) {
        vm.vendidos = data;
        //console.log(data);
    });


    function agregarProducto(producto) {
        producto.oferta_id = -1;
        addProducto(producto);
    }

    function agregarOferta(oferta) {
        var prod_oferta = {};

        //console.log(oferta);
        //prod_oferta["producto_id"] = -1;
        prod_oferta.oferta_id = -1;
        prod_oferta.precios = [];
        var precio = {precio: 0};
        prod_oferta.precios.push(precio);
        prod_oferta.precios[0].precio = oferta.precio;
        prod_oferta.cantidad = 1;
        prod_oferta.oferta_id = -1;
        prod_oferta.producto_id = oferta.producto_id;
        prod_oferta.nombre = oferta.titulo;
        prod_oferta.descripcion = oferta.descripcion;

        addProducto(prod_oferta);
    }


    function addProducto(producto) {


        //console.log(producto);
        acAngularCarritoServiceAcciones.addProducto(producto);


    }


    $scope.$on('ActualizaCarrito', function() {
        if(acAngularCarritoTotalService.productosCarrito.length>0){
            vm.with_products = true;
        }else{
            vm.with_products = false;
        }
    });


    var container = document.getElementsByClassName('parallax');

    function animate() {
        if (document.getElementById("parallax").scrollTop > 580) {
            document.getElementById("sucursales-03").style.opacity = 0;
            document.getElementById("sucursales-02").style.opacity = 0;

        } else {
            document.getElementById("sucursales-03").style.opacity = 1;
            document.getElementById("sucursales-02").style.opacity = 1;

        }
    }

    container[0].addEventListener('scroll', function () {

        requestAnimationFrame(animate);

        showPosition();
        function showPosition() {
            //console.log('top: ' + window.pageYOffset);
            //console.log(document.getElementById("parallax").scrollTop);
            vm.top = document.getElementById("parallax").scrollTop;
            //console.log(vm.top);
            //console.log('bottom: ' + (window.pageYOffset + window.innerHeight));


        }
    }, false);
}

function MainService($http) {

    //Variables
    var service = {};

    service.sendMail = sendMail;

    return service;

    function sendMail(nombre, apellido, email, mensaje, callback) {
        mensaje = mensaje + "\n\n" + "Consulta de " + apellido + ", " + nombre + "\n\n" + "Correo: " + email;
        //console.log(mensaje);
        return $http.post('contact.php',
            {
                'email': email,
                'mensaje': mensaje
            })
            .success(function (data) {
                //console.log(data);
                callback(data);
            })
            .error()
    }

}