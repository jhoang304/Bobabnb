'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

// Spot owners (for reference, so nobody reviews their own spot):
//   spots 1, 2, 15 -> user 1 | spots 3, 4, 16 -> user 2 | spots 5, 6 -> user 3
//   spots 7, 8 -> user 4     | spots 9, 10 -> user 5    | spots 11, 12 -> user 6
//   spots 13, 14 -> user 7
// Spot 14 (Meet Fresh) is intentionally left without reviews to show the "New" badge.

module.exports = {
  up: async(queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 3,
        review: "Their handmade boba is so good, but they put too much ice in their drinks",
        stars: 4
      },
      {
        userId: 1,
        spotId: 4,
        review: "Great variety of milk teas",
        stars: 4
      },
      {
        userId: 2,
        spotId: 1,
        review: "Their milk tea is pretty good, but I have had better",
        stars: 3
      },
      {
        userId: 3,
        spotId: 2,
        review: "Their house coffee is so delicious",
        stars: 5
      },
      {
        userId: 1,
        spotId: 5,
        review: "I think Xing Fu Tang makes better boba",
        stars: 3
      },
      {
        userId: 2,
        spotId: 6,
        review: "You can never go wrong with the Lemon Honey Green Tea",
        stars: 4
      },
      {
        userId: 1,
        spotId: 7,
        review: "Love this place! Regret not knowing about it sooner. Looking forward to coming back. Music is great and speedy service creates a good ambience!",
        stars: 5
      },
      {
        userId: 2,
        spotId: 7,
        review: "A contender for the coolest place in LA -- boba + hookah + friendly service + great music.",
        stars: 5
      },
      {
        userId: 3,
        spotId: 7,
        review: "This place is an okay place to grab drinks at night. The area is a bit sketchy, and there is no in-door seating unless you're there for the hookah bar which requires ID.",
        stars: 3
      },
      {
        userId: 1,
        spotId: 8,
        review: "I LOVE URBAN BUBBLE !!!!!! the service was amazing, i asked for the roasted oolong milk tea with cheese, and this was amazing!!!! the ambiance was incredible i would totally come back.",
        stars: 5
      },
      {
        userId: 2,
        spotId: 8,
        review: "Affordable pricing, excellent service, by far one of the best boba spots in San Diego!",
        stars: 4
      },
      {
        userId: 3,
        spotId: 8,
        review: "Cute new boba spot with lots of seating and yummy milk tea! There is an online order kiosk to the right upon entering which makes it a whole lot easier to order.",
        stars: 5
      },
      {
        userId: 4,
        spotId: 1,
        review: "Cozy spot with a huge menu. The Thai tea is creamy without being too sweet and the staff remembered my order on the second visit.",
        stars: 4
      },
      {
        userId: 5,
        spotId: 1,
        review: "Best jasmine milk tea in north Houston, hands down. Pearls were perfectly chewy and they let you pick 30% sugar.",
        stars: 5
      },
      {
        userId: 2,
        spotId: 2,
        review: "Beautiful minimalist interior and the Mung Bean Milk Tea is a sleeper hit. Parking lot gets packed on weekends though.",
        stars: 4
      },
      {
        userId: 4,
        spotId: 3,
        review: "Watching them hand roll the brown sugar boba in the open kitchen is worth the trip alone. The pearls are warm and caramelized.",
        stars: 5
      },
      {
        userId: 3,
        spotId: 4,
        review: "Strawberry Matcha Latte was gorgeous and tasted as good as it looked. A little pricey for the size.",
        stars: 4
      },
      {
        userId: 4,
        spotId: 5,
        review: "The tiger stripes of brown sugar syrup are iconic for a reason. Rich, smoky, and the boba melts in your mouth.",
        stars: 5
      },
      {
        userId: 1,
        spotId: 6,
        review: "Solid go-to when I am in Plano. The salted cheese foam on the cocoa is surprisingly addictive.",
        stars: 4
      },
      {
        userId: 5,
        spotId: 6,
        review: "Drinks were fine but they were out of pearls at 3pm on a Saturday, which felt like a boba emergency.",
        stars: 3
      },
      {
        userId: 1,
        spotId: 9,
        review: "Okinawa Pearl Milk Tea is my desert island drink. Tea tastes freshly brewed every time and the lychee jelly is a nice touch.",
        stars: 5
      },
      {
        userId: 3,
        spotId: 9,
        review: "Consistent and quick. Nothing mind blowing but I have never had a bad drink here.",
        stars: 4
      },
      {
        userId: 2,
        spotId: 10,
        review: "Kung Fu Milk Tea with extra pearls after a Chinatown dumpling run is a New York rite of passage.",
        stars: 5
      },
      {
        userId: 6,
        spotId: 10,
        review: "Good drinks, but the Bowery location is tiny and there is nowhere to sit. Grab and go only.",
        stars: 4
      },
      {
        userId: 7,
        spotId: 10,
        review: "The rewards app keeps me coming back. Winter Melon Green Tea with 0% sugar is perfectly refreshing.",
        stars: 5
      },
      {
        userId: 1,
        spotId: 11,
        review: "Milk Foam Oolong is so smooth. Wish they had more seating on Market Street but the staff is quick and friendly.",
        stars: 4
      },
      {
        userId: 4,
        spotId: 11,
        review: "Salted cream foam plus black tea is the perfect combo. Best boba on Market by a mile.",
        stars: 5
      },
      {
        userId: 2,
        spotId: 12,
        review: "Deerioca pearls are on another level. Warm brown sugar tapioca with cold fresh milk, no tea needed. Ten out of ten.",
        stars: 5
      },
      {
        userId: 5,
        spotId: 12,
        review: "Worth the line. The shop is cozy, the drinks are photogenic, and the pearls are clearly made in house.",
        stars: 5
      },
      {
        userId: 3,
        spotId: 12,
        review: "Delicious but very sweet even at half sugar. Split one with a friend.",
        stars: 4
      },
      {
        userId: 1,
        spotId: 13,
        review: "Roasted milk tea was great, but service was slow and my order was mixed up twice.",
        stars: 3
      },
      {
        userId: 6,
        spotId: 13,
        review: "My favorite study spot on Buford Highway. Fast Wi-Fi, comfy chairs, and the seasonal mango pomelo sago is a treat.",
        stars: 4
      },
      {
        userId: 3,
        spotId: 15,
        review: "Watching them roll matcha and black sesame boba by hand was so fun. The pearls actually taste like something!",
        stars: 5
      },
      {
        userId: 6,
        spotId: 15,
        review: "Unique flavored pearls, friendly staff, and a clean modern shop. Lines get long on weekends.",
        stars: 4
      },
      {
        userId: 1,
        spotId: 16,
        review: "Open until midnight and cheap. Perfect late night stop after the Strip. Passionfruit green tea hit the spot.",
        stars: 4
      },
      {
        userId: 7,
        spotId: 16,
        review: "Decent for the price but the milk tea tasted a bit powdery. Fruit teas are the move here.",
        stars: 3
      },
      {
        userId: 5,
        spotId: 16,
        review: "Huge menu, fast service, and they got my 50% sugar 30% ice exactly right. Vegas boba done well.",
        stars: 5
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }
    }, {});
  }
};
