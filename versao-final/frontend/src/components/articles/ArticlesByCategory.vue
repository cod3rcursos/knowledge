<template>
    <div class="articles-by-categories">
        <PageTitle icon="fa fa-folder-o" :main="category.name" sub="Categoria" />
        <ul>
            <li v-for="article in articles" :key="article.id">
                <ArticleItem :article="article" />
            </li>
        </ul>
        <div class="load-more">
            <button v-if="loadMore" 
                class="btn btn-lg btn-outline-primary"
                @click="getArticle">Carregar Mais Artigos</button>
        </div>
    </div>
</template>

<script>
import { baseApiUrl } from '@/global'
import axios from 'axios'
import PageTitle from '../common/PageTitle'
import ArticleItem from './ArticleItem'

export default {
    name: 'ArticlesByCategory',
    components: { PageTitle, ArticleItem },
    data: function() {
        return {
            page: 1,
            loadMore: true,
            categoryId: null,
            category: {},
            articles: []
        }
    },
    methods: {
        getCategory() {
            const url = `${baseApiUrl}/categories/${this.categoryId}`
            axios(url).then(res => {
                this.category = res.data
            })
        },
        getArticle() {
            this.name = name
            const url = `${baseApiUrl}/categories/${this.categoryId}/articles?page=${this.page}`
            axios(url).then(res => {
                this.articles = this.articles.concat(res.data)
                this.page++

                if(res.data.length === 0) this.loadMore = false
            })
        }
    },
    watch: {
        '$route'(to) {
            this.categoryId = to.params.id
            this.articles = []
            this.page = 1
            this.loadMore = true

            this.getArticle()
            this.getCategory()
        }
    },
    mounted() {
        this.categoryId = this.$route.params.id
        this.getArticle()
        this.getCategory()
    },
}
</script>

<style>
    .articles-by-categories h1 {
        margin-top: 0px;
    }

    .articles-by-categories ul {
        list-style-type: none;
        padding: 0px;
    }

    .articles-by-categories .load-more {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 25px;
    }
</style>
