import { column, defineDb, defineTable } from 'astro:db'


const User = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
      unique: true,
    }),

    name: column.text(),
    lastName: column.text(),
    email: column.text({ unique: true }),
    password: column.text(),

    gender: column.text({ optional: true }),
    birthDate: column.text({ optional: true }),

    createdAt: column.date({ default: new Date() }),
    updatedAt: column.date({ default: new Date() }),
    role: column.text({ references: () => Role.columns.id }),
  },
})

const Role = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    name: column.text(),
  },
})

// https://astro.build/db/config
export default defineDb({
  tables: {
    User,
    Role,
  }
});
