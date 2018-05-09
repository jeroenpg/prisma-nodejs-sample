const { getUserId } = require('../utils')

const Query = {
  projects(parent, args, ctx, info) {
    return ctx.db.query.projects({}, info)
  },

  project(parent, { id }, ctx, info) {
    return ctx.db.query.project({ where: { id } }, info)
  },

  stage(parent, { id }, ctx, info) {
    return ctx.db.query.stage({ where: { id } }, info)
  },

  event(parent, { id }, ctx, info) {
    return ctx.db.query.event({ where: { id } }, info)
  },

  me(parent, args, ctx, info) {
    const id = getUserId(ctx)
    return ctx.db.query.user({ where: { id } }, info)
  },
}

module.exports = { Query }
