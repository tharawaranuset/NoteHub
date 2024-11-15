import Item from "../models/itemModel.js";

export const createItem = async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();

    res.status(200).json({ message: "OK" });
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({ error: "Bad Request" });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
};

export const getItems = async (req, res) => {
  const items = await Item.find();

  res.status(200).json(items);
};

export const deleteItem = async (req, res) => {
  const { id } = req.params;  // Assuming you pass the item ID via the URL

  try {
    const deletedItem = await Item.findByIdAndDelete(id);  // Delete item by ID

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });  // Item not found
    }

    res.status(200).json({ message: "Item successfully deleted" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
  
};

export const filterItems = async (req, res) => {
  // TODO3: implement this filter function
  try {
    const { filterName, lowerPrice, upperPrice } = req.query;

    // Build the query object
    let query = {};
    if (lowerPrice && upperPrice) {
      query.price = { $gte: parseFloat(lowerPrice), $lte: parseFloat(upperPrice) };
    }

    if (filterName && filterName !== "ทั้งหมด") {
      query.name = filterName;
    }

    // Query the database
    const items = await Item.find(query);

    // Return the filtered items
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
  // WARNING: you are not allowed to query all items and do something to filter it afterward.
  // Otherwise, you will be punished by -0.5 scores for this part
  // res.status(501).send("Unimplemented");
};