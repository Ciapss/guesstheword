angular.module('myApp', [
    'myApp.welcome',
    'myApp.words',
    'myApp.game',
    'ngRoute'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/'
    });
}]);
//Service for passing objects between controllers
var getPassObj = function() {
    var obj;

    var passObj = function(newResult) {
        obj = newResult;
    };

    var getObj = function() {
        return obj;
    }

    return {
        passObj: passObj,
        getObj: getObj
    }
}

angular.module('myApp')
.service('getPassObj', getPassObj)
angular.module('myApp.welcome', ['ngRoute'])
.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/', {
        templateUrl:'components/welcome/welcome.html',
        controller: 'WelcomeController'
    })
}]);
var WelcomeController = ['$scope', '$location', 'getPassObj', function($scope, $location, getPassObj) {

    //Create name of player and pass to other controller
     $scope.startGame = function(name) {
        getPassObj.passObj(name);
        $location.path('/game');
    }
}];

angular.module('myApp.welcome')
.controller('WelcomeController', WelcomeController);
angular.module('myApp.words', ['ngRoute'])
.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/words', {
        templateUrl:'components/words/words.html',
        controller:'WordsController'
    })
}])
var WordsController = ['$scope', '$http', 'gameFactory', function($scope, $http, gameFactory) {
    
    //get all words from Firebase
    $http.get("https://guesstheword-ed9bc.firebaseio.com/Words.json").then(function(response) {
        $scope.words = response.data;
    });

    //Add new word to Firebase
    $scope.addWord = function(name) {
        var newWord = {
            name: name
        };
        $http.post("https://guesstheword-ed9bc.firebaseio.com/Words.json", newWord).then(function(response) {
            $scope.name = "";
        });
    };
}];

angular.module('myApp.words')
.controller('WordsController', WordsController);
angular.module('myApp.game', ['ngRoute'])
.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/game', {
        templateUrl:'components/game/game.html',
        controller:'GameController'
    })
}]);
var gameFactory = function($http) {
    var gameFactoryObj = {};


    //get all words from Firebase
    gameFactoryObj.getWords = function() {
        return $http.get("https://guesstheword-ed9bc.firebaseio.com/Words.json").success(function(response) {
            return response.data;
        });
    };

    return gameFactoryObj; 
};

angular.module('myApp.game')
.factory('gameFactory', gameFactory);
var GameController = ['$scope', '$http', 'gameFactory', function($scope, $http, gameFactory) {
    gameFactory.getWords().then(function(response) {
        // $scope.words = response.data;
        console.log(response.data);
    });
}];

angular.module('myApp.game')
.controller('GameController', GameController);