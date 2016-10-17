app.service('QuizzCategoriesService', function () {
  this.get = function () {
    return [
      { id:1, name:"psycho" },
      { id:2, name:"astro" },
      { id:3, name:"sex" },
      { id:4, name:"social" },
      { id:5, name:"food" },
      { id:6, name:"sport" },
      { id:7, name:"politic" },
      { id:8, name:"fun" }
    ];
  };
});
