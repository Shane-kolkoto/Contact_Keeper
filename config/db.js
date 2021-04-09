const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    // More cleaner way to connect to DB
  try {
    await mongoose
    .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    });

    console.log('MongoDB Connected')
  } catch (err) {
      console.error(err.message);
      process.exit(1);
  }
};

// Other version to connect to DB
//     mongoose
//     .connect(db, {
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useFindAndModify: false
//     })
//     .then(() => console.log('MongoDB Connected'))
//     .catch(err =>{
//         console.log(err.message);
//         process.exit(1);
//     });
// };

module.exports = connectDB;