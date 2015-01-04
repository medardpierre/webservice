var BASE_API = "http://localhost:4242";

var gltypeApp = angular.module('gltypeApp', ['ngRoute', 'xeditable', 'ngCookies', 'bnx.module.facebook']);


gltypeApp.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'pages/home.html',
                controller  : 'mainController'
            })

            // route for the about page
            .when('/about', {
                templateUrl : 'pages/about.html',
                controller  : 'aboutController'
            })

            // route for the search page
            .when('/search', {
                templateUrl : 'pages/search.html',
                controller  : 'searchController'
            })

            // route for the profil page
            .when('/profil', {
                templateUrl : 'pages/profil.html',
                controller  : 'profilController'
            });

    });

gltypeApp.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

gltypeApp.controller('mainController', function($scope, $http, $cookieStore) {
		$scope.user = {};
        $scope.webmaster = "Gilles TUAL";
        $scope.isConnected = ($cookieStore.get('TOKEN') == undefined || $cookieStore.get('TOKEN') == null) ? 1 : 0;
        $scope.locate = "index";

        if ($cookieStore.get("TOKEN") != undefined)
        $http({
            url: BASE_API + "/users/token/"+$cookieStore.get("TOKEN"),
            dataType: 'json',
            method: 'GET',
            data: {token:       $cookieStore.get("TOKEN")},
            headers: {
                "Content-Type": "application/json"
            }})
            .success(function (data, status, headers, config) {
                $scope.picture = data.picture;
                $scope.user.picture = data.picture;
                $scope.email = data.email;
                $scope.user.email = data.email;
            })
            .error(function (data, status, headers, config) {
                alert(data);
            });
});

gltypeApp.controller('userController', function($scope, $http, $cookieStore)
		{
	
	    $scope.new_user = {};
	
	    //Register User to the API
	    $scope.register = function (person)
	    {
	      var datas = {
	        	firstname:	person.firstname,
	        	lastname:	person.lastname,
	        	picture:	person.picture,
	        	email:		person.email,
	        	about:		person.about,
	        	role:		person.role,
	        	password:	person.password
	        };
	      $http({
	            url: BASE_API + "/users",
	            dataType: 'json',
	            method: 'POST',
	            data: datas,
	            headers: {
	                "Content-Type": "application/json"
	            }})
	            .success(function (data, status, headers, config) {
	                   $("#registerModalSuccess").modal({
                            keyboard: true
                       })
	            }).error(function (data, status, headers, config) {
	                alert(data);
	            });
	    	};
	
	    //Log in a User
	    $scope.login = function (person)
	    {
	      var datas = {
	        	email:		person.email,
	        	password:	person.password
	      };
	      
	       $http({
	            url: BASE_API + "/users/connect",
	            dataType: 'json',
	            method: 'POST',
	            data: datas,
	            headers: {
	                "Content-Type": "application/json"
	            }})
	            .success(function (data, status, headers, config) {
	            	if (status == 400)
		        		alert(data);
		        	else if (status == 200)
		        		{
		        			$cookieStore.put("TOKEN", data.token);
		        			$cookieStore.put("email", person.email);
		        			$cookieStore.put("role", data.role);
                            window.location.reload();
		        		}
            	})
            	.error(function (data, status, headers, config) {
	                alert(data);
	            });
	    };
	    
	    //Log out a User
	    $scope.logout = function ()
	    {
	      var datas = {
	        	token:		$cookieStore.get("TOKEN")
	      };
	      
	       $http({
	            url: BASE_API + "/users/disconnect",
	            dataType: 'json',
	            method: 'POST',
	            data: datas,
	            headers: {
	                "Content-Type": "application/json"
	            }})
	            .success(function (data, status, headers, config) {
                    window.location.reload();
        			$cookieStore.remove("TOKEN");
            	})
            	.error(function (data, status, headers, config) {
	                alert(data);
	            });
	    };
	
	});

gltypeApp.controller('aboutController', function($scope) {
		$scope.webmaster = "Gilles TUAL";
		$scope.members = [{firstname:'Gilles', lastname:'TUAL', img: './img/tual_g.jpg', role: 'Project Leader / Designer', age:'22'},
        {firstname: '一同', lastname:'王', img: './img/empty.jpg', role: 'Android Developer', age:'24'},
        {firstname: 'Thomas', lastname:'LACROIX', img: './img/empty.jpg', role: 'Web Developer', age:'21'},
        {firstname: 'Morgan', lastname:'', img: './img/empty.jpg', role: 'Android Developer', age:'?'},
        {firstname: 'Pierre', lastname:'MEDARD', img: './img/empty.jpg', role: 'API Developer', age:'21'},
        {firstname: 'Yan', lastname:'', img: './img/empty.jpg', role: 'Android Developer', age:'?'}];
    });

gltypeApp.controller('searchController', function($scope, $http, $cookieStore) {
	$scope.form_search = {};
	$scope.receipes = {};
	$scope.products = {};
	$scope.ingredients = {};

	//search
    $scope.search_data = function ($form_search) {
        $http({
            url: BASE_API + "/search/ingredients/"
            + $form_search.name + "/"
            + $form_search.minCal + "/"
            + $form_search.maxCal + "/0/10",
            dataType: 'json',
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        })
            .success(function (data, status, headers, config) {
                $scope.ingredients = data;
            })
            .error(function (data, status, headers, config) {
                alert("error");
            });

        $http({
            url: BASE_API + "/search/products/"
            + $form_search.name + "/"
            + $form_search.minCal + "/"
            + $form_search.maxCal + "/0/10",
            dataType: 'json',
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        })
            .success(function (data, status, headers, config) {
                $scope.products = data;
            })
            .error(function (data, status, headers, config) {
                alert("error");
            });


        $http({
            url: BASE_API + "/search/receipes/"
            + $form_search.name + "/"
            + $form_search.minCal + "/"
            + $form_search.maxCal + "/0/10",
            dataType: 'json',
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        })
            .success(function (data, status, headers, config) {
                $scope.receipes = data;
            })
            .error(function (data, status, headers, config) {
                alert("error");
            });
    }
});

gltypeApp.controller('profilController', function($scope, $http, $cookieStore) {
    $scope.webmaster = "Gilles TUAL";
    $scope.user = {};
    $http({
        url: BASE_API + "/users/token/"+$cookieStore.get("TOKEN"),
        dataType: 'json',
        method: 'GET',
        data: {token:	$cookieStore.get("TOKEN")},
        headers: {
            "Content-Type": "application/json"
        }})
        .success(function (data, status, headers, config) {
            $scope.firstname = data.firstname;
            $scope.user.email = data.firstname;
            $scope.lastname = data.lastname;
            $scope.user.lastname = data.lastname;
            $scope.picture = data.picture;
            $scope.user.picture = data.picture;
            $scope.email = data.email;
            $scope.user.email = data.email;
            $scope.about = data.about;
            $scope.user.about = data.about;
            $scope.role = (data.role == 1) ? "Consumer" : (data.role == 2) ? "Food supplier" : (data.role == 3) ? "Gastronomist" : "Admin";
            $scope.moments = data.moments;
        })
        .error(function (data, status, headers, config) {
            alert(data);
        });
//Update User
    $scope.update_profil = function ($user)
    {
        var datas = {
            token:	$cookieStore.get("TOKEN"),
            picture:	$user.picture,
            email:	$user.email,
            about:	$user.about
        };
        if ($user.password != "")
            datas['password'] = $user.password;
        $http({
            url: BASE_API + "/users/token/"+$cookieStore.get("TOKEN"),
            dataType: 'json',
            method: 'PUT',
            data: datas,
            headers: {
                "Content-Type": "application/json"
            }})
            .success(function (data, status, headers, config) {
                $('#profil-success').show();
            })
            .error(function (data, status, headers, config) {
                $('#profil-error').show();
            });
    };
});