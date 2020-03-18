var User = (function() {
  function User(id, nam) {
    var self = this;

    this.id = id;
    this.nam = nam;

    this.__data = {};

    for (var p in self) {
      if (p === '__data') {
        return;
      }

      self.__data[p] = self[p];

      (function(field_name) {
        Object.defineProperty(self, field_name, {
          get: function() {
            console.log('GET', field_name);
            return self.__data[field_name];
          },
          set: function(new_value) {
            console.log('SET', field_name, new_value);
            self.__data[field_name] = new_value;
            self.__data['modified'] = new Date().getTime();
          },
        });
      })(p);
    }
  }

  return User;
})();

var user1 = new User(1, 'Paul');
var user2 = new User(2, 'Mark');

console.log(user1.id);

user1.id = 5;

console.log(user1.id);
