app.service('UserLanguagesService', function () {
  this.get = function () {
    return [
      { id:1, name:"fr" },
      { id:2, name:"en" },
      { id:3, name:"es" }
    ];
  };
});
