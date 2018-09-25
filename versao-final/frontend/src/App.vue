<template>
	<div id="app" :class="{'hide-menu': !isMenuVisible, 'auth': !hasValidUser}">
		<Header title="Cod3r - Base de Conhecimento"
			:hideToggle="!hasValidUser"
			:hideUserDropdown="!hasValidUser" />
		<Menu v-if="hasValidUser" />
		<div class="loading" v-if="validatingToken">
			<img src="@/assets/loading.gif" alt="Loading">
		</div>
		<Content v-else></Content>
		<Footer v-if="hasValidUser" />
	</div>
</template>

<script>
import { mapState } from "vuex"
import { baseApiUrl } from "@/global"
import axios from "axios"

import Header from "./components/header/Header"
import Menu from "./components/menu/Menu"
import Content from "./components/Content"
import Footer from "./components/footer/Footer"

export default {
	name: "App",
	computed: {
		...mapState(["isMenuVisible", "user"]),
		hasValidUser() {
			return !this.validatingToken && this.user
		}
	},
	components: { Header, Menu, Content, Footer },
	data: function() {
		return {
			validatingToken: true
		}
	},
	methods: {
    	async validateToken() {
			this.validatingToken = true

			const json = localStorage.getItem("__knowledge_user")
			const userData = JSON.parse(json)

			if (userData) {
				const res = await axios.post(`${baseApiUrl}/validateToken`, userData)

				if (res.data) {
					this.$store.commit("setUser", userData)
				} else {
					localStorage.removeItem("__knowledge_user")
				}
			}

			this.validatingToken = false
		}
	},
	created() {
		if (this.$mq === "xs") {
			this.$store.commit("toggleMenu", false)
		}
		this.validateToken()
	}
}
</script>

<style>
* {
  font-family: "Lato", sans-serif;
}

body {
  margin: 0;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  height: 100vh;
  display: grid;
  grid-template-rows: 60px 1fr 40px;
  grid-template-columns: 300px 1fr;
  grid-template-areas:
    "header header"
    "menu content"
    "menu footer";
}

#app.hide-menu {
  grid-template-areas:
    "header header"
    "content content"
    "footer footer";
}

#app.auth {
  grid-template-areas:
    "header header"
    "content content"
    "content content";
}

.loading {
  grid-area: content;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
