<template>
    <div class="article-admin">
        <b-form>
            <input id="article-id" type="hidden"
                v-model="article.id" />
            <b-form-group label="Nome:" label-for="name">
                <b-form-input id="article-name" type="text"
                    v-model="article.name" required
                    placeholder="Informe o Nome do Artigo...">
                </b-form-input>
            </b-form-group>
            <b-form-group label="Descrição:" label-for="description">
                <b-form-input id="article-description" type="text"
                    v-model="article.description" required
                    placeholder="Informe a Descrição do Artigo...">
                </b-form-input>
            </b-form-group>
            <b-form-group label="Imagem (URL):" label-for="imageUrl">
                <b-form-input id="article-imageUrl" type="text"
                    v-model="article.imageUrl" required
                    placeholder="Informe a URL da Imagem do Artigo...">
                </b-form-input>
            </b-form-group>
            <b-form-group label="Categoria:"
                label-for="article-categoryId">
                <b-form-select id="article-categoryId"
                    :options="categories" v-model="article.categoryId" required>
                </b-form-select>
            </b-form-group>
            <b-form-group label="Autor:"
                label-for="article-userId">
                <b-form-select id="article-userId"
                    :options="users" v-model="article.userId" required>
                </b-form-select>
            </b-form-group>
            <b-form-group label="Conteúdo:" label-for="article-content">
                <VueEditor v-model="article.content"
                    placeholder="Informe o Conteúdo do Artigo..." />
            </b-form-group>
            <b-button variant="primary" v-if="mode === 'save'"
                @click="save">Salvar</b-button>
            <b-button variant="danger" v-if="mode === 'remove'"
                @click="remove">Excluir</b-button>
            <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-form>
        <hr>
        <b-table hover :items="articles" :fields="fields" striped>
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" @click="loadArticle(data.item)"
                    class="mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="loadArticle(data.item, 'remove')">
                    <i class="fa fa-trash"></i>
                </b-button>
            </template>
        </b-table>
        <b-pagination size="md" v-model="page"
            :total-rows="count" 
            :per-page="limit" />
    </div>
</template>

<script>
import { VueEditor } from "vue2-editor"
import axios from 'axios'
import { baseApiUrl } from '@/global'

export default {
    name: 'ArticleAdmin',
    components: { VueEditor },
    data: function() {
        return {
            mode: 'save',
            fields: [
                { key: 'id', label: 'Código', sortable: true },
                { key: 'name', label: 'Nome', sortable: true },
                { key: 'description', label: 'Descrição', sortable: true },
                { key: 'actions', label: 'Ações'}
            ],
            page: 1,
            limit: 0,
            count: 0,
            article: {},
            articles: [],
            categories: [],
            users: []
        }
    },
    methods: {
        async loadArticle(article, mode = 'save') {
            this.mode = mode
            axios.get(`${baseApiUrl}/articles/${article.id}`)
                .then(res => this.article = res.data)
        },
        save() {
            const method = this.article.id ? 'put' : 'post'
            const id = this.article.id ? `/${this.article.id}` : ''
            axios[method](`${baseApiUrl}/articles${id}`, this.article)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        remove() {
            const id = this.article.id
            axios.delete(`${baseApiUrl}/articles/${id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        reset() {
            this.mode = 'save'
            this.article = {}
            this.loadArticles()
        },
        loadArticles() {
            const url = `${baseApiUrl}/articles?page=${this.page}`
            axios.get(url).then(res => {
                this.articles = res.data.data
                this.count = res.data.count
                this.limit = res.data.limit
            })
        },
        loadCategories() {
            const url = `${baseApiUrl}/categories`
            axios.get(url).then(res => {
                this.categories = res.data.map(category => {
                    return { value: category.id, text: category.path }
                })
            })
        },
        loadUsers() {
            const url = `${baseApiUrl}/users`
            axios.get(url).then(res => {
                this.users = res.data.map(user => {
                    return { value: user.id, text: `${user.name} - ${user.email}` }
                })
            })
        }
    },
    watch: {
        page() {
            this.loadArticles()
        }
    },
    mounted() {
        this.loadCategories()
        this.loadUsers()
        this.loadArticles()
    },
}
</script>

<style>
</style>
