import { Knex } from "knex";

export async function clearDb(knex: Knex) {
    await knex("app.skills").delete();
}
