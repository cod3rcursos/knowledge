module.exports = {
    categoryWithChildren: `
            WITH RECURSIVE
                allcategories (id) AS
                (
                    SELECT id FROM categories WHERE id = ?
                    UNION ALL
                    SELECT c.id FROM allcategories, categories c
                        WHERE "parentId" = allcategories.id
                )
            SELECT id FROM allcategories
        `
}