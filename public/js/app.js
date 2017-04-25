var Item = {
  props: ['item'],
  template: `
    <div class="item itm-l col-md-4 col-sm-6" v-if="item.quantity > 0">
      <div class="thumbnail">
        <a class="popup" :href="item.img">
          <img class="img-responsive" :src="item.img" alt="item.title">
        </a>
        <div class="caption-full">
          <h4 class="pull-right">₽ <span class="cost">{{item.price}}</span></h4>
          <h4><a href="#">{{item.title}}</a></h4>
          <div v-html="item.description" class="description"></div>
        </div>
        <div class="pb">
          <iframe frameborder="0" allowtransparency="true" scrolling="no" :src="ym" width="107" height="25"></iframe>
          <iframe frameborder="0" allowtransparency="true" scrolling="no" :src="crd" width="107" height="25"></iframe>
        </div>
        <div class="qty">
          <p>{{item.quantity}} шт в наличии</p>
        </div>
      </div>
    </div>
  `,
  computed: {
    crd () {
      let crd = `https://money.yandex.ru/quickpay/button-widget?account=410013949854124&quickpay=small&any-card-payment-type=on&button-text=02&button-size=s&button-color=black&targets=Fidgettoys.ru%2C+%D0%9E%D0%BF%D0%BB%D0%B0%D1%82%D0%B0+%D1%82%D0%BE%D0%B2%D0%B0%D1%80%D0%B0.&default-sum=${this.item.price}&fio=on&mail=on&address=on&successURL=fidgettoys.ru%2Fcp.html`
      return crd
    },
    ym () {
      let ym = `https://money.yandex.ru/quickpay/button-widget?account=410013949854124&quickpay=small&yamoney-payment-type=on&button-text=02&button-size=s&button-color=black&targets=Fidgettoys.ru%2C+%D0%9E%D0%BF%D0%BB%D0%B0%D1%82%D0%B0+%D1%82%D0%BE%D0%B2%D0%B0%D1%80%D0%B0.&default-sum=${this.item.price}&fio=on&mail=on&address=on&successURL=fidgettoys.ru%2Fcp.html`
      return ym
    }
  },
  mounted () {
    $('.popup').magnificPopup({
      type: 'image'
    })
  }
}

Vue.component('items', {
  components: {
    Item
  },
  template: `
    <div class="row items">
      <item v-for="item in items" :key="item['.key']" :item="item"></item>
    </div>
  `,
  data () {
    return {
      items: []
    }
  },
  methods: {
    fetchItems () {
      $.get('https://fidgettoys-c97b9.firebaseio.com/items.json').done(data => {
        this.items = data
      })
    }
  },
  beforeMount () {
    this.fetchItems()
  }
})


new Vue({
  el: '#app'
})
