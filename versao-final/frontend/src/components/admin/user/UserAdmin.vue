<template>
    <div class="user-admin">
        <b-form>
            <input id="user-id" type="hidden" v-model="user.id" />
            <b-row>
                <b-col md="6" xs="12">
                    <b-form-group label="Nome:" label-for="name">
                        <b-form-input id="user-name" type="text"
                            v-model="user.name" required
                            placeholder="Informe o Nome do Usuário...">
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col md="6" xs="12">
                    <b-form-group label="E-mail:" label-for="email">
                        <b-form-input id="user-email" type="text"
                            v-model="user.email" required
                            placeholder="Informe o E-mail do Usuário...">
                        </b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            
            <b-form-checkbox id="user-admin" v-model="user.admin" class="mt-3 mb-3">
                Administrador?
            </b-form-checkbox>
            
            <b-row>
                <b-col md="6" xs="12">
                    <b-form-group label="Senha:" label-for="password">
                        <b-form-input id="user-password" type="password"
                            v-model="user.password" required
                            placeholder="Informe o Senha do Usuário...">
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col md="6" xs="12">
                    <b-form-group label="Confirmar Senha:" label-for="confirmPassword">
                        <b-form-input id="user-confirmPassword" type="password"
                            v-model="user.confirmPassword" required
                            placeholder="Confime o Senha do Usuário...">
                        </b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-button variant="primary" v-if="mode === 'save'"
                @click="save">Salvar</b-button>
            <b-button variant="danger" v-if="mode === 'remove'"
                @click="remove">Excluir</b-button>
            <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-form>
        <hr>
        <b-table hover :items="users" :fields="fields" striped>
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" @click="loadUser(data.item)"
                    class="mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="loadUser(data.item, 'remove')">
                    <i class="fa fa-trash"></i>
                </b-button>
            </template>
        </b-table>
    </div>
</template>

<script>
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
    name: 'UserAdmin',
    data: function() {
        return {
            mode: 'save',
            changePassword: false,
            fields: [
                { key: 'id', label: 'Código', sortable: true },
                { key: 'name', label: 'Nome', sortable: true },
                { key: 'email', label: 'E-mail', sortable: true },
                { key: 'admin', label: 'Administrador', sortable: true,
                    formatter: value => value ? 'Sim' : 'Não' },
                { key: 'actions', label: 'Ações'}
            ],
            user: {},
            users: []
        }
    },
    methods: {
        loadUser(user, mode = 'save') {
            this.mode = mode
            this.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                admin: user.admin,
            }
        },
        save() {
            const method = this.user.id ? 'put' : 'post'
            const id = this.user.id ? `/${this.user.id}` : ''
            axios[method](`${baseApiUrl}/users${id}`, this.user)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        remove() {
            const id = this.category.id
            axios.delete(`${baseApiUrl}/users/${id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        reset() {
            this.mode = 'save'
            this.user = {}
            this.loadUsers()
        },
        loadUsers() {
            const url = `${baseApiUrl}/users`
            axios.get(url).then(res => {
                this.users = res.data
            })
        }
    },
    mounted() {
        this.loadUsers()
    },
}
</script>

<style>
</style>
