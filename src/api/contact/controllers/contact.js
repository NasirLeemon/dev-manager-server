"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::contact.contact", ({ strapi }) => ({
  async delete(ctx) {
    const { id } = ctx.params;
    const { id: authId } = ctx.state.user;
    try {
      const contact = await strapi.entityService.findOne(
        "api::contact.contact",
        +id,
        {
          populate: "author",
        }
      );
      console.log(contact);
      if (!contact) return ctx.notFound("Contact is not found to be deleted");
      if (contact.author.id !== authId)
        return ctx.unauthorized("You are not the owner of the contact");

      const response = await super.delete(ctx);
      return response;
    } catch (error) {
      ctx.internalServerError("Unknown Error");
    }
  },

  async create(ctx) {
    try {
      const { id } = ctx.state.user;
      ctx.request.body.data.author = id;
      const response = await super.create(ctx);
      return response;
    } catch (error) {
      ctx.internalServerError("Unknown Error");
    }
  },

  async update(ctx) {
    const { id: authId } = ctx.state.user;
    const { id } = ctx.params;
    try {
      const contact = await strapi.entityService.findOne(
        "api::contact.contact",
        +id,
        {
          populate: "author",
        }
      );
      console.log(contact);
      if (!contact) return ctx.notFound("Contact is not found to be updated");
      if (contact.author.id !== authId)
        return ctx.unauthorized(
          "You are not the owner of the contact to update"
        );

      const response = await super.update(ctx);
      return response;
    } catch (error) {
      ctx.internalServerError("Unknown Error");
    }
  },
}));
