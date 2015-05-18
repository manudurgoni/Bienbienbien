var routes = {
  '/': {
    componentId: 'home-section',
    beforeUpdate: function(path, context, next) {

      if (context.componentId === 'post-section') {
        this.$broadcast('post:exit', next);
      } else {
        next();
      }
    },
    isDefault: true
  },
  '/article/:slug': {
    componentId: 'post-section',
    beforeUpdate: function(path, context, next) {
      next();
      // if(path.componentId === 'post-section'){
      //   this.$broadcast( 'post:exit', next);
      // }else{
      //   next();
      // }
    },
  },
  '/about': {
    componentId: 'about-section'
  },
  options: {
    // click: true,
    // broadcast:true
  }
};

module.exports = routes;
