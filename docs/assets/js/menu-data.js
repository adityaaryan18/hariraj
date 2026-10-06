/* =========================================================
   HARIRAJ — MENU DATA
   Edit dishes and prices here. Each category can have an
   `img` (shown when hovering the category tab) and each
   group can have an `img` (shown when hovering that group).
   Images live in assets/img/ — use the base name without
   the "-700.webp" suffix.
   ========================================================= */
window.HARIRAJ_MENU = [
  {
    id: "soups",
    title: "Soups",
    hi: "सूप",
    blurb: "Slow-simmered, steaming and soul-warming — the perfect way to begin.",
    img: null,
    groups: [
      {
        name: "Continental",
        items: [
          ["Cream of Tomato Soup", 120],
          ["Cream of Mushroom Soup", 150],
          ["Cream of Veg. Soup", 150],
          ["Cream of Spinach Soup", 150]
        ]
      },
      {
        name: "Chinese",
        items: [
          ["Veg. Hot & Sour Soup", 120],
          ["Veg. Manchow Soup", 120],
          ["Veg. Sweet Corn Soup", 120],
          ["Veg. Lemon Coriander Soup", 120],
          ["Veg. Lung Fung Soup", 120],
          ["Veg. Talumein Soup", 120],
          ["Mushroom Soup", 120]
        ]
      }
    ]
  },
  {
    id: "starters",
    title: "Starters",
    hi: "स्टार्टर",
    blurb: "Crisp, saucy, smoky — little plates that disappear fast.",
    img: "gobi-manchurian",
    groups: [
      {
        name: "Indian Starters",
        img: "chole-bhature",
        items: [
          ["Finger Chips", 140],
          ["Veg Pakoda", 160],
          ["Chana Roast", 180],
          ["Paneer Pakoda", 180],
          ["Shahi Petro", 200],
          ["Vegetable Cutlet", 90],
          ["Chole Bhature", 160],
          ["Extra Bhature", 30],
          ["Extra Chole", 100]
        ]
      },
      {
        name: "Chinese Starters",
        img: "manchurian-spring-roll",
        items: [
          ["Chinese Bhel", 180],
          ["Spring Roll", 180],
          ["Chana Chilly", 200],
          ["Gobhi Chilly", 200],
          ["Crispy Corn", 200],
          ["Corn Chilly", 200],
          ["Lovely Corn", 200],
          ["Veg. Manchurian", 210],
          ["Crispy Veg.", 210],
          ["Crunchy Veg.", 210]
        ]
      }
    ]
  },
  {
    id: "south-indian",
    title: "South Indian",
    hi: "दक्षिण भारतीय",
    blurb: "Golden, paper-thin dosas with piping-hot sambar and fresh coconut chutney.",
    img: "masala-dosa",
    groups: [
      {
        name: "New Additions",
        tag: "New",
        img: "masala-dosa",
        items: [
          ["Crunchy Idly", 100],
          ["Ghee Pan Fry Idly", 120],
          ["Crunchy Bites Dosa", 200],
          ["American Corn Dosa", 200],
          ["Chocolate Dosa", 200],
          ["Butter Roast Dosa", 150],
          ["Garlic Roast", 170],
          ["Mysore Masala Dosa", 220]
        ]
      },
      {
        name: "Old is Gold",
        tag: "Classic",
        items: [
          ["Sada Dosa", 100],
          ["Masala Dosa", 120],
          ["Rawa Sada Dosa", 110],
          ["Rawa Onion Sada Dosa", 120],
          ["Rawa Masala Dosa", 130],
          ["Rawa Onion Masala Dosa", 140],
          ["Onion Uttapam", 110],
          ["Tomato Uttapam", 110],
          ["Masala Uttapam", 130],
          ["Vegetable Uttapam", 140],
          ["Butter Sada Dosa", 130],
          ["Butter Masala Dosa", 150]
        ]
      }
    ]
  },
  {
    id: "main-course",
    title: "Main Course",
    hi: "मुख्य व्यंजन",
    blurb: "Rich gravies, slow-cooked masalas and koftas that melt in the mouth.",
    img: "paneer-tikka",
    groups: [
      {
        name: "Indian Vegetables",
        img: "paneer-tikka",
        items: [
          ["Aloo Jeera / Methi", 160],
          ["Bhindi Kurkure", 160],
          ["Bhindi Masala", 170],
          ["Baigan Bharta", 170],
          ["Mix Veg.", 190],
          ["Dum Aloo Punjabi", 190],
          ["Aloo Gobhi", 190],
          ["Chole Masala", 200],
          ["Chole Amritsari", 200],
          ["Stuffed Tomato / Capsicum", 220],
          ["Veg. Handi", 220],
          ["Veg. Kadhai", 220],
          ["Veg. Hariyali", 220],
          ["Veg. Kolhapuri", 220],
          ["Veg. Jalfrezi", 220],
          ["Veg. Keema Kasturi", 220],
          ["Corn Palak", 230],
          ["Veg. Makhanwala", 240],
          ["Aloo Nazakat", 240],
          ["Corn Capsicum Masala", 250],
          ["Navratan Korma", 300],
          ["Methi Matar Malai", 300]
        ]
      },
      {
        name: "Indian Kofta",
        items: [
          ["Dum Handi Kofta", 200],
          ["Veg. Kofta", 200],
          ["Zafrani Kofta", 220],
          ["Punjabi Kofta", 240],
          ["Nargisi Kofta", 260],
          ["Cheese Angoori Kofta", 280],
          ["Malai Kofta", 300],
          ["Shahi Kofta", 280],
          ["Fusion Kofta", 280],
          ["Paneer Kofta", 280]
        ]
      }
    ]
  },
  {
    id: "breads",
    title: "Breads",
    hi: "रोटी और नान",
    blurb: "Fresh from the tandoor — blistered, buttery and made to order.",
    img: null,
    groups: [
      {
        name: "Tandoori Roti / Naan",
        items: [
          ["Tawa Roti", 20],
          ["Tawa Roti (Ghee)", 25],
          ["Tandoori Roti", 20],
          ["Tandoori Roti (Butter)", 25],
          ["Missi Roti", 60],
          ["Lachha Paratha", 60],
          ["Stuffed Paratha (Potato / Veg.)", 80],
          ["Paneer Paratha", 150],
          ["Roomali Roti", 120],
          ["Plain Naan", 30],
          ["Butter Naan", 50],
          ["Garlic Naan", 90],
          ["Cheese Naan", 150],
          ["Kashmiri Naan", 170],
          ["Cheese Garlic Naan", 170]
        ]
      },
      {
        name: "Kulcha",
        items: [
          ["Kulcha", 60],
          ["Stuffed Kulcha", 100],
          ["Paneer Stuffed Kulcha", 160]
        ]
      }
    ]
  },
  {
    id: "rice",
    title: "Rice & Biryani",
    hi: "चावल और बिरयानी",
    blurb: "Fragrant basmati, layered biryanis and comforting khichdi.",
    img: null,
    groups: [
      {
        name: "Rice",
        items: [
          ["Steam Rice", 120],
          ["Jeera Rice", 140],
          ["Onion Tomato Jeera Rice", 150],
          ["Curd Rice", 160],
          ["Pulao (Veg. / Peas)", 190],
          ["Masala Rice", 180],
          ["Dal Lapeta Rice", 190],
          ["Kashmiri Pulao", 250],
          ["Paneer Pulao", 230]
        ]
      },
      {
        name: "Biryani",
        items: [
          ["Veg. Dum Biryani", 250],
          ["Veg. Hyderabadi Biryani", 250],
          ["Paneer Biryani", 280]
        ]
      },
      {
        name: "Khichdi",
        items: [
          ["Moong Dal Khichdi (Plain / Masala)", 170],
          ["Yellow Dal Khichdi (Plain / Masala)", 170],
          ["Vegetable Khichdi", 220],
          ["Palak Khichdi", 220]
        ]
      }
    ]
  },
  {
    id: "chinese",
    title: "Chinese",
    hi: "चाइनीज़",
    blurb: "Wok-tossed on roaring flames — smoky, spicy, irresistible.",
    img: "veg-fried-rice",
    groups: [
      {
        name: "Noodles",
        img: "chilli-paneer",
        items: [
          ["Veg. Noodles", 180],
          ["Veg. Schezwan Noodles", 190],
          ["Veg. Hakka Noodles", 190],
          ["Chilly Garlic Noodles", 190],
          ["Crispy Noodles", 190],
          ["American Chopsuey", 190]
        ]
      },
      {
        name: "Chinese Rice",
        img: "veg-fried-rice",
        items: [
          ["Veg. Fried Rice", 170],
          ["Chilly Garlic Fried Rice", 180],
          ["Pan King Fried Rice", 180],
          ["Veg. Schezwan Fried Rice", 180],
          ["Singapuri Fried Rice", 200],
          ["Mexican Fried Rice", 200],
          ["All Mixed Fried Rice", 300]
        ]
      }
    ]
  },
  {
    id: "sides",
    title: "Salads & Sides",
    hi: "सलाद और रायता",
    blurb: "Crunchy papads, fresh salads and cooling raitas to round off your thali.",
    img: null,
    groups: [
      {
        name: "Papad",
        items: [
          ["Papad Roasted", 20],
          ["Masala Papad (Dry / Fry)", 50]
        ]
      },
      {
        name: "Salad",
        items: [
          ["Onion Salad", 60],
          ["Green Salad", 80],
          ["Kachumber Salad", 100],
          ["Curd Salad", 120],
          ["Italian Hot Salad", 220]
        ]
      },
      {
        name: "Raita / Curd",
        items: [
          ["Plain Curd", 70],
          ["Sweet Curd", 80],
          ["Boondi Raita", 80],
          ["Mix Veg. Raita", 80],
          ["Pineapple Raita", 120]
        ]
      }
    ]
  },
  {
    id: "beverages",
    title: "Beverages",
    hi: "पेय",
    blurb: "Chilled lassi, thick shakes and fizzy mocktails.",
    img: null,
    groups: [
      {
        name: "Cold Beverages",
        items: [
          ["Packaged Drinking Water", 20],
          ["Butter Milk", 60],
          ["Soft Drinks", 60],
          ["Fresh Lime Soda", 70],
          ["Masala Cold Drink", 80],
          ["Lassi", 70]
        ]
      },
      {
        name: "Shakes & Mocktails",
        items: [
          ["Mojito", 120],
          ["Blue Lagoon", 120],
          ["Thick Milk Shake (Choice of Flavour)", 160],
          ["Cold Coffee", 140],
          ["Cold Coffee with Ice Cream", 160],
          ["Ice Cream Soda (Lemon, Orange, Strawberry)", 140]
        ]
      }
    ]
  },
  {
    id: "desserts",
    title: "Sundaes & Desserts",
    hi: "मिठाई",
    blurb: "Save room. Trust us.",
    img: null,
    groups: [
      {
        name: "Sundaes",
        items: [
          ["Tutti Frutti", 200],
          ["Fruit Punch", 170],
          ["Pineapple Delight", 170],
          ["Nutty Butty", 140],
          ["Chocolate Overload", 200],
          ["Chocolate Brownie Sundae", 250]
        ]
      },
      {
        name: "Desserts",
        items: [
          ["Ice Cream (Chocolate, Vanilla, Butterscotch, Strawberry)", 80],
          ["Hot Gulab Jamun", 60],
          ["Rasgulla", 60],
          ["Rasmalai", 80]
        ]
      }
    ]
  }
];
