var PRICE = 9.99
var LOAD_NUM = 10;

new Vue({
  el: '#app',
  data: {
    total: 0,
    lastSearch: '',
    newSearch: 'anime',
    items: [],
    results: [],
    cart: [],
    loading: false,
    price: PRICE,
  },
  computed: {
    noMoreItems: function() {
      return this.items.length === this.results.length && this.results.length > 0;
    }
  },
  methods: {
    appendItems: function() {
      if(this.items.length < this.results.length) {
        var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
        this.items = this.items.concat(append);
      }
    },
    inc: function(item) {
      item.qty++;
      this.total += PRICE;
    },
    dec: function(item) {
      item.qty --;
      this.total -= PRICE;

      if(item.qty <= 0) {
        for(var i = 0; i < this.cart.length; i++) {
          if(item.id == this.cart[i].id) {
            this.cart.splice(i, 1);
            break;
          }
        }
      }
    },
    addItem: function(index) {
      this.total += 9.99;
      var item = this.items[index];
      for(var i = 0; i < this.cart.length; i++) {
        if(this.cart[i].id === item.id) {
          this.cart[i].qty++;
          return;
        }
      }
      this.cart.push({
        id: item.id,
        title: item.title,
        price: 9.99,
        qty: 1,
      })
    },
    onSubmit: function() {
      if(this.newSearch.length) {
        this.items = [];
        this.loading = true;
        this.$http
          .get(`/search/${this.newSearch}`)
          .then(function(res) {
            this.lastSearch = this.newSearch;
            this.results = res.data;
            this.appendItems();
            this.loading = false;
          });
      }
    }
  },
  filters: {
    currency: function(price) {
      return `$${price.toFixed(2)}`
    }
  },
  mounted: function() {
    this.onSubmit();

    var that = this
    var elem = document.getElementById('product-list-bottom');
    var watcher = scrollMonitor.create(elem);
    watcher.enterViewport(function() {
      that.appendItems();
    });
  }
})


