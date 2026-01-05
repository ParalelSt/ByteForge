import db from "../db.js";

const addReviewsToAllProducts = async () => {
  try {
    const connection = await db.getConnection();

    // Get all products and users
    const [products] = await connection.query("SELECT id FROM products");
    const [users] = await connection.query("SELECT id FROM users");

    if (products.length === 0 || users.length === 0) {
      console.log("Not enough products or users in database");
      connection.release();
      return;
    }

    console.log(`Found ${products.length} products and ${users.length} users`);

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
      {
        rating: 4,
        title: "Worth It",
        text: "Good investment. Performs well for the price.",
      },
      {
        rating: 5,
        title: "Best Buy",
        text: "Exceeded expectations. Quality is outstanding.",
      },
      {
        rating: 3,
        title: "Average",
        text: "It's okay. Does what it says but nothing special.",
      },
      {
        rating: 4,
        title: "Happy Customer",
        text: "Very satisfied with this purchase. Great service too.",
      },
      {
        rating: 5,
        title: "Fantastic",
        text: "Everything about this product is fantastic. Highly satisfied.",
      },
      {
        rating: 4,
        title: "Good Quality",
        text: "Quality is really good. Delivery was fast.",
      },
      {
        rating: 5,
        title: "Superb",
        text: "Superb quality and excellent customer support.",
      },
      {
        rating: 3,
        title: "Okay",
        text: "It works as expected. Nothing more, nothing less.",
      },
      {
        rating: 4,
        title: "Solid",
        text: "Solid product. Does exactly what it promises.",
      },
      {
        rating: 5,
        title: "Impressive",
        text: "Very impressive quality. Definitely recommend to friends.",
      },
    ];

    let totalAdded = 0;

    // For each product, add 10-15 random reviews
    for (const product of products) {
      const randomCount = Math.floor(Math.random() * 6) + 10; // 10-15 reviews per product
      let addedForProduct = 0;

      for (let i = 0; i < randomCount; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomReview =
          sampleReviews[Math.floor(Math.random() * sampleReviews.length)];

        try {
          const query = `
            INSERT INTO reviews (product_id, user_id, rating, title, text)
            VALUES (?, ?, ?, ?, ?)
          `;

          await connection.query(query, [
            product.id,
            randomUser.id,
            randomReview.rating,
            randomReview.title,
            randomReview.text,
          ]);
          addedForProduct++;
          totalAdded++;
        } catch (err) {
          // Skip if review already exists or other error
          if (!err.message.includes("Duplicate")) {
            console.error(
              `Error adding review for product ${product.id}: ${err.message}`
            );
          }
        }
      }

      console.log(`✓ Product ${product.id}: Added ${addedForProduct} reviews`);
    }

    connection.release();
    console.log(
      `\n✅ Successfully added ${totalAdded} reviews across all products!`
    );
  } catch (error) {
    console.error("Error adding reviews to products:", error);
  }
};

addReviewsToAllProducts();
