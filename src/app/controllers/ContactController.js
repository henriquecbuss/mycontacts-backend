const ContactRepository = require('../repositories/ContactRepository')

class ContactController {
  mergeCategory (contact) {
    const { category_name: categoryName, category_id: categoryId, ...rest } = contact
    const category =
        (categoryName && categoryId && { name: categoryName, id: categoryId }) ||
        null

    return {
      category,
      ...rest
    }
  }

  async index (request, response) {
    const { order } = request.query
    const contacts = await ContactRepository.findAll(order)

    response.json(contacts.map(controller.mergeCategory))
  }

  async show (request, response) {
    const { id } = request.params

    const contact = await ContactRepository.findById(id)

    if (!contact) {
      return response.status(404).json({ error: 'User not found' })
    }

    response.json(controller.mergeCategory(contact))
  }

  async store (request, response) {
    const { name, email, phone, category_id: categoryId } = request.body

    if (!name) {
      return response.status(400).json({ error: 'Name is required' })
    }

    const emailExists = await ContactRepository.findByEmail(email)
    if (emailExists) {
      return response.status(400).json({ error: 'Email already taken' })
    }

    const newContact = await ContactRepository.create({ name, email, phone, categoryId })

    response.status(201).json(newContact)
  }

  async update (request, response) {
    const { id } = request.params
    const { name, email, phone, category_id: categoryId } = request.body

    const contactExists = await ContactRepository.findById(id)
    if (!contactExists) {
      return response.status(404).json({ error: 'User not found' })
    }

    if (!name) {
      return response.status(400).json({ error: 'Name is required' })
    }

    const contactByEmail = await ContactRepository.findByEmail(email)
    if (contactByEmail && contactByEmail.id !== id) {
      return response.status(400).json({ error: 'Email already taken' })
    }

    const contact = await ContactRepository.update(id, {
      name,
      email,
      phone,
      categoryId
    })

    response.json(contact)
  }

  async delete (request, response) {
    const { id } = request.params

    await ContactRepository.delete(id)

    // 204: No Content
    response.sendStatus(204)
  }
}

const controller = new ContactController()
module.exports = controller
