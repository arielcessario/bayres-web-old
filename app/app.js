'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'ngAnimate',
    'ngCookies',
    'angular-storage',
    'angular-jwt',
    'acUtils',
    'acUsuarios',
    'acProductos',
    'acSucursales',
    'acCarrito'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/commerce/main'});
        $routeProvider.when('/commerce/:parameter', {
            controller: 'MainController'
        });
    }])
    .controller('MainController', MainController)
    .factory('MainService', MainService);

//==============================================================================================
MainController.$inject = ['acAngularProductosService', 'acAngularCarritoServiceAcciones', '$scope',
    '$document', 'acAngularSucursalesService', '$timeout', '$routeParams', '$location', '$interval',
    'UserService', 'UserVars', 'acAngularCategoriasService', 'MainService', 'acAngularCarritoTotalService',
    '$window', 'CategoryService', 'ProductService', 'CartService', 'AcUtils', 'SucursalService'];

MainService.$inject = ['$http'];

//==============================================================================================
function MainController(acAngularProductosService, acAngularCarritoServiceAcciones, $scope,
                        $document, acAngularSucursalesService, $timeout, $routeParams, $location, $interval,
                        UserService, UserVars, acAngularCategoriasService, MainService, acAngularCarritoTotalService,
                        $window, CategoryService, ProductService, CartService, AcUtils, SucursalService) {

    var vm = this;
    //===============================================
    //Declaración de objetos
    vm.usuarioFull = {
        'nombre': '',
        'apellido': '',
        'mail': '',
        'nacionalidad_id': 0,
        'tipo_doc': 0,
        'nro_doc': '',
        'comentarios': '',
        'marcado': '',
        'telefono': '',
        'fecha_nacimiento': '',
        'profesion_id': 0,
        'saldo': '',
        'rol_id': 0,
        'news_letter': 0,
        'password': ''
    };
    vm.usuario = {
        'nombre': '',
        'apellido': '',
        'mail': '',
        'nacionalidad_id': 0,
        'tipo_doc': 0,
        'nro_doc': '',
        'comentarios': '',
        'marcado': '',
        'telefono': '',
        'fecha_nacimiento': '',
        'profesion_id': 0,
        'saldo': '',
        'rol_id': 0,
        'news_letter': 0,
        'password': ''
    };
    vm.contactoForm = {
        nombre:'',
        apellido:'',
        mail:'',
        consulta:''
    };
    vm.passwordForm = {
        oldPassword:'',
        newPassword:''
    };
    vm.sucursal = {
        nombre: '',
        direccion: '',
        telefono: ''
    };
    vm.carrito = {
        status: 0,
        total: 0,
        usuario_id: -1,
        carrito_id: -1,
        productos: []
    };
    vm.carritoInfo = {
        cantidadDeProductos: 0,
        totalAPagar: 0.00,
        modified: false
    };
    vm.carritoDetalle = {

    };

    //===============================================================
    //Variables
    vm.active_form = ($routeParams.parameter === undefined) ? 'main' : $routeParams.parameter;
    vm.active_form_before = '';
    vm.top = 0;
    vm.top_before = 0;
    vm.debug = false;
    vm.user_is_logged = false;
    vm.searchTitle = 'RESULTADOS';
    vm.envios = 'Gran Buenos Aires';
    vm.menu_mobile = false;
    vm.menu_mobile_open = false;
    vm.with_products = false;
    vm.scrollTo = scrollTo;
    vm.intervalo;

    //===============================================================
    //Arreglos
    vm.categorias = [];
    vm.subcategorias = [];
    vm.usuarios = [];
    vm.sucursales = [];
    vm.carritoDetalles = [];
    vm.historico_pedidos = [];
    /*vm.historico_pedidos = [{
        apellido: '',
        carrito_id: -1,
        fecha: '',
        nombre: '',
        productos: [],
        status: 0,
        total: 0.00,
        usuario_id: -1
    }];*/
    var productosList = [];

    //===============================================
    /*
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
    */
    vm.tipo = 0;


    //vm.active_form = 'main';



    vm.usuario_creado = 0;

    vm.creaCliente = false;
    vm.compraTerminada = false;
    vm.slider_nro = 1;
    //Agregado por mateo
    vm.aceptoAgreement = false;
    //vm.detalles = [];
    //vm.pass_old = '';
    //vm.pass_new = '';
    vm.sucursal_contacto = 1;
    vm.mapa_sucursal = '';
    vm.menu_selected = '';
    vm.ingresarClienteEnter = ingresarClienteEnter;
    vm.error_code = 0;
    vm.recovery_pwd = 0;
    vm.info_envio = '';
    vm.textoLegales = '';
    vm.newsLetter = true;
    vm.newsLetterToUpdate = true;

    //Manejo de errores
    vm.message_error = '';
    vm.update_error = '0';
    vm.change_pwd_error = '0';
    vm.carrito_mensaje = '0';
    vm.contacto_enviado = '0';


    vm.intervalo = $interval(cambiarSlide, 7000);

    $scope.$on('$routeChangeSuccess', function (next, current) {
        vm.active_form = ($routeParams.parameter === undefined) ? 'main' : $routeParams.parameter;
        if(vm.active_form != 'search')
            vm.search = '';
    });

    window.addEventListener('resize', function () {
        vm.menu_mobile = (window.innerWidth < 800);

        $scope.$apply();
    });

    if (window.innerWidth < 800) {
        vm.menu_mobile = true;
    }

    $scope.$on('ActualizaCarrito', function() {
        if(acAngularCarritoTotalService.productosCarrito.length>0){
            vm.with_products = true;
        }else{
            vm.with_products = false;
        }
    });

    var container = document.getElementsByClassName('parallax');

    container[0].addEventListener('scroll', function () {
        requestAnimationFrame(animate);
        showPosition();
        function showPosition() {
            vm.top = document.getElementById("parallax").scrollTop;
        }
    }, false);

    //=========================================================================================0
    //CON EL NUEVO MODULO DE USUARIOS
    if(!UserService.getLogged()){

    } else {
        console.log('usuario logueado');
        vm.user_is_logged = true;
        vm.usuario = UserService.getLogged();
        vm.newsLetterToUpdate = (vm.usuario.news_letter == 1) ? true : false;
        console.log(vm.usuario);
        //Obtengo el historico actualizado de pedidos
        getHistoricoDePedidos(vm.usuario);
    }

    //###########################################################################
    //DECLARACIÓN DE FUNCIONES PROPIAS
    //###########################################################################

    var pos_origin = 0;

    function scrollTo(pos) {
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

        if (document.getElementById('parallax').scrollTop != pos) {
            setTimeout(function () {
                if(pos < document.getElementById('parallax').scrollTop){
                    document.getElementById('parallax').scrollTop -= pos_origin / 25;
                }else{
                    document.getElementById('parallax').scrollTop += pos / 25;
                }
                if(!is_end){
                    vm.scrollTo(pos);
                }
            }, 10);
        }
    }

    /****************************************************************
     * Limpio todos los valores del objeto usuarioFull
     *****************************************************************/
    function clearUsuarioFull() {
        vm.usuarioFull = {
            'nombre': '',
            'apellido': '',
            'mail': '',
            'nacionalidad_id': 0,
            'tipo_doc': 0,
            'nro_doc': '',
            'comentarios': '',
            'marcado': '',
            'telefono': '',
            'fecha_nacimiento': '',
            'profesion_id': 0,
            'saldo': '',
            'rol_id': 0,
            'news_letter': 0,
            'password': ''
        };
    }

    /****************************************************************
     * Limpio todos los valores del objeto usuario
     *****************************************************************/
    function clearUsuario() {
        vm.usuario = {
            'nombre': '',
            'apellido': '',
            'mail': '',
            'nacionalidad_id': 0,
            'tipo_doc': 0,
            'nro_doc': '',
            'comentarios': '',
            'marcado': '',
            'telefono': '',
            'fecha_nacimiento': '',
            'profesion_id': 0,
            'saldo': '',
            'rol_id': 0,
            'news_letter': 0,
            'password': ''
        };
    }

    /****************************************************************
     * Limpio todos los valores del objeto contactoForm
     *****************************************************************/
    function clearDatosContacto() {
        vm.contactoForm = {
            nombre:'',
            apellido: '',
            mail:'',
            consulta: ''
        }
    }

    /****************************************************************
     * Limpio todos los valores del objeto PasswordForm
     *****************************************************************/
    function clearPasswordForm() {
        vm.passwordForm = {
            oldPassword:'',
            newPassword: ''
        }
    }

    /****************************************************************
     * Limpio el objeto carritoInfo
     *****************************************************************/
    function clearCarritoInfo() {
        vm.carritoInfo = {
            cantidadDeProductos: 0,
            totalAPagar: 0.00,
            modified: false
        };
    }

    /****************************************************************
     * Se encarga de ir incrementado un slider
     *****************************************************************/
    function cambiarSlide(){
        vm.slider_nro = (vm.slider_nro == 4) ? vm.slider_nro = 1 : vm.slider_nro += 1;
        //vm.slider_nro = 2;
    }

    /****************************************************************
     * Valida que el formato de una fecha sea valido
     *****************************************************************/
    function validarFormatoFecha(campo) {
        var RegExPattern = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
        if ((campo.match(RegExPattern)) && (campo!='')) {
            return true;
        } else {
            return false;
        }
    }

    /****************************************************************
     * Limpio las siguientes variables que se usan en gran parte del código
     *****************************************************************/
    function inicializarVariables() {
        vm.update_error = '0';
        vm.change_pwd_error = '0';
        vm.message_error = '';
        vm.carrito_mensaje = '0';
        vm.contacto_enviado = '0';
        vm.recovery_pwd = 0;
    }

    /****************************************************************
     * Se encarga de la animación parallax
     *****************************************************************/
    function animate() {
        if (document.getElementById("parallax").scrollTop > 580) {
            document.getElementById("sucursales-03").style.opacity = 0;
            document.getElementById("sucursales-02").style.opacity = 0;
        } else {
            document.getElementById("sucursales-03").style.opacity = 1;
            document.getElementById("sucursales-02").style.opacity = 1;
        }
    }

    /****************************************************************
     * Función que pone en mayuscula la primera letra de cada palabra
     * @returns {string}
     ****************************************************************/
    String.prototype.capitalize = function(){
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    /****************************************************************
     * Agrega un nuevo producto al carrito
     *****************************************************************/
    function addProducto(producto) {
        //acAngularCarritoServiceAcciones.addProducto(producto);
        console.log(producto);
        CartService.addToCart(1, producto, function(data){
            console.log(data);
            vm.totalProductosEnCarrito = vm.totalProductosEnCarrito + 1;
        });
    }

    /****************************************************************
     * Capturo el evento Enter y llamo a la función login
     *****************************************************************/
    function ingresarClienteEnter(event) {
        if(event.keyCode == 13) {
            vm.login();
        }
    }

    /*****************************************************************
     * Calcula el total a pagar y la cantidad de productos en el carrito
     *****************************************************************/
    function calcularCarritoTotal() {
        var cantidadDeProductos = 0;
        var totalAPagar = 0.00;

        vm.carritoDetalles.forEach(function(data){
            cantidadDeProductos = data.cantidad + cantidadDeProductos;
            totalAPagar = (data.precio_unitario * data.cantidad)+ totalAPagar;
        });

        vm.carritoInfo.cantidadDeProductos = cantidadDeProductos;
        vm.carritoInfo.totalAPagar = totalAPagar;
        vm.carritoInfo.modified = true;

        console.log(vm.carritoInfo);
    }

    /****************************************************************
     * Me retorna un historico de pedidos por Usuario
     *****************************************************************/
    function getHistoricoDePedidos(usuario) {
        console.log(usuario);
        //Obtengo el listado de carritos
        CartService.getByParams("status","1","true",usuario.usuario_id, function(data){
            //Cargo el historico de pedidos ordenado en forma desc por carrito_id
            vm.historico_pedidos = data.sort(function(a, b){
                return b.carrito_id - a.carrito_id;
            });
            //Agrego un nuevo registro en el arreglo con la leyenda seleccione un pedido
            var select_one = { pedido_id:-1, fecha:'Seleccione un pedido' };
            vm.historico_pedidos.unshift(select_one);
            //Muestro el primer elemento del arreglo
            vm.pedido = vm.historico_pedidos[0];
        });
    }

    /*****************************************************************
     * Actualiza el arreglo carritoDetalles cuando se agrega o quita un producto
     * @param miProducto
     *****************************************************************/
    function actualizarMiCarrito(miProducto) {
        var encontrado = false;
        var indexToDelete = 0;

        if(vm.carritoDetalles.length > 0) {
            var index = 0;
            vm.carritoDetalles.forEach(function(data){
                if(data.producto_id == miProducto.producto_id) {
                    miProducto.cantidad = data.cantidad + miProducto.cantidad;
                    indexToDelete = index;
                    encontrado = true;
                }
                index = index + 1;
            });

            if(encontrado) {
                vm.carritoDetalles.splice( indexToDelete, 1 );
            }
        }
        vm.carritoDetalles.push(miProducto);
        //Ordeno carrito detalles por nombre del producto
        vm.carritoDetalles.sort(function(a, b){ return a.nombre - b.nombre; });
        console.log(vm.carritoDetalles);
        calcularCarritoTotal();
    }

    /*****************************************************************
     * Retorna la fecha actual del sistema en el formato dd/mm/aaaa
     * @returns {string}
     *****************************************************************/
    function getCurrentDate() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        }
        if(mm<10){
            mm='0'+mm
        }
        var today = dd + '/' + mm + '/' + yyyy;
        return today;
    }

    //#################################################################################################################
    //#################################################################################################################

    /****************************************************************
     * Retorna el listado de productos
     *****************************************************************/
    ProductService.get(function(data){
        productosList = data;
    });

    /****************************************************************
     * Cargo el listado de Sucursales
     *****************************************************************/
    SucursalService.get(function (data) {
        vm.sucursales = data;
        vm.sucursal = data[0];
    });

    /****************************************************************
     * Cargo el listado de categorias y subcategorias
     *****************************************************************/
    CategoryService.getByParams("parent_id", "-1", "true", function(data){
        //console.log(data);
        vm.categorias = data;
        var i = 0;
        vm.categorias.forEach(function(categoria){
            //console.log(categoria);
            CategoryService.getByParams("parent_id", categoria.categoria_id.toString(), "true", function(list){
                //console.log(list);
                vm.categorias[i].subcategorias = list;
                var j = 0;
                list.forEach(function(subcategoria){
                    var count = CategoryService.getItemsByCategory(subcategoria.categoria_id, productosList);
                    vm.categorias[i].subcategorias[j].total_categoria = count;
                    j = j + 1;
                });
                i++;
            });
        });
    });

    /****************************************************************
     * Retorna los productos que estan en oferta
     *****************************************************************/
    ProductService.getByParams("en_oferta", "1", "true", function(data){
        vm.ofertas = data;
    });

    /****************************************************************
     * Retorna los productos destacados
     *****************************************************************/
    ProductService.getByParams("destacado", "1", "true", function(data){
        vm.destacados = data;
    });

    /****************************************************************
     * Retorna los 8 productos más vendidos
     *****************************************************************/
    ProductService.getMasVendidos(function (data) {
        vm.vendidos = data;
    });

    /****************************************************************
     * Si el usuario no acepta redirecciona a la pagina de google
     *****************************************************************/
    vm.noAcepto = function () {
        $window.location.href = 'http://www.google.com';
    }

    /****************************************************************
     * Inicia la sesion del usuario
     *****************************************************************/
    vm.login = function () {
        vm.usuario_creado = -1;

        if(vm.usuarioFull.mail.trim().length == 0) {
            vm.message_error = 'Ingrese un Mail';
            vm.error_code = 6;
            return;
        }
        if(vm.usuarioFull.password.trim().length == 0) {
            vm.message_error = 'Ingrese una contraseña';
            vm.error_code = 8;
            return;
        }
        if (!AcUtils.validateEmail(vm.usuarioFull.mail.trim())) {
            vm.message_error = 'El mail ingresado no es valido';
            vm.error_code = 6;
        }

        scrollTo(636);

        UserService.login(vm.usuarioFull.mail, vm.usuarioFull.password, 0, function (data) {
            console.log(data);
            //Si data tiene datos, esta logueado
            if (data.user != null || data.user != undefined) {
                if(vm.active_form_before == 'carrito') {
                    vm.active_form = 'carrito';
                    $location.path('/commerce/carrito');
                } else {
                    $location.path('/commerce/main');
                }

                vm.active_form_before = '';
                vm.user_is_logged = true;
                vm.usuario = data.user;
                vm.newsLetterToUpdate = (vm.usuario.news_letter == 1) ? true : false;
                vm.error_code = 0;

                clearUsuarioFull();
                //Obtengo el historico actualizado de pedidos
                getHistoricoDePedidos(vm.usuario);
            } else {
                vm.message_error = 'Mail o password incorrectos';
                vm.usuario_creado = data;
                vm.nombre = '';
                vm.user_is_logged = false;
                vm.recovery_pwd = 1;
            }
        });
    };

    /****************************************************************
     * Cierra sesion de usuario
     *****************************************************************/
    vm.logout = function () {
        console.log('logout');
        UserService.logout();

        var user = UserService.getLogged();
        if(user == undefined || user == null){
            clearUsuario();
            vm.user_is_logged = false;
            $location.path('/commerce/main');
        }
        else {
            console.log('Error');
        }

    };

    /****************************************************************
     * Crea un nuevo usuario
     *****************************************************************/
    vm.createUsuario = function () {
        vm.message_error = '';
        vm.usuario_creado = -1;
        var data = {};

        scrollTo(636);

        if(vm.usuarioFull.isUndefined) {
            vm.message_error = "Error inesperado. No hay datos de usuario";
            vm.error_code = 1;
            return;
        }
        if(vm.usuarioFull.nombre.trim().length == 0) {
            vm.message_error = "El Nombre es Obligatorio";
            vm.error_code = 1;
            return;
        }
        if(vm.usuarioFull.apellido.trim().length == 0) {
            vm.message_error = "El Apellido es Obligatorio";
            vm.error_code = 2;
            return;
        }
        if(vm.usuarioFull.fecha_nacimiento.trim().length == 0) {
            vm.message_error = "La Fecha de Nacimiento es Obligatoria";
            vm.error_code = 3;
            return;
        }
        if(!validarFormatoFecha(vm.usuarioFull.fecha_nacimiento)) {
            vm.message_error = "La Fecha de Nacimiento no tiene el formato correcto dd/mm/aaaa";
            vm.error_code = 3;
            return;
        }
        if(vm.usuarioFull.telefono.trim().length == 0) {
            vm.message_error = "El Teléfono es Obligatorio";
            vm.error_code = 4;
            return;
        }
        if(vm.usuarioFull.mail == undefined) {
            vm.message_error = "El Mail es Obligatorio";
            vm.error_code = 6;
            return;
        }
        if(vm.usuarioFull.mail.trim().length == 0) {
            vm.message_error = "El Mail es Obligatorio";
            vm.error_code = 6;
            return;
        }
        if(vm.mail_repeat == undefined) {
            vm.message_error = "El Mail es Obligatorio";
            vm.error_code = 6;
            return;
        }
        if(vm.mail_repeat.trim().length == 0) {
            vm.message_error = "Debe Repetir el mismo mail";
            vm.error_code = 7;
            return;
        }
        if(vm.usuarioFull.password.trim().length == 0) {
            vm.message_error = "La Contraseña es Obligatoria";
            vm.error_code = 8;
            return;
        }
        if (!AcUtils.validateEmail(vm.usuarioFull.mail.trim())) {
            vm.message_error = "El mail ingresado no es valido";
            vm.error_code = 6;
            return;
        }
        if (!AcUtils.validateEmail(vm.mail_repeat.trim())) {
            vm.message_error = "El segundo mail ingresado no es valido";
            vm.error_code = 7;
            return;
        }

        if (vm.usuarioFull.mail.trim().length > 0 && vm.mail_repeat.trim().length > 0) {
            if (vm.usuarioFull.mail.trim() === vm.mail_repeat.trim()) {
                UserService.create(vm.usuarioFull, function (data) {
                    if(data !== -1){
                        vm.login();
                        $location.path('/commerce/main');
                    }
                    else {
                        vm.message_error = 'Ocurrio un error creando el usuario';
                    }
                });
            }
            else {
                vm.message_error = 'Los correos deben ser iguales';
            }
        }
        else {
            vm.message_error = 'Los correos son obligatorios';
        }

        /*
        //Valido si el mail ingresado ya existe
        UserService.userExist(vm.usuarioFull.mail.trim(), function(data){
            //Ya existe el mail ingresado
            if(data == -1) {
                vm.message_error = 'El mail ya se encuentra en uso. En caso de no recordar la contraseña, solicitela a través de la página.';
                vm.usuario_creado = -1;
                vm.error_code = 6;
                return;
            }

            if (vm.usuarioFull.mail.trim().length > 0 && vm.mail_repeat.trim().length > 0) {
                if (vm.usuarioFull.mail.trim() === vm.mail_repeat.trim()) {
                    UserService.create(vm.usuarioFull, function (data) {
                        if(data !== -1){
                            vm.login();
                            $location.path('/commerce/main');
                        }
                        else {
                            vm.message_error = 'Ocurrio un error creando el usuario';
                        }
                    });
                }
                else {
                    vm.message_error = 'Los correos deben ser iguales';
                }
            }
            else {
                vm.message_error = 'Los correos son obligatorios';
            }
        });
        */
    };

    /****************************************************************
     * Actualizar los datos de un usuario
     *****************************************************************/
    vm.actualizarUsuario = function () {
        inicializarVariables();

        if (!UserService.getLogged()) {
            vm.user_is_logged = false;
            $location.path('/commerce/login');
            vm.usuario = {};
        } else {
            vm.user_is_logged = true;
            if (vm.usuario.apellido.trim().length > 0 && vm.usuario.nombre.trim().length > 0 && vm.usuario.mail.trim().length > 0) {
                if (AcUtils.validateEmail(vm.usuario.mail.trim())) {
                    vm.usuario.news_letter = (vm.newsLetterToUpdate) ? 1 : 0;
                    UserService.update(vm.usuario, function(data){
                        console.log(data);
                        if(data == 1) {
                            vm.update_error = '1';
                            vm.message_error = 'Los datos fueron actualizados satisfactoriamente';
                        }
                        else {
                            vm.update_error = '1';
                            vm.message_error = 'Error al actualizar los datos';
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

    /****************************************************************
     * Cambio la contraseña de un usuario
     *****************************************************************/
    vm.modificarPassword = function () {
        inicializarVariables();

        if (!UserService.getLogged()) {

        } else {
            if (vm.passwordForm.oldPassword.trim().length > 0 && vm.passwordForm.newPassword.trim().length > 0) {
                vm.user_is_logged = true;
                var user = UserService.getLogged();
                console.log(user);
                UserService.changePassword(
                    user.usuario_id,
                    vm.passwordForm.oldPassword,
                    vm.passwordForm.newPassword,
                    function (data) {
                        vm.change_pwd_error = '1';
                        if (data == 1) {
                            clearPasswordForm();
                            vm.message_error = 'La contraseña se modifico satisfactoriamente';
                        }
                        else {
                            vm.change_pwd_error = '1';
                            vm.message_error = 'Error modificando la contraseña';
                        }
                    });
            }
            else {
                vm.change_pwd_error = '1';
                vm.message_error = 'Las contraseñas no pueden ser vacias';
            }
        }
    }

    /****************************************************************
     * Recupero la contraseña
     *****************************************************************/
    vm.recoveryPwd = function () {
        vm.error_code = 6;
        if(vm.mail != undefined) {
            if (vm.mail.trim().length > 0) {
                if (AcUtils.validateEmail(vm.mail.trim())) {
                    UserService.getClienteByEmail(vm.mail.trim(), function (data) {
                        if (data.result == true) {
                            var newPassword = LoginService.generateRandomPassword();
                            UserService.forgotPassword(vm.mail.trim(), function (data) {
                                console.log(data);
                                vm.error_code = -1;
                            });
                        }
                        else {
                            vm.message_error = 'El mail ingresado no existe';
                        }
                    });
                }
                else {
                    vm.message_error = 'El mail no tiene un formato valido';
                }
            }
            else {
                vm.message_error = 'Ingrese un mail';
            }
        }
        else {
            vm.message_error = 'Ingrese un mail';
        }
    }

    /****************************************************************
     * Llamo al formulario de Mi Cuenta
     *****************************************************************/
    vm.cuenta = function () {
        vm.menu_selected = 'cuenta';
        inicializarVariables();

        scrollTo(636);
        console.log(UserService.getLogged());
        if (!UserService.getLogged()) {
            clearUsuarioFull();
            vm.creaCliente = false;
            vm.active_form = 'login';
            $location.path('/commerce/login');
        } else {
            $location.path('/commerce/cuenta');
        }

        if(vm.menu_mobile_open) vm.menu_mobile_open = false;

        if(vm.showCategorias) vm.showCategorias = false;
    }

    /****************************************************************
     * Retorna los productos filtrando por categoria
     *****************************************************************/
    vm.getByCategoria = function (categoria_id){
        ProductService.getByCategoria(categoria_id, function(productos){
            vm.searchTitle = productos[0].categorias[0].nombre; //Seteo el titulo de la categoria a mostrar
            vm.productos = productos; //Cargo el listado de productos recuperados

            scrollTo(700);
            $location.path('/commerce/search');

            if(vm.menu_mobile_open) vm.menu_mobile_open = false;
        });

        if(vm.showCategorias) vm.showCategorias = false;
    }

    /****************************************************************
     * Repite un producto que ya se habia pedido en un carrito
     *****************************************************************/
    vm.actualizarMiProducto = function (producto) {
        var miProducto = {
            producto_id: producto.producto_id,
            cantidad: 0,
            en_oferta: 1,
            precio_unitario: producto.precio_unitario,
            carrito_id: -1,
            nombre: producto.nombre
        };

        actualizarMiCarrito(miProducto);
    }

    /****************************************************************
     * Repite un producto que ya se habia pedido en un carrito
     *****************************************************************/
    vm.repetirProducto = function (producto) {
        var miProducto = {
            producto_id: producto.producto_id,
            cantidad: 1,
            en_oferta: 1,
            precio_unitario: producto.precio_unitario,
            carrito_id: -1,
            nombre: producto.nombre
        };

        actualizarMiCarrito(miProducto);
    }

    /****************************************************************
     * Agrega un nuevo producto al carrito
     *****************************************************************/
    vm.agregarCarrito = function(producto) {
        var miProducto = {
            producto_id: producto.producto_id,
            cantidad: 1,
            en_oferta: 1,
            precio_unitario: producto.precios[0].precio,
            carrito_id: -1,
            nombre: producto.nombre
        };

        actualizarMiCarrito(miProducto);
    }

    /****************************************************************
     * Quita un producto del carrito
     *****************************************************************/
    vm.removerProducto = function(index) {
        if(vm.carritoDetalles.length > 0) {
            var producto = vm.carritoDetalles[index];
            var detalle = producto.nombre + ' $' + producto.precio_unitario + '(x' + producto.cantidad + ')';
            var borrarOk = confirm('¿Desea borrar el producto '+ detalle +'?');
            if(borrarOk){
                vm.carritoDetalles.splice( index, 1 );
                //Ordeno el arreglo por nombre
                vm.carritoDetalles.sort(function(a, b){ return a.nombre - b.nombre; });
                console.log(vm.carritoDetalles);
                calcularCarritoTotal();
            } else {
                return;
            }
        }
    }

    /****************************************************************
     * Repite el pedido de un carrito ya existenten
     *****************************************************************/
    vm.repetirCarrito = function (carrito) {
        console.log(carrito);
        inicializarVariables();

        if(carrito === undefined) {
            vm.carrito_mensaje = '1';
            vm.message_error = 'Por favor seleccione un pedido del listado';
        } else {
            if(carrito.carrito_id == -1) {
                vm.carrito_mensaje = '1';
                vm.message_error = 'Por favor seleccione un pedido del listado';
            } else {
                carrito.productos.forEach(function(producto) {

                    var miProducto = {
                        producto_id: producto.producto_id,
                        cantidad: producto.cantidad,
                        en_oferta: producto.en_oferta,
                        precio_unitario: producto.precio_unitario,
                        carrito_id: -1,
                        nombre: producto.nombre
                    };

                    var encontrado = false;
                    var indexToDelete = 0;

                    if(vm.carritoDetalles.length > 0) {
                        var index = 0;
                        vm.carritoDetalles.forEach(function(data){
                            if(data.producto_id == miProducto.producto_id) {
                                miProducto.cantidad = data.cantidad + miProducto.cantidad;
                                indexToDelete = index;
                                encontrado = true;
                            }
                            index = index + 1;
                        });

                        if(encontrado) {
                            console.log('indexToDelete: ' + indexToDelete);
                            vm.carritoDetalles.splice( indexToDelete, 1 );
                        }
                    }
                    vm.carritoDetalles.push(miProducto);
                    //Ordeno el arreglo por nombre
                    vm.carritoDetalles.sort(function(a, b){ return a.nombre - b.nombre; });
                    console.log(vm.carritoDetalles);

                    calcularCarritoTotal();
                });
            }
        }
    }

    /****************************************************************
     * Cancela un carrito
     *****************************************************************/
    vm.cancelarCarrito = function (carrito) {
        console.log(carrito);
        inicializarVariables();

        if(carrito.pedido_id != undefined) {
            vm.carrito_mensaje = '1';
            vm.message_error = 'Seleccione un pedido';
        } else {
            if (carrito.status == 3) {
                vm.carrito_mensaje = '1';
                vm.message_error = 'El Pedido ya esta confirmado. No se puede cancelar';
            }
            else {
                var result = confirm('¿Esta seguro que desea Cancelar el Pedido ' + carrito.carrito_id + '?');
                if (result) {
                    //cancelo el carrito, para lo cual pongo status = 0
                    carrito.status = 0;
                    CartService.update(carrito, function(data){
                        console.log(data);
                        if(data != -1){
                            var usuario = UserService.getLogged();

                            //Envio los mails al comprador y vendedor para informar de la cancelación del carrito
                            MainService.sendMailCancelarCarritoComprador(usuario.mail, carrito, function(data){
                                if(data) {
                                    console.log('Se envio el mail con la confirmación');
                                } else {
                                    console.log('Error enviando el mail');
                                }
                            });
                            var usuarioNombre = usuario.apellido + ', ' + usuario.nombre;
                            MainService.sendMailCancelarCarritoVendedor(usuarioNombre, usuario.mail, carrito, function(data){
                                if(data) {
                                    console.log('Se envio el mail con la confirmación');
                                } else {
                                    console.log('Error enviando el mail');
                                }
                            });

                            //Obtengo el historico actualizado de pedidos
                            getHistoricoDePedidos(usuario);

                            vm.carrito_mensaje = '1';
                            vm.message_error = 'Su pedido fué cancelado satisfactoriamente';
                            vm.historico_pedidos = [];
                        } else {
                            vm.carrito_mensaje = '1';
                            vm.message_error = 'Error cancelando el pedido';
                        }
                    });
                }
            }
        }
    }

    /****************************************************************
     * efectiviza la compra
     *****************************************************************/
    vm.comprar = function(opcion) {
        vm.menu_selected = opcion;
        scrollTo(636);

        if (!UserService.getLogged()) {
            clearUsuarioFull();
            vm.creaCliente = false;
            vm.active_form = 'login';
            $location.path('/commerce/login');
        } else {
            $location.path('/commerce/carrito');
            vm.info_envio = 'Los envios se realizan por medio de cadeteria, según el tamaño y peso del pedido. El costo del mismo es a cargo del comprador, previo coordinacion con el vendedor';
        }

        if(vm.menu_mobile_open) vm.menu_mobile_open = false;

        if(vm.showCategorias) vm.showCategorias = false;
    }

    /****************************************************************
     * Finaliza la compra
     *****************************************************************/
    vm.finalizarCompra = function () {
        var envio_retira = (vm.tipo == 0) ? vm.envios : vm.sucursal.nombre;

        if (!UserService.getLogged()) {
            clearUsuarioFull();
            vm.creaCliente = false;
            vm.active_form = 'login';
            vm.active_form_before = 'carrito';
            $location.path('/commerce/login');
        }
        else {
            if(vm.carritoDetalles.length > 0) {
                var usuario = UserService.getLogged();
                vm.carrito.usuario_id = usuario.usuario_id;
                vm.carrito.total = vm.carritoInfo.totalAPagar;
                vm.carrito.status = 1;
                vm.carrito.fecha = getCurrentDate();

                var error = false;
                CartService.create(vm.carrito, function(carrito_id){
                    if(carrito_id > 0) {
                        vm.carrito.carrito_id = carrito_id;
                        console.log(vm.carrito);
                        var i = 0;
                        vm.carritoDetalles.forEach(function(producto){
                            CartService.addToCart(carrito_id, producto, function(data){
                                if(data > 0) {
                                    console.log(data);
                                    vm.carrito.productos[i] = producto;
                                    i =+ 1;
                                }
                                else {
                                    console.log('Error detalle carrito');
                                    error = true;
                                }
                            });
                        });
                    } else {
                        console.log('Error creando el carrito');
                        error = true;
                    }
                });

                if(!error) {
                    console.log('Carrito Pedido');
                    vm.info_envio = '';
                    vm.compraTerminada = true;
                    $timeout(function () {
                        vm.compraTerminada = false;
                        $location.path('/commerce/main');

                        console.log(vm.carrito);

                        //Envio el mail al comprador con el detalle de su compra
                        MainService.sendMailComprador(usuario.mail, usuario.nombre, vm.carrito, 1, 'Falta la direccion', function(data){
                           console.log(data);
                        });
                        //Envio el mail al vendedor con el detalle de la compra a ser entregada
                        MainService.sendMailVendedor(usuario.mail, usuario.nombre, vm.carrito, 1, 'Falta la direccion', function(data){
                            console.log(data);
                        });

                        //Obtengo el historico actualizado de pedidos
                        getHistoricoDePedidos(usuario);

                        //Si el carrito se persistio perfectamente en la DB, reinicio el arreglo
                        vm.carritoDetalles = [];
                        clearCarritoInfo();

                    }, 2000);
                }

            } else {
                console.log('No hay productos para agregar al carrito');
            }

        }
    }

    /****************************************************************
     * Muestro cual es el pedido seleccionado
     *****************************************************************/
    vm.getPedidoSelected = function (pedido) {
        console.log(pedido);
        if(pedido != null) {
            vm.carrito_mensaje = '0';
            vm.message_error = '';
        }
    }

    /****************************************************************
     * Muestro el detalle de un producto
     *****************************************************************/
    vm.selectDetalle = function () {
        vm.detalles = vm.historico_pedidos[2].detalles;
    }

    /****************************************************************
     * Muestra formulario para cargar los datos del contacto
     *****************************************************************/
    vm.contacto = function (sucursal_id) {
        vm.menu_selected = 'contacto';
        vm.sucursal_contacto = sucursal_id;
        scrollTo(0);
        $location.path('/commerce/contact');

        if(vm.showCategorias) vm.showCategorias = false;

        if(vm.menu_mobile_open) vm.menu_mobile_open = false;

        inicializarVariables();
        clearDatosContacto();
    }

    /****************************************************************
     * Envia un mail con una consulta
     *****************************************************************/
    vm.enviarConsulta = function () {
        inicializarVariables();

        if((vm.contactoForm.nombre.trim().length == 0) || (vm.contactoForm.apellido.trim().length == 0) ||
            (vm.contactoForm.mail.trim().length == 0) || (vm.contactoForm.consulta.trim().length == 0)) {
            vm.contacto_enviado = '1';
            vm.message_error = 'Por favor ingrese todos los datos para poder enviar el Mail';
        }
        else {
            if (AcUtils.validateEmail(vm.contactoForm.mail.trim())) {
                MainService.sendMailConsulta(vm.contactoForm, function(data) {
                    console.log(data);
                    if(data) {
                        clearDatosContacto();

                        vm.contacto_enviado = '1';
                        vm.message_error = 'Su consulta fue enviada. Gracias por contactarse';
                        vm.inicio();
                    }
                    else {
                        vm.contacto_enviado = '1';
                        vm.message_error = 'Se produjo un error al enviar el mail';
                    }
                });
            }
            else {
                vm.contacto_enviado = '1';
                vm.message_error = 'El mail ingresado no es valido';
            }
        }
    }

    /****************************************************************
     * Muestra el panel con el mapa del lugar
     *****************************************************************/
    vm.mapa = function (sucursal_id) {
        vm.sucursal_contacto = sucursal_id;
        scrollTo(0);
        $location.path('/commerce/mapa');
    }

    /****************************************************************
     * Dependiendo de la opción muestra datos en el formulario
     *****************************************************************/
    vm.verLegales = function(option) {
        scrollTo(0);
        $location.path('/commerce/legales');

        if(vm.showCategorias) vm.showCategorias = false;

        if(vm.menu_mobile_open) vm.menu_mobile_open = false;

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

    /****************************************************************
     * Sale de la vista legales y vuelve al principio
     *****************************************************************/
    vm.volverLegales = function() {
        vm.menu_selected = 'inicio';
        scrollTo(1800);

        $location.path('/commerce/main');

        if(vm.menu_mobile_open) vm.menu_mobile_open = false;

        if(vm.showCategorias) vm.showCategorias = false;
    }

    /****************************************************************
     * Va a la parte principal del sitio
     *****************************************************************/
    vm.inicio = function () {
        vm.menu_selected = 'inicio';
        scrollTo(0);
        $location.path('/commerce/main');

        if(vm.menu_mobile_open) vm.menu_mobile_open = false;

        if(vm.showCategorias) vm.showCategorias = false;
    }

    /****************************************************************
     * Va a la parte destacados del sitio
     *****************************************************************/
    vm.destacadosForm = function () {
        scrollTo(1036);
        $location.path('/commerce/main');
    }

    /****************************************************************
     * Va a la parte Más vendidos del sitio
     *****************************************************************/
    vm.masVendidosForm = function () {
        scrollTo(1536);
        $location.path('/commerce/main');
    }

    /****************************************************************
     * Va a la parte Sucursales del sitio
     *****************************************************************/
    vm.sucursalesForm = function () {
        scrollTo(0);
        $location.path('/commerce/main');
    }

    /****************************************************************
     * Va a la parte de Ofertas del sitio
     *****************************************************************/
    vm.ofertasForm = function () {
        scrollTo(636);
        $location.path('/commerce/main');
    }

    /****************************************************************
     * Va a la parte de Ofertas del sitio
     *****************************************************************/
    vm.ingresarCliente = function () {
        inicializarVariables();

        scrollTo(363);
        $location.path('/commerce/login');

        vm.creaCliente = false;
        if(vm.showCategorias) vm.showCategorias = false;
    }

    /****************************************************************
     * Va a la parte de Ingresar
     *****************************************************************/
    vm.goToIngresar = function () {
        vm.creaCliente = false;
        vm.message_error = '';
        vm.error_code = 0;
    }

    /****************************************************************
     * Va a la parte de crear cliente
     *****************************************************************/
    vm.goToCrearCliente = function () {
        vm.creaCliente = true;
        vm.message_error = '';
        vm.error_code = 0;
    }

    /****************************************************************
     * Va a la parte de crear cliente
     *****************************************************************/
    vm.crearCliente = function () {
        vm.message_error = '';
        $location.path('/commerce/login');

        vm.creaCliente = true;
        scrollTo(636);

        if(vm.showCategorias) vm.showCategorias = false;
    }

    /****************************************************************
     * Muestra el detalle de un producto
     *****************************************************************/
    vm.showDetails = function (detalle, currentForm) {
        //vm.active_form_before = vm.active_form;
        vm.active_form_before = currentForm;
        $location.path('/commerce/details');

        vm.detalle = detalle;
        vm.details = true;
        scrollTo(636);
    }

    /****************************************************************
     * Muestra el detalle de una oferta
     *****************************************************************/
    vm.showDetailsOferta = function (oferta) {
        vm.showDetails(oferta, "slider");
    }

    /****************************************************************
     * Oculta el detalle de un producto
     *****************************************************************/
    vm.hideDetails = function (detalle) {
        $location.path('/commerce/main');
        if(vm.active_form_before == 'slider')
            scrollTo(550);
        if(vm.active_form_before == 'destacados')
            scrollTo(1000);
        if(vm.active_form_before == 'masVendidos')
            scrollTo(1500);

        if(detalle.destacado == 1) {
            vm.detalle = {};
            vm.details = false;
        }
        else {
            vm.getByCategoria(detalle.categorias[0].categoria_id);
        }
    }

    /****************************************************************
     * Va a la sección de resultados cuando presiono enter
     *****************************************************************/
    vm.goToResultado = function (event) {
        if(event.keyCode == 13) {
            scrollTo(700);
        }
    }

    /****************************************************************
     * Realiza la busqueda de un producto por el nombre
     *****************************************************************/
    vm.searchByName = function () {
        if (vm.search.length > 2) {
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
            $location.path('/commerce/main');
        }
    }

    /****************************************************************
     * Muestra carrito compras
     *****************************************************************/
    vm.carritoCompras = function () {
        vm.menu_selected = 'compras';
    }

    /****************************************************************
     * Muestra las categorias
     *****************************************************************/
    vm.mostrarCategorias = function () {
        vm.menu_selected = 'categorias';
        vm.showCategorias = !vm.showCategorias;
    }

    //=========================================================================================0

}

//===============================================================================================
//En esta sección se declara el servicio
//===============================================================================================
function MainService($http) {

    //Variables
    var service = {};

    service.sendMailConsulta = sendMailConsulta;
    service.sendMailCancelarCarritoComprador = sendMailCancelarCarritoComprador;
    service.sendMailCancelarCarritoVendedor = sendMailCancelarCarritoVendedor;
    service.sendMailComprador = sendMailComprador;
    service.sendMailVendedor = sendMailVendedor;

    return service;


    /**
     *
     * @param contactoForm
     * @param callback
     * @returns {*}
     */
    function sendMailConsulta(contactoForm, callback) {
        return $http.post('mailer/mailer.php',
            {
                function: 'sendConsulta',
                'contactoForm': JSON.stringify(contactoForm)
            })
            .success(function (data) {
                callback(data);
            })
            .error(function (data) {
                callback(data);
            })
    }

    /**
     *
     * @param usuario
     * @param carrito
     * @param callback
     * @returns {*}
     */
    function sendMailCancelarCarritoComprador(usuario, carrito, callback) {
        return $http.post('mailer/mailer.php',
            {
                function: 'sendCancelarCarritoComprador',
                'usuario': usuario,
                'carrito': JSON.stringify(carrito)
            })
            .success(function (data) {
                callback(data);
            })
            .error(function (data) {
                callback(data);
            });
    }

    /**
     *
     * @param usuario
     * @param email
     * @param carrito
     * @param callback
     * @returns {*}
     */
    function sendMailCancelarCarritoVendedor(usuario, email, carrito, callback) {
        return $http.post('mailer/mailer.php',
            {
                function: 'sendCancelarCarritoVendedor',
                'usuario': usuario,
                'email': email,
                'carrito': JSON.stringify(carrito)
            })
            .success(function (data) {
                callback(data);
            })
            .error(function (data) {
                callback(data);
            });
    }

    /**
     *
     * @param mail
     * @param nombre
     * @param carrito
     * @param sucursal
     * @param direccion
     * @param callback
     */
    function sendMailComprador(mail, nombre, carrito, sucursal, direccion, callback) {
        return $http.post('mailer/mailer.php',
            {
                function: 'sendCarritoComprador',
                'email': mail,
                'nombre': nombre,
                'carrito': JSON.stringify(carrito),
                'sucursal': sucursal,
                'direccion': direccion
            })
            .success(function (data) {
                callback(data);
            })
            .error(function (data) {
                callback(data);
            });
    }

    /**
     *
     * @param mail
     * @param nombre
     * @param carrito
     * @param sucursal
     * @param direccion
     * @param callback
     * @returns {*}
     */
    function sendMailVendedor(mail, nombre, carrito, sucursal, direccion, callback) {
        return $http.post('mailer/mailer.php',
            {
                function: 'sendCarritoVendedor',
                'email': mail,
                'nombre': nombre,
                'carrito': JSON.stringify(carrito),
                'sucursal': sucursal,
                'direccion': direccion
            })
            .success(function (data) {
                callback(data);
            })
            .error(function (data) {
                callback(data);
            });
    }
}