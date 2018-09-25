<template>
    <div class="menu" v-show="isMenuVisible">
        <div class="menu-filter">
            <i class="fa fa-search fa-lg"></i>
            <input type="text" placeholder="Digite para filtrar..."
                v-model="treeFilter" class="filter-field">
        </div>

        <Tree :data="treeData" :options="treeOptions"
            :filter="treeFilter" ref="tree" />
    </div>
</template>

<script>
import { baseApiUrl } from '@/global'
import { mapState } from 'vuex'
import axios from 'axios'
import Tree from 'liquor-tree'

export default {
    name: 'Menu',
    components: { Tree },
    data: function() {
        return {
            treeData: this.getTreeData(),
            treeFilter: '',
            treeOptions: {
                filter: {
                    emptyText: 'Categoria não encontrada'
                },
                propertyNames: {
                    'text': 'name'
                }
            }
        }
    },
    methods: {
        onNodeSelect(node) {
            if(this.$mq === 'xs') {
                this.$store.commit('toggleMenu')
            }

            this.$router.push({
                name: 'articlesByCategory',
                params: { id: node.id }
            })
        },
        getTreeData() {
            const url = `${baseApiUrl}/categories/tree`
            return axios.get(url).then(res => res.data)
        },
    },
    computed: {
        ...mapState(['isMenuVisible'])
    },
    mounted() {
        this.$refs.tree.$on('node:selected', this.onNodeSelect)
    }
}
</script>

<style>
.menu {
  grid-area: menu;
  background: linear-gradient(to right, rgb(35, 37, 38), rgb(65, 67, 69));

  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.menu a {
  color: #fff;
}

.menu .tree-node.selected > .tree-content,
.menu .tree-node .tree-content:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.tree-arrow.has-child {
    filter: brightness(2);
}

.menu .tree-node .tree-content a {
    text-decoration: none;
}

.menu .menu-filter {
    display: flex;
    justify-content: center;
    align-items: center;
    
    margin: 20px;
    padding-bottom: 8px;
    border-bottom: 1px solid #AAA;
}

.menu .menu-filter i {
    color: #AAA;
    margin-right: 10px; 
}

.menu input {
    color: #CCC;
    font-size: 1.3rem;
    border: 0;
    outline: 0;
    width: 100%;
    background: transparent;
}
</style>

