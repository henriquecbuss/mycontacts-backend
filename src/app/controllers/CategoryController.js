const CategoryRepository = require('../repositories/CategoryRepository')

class CategoryController {
  async index (request, response) {
    const { order } = request.query
    const categories = await CategoryRepository.findAll(order)

    response.json(categories)
  }

  async show (request, response) {
    const { id } = request.params

    const category = await CategoryRepository.findById(id)

    if (!category) {
      return response.status(404).json({ error: 'Category not found' })
    }

    response.json(category)
  }

  async store (request, response) {
    const { name } = request.body

    if (!name) {
      return response.status(400).json({ error: 'Name is required' })
    }

    const category = await CategoryRepository.create({ name })

    response.status(201).json(category)
  }

  async update (request, response) {
    const { id } = request.params
    const { name } = request.body

    const categoryExists = await CategoryRepository.findById(id)
    if (!categoryExists) {
      return response.status(404).json({ error: 'Category not found' })
    }

    if (!name) {
      return response.status(400).json({ error: 'Name is required' })
    }

    const newCategory = await CategoryRepository.update(id, { name })

    response.json(newCategory)
  }

  async delete (request, response) {
    const { id } = request.params

    await CategoryRepository.delete(id)

    response.sendStatus(204)
  }
}

module.exports = new CategoryController()
