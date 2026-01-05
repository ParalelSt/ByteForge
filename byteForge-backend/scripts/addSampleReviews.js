import db from "../db.js";

const addSampleReviews = async () => {
  try {
    const connection = await db.getConnection();

    // Get users and products
    const [users] = await connection.query(
      "SELECT id, name FROM users LIMIT 10"
    );
    const [products] = await connection.query(
      "SELECT id FROM products LIMIT 5"
    );

    if (users.length === 0 || products.length === 0) {
      console.log("Not enough users or products in database");
      connection.release();
      return;
    }

    // Sample reviews - excluding ones with "ROM" or "cigan"
    const sampleReviews = [
      {
        rating: 5,
        title: "Excellent Product",
        text: "Great quality and fast shipping. Highly recommend!",
      },
      {
        rating: 4,
        title: "Very Good",
        text: "Good performance and value for money. Minor issues but overall satisfied.",
      },
      {
        rating: 5,
        title: "Amazing",
        text: "Exceeded my expectations. Perfect for gaming and work.",
      },
      {
        rating: 3,
        title: "Decent",
        text: "Does the job but could be better. Average quality.",
      },
      {
        rating: 5,
        title: "Outstanding",
        text: "Best purchase ever. Everything works perfectly.",
      },
      {
        rating: 4,
        title: "Pretty Good",
        text: "Solid build quality. Would buy again.",
      },
      {
        rating: 5,
        title: "Love It",
        text: "Fantastic product. Exactly what I needed.",
      },
      {
        rating: 2,
        title: "Not Great",
        text: "Expected better quality for this price.",
      },
      {
        rating: 4,
        title: "Recommended",
        text: "Good value. Functions as described.",
      },
      {
        rating: 5,
        title: "Perfect",
        text: "Absolutely perfect. No complaints whatsoever.",
      },
    ];

    // Insert reviews
    let insertCount = 0;
    for (let i = 0; i < sampleReviews.length; i++) {
      const review = sampleReviews[i];
      const user = users[i % users.length];
      const product = products[i % products.length];

      const query = `
        INSERT INTO reviews (product_id, user_id, rating, title, text)
        VALUES (?, ?, ?, ?, ?)
      `;

      try {
        await connection.query(query, [
          product.id,
          user.id,
          review.rating,
          review.title,
          review.text,
        ]);
        insertCount++;
      } catch (err) {
        console.error(`Failed to insert review: ${err.message}`);
      }
    }

    connection.release();
    console.log(`Successfully added ${insertCount} sample reviews!`);
  } catch (error) {
    console.error("Error adding sample reviews:", error);
  }
};

addSampleReviews();
