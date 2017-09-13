// public/core.js
var jct = angular.module('jct', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all tickets and show them
    $http.get('/api/tickets')
        .success(function(data) {
            $scope.tickets = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createTicket = function() {
        $http.post('/api/tickets', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.tickets = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a ticket after checking it
    $scope.deleteTicket = function(id) {
        $http.delete('/api/tickets/' + id)
            .success(function(data) {
                $scope.tickets = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}
