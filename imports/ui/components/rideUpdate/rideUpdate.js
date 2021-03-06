import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import {
  Meteor
} from 'meteor/meteor';

import template from './rideUpdate.html';
import {
  Rides
} from '../../../api/rides';
import {
  name as RideMap
} from '../rideMap/rideMap';

class RideUpdate {
  constructor($stateParams, $scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.rideId = $stateParams.rideId;

    this.subscribe('rides');
    this.subscribe('users');

    this.location = [{
      id: 101,
      latitude: 42.3563941755867,
      longitude: -71.0363168884369
    }];

    this.helpers({
      ride() {
        var ride = Rides.findOne({
          _id: $stateParams.rideId
        });
        if (ride) {
          $('.chips-initial').material_chip({
            data: ride.tags ,
          });
          return ride;
        }
      },
      users() {
        return Meteor.users.find({});
      },
      isLoggedIn() {
        // $('.chips').material_chip({
        //   data: this.ride.tags
        //  })
        return !!Meteor.userId();
      },
      isOwner() {
        if (!this.ride) {
          return false;
        }

        return this.ride.owner === Meteor.userId();
      }

    });

  }

  submit() {
    Rides.update({
      _id: this.ride._id
    }, {
      $set: {
        price: this.ride.price,
        fromLocation: this.ride.fromLocation,
        toLocation: this.ride.toLocation,
        fromPlaceDetails: this.ride.fromPlaceDetails,
        toPlaceDetails: this.ride.toPlaceDetails,
        contact: this.ride.contact,
        tags: this.ride.tags,
        time: this.ride.time,
        date: this.ride.date
      }
    }, (error) => {
      if (error) {
        Materialize.toast('Not Succesful in updating your Post. Please try again.', 4000);
      } else {
        Materialize.toast('Successfully Updated Your Post', 4000);
        this.$state.go('myRides');
      }
    });
  }
}

const name = 'rideUpdate';

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    RideMap
  ]).component(name, {
    template,
    controllerAs: name,
    controller: RideUpdate
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('rideUpdate', {
    url: '/rideUpdate/:rideId',
    template: '<ride-update></ride-update>',
    resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        } else {
          return $q.resolve();
        }
      }
    }
  });
}