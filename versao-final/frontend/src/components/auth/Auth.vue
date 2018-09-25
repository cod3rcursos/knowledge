<template>
  <div class="auth-content">
    <div class="auth-modal">
      <img src="@/assets/logo.png" width="200" alt="Logo" />
      <hr>
      <div class="auth-title">{{ showSignup ? 'Cadastro' : 'Login' }}</div>
      
      <input v-if="showSignup" v-model="user.name" placeholder="Nome">
      <input v-model="user.email" type="text" placeholder="E-mail">
      <input v-model="user.password" type="password" placeholder="Senha">
      <input v-if="showSignup" v-model="user.confirmPassword"
        type="password" placeholder="Confirme a Senha">
      
      <button @click="signup" v-if="showSignup">Registrar</button>
      <button @click="signin" v-else>Entrar</button>

      <a href @click.prevent="showSignup = !showSignup">
        <span v-if="showSignup">Já tem cadastro? Acesse o Login!</span>
        <span v-else>Não tem cadastro? Registre-se aqui!</span>
      </a>
    </div>
  </div>
</template>

<script>
import { baseApiUrl } from '@/global'
import axios from 'axios'

import Header from '../header/Header'

export default {
  name: 'Auth',
  components: { Header },
  data: function() {
    return {
      showSignup: false,
      user: {}
    }
  },
  methods: {
    signin() {
      axios.post(`${baseApiUrl}/signin`, this.user)
          .then(res => {
            this.$store.commit('setUser', res.data)
            localStorage.setItem('__knowledge_user', JSON.stringify(res.data))
            this.$router.push({ path: '/' })
          })
          .catch(e => e.response && this.$toasted.error(e.response.data))      
    },
    signup() {
      axios.post(`${baseApiUrl}/signup`, this.user)
          .then(() => {
            this.$toasted.global.defaultSuccess()
            this.user = {}
            this.showSignup = false
          })
          .catch(e => e.response && this.$toasted.error(e.response.data))
    },
  }
}
</script>

<style>
* {
  font-family: 'Lato', sans-serif;
}

body {
  margin: 0;
}

.auth-content {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-modal {  
  background-color: #FFF;
  width: 350px;
  padding: 35px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);  

  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-title {
  font-size: 1.2rem;
  font-weight: 100;
  margin-top: 10px;
  margin-bottom: 15px;
}

.auth-modal input {
  border: 1px solid #BBB;
  width: 100%;
  margin-bottom: 15px;
  padding: 3px 8px;
  outline: none;
}

.auth-modal button {
  align-self: flex-end;
  background-color: #2460ae;
  color: #FFF;
  padding: 5px 15px;
}

.auth-modal a {
  margin-top: 35px;
}

.auth-modal hr {
  border: 0;
  width: 100%;
  height: 1px;
  background-image: linear-gradient(to right,
    rgba(120, 120, 120, 0), 
    rgba(120, 120, 120, 0.75), 
    rgba(120, 120, 120, 0));
}
</style>
