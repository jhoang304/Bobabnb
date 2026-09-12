'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async(queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: "5315 Cypress Creek Pkwy C",
        city: "Houston",
        state: "Texas",
        country: "United States of America",
        lat: 29.9548,
        lng: -95.4340,
        name: "Teahouse",
        description: "The Teahouse offers a chance for others to join in on their goal of delivering happiness in a cup, capitalizing on the traditional and trusted tea flavors and recipes, and the reputable brand they have built over the last two decades.",
        price: 67
      },
      {
        ownerId: 1,
        address: "2540 Old Denton Rd",
        city: "Carrollton",
        state: "Texas",
        country: "United States of America",
        lat: 32.9976,
        lng: -96.8905,
        name: "7 Leaves",
        description: "We focus on using natural elements to remind ourselves of our connection with the Earth, without sacrificing modern style. Our linear setup helps us maintain a simplistic, yet clean and attractive design.",
        price: 84
      },
      {
        ownerId: 2,
        address: "9889 Bellaire Blvd",
        city: "Houston",
        state: "Texas",
        country: "United States of America",
        lat: 29.7050,
        lng: -95.5535,
        name: "Xing Fu Tang",
        description: "Known for making the best hand crafted brown sugar boba from Taiwan, is finally here in the United States featuring an open kitchen concept where boba pearls are freshly hand-made hourly and cooked to order for all guests to see what goes into their cups.",
        price: 200
      },
      {
        ownerId: 2,
        address: "378 Santana Row",
        city: "San Jose",
        state: "California",
        country: "United States of America",
        lat: 37.3208,
        lng: -121.9477,
        name: "Boba Guys",
        description: "The guys that make boba",
        price: 70
      },
      {
        ownerId: 3,
        address: "32211 John R Rd",
        city: "Detroit",
        state: "Michigan",
        country: "United States of America",
        lat: 42.5330,
        lng: -83.1050,
        name: "Tiger Sugar",
        description: "With humble beginnings in Taichung, Taiwan, in 2017, Tiger Sugar has grown into an undisputed cult brand of Boba worldwide.",
        price: 444
      },
      {
        ownerId: 3,
        address: "301 W Parker Rd",
        city: "Plano",
        state: "Texas",
        country: "United States of America",
        lat: 33.0364,
        lng: -96.7050,
        name: "Happy Lemon",
        description: "Happy Lemon is a world-leading beverage chain founded in 2006 by the Yummy-Town Group, a publicly listed tea culture company originating in Taiwan. They are the elite pioneers who originally brought and expanded the tea culture to Mainland China and Hong Kong.",
        price: 54
      },
      {
        ownerId: 4,
        address: "414 S Western Ave",
        city: "Los Angeles",
        state: "California",
        country: "United States of America",
        lat: 34.06686,
        lng: -118.30868,
        name: "Boba Bear",
        description: "Boba teas, hookah, smoothies, crêpes & light Korean bites offered at tables or in a lounge area.",
        price: 83
      },
      {
        ownerId: 4,
        address: "8055 Clairemont Mesa Blvd Ste 100",
        city: "San Diego",
        state: "California",
        country: "United States of America",
        lat: 32.83285954989467,
        lng: -117.1499956460283,
        name: "Urban Bubble",
        description: "'Yogurt Series' Urban Bubble is locally owned and operated here in San Diego. We plan on having our grand opening Fall of 2022",
        price: 49
      },
      {
        ownerId: 5,
        address: "5435 Belt Line Rd",
        city: "Dallas",
        state: "Texas",
        country: "United States of America",
        lat: 32.9535,
        lng: -96.8261,
        name: "Sharetea",
        description: "Founded in Taipei in 1992, Sharetea brings authentic Taiwanese tea culture to every cup. Our tea leaves are imported straight from Taiwan and freshly brewed every four hours, so nothing sits around. Try the Okinawa Pearl Milk Tea or a Mango Green Tea with lychee jelly.",
        price: 62
      },
      {
        ownerId: 5,
        address: "34 Bowery",
        city: "New York",
        state: "New York",
        country: "United States of America",
        lat: 40.7145,
        lng: -73.9975,
        name: "Kung Fu Tea",
        description: "Born in Queens in 2010, Kung Fu Tea is now America's largest bubble tea brand. Every drink is hand-shaken to order and our boba is cooked fresh every two hours. Grab a Kung Fu Milk Tea with extra pearls and settle in at our Chinatown flagship.",
        price: 95
      },
      {
        ownerId: 6,
        address: "1390 Market St",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7764,
        lng: -122.4172,
        name: "Gong Cha",
        description: "Gong cha means 'tribute tea for the emperor', and we treat every guest like royalty. Our signature Milk Foam series layers salted cream over freshly brewed tea, and we never serve tea that has been sitting for more than four hours.",
        price: 78
      },
      {
        ownerId: 6,
        address: "1121 S Jackson St",
        city: "Seattle",
        state: "Washington",
        country: "United States of America",
        lat: 47.5993,
        lng: -122.3170,
        name: "The Alley",
        description: "Home of the Deerioca pearl. Our tapioca is hand-cooked from scratch every morning and simmered in brown sugar, then poured over fresh milk for the famous Brown Sugar Deerioca Fresh Milk. Cozy Little Saigon storefront with plenty of seating.",
        price: 110
      },
      {
        ownerId: 7,
        address: "5455 Buford Hwy NE",
        city: "Atlanta",
        state: "Georgia",
        country: "United States of America",
        lat: 33.9190,
        lng: -84.2678,
        name: "Chatime",
        description: "Chatime has been brewing Taiwanese tea since 2005 and now serves over a million cups a day worldwide. Our Buford Highway shop is a favorite study spot with fast Wi-Fi, a roasted milk tea that regulars swear by, and a rotating menu of seasonal fruit teas.",
        price: 58
      },
      {
        ownerId: 7,
        address: "2020 S Wentworth Ave",
        city: "Chicago",
        state: "Illinois",
        country: "United States of America",
        lat: 41.8535,
        lng: -87.6323,
        name: "Meet Fresh",
        description: "A Taiwanese dessert house in the heart of Chinatown. Beyond milk tea, Meet Fresh is famous for chewy handmade taro balls, herbal grass jelly, and mountains of shaved ice. Come for the Taro Ball Signature and stay for the red bean soup.",
        price: 72
      },
      {
        ownerId: 1,
        address: "5085 S Kirkman Rd",
        city: "Orlando",
        state: "Florida",
        country: "United States of America",
        lat: 28.4653,
        lng: -81.4691,
        name: "OneZo",
        description: "Boba made from scratch in-store every single day. Watch our team roll flavored tapioca like matcha, cocoa, black sesame, and sweet potato right behind the counter, then pair it with any of our brewed teas. No powders, no shortcuts.",
        price: 89
      },
      {
        ownerId: 2,
        address: "5960 Spring Mountain Rd",
        city: "Las Vegas",
        state: "Nevada",
        country: "United States of America",
        lat: 36.1257,
        lng: -115.2222,
        name: "Ding Tea",
        description: "Since 2004, Ding Tea has grown to over 500 locations by keeping things simple: high-quality Taiwanese tea leaves, adjustable sweetness and ice, and prices that won't break the bank. A late-night Chinatown staple that stays open until midnight.",
        price: 45
      }
    ], {});
  },

  down: async(queryInterface, Sequelize) => {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7] }
    }, {});
  }
};
