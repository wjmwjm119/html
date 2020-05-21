      Quasar.lang.set(Quasar.lang.zhHans)
      
      Vue.component
      (
        'app',
        {
          template: '#app'
        }
      )

      new Vue
      (
        {
          el: '#q-app',
          data: function () 
          {
            return {version: Quasar.version,drawerState: true}
          }
        }
      )
