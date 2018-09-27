<template>
    <div class="category-admin">
        <b-form>
            <input id="category-id" type="hidden" v-model="category.id" />
            <b-form-group  label="Nome:" label-for="category-name">
                <b-form-input id="category-name" type="text"
                    v-model="category.name" required
                    placeholder="Informe o Nome da Categoria...">
                </b-form-input>
            </b-form-group>
            <b-form-group label="Categoria Pai:"
                label-for="parentId">
                <b-form-select id="category-parentId"
                    :options="categories" v-model="category.parentId" required>
                </b-form-select>
            </b-form-group>
            <b-button variant="primary" v-if="mode === 'save'"
                @click="save">Salvar</b-button>
            <b-button variant="danger" v-if="mode === 'remove'"
                @click="remove">Excluir</b-button>
            <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-form>
        <hr>
        <b-table hover :items="categories" :fields="fields" striped>
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" @click="loadCategory(data.item)"
                    class="mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="loadCategory(data.item, 'remove')">
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
    name: 'CategoryAdmin',
    data: function() {
        return {
            mode: 'save',
            fields: [
                { key: 'id', label: 'Código', sortable: true },
                { key: 'name', label: 'Nome', sortable: true },
                { key: 'path', label: 'Caminho', sortable: true },
                { key: 'actions', label: 'Ações'}
            ],
            category: {},
            categories: []
        }
    },
    methods: {
        loadCategory(category, mode = 'save') {
            this.mode = mode
            this.category = {
                id: category.id,
                name: category.name,
                parentId: category.parentId
            }
        },
        save() {
            const method = this.category.id ? 'put' : 'post'
            const id = this.category.id ? `/${this.category.id}` : ''
            axios[method](`${baseApiUrl}/categories${id}`, this.category)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        remove() {
            const id = this.category.id
            axios.delete(`${baseApiUrl}/categories/${id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        reset() {
            this.mode = 'save'
            this.category = {}
            this.loadCategories()
        },
        loadCategories() {
            const url = `${baseApiUrl}/categories`
            axios.get(url).then(res => {
                this.categories = res.data.map(category => {
                    return { ...category, value: category.id, text: category.path }
                })
            })
        }
    },
    mounted() {
        this.loadCategories()
    },
}
</script>

<style>
</style>
