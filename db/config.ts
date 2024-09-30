import { column, defineDb, defineTable } from 'astro:db'


const User = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
      unique: true,
    }),

    name: column.text({ optional: true }),
    lastName: column.text({ optional: true }),
    gender: column.text({ optional: true }),
    birthDate: column.text({ optional: true }),

    email: column.text({ unique: true }),
    password: column.text(),

    createdAt: column.date({ default: new Date() }),
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
