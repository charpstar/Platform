<template>
    <div id="header">
        <div class="flexrow homebutton" @click="$emit('home')">
            <img src="/charpstar3.png" class="logosmall" />
            <p>3D asset management system</p>
        </div>
        <div v-if="$route.path != '/'" >
            <v-menu id="menu" offset-y v-model="menuOpen" :close-on-content-click="false">
                <template v-slot:activator="{ on }">
					<!-- added fab to make button round, color,dark-->
                     <div class="account">
						<v-btn text id="menuButton" v-on="on" fab dark color="#1FB1A9" >
                        <p
                            class="notification-badge"
                            v-if="Object.values(notifications).length > 0"
                        >{{Object.values(notifications).length}}</p>
						<!-- Div created for styling of p and icon-->
                       
                        <!-- <i class="material-icons" id="acountIcon" color="#1FB1A9" >account_circle</i> -->
						<v-icon large >mdi-account</v-icon>
						
                    </v-btn>
					<p class="accountName">{{account.name}}</p>
					</div>
                </template>
                <v-list>
                    <v-list-item v-for="(item, index) in items" :key="index" @click="item.click">
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
						<v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
                    </v-list-item>
                    <v-divider v-if="Object.values(notifications).length > 0" />
                    <v-list-item
                        v-for="(item, id) in notifications"
                        :key="'notification' + id"
                        @click="$router.push(item.url)"
                    >
                        <p class="notification-small"></p>
                        <v-list-item-title>{{ item.message }}</v-list-item-title>
                        <v-btn icon @click="closeNotification(id)">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-list-item>
					<!-- Added QA tools to access important links -->
					<v-list-group
        :value="false"
		v-if="account.usertype == 'QA'"
      >
		<template v-slot:activator>
          <v-list-item-title>QA tools</v-list-item-title>
        </template>
		<v-list-group
          :value="true"
          no-action
          sub-group
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Links</v-list-item-title>
            </v-list-item-content>
          </template>
		<v-list-item
            v-for="item in links"
            :key="item.title"
			:href="item.href"
            link
			target="_blank"
          >
            <v-list-item-title>{{item.title}}</v-list-item-title>
			<v-icon>mdi-link</v-icon>
</v-list-item>
            </v-list-group>
			</v-list-group>
                </v-list>
            </v-menu>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import backend from "../backend";
export default {
    props: {
        account: { type: Object, required: true },
        notifications: { type: Object, required: true }
    },
    data: () => ({
        items: [],
        menuOpen: false,
		links: [
		{title:'3DTester', href:'https://charpstar.se/3DTester'},
        {title:'modelviewer', href:'https://modelviewer.dev/editor'},
		{title:'vectary', href:'https://wwww.vectary.com'}
      
      ],
    }),
    methods: {
        logout() {
            var vm = this;
            vm.menuOpen = false;
            backend
                .logout()
                .then(() => {
                    vm.$router.push("/");
                })
                .catch(() => {
                    vm.$router.push("/");
                });
        },
        closeNotification(id) {
            Vue.delete(this.notifications, id);
        }
    },
    mounted() {
        var vm = this;
        vm.items = [
            { title: "Log out", icon: 'mdi-logout', click: vm.logout },
            {
                title: "Support", icon:'mdi-lifebuoy',
                click: () => {
                    window.location.href = "https://www.charpstar.se/";
                    vm.menuOpen = false;
                }
            }
        ];
    }
};
</script>


<style lang="scss" scoped>
#menuButton {
    background-color: white !important;
}
.v-menu__content {
    min-width: 300px !important;
}
.homebutton {
    cursor: pointer;
}
#header {
    display: flex;
    flex-direction: row;
    padding: 10px;
    background-color: white;
    justify-content: space-between;
    .row {
        flex-grow: 0;
        cursor: pointer;
    }
    p {
        font-size: 24px;
        padding: 0;
        margin-left: 10px;
        color: grey;
    }
    > * {
        margin-top: auto;
        margin-bottom: auto;
    }
}

.notification-badge {
    border-radius: 12px;
    background-color: #2196f3;
    width: 24px;
    height: 24px;
    font-size: 20px !important;
    color: black !important;
    font-weight: normal !important;
}
.notification-small {
    display: block;
    border-radius: 8px;
    background-color: #2196f3;
    width: 20px !important;
    height: 16px;
    margin-right: 5px;
    font-size: 16px !important;
    color: black !important;
    font-weight: normal !important;
}
// To change icon color from grey to green
/*#acountIcon {
     color: grey;
    font-size: 24px ;
}*/

.logosmall {
    height: 30px;
    margin-left: 10px;
}
//Added To style p (account.name)
.accountName {
	font-size: 15px  !important;
margin-right: 10px;
}
.account{
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center
	;
}

</style>
