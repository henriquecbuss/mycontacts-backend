const ContactRepository = require('../repositories/ContactRepository')
const CategoryRepository = require('../repositories/CategoryRepository')
const isValidUUID = require('../utils/isValidUUID')

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

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid contact ID' })
    }

    const contact = await ContactRepository.findById(id)

    if (!contact) {
      return response.status(404).json({ error: 'Contact not found' })
    }

    response.json(controller.mergeCategory(contact))
  }

  async store (request, response) {
    const { name, email, phone, category_id: categoryId } = request.body

    if (!name) {
      return response.status(400).json({ error: 'Name is required' })
    }

    if (categoryId && !isValidUUID(categoryId)) {
      return response.status(400).json({ error: 'Invalid category ID' })
    }

    if (email) {
      const emailExists = await ContactRepository.findByEmail(email)
      if (emailExists) {
        return response.status(400).json({ error: 'Email already taken' })
      }
    }

    const newContact = await ContactRepository.create({
      name,
      email: email || null,
      phone: phone || null,
      categoryId: categoryId || null
    })

    response.status(201).json(newContact)
  }

  async update (request, response) {
    const { id } = request.params
    const { name, email, phone, category_id: categoryId } = request.body

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid contact ID' })
    }

    if (categoryId && !isValidUUID(categoryId)) {
      return response.status(400).json({ error: 'Invalid category ID' })
    }

    if (!name) {
      return response.status(400).json({ error: 'Name is required' })
    }

    const contactExists = await ContactRepository.findById(id)
    if (!contactExists) {
      return response.status(404).json({ error: 'Contact not found' })
    }

    if (email) {
      const contactByEmail = await ContactRepository.findByEmail(email)
      if (contactByEmail && contactByEmail.id !== id) {
        return response.status(400).json({ error: 'Email already taken' })
      }
    }

    const contact = await ContactRepository.update(id, {
      name,
      email: email || null,
      phone: phone || null,
      categoryId: categoryId || null
    })

    if (contact.category_id) {
      const category = await CategoryRepository.findById(contact.category_id)

      contact.category_name = category.name
    }

    response.json(controller.mergeCategory(contact))
  }

  async delete (request, response) {
    const { id } = request.params

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid contact ID' })
    }

    await ContactRepository.delete(id)

    // 204: No Content
    response.sendStatus(204)
  }
}

const controller = new ContactController()
module.exports = controller
