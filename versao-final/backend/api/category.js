const { existsOrError, notExistsOrError } = require('./validation')

module.exports = app => {

    const save = (req, res) => {

        const category = { ...req.body }
        if(req.params.id) category.id = parseInt(req.params.id)

        try {
            existsOrError(category.name, 'Nome não informado')
        } catch(msg) {
            res.status(400).send(msg)
            return
        }

        if(category.id) {
            app.db('categories')
                .update(category)
                .where({ id: category.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(400).json(err))    
        } else {
            app.db('categories')
                .insert(category)
                .then(_ => res.status(204).send())
                .catch(err => res.status(400).json(err))
        }
    }

    const remove = async (req, res) => {
        try {
            const subcategory = await app.db('categories')
                .where({ parentId: req.params.id })
            console.log(subcategory)
            notExistsOrError(subcategory, 'Categoria possui subcategorias.')


            const articles = await app.db('articles')
                .where({ categoryId: req.params.id })
            notExistsOrError(articles, 'Categoria possui artigos.')
    
            const rowsDeleted = await app.db('categories')
                .where({ id: req.params.id }).del()
            notExistsOrError(rowsDeleted, 'Categoria não foi encontrada.')
            
            res.status(204).send()
        } catch(e) {
            res.status(400).send(e)
        }
    }

    const get = (req, res) => {
        app.db('categories')
            .then(categories => res.json(withPath(categories)))
            .catch(err => res.status(400).json(err))
    }

    const getById = (req, res) => {
        app.db('categories')
            .where({ id: req.params.id })
            .first()
            .then(category => res.json(category))
            .catch(err => res.status(400).json(err))
    }

    const toTree = (array, tree) => {
        if(!tree) tree = array.filter(c => !c.parentId)
        tree = tree.map(parentNode => {
            const isChild = node => node.parentId == parentNode.id
            parentNode.children = toTree(array, array.filter(isChild))
            return parentNode
        })
        return tree
    }

    const withPath = categories => {
        const getParent = (categories, parentId) => {
            let parent = categories.filter(
                parent => parent.id === parentId)
            return parent.length ? parent[0] : null
        }

        const categoriesWithPath = categories.map(category => {
            let path = category.name
            let parent = getParent(categories, category.parentId)
            
            while(parent) {
                path = `${parent.name} > ${path}`
                parent = getParent(categories, parent.parentId)
            }
            
            return { ...category, path }
        })

        categoriesWithPath.sort((a, b) => {
            if(a.path < b.path) return -1
            if(a.path > b.path) return 1
            return 0
        })

        return categoriesWithPath
    }

    const getTree = (req, res) => {
        app.db('categories')
            .then(categories => {
                res.json(toTree(withPath(categories)))
            })
            .catch(err => res.status(400).json(err))
    }

    return { save, remove, get, getById, getTree }
}
