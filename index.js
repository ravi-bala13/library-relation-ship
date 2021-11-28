const express = require("express");

const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const connect = () => {
    return mongoose.connect("mongodb://localhost:27017/library");
};

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: false, default: "Male" },
    age: { type: Number, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema); // users

const sectionSchema = new mongoose.Schema(
    {
      section_name: { type: String, required: true }
    },
    {
      versionKey: false,
      timestamps: true,
    }
);

const Section = mongoose.model("section", sectionSchema);  // sections collection

const bookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    body: { type: String, required: true },
    section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "section",
      required: true,
    },
    author_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "author",
        required: true,
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Book = mongoose.model("book", bookSchema); // books collection

const authorSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: false },
    // book_ids: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "book",
    //     required: true,
    //   },
    // ]
  },
  
  {
    versionKey: false,
    timestamps: true,
  }
);

const Author = mongoose.model("author", authorSchema); // authors collection

const checkedoutSchema = new mongoose.Schema(
  {
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
      required: true,
    },
    section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: { type: String, required: true },
    
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Checkedout = mongoose.model("checkedout", checkedoutSchema); // checkedouts collection

//****************** */
app.post("/users", async (req, res) => {
  
  try {
    const user = await User.create(req.body);

    return res.status(201).send(user);
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find().lean().exec();

    return res.send({ users });
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});
//****************** */
//****************** */
app.post("/sections", async (req, res) => {
  
  try {
    const section = await Section.create(req.body);

    return res.status(201).send(section);
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});

app.get("/sections", async (req, res) => {
  try {
    const section = await Section.find().lean().exec();

    return res.send({ section });
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});
//****************** */
//****************** */
app.post("/authors", async (req, res) => {
  
  
  try {
    const author = await Author.create(req.body);

    return res.status(201).send(author);
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});

app.get("/authors", async (req, res) => {
  try {
    const author = await Author.find().lean().exec();

    return res.send({ author });
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});
//****************** */
//****************** */
app.post("/books", async (req, res) => {
  
  
  try {
    const book = await Book.create(req.body);

    return res.status(201).send(book);
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});

app.get("/books", async (req, res) => {
  try {
    const book = await Book.find().populate({path: "section_id", select: "section_name"}).populate("author_ids").lean().exec();

    return res.send({ book });
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});
//****************** */
app.get("/books/:section", async (req, res) => {
  
  try {
    
    const section = await Section.find({section_name: req.params.section})
    // console.log('section:', section)

    // console.log(section._id)
    // const book = await Book.find({section_id: section[0]._id}).lean().exec();

    return res.send({ section });
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});
//****************** */
app.post("/checkouts", async (req, res) => {
  
  
  try {
    const checkout = await Checkedout.create(req.body);

    return res.status(201).send(checkout);
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});

app.get("/checkouts", async (req, res) => {
  try {
    const checkout = await Checkedout.find().lean().exec();

    return res.send({ checkout });
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});

//********** query ******** */
app.get("/checkouts/:status", async (req, res) => {
  
  try {
    const checkout = await Checkedout.find({status: req.params.status}).lean().exec();

    return res.send({ checkout });
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});
//****************** */
app.listen(2348, async () => {
    await connect();
    console.log("Hai my dear friend i am listening on 2348");
});