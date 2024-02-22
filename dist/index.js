import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";
//connections nad listeneres
const PORT = process.env.PORT || 5000;
connectToDatabase()
    .then(() => {
    app.listen(PORT, () => console.log("Server Open & Connected To Database 👌"));
})
    .catch((err) => console.log(err));
// console.log(
//   "This is a starter kit for this amazing project. With 💓 By Indian Coders"
// );
//# sourceMappingURL=index.js.map