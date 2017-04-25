$(document).ready(function() {
  var config = {
    apiKey: "AIzaSyC1Va95vfyNXc-eBLQaNKk5MTj_fimYQXc",
    authDomain: "fidgettoys-c97b9.firebaseapp.com",
    databaseURL: "https://fidgettoys-c97b9.firebaseio.com",
    projectId: "fidgettoys-c97b9",
  };
  var fb = firebase.initializeApp(config)
  var db = fb.database()

  var Auth = {
    template: `
    <form class="form-inline well add-item">
      <div class="form-group">
        <input type="text" v-model="user.email" class="form-control" placeholder="email"></input>
      </div>
      <div class="form-group">
        <input type="password" v-model="user.password" class="form-control" placeholder="password"></input>
      </div>
      <div class="form-group">
        <button type="submit" class="btn btn-success" @click.prevent="auth()">Вход</button>
      </div>
    </form>
    `,
    data () {
      return {
        user: {
          email: '',
          password: ''
        }
      }
    },
    methods: {
      auth () {
        firebase.auth().signInWithEmailAndPassword(this.user.email, this.user.password).then(res => {
          this.$emit('authorized')
        })
      }
    }
  }

  var AddItem = {
    template: `
      <form class="form-inline well add-item">
        <div class="form-group">
          <input type="text" v-model="item.title" class="form-control" placeholder="название"></input>
        </div>
        <div class="form-group">
          <input type="text" v-model="item.price" class="form-control" placeholder="цена"></input>
        </div>
        <div class="form-group">
          <input type="number" v-model="item.quantity" class="form-control" placeholder="количество"></input>
        </div>
        <div class="form-group">
          <input type="text" v-model="item.img" class="form-control" placeholder="ссылка на фото"></input>
        </div>
        <div class="form-group">
          <textarea v-model="item.description" rows="5" cols="60" class="form-control" placeholder="описание"></textarea>
        </div>
        <div class="form-group">
          <button type="submit" class="btn btn-success" @click.prevent="save()">Сохранить</button>
        </div>
      </form>
    `,
    data () {
      return {
        item: {
          title: null,
          price: null,
          quantity: null,
          img: null,
          description: null
        }
      }
    },
    methods: {
      save () {
        for (let v in this.item) {
          if (this.item[v] === null) {
            return
          }
        }
        this.$emit('add', this.item)
        this.item = {}
      }
    }
  }

  var Item = {
    props: ['item'],
    template: `
      <tr>
        <td><span @click="deleteItem(item)" v-if="edit" class="glyphicon glyphicon-trash" style="color: #F44336;"></span></td>
        <td><span @click="editItem(item.id)" v-if="!edit" class="glyphicon glyphicon-edit"></span></td>
        <td><span @click="updateItem(item)" v-if="edit" class="glyphicon glyphicon-ok" style="color: #5cb85c;"></span></td>

        <td v-if="!edit">{{item.title}}</td>
        <td v-if="edit"><input type="text" v-model="item.title" class="form-control" placeholder="название"></input></td>

        <td v-if="!edit">{{item.price}}</td>
        <td v-if="edit"><input type="text" v-model="item.price" class="form-control" placeholder="цена"></input></td>

        <td v-if="!edit">{{item.quantity}}</td>
        <td v-if="edit"><input type="number" v-model="item.quantity" class="form-control" placeholder="количество"></input></td>

        <td v-if="!edit"><a :href="item.img" target="_blank" v-if="item.img">img url</a></td>
        <td v-if="edit"><input type="text" v-model="item.img" class="form-control" placeholder="ссылка на фото"></input></td>

        <td v-if="!edit"><div v-html="item.description"></div></td>
        <td v-if="edit"><textarea v-model="item.description" rows="5" cols="60" class="form-control" placeholder="описание"></textarea></td>
      </tr>
    `,
    data () {
      return {
        edit: false
      }
    },
    methods: {
      editItem () {
        this.edit = !this.edit
      },
      updateItem (item) {
        this.$emit('save', item)
        this.edit = !this.edit
      },
      deleteItem (item) {
        this.$emit('delete', item)
        this.edit = !this.edit
      }
    }
  }

  Vue.component('dash', {
    components: {
      Auth,
      AddItem,
      Item
    },
    template: `
      <div>
        <auth v-if="!authorized" @authorized="auth()"></auth>
        <div v-if="authorized">
          <add-item @add="addItem"></add-item>
          <table v-if="items !== null" v-cloak class="table">
            <thead>
              <tr>
                <th colspan="3"></th>
                <th>Название</th>
                <th>Цена</th>
                <th>Количество</th>
                <th>Ссылка на фото</th>
                <th>Описание</th>
                <th colspan="3"></th>
              </tr>
            </thead>
            <tbody>
              <item v-for="item in fshopItems" :key="item.id" :item="item" @delete="deleteItem" @save="updateItem"></item>
            </tbody>
            </table>
          </table>
          <span v-else>no items here yet</span>
        </div>

      </div>
    `,
    data () {
      return {
        authorized: false,
        items: []
      }
    },
    methods: {
      fetchItems () {
        $.get('https://fidgettoys-c97b9.firebaseio.com/items.json').done(data => {
          this.items = data
        })
      },
      addItem (item) {
        this.$firebaseRefs.fshopItems.push(item)
      },
      deleteItem (item) {
        this.$firebaseRefs.fshopItems.child(item['.key']).remove()
      },
      updateItem (item) {
        const {title, description, price, quantity, img} = item
        this.$firebaseRefs.fshopItems.child(item['.key']).set({title, description, price, quantity, img})
      },
      auth () {
        let ls = window.localStorage
        for (var key in ls){
          if (key.includes('firebase:authUser')) {
            return this.authorized = true
          }
          return this.authorized = false
        }
      }
    },
    beforeMount () {
      this.fetchItems()
    },
    mounted () {
      this.auth()
    },
    firebase () {
      return {
        fshopItems: db.ref('items'),
      }
    }
  })

  new Vue({
    el: '#admin'
  })

})
