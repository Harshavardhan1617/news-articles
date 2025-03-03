export const prerender = false; // ✅ Ensures this API runs in SSR mode

import sqlite3 from "sqlite3";
import type { APIContext } from "astro";
import type { Article } from "../../types/article_type";

const DB_PATH = "data/articles.db";

// ✅ Function to fetch articles based on species status
async function getArticles(isSpecies: boolean | null): Promise<Response> {
  const db = new sqlite3.Database(DB_PATH);

  return new Promise((resolve) => {
    let query = "SELECT id, title, image_url, link FROM articles WHERE is_species IS ";
    let params: any[] = [];

    if (isSpecies === true) {
      query += "?";
      params.push(1); // SQLite uses 1 for true
    } else if (isSpecies === false) {
      query += "?";
      params.push(0); // SQLite uses 0 for false
    } else {
      query += "NULL"; // ✅ Properly handle NULL case
    }

    query += " ORDER BY id DESC";

    db.all(query, params, (err, rows: Article[]) => {
      db.close();
      if (err) {
        resolve(
          new Response(JSON.stringify({ error: err.message }), {
            status: 500,
          })
        );
      } else {
        resolve(new Response(JSON.stringify(rows), { status: 200 }));
      }
    });
  });
}

export async function GET({ url }: APIContext): Promise<Response> {
  const speciesQuery = url.searchParams.get("species");

  if (speciesQuery === "true") {
    return getArticles(true);
  } else if (speciesQuery === "false") {
    return getArticles(false);
  } else if (speciesQuery === "null") {
    return getArticles(null); // ✅ Handle null case properly
  } else {
    return new Response(
      JSON.stringify({
        error:
          "Invalid species query. Use ?species=true, ?species=false, or ?species=null",
      }),
      {
        status: 400,
      }
    );
  }
}

// ✅ POST API: Mark an article as `false` (not species)
export async function POST({ request }: APIContext): Promise<Response> {
  try {
    const data = await request.json();
    if (!("id" in data) || !("is_species" in data)) {
      return new Response(
        JSON.stringify({ error: "ID and is_species are required" }),
        { status: 400 }
      );
    }

    const db = new sqlite3.Database(DB_PATH);

    return new Promise((resolve) => {
      db.run(
        "UPDATE articles SET is_species = ? WHERE id = ?",
        [data.is_species, data.id], // Accepts true or false
        (err) => {
          db.close();
          if (err) {
            resolve(
              new Response(JSON.stringify({ error: err.message }), {
                status: 500,
              })
            );
          } else {
            resolve(
              new Response(
                JSON.stringify({ message: "Updated successfully" }),
                { status: 200 }
              )
            );
          }
        }
      );
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid JSON data" }), {
      status: 400,
    });
  }
}

