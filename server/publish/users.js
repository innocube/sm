/**
 * Created by Clayvessel on 2/1/16.
 */

Meteor.publish("users_list", function() {
    return Users.find();
});