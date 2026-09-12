'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

// Photos are served from Unsplash (images.unsplash.com), which allows hotlinking
// and does not expire its links. The first image listed for each spot is its
// preview image; the spot details page shows it first, then the next four.
const img = (id) => `https://images.unsplash.com/photo-${id}?w=1200&q=80`;

// Drinks
const BOBA_CUP = '1558857563-b371033873b8';
const HAND_HELD_BOBA = '1745883949374-baeba0ed57c3';
const THREE_CUPS = '1734770580735-796a00e42cb2';
const TWO_JARS = '1525803377221-4f6ccdaa5133';
const TAKEOUT_CUPS = '1572932759882-bb34c848d1b3';
const TWO_CUPS_TABLE = '1674218153634-7f6094a17820';
const POLKA_DOT_DRINK = '1718065598477-505b9c2e764d';
const TALL_GLASS_BOBA = '1686860792691-d324f79d3fcc';
const CARAMEL_TAPIOCA = '1756132539966-8d65f7a9eed8';
const FOUR_COLORFUL = '1747016804753-866c3ed6b3b7';
const MATCHA_CUP = '1637273484093-3e205aed2c59';
const BLACK_STRAW_CUP = '1692783029695-1956cd253e10';
const LOGO_BOBA_CUP = '1600773407745-8eaa1937e802';
const NEON_SIGN = '1636737187581-f25682019be7';
const MANGO_DRINK = '1525385133512-2f3bdd039054';
const THAI_TEA = '1546039907-7fa05f864c02';
const HERBAL_TEA = '1576092768241-dec231879fc3';
const FLOWER_DESSERTS = '1627308595229-7830a5c91f9f';
const COOKIE_FRAPPE = '1572490122747-3968b75cc699';
const LAYERED_MATCHA = '1592284441621-581ebd2e677d';
const ICED_TEA_SPLASH = '1594489556673-c816408242f5';
const PINK_DRINKS = '1575417634984-8e608b88a04b';
const POURING_ICED_TEA = '1661499102718-aebb4886a0bc';
const ICED_LATTE = '1729656606803-624227313880';
const POURING_MILK = '1553909489-ec2175ef3f52';
const POURING_INTO_BOBA = '1620360289473-bfafadc16c57';
const MATCHA_LATTE = '1556679343-c7306c1976bc';
const TEA_AND_PEARLS = '1541696490-8744a5dc0228';

// Shop interiors and details
const CAFE_CROWD = '1521017432531-fbd92d768814';
const CAFE_TABLES = '1521917441209-e886f0404a7b';
const PITCHER_TABLE = '1616103425322-91736a8724a9';
const TEA_GLASS = '1531967802777-e0f8fc276609';
const TEA_BOARD = '1531019319449-bb12b54939be';
const WOOD_TABLES = '1586965142106-83751d8f57a3';
const LABELED_GLASSES = '1515094264130-1c21fc4c9dcd';
const KETTLE = '1531877038798-51499a9eedf0';
const DISPLAY_COUNTER = '1623814877285-846d8f309845';
const CURVED_COUNTER = '1567880905822-56f8e06fe630';
const HANGING_BULBS = '1511081692775-05d0f180a065';
const DINING_TABLE = '1613274554329-70f997f5789f';
const ROUND_TABLE = '1583354608715-177553a4035e';
const BUSY_RESTAURANT = '1494346480775-936a9f0d0877';
const EMPTY_CHAIRS = '1538333581680-29dd4752ddf2';
const TABLE_ROOM = '1648462908676-8305f0eff8e0';
const WOOD_CHAIRS = '1612192527395-06b72da6b35a';
const LEATHER_SOFA = '1565650839149-2c48a094196c';
const PLANT_TABLE = '1588253137728-1e4dd0fe9a93';
const CHALKBOARD_MENU = '1545418314-7ce0b9b53901';
const POTTED_PLANTS = '1600353565737-2427a1ba3d3a';
const BIG_WINDOW = '1728761390316-935ffeb3fbcc';
const LATTE_TRAY = '1498804103079-a6351b050096';
const STOREFRONT = '1611332667387-b57b4a2462ca';
const COZY_CAFE = '1559925393-8be0ec4767c8';
const BRIGHT_CAFE = '1554118811-1e0d58224f24';
const RUSTIC_CAFE = '1445116572660-236099ec97a0';
const CAFE_SIGN = '1501339847302-ac426a4a7cbb';
const CAFE_WINDOW = '1493857671505-72967e2e2760';
const TEA_TOP_VIEW = '1571934811356-5cc061b6821f';
const PLANT_CAFE = '1600093463592-8e36ae95ef56';

// [preview, ...gallery]
const spotPhotos = {
  1:  [BOBA_CUP, TEA_AND_PEARLS, HERBAL_TEA, TEA_BOARD, KETTLE],                       // Teahouse
  2:  [ICED_LATTE, MATCHA_LATTE, MATCHA_CUP, POTTED_PLANTS, PLANT_TABLE],              // 7 Leaves
  3:  [CARAMEL_TAPIOCA, LOGO_BOBA_CUP, POURING_MILK, DISPLAY_COUNTER, CAFE_TABLES],    // Xing Fu Tang
  4:  [THREE_CUPS, TWO_CUPS_TABLE, LAYERED_MATCHA, COZY_CAFE, ROUND_TABLE],            // Boba Guys
  5:  [POURING_INTO_BOBA, COOKIE_FRAPPE, ICED_TEA_SPLASH, HANGING_BULBS, EMPTY_CHAIRS],// Tiger Sugar
  6:  [POLKA_DOT_DRINK, THAI_TEA, HERBAL_TEA, DINING_TABLE, LATTE_TRAY],               // Happy Lemon
  7:  [NEON_SIGN, ICED_TEA_SPLASH, LOGO_BOBA_CUP, BUSY_RESTAURANT, LEATHER_SOFA],      // Boba Bear
  8:  [FOUR_COLORFUL, MATCHA_CUP, TWO_CUPS_TABLE, TABLE_ROOM, BIG_WINDOW],             // Urban Bubble
  9:  [HAND_HELD_BOBA, TEA_AND_PEARLS, LAYERED_MATCHA, BRIGHT_CAFE, WOOD_CHAIRS],      // Sharetea
  10: [TAKEOUT_CUPS, POURING_MILK, COOKIE_FRAPPE, RUSTIC_CAFE, CAFE_WINDOW],           // Kung Fu Tea
  11: [TALL_GLASS_BOBA, MATCHA_LATTE, THAI_TEA, PLANT_CAFE, TEA_GLASS],                // Gong Cha
  12: [TWO_JARS, CARAMEL_TAPIOCA, POURING_MILK, PITCHER_TABLE, STOREFRONT],            // The Alley
  13: [PINK_DRINKS, TWO_CUPS_TABLE, MATCHA_CUP, CHALKBOARD_MENU, LABELED_GLASSES], // Chatime
  14: [POURING_ICED_TEA, FLOWER_DESSERTS, COOKIE_FRAPPE, CAFE_CROWD, WOOD_TABLES],           // Meet Fresh
  15: [BLACK_STRAW_CUP, LOGO_BOBA_CUP, LAYERED_MATCHA, CAFE_SIGN, CURVED_COUNTER],     // OneZo
  16: [MANGO_DRINK, THAI_TEA, ICED_TEA_SPLASH, TEA_TOP_VIEW, BUSY_RESTAURANT]          // Ding Tea
};

const rows = [];
for (const [spotId, photos] of Object.entries(spotPhotos)) {
  photos.forEach((id, index) => {
    rows.push({ spotId: Number(spotId), url: img(id), preview: index === 0 });
  });
}

module.exports = {
  up: async(queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, rows, {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: Object.keys(spotPhotos).map(Number) }
    }, {});
  }
};
