const express = require("express");
let cors = require("cors");
let sqlite3 = require("sqlite3");
let { open } = require("sqlite");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.static("static"));

let db;

(async () => {
  db = await open({
    filename: path.join(__dirname, "BD4_Assignment1/database.sqlite"),
    driver: sqlite3.Database,
  });
})();

async function fetchAllRestaurants() {
  let query = "SELECT * from restaurants";
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get("/restaurants", async (req, res) => {
  try {
    let results = await fetchAllRestaurants();
    if (results.restaurants.length === 0) {
      return res.status(404).json({
        message: "No restaurants found",
      });
    }
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

async function fetchRestaurantById(id) {
  let query = "SELECT * from restaurants where id = ?";
  let response = await db.get(query, [id]);
  return { restaurant: response };
}

app.get("/restaurants/details/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let result = await fetchRestaurantById(id);
    if (result.restaurant === undefined) {
      return res.status(404).json({
        message: "No restaurants found with id " + id,
      });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

async function fetchRestaurantByCuisine(cuisine) {
  let query = "SELECT * from restaurants where cuisine = ?";
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}

app.get("/restaurants/cuisine/:cuisine", async (req, res) => {
  try {
    let cuisine = req.params.cuisine;
    let result = await fetchRestaurantByCuisine(cuisine);
    if (result.restaurants.length == 0) {
      return res.status(404).json({
        message: "No restaurants found with cuisine " + cuisine,
      });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

async function fetchRestaurantByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    "SELECT * from restaurants where isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?";
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}

app.get("/restaurants/filter/", async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let hasOutdoorSeating = req.query.hasOutdoorSeating;
    let isLuxury = req.query.isLuxury;

    let result = await fetchRestaurantByFilter(isVeg, hasOutdoorSeating, isLuxury);

    if (result.restaurants.length == 0) {
      return res.status(404).json({
        message:
          "No restaurants found with filter isVeg " +
          isVeg +
          " hasOutdoorSeating " +
          hasOutdoorSeating +
          " isLuxury " +
          isLuxury,
      });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

async function getRestaurantSortedByRating() {
  let query = "SELECT * from restaurants ORDER BY rating DESC";
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get("/restaurants/sort-by-rating", async (req, res) => {
  try {
    let result = await getRestaurantSortedByRating();
    if (result.restaurants.length === 0) {
      return res.status(404).json({
        message: "No restaurants found",
      });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

async function fetchAllDishes() {
  let query = "SELECT * from dishes";
  let result = await db.all(query, []);
  return { dishes: result };
}

app.get("/dishes", async (req, res) => {
  try {
    let result = await fetchAllDishes();
    if (result.dishes.length === 0) {
      return res.status(404).json({
        message: "No dishes found",
      });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

async function fetchDishesById(id) {
  let query = "SELECT * from dishes where id = ?";
  let response = await db.get(query, [id]);
  return { dish: response };
}

app.get("/dishes/details/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let result = await fetchDishesById(id);
    if (result.dish === undefined) {
      return res.status(404).json({
        message: "No dish found with id " + id,
      });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

async function fetchDishesByFilter(isVeg) {
  let query = "SELECT * from dishes where isVeg = ?";
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}

app.get("/dishes/filter", async (req, res) => {
  try {
    const isVeg = req.query.isVeg;
    let result = await fetchDishesByFilter(isVeg);
    if (result.dishes.length === 0) {
      return res.status(404).json({
        message: "No dishes found",
      });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

async function getDishesSortedByPrice() {
  let query = "SELECT * FROM dishes ORDER BY price";
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get("/dishes/sort-by-price", async (req, res) => {
  try {
    let result = await getDishesSortedByPrice();
    if (result.dishes.length === 0) {
      return res.status(404).json({ message: "No dishes found" });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
