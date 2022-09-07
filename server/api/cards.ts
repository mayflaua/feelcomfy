/* CATEGORY ID IS
 ** 1 for mouse
 ** 2 for keyboard
 ** 3 for chairs
 ** 4 for tables
 ** 5 for monitors
 ** 6 for merch
 */

export default defineEventHandler((event) => {
  const query = useQuery(event);
  const start = Number(query.start);
  const end = Number(query.end);
  const limit = Number(query.limit);
  const ids = query.ids;

  let cards: Card[] = [
    {
      id: 1,
      categoryID: 1,
      title: "Mouse",
      price: {
        final: 1199,
      },
      url: "https://via.placeholder.com/600/92c952",
      thumbnailUrl: "https://via.placeholder.com/150/92c952",
    },
    {
      id: 2,
      categoryID: 2,
      title: "Keyboard",
      price: {
        final: 1499,
      },
      url: "https://via.placeholder.com/600/771796",
      thumbnailUrl: "https://via.placeholder.com/150/771796",
    },
    {
      id: 3,
      categoryID: 3,
      title: "Chair",
      price: {
        final: 1199,
      },
      url: "https://via.placeholder.com/600/24f355",
      thumbnailUrl: "https://via.placeholder.com/150/24f355",
    },
    {
      id: 4,
      categoryID: 6,
      title: "T-Shirt",
      price: {
        final: 1199,
      },
      url: "https://via.placeholder.com/600/f66b97",
      thumbnailUrl: "https://via.placeholder.com/150/f66b97",
    },
    {
      id: 5,
      categoryID: 1,
      title: "Mouse #2",
      price: {
        final: 1199,
      },
      url: "https://via.placeholder.com/600/56a8c2",
      thumbnailUrl: "https://via.placeholder.com/150/56a8c2",
    },
    {
      id: 6,
      categoryID: 1,
      title: "Apple Mouse",
      price: {
        final: 1199,
      },
      url: "https://via.placeholder.com/600/b0f7cc",
      thumbnailUrl: "https://via.placeholder.com/150/b0f7cc",
    },
    {
      id: 7,
      categoryID: 2,
      title: "Apple Keyboard",
      price: {
        final: 1199,
      },
      url: "https://via.placeholder.com/600/54176f",
      thumbnailUrl: "https://via.placeholder.com/150/54176f",
    },
    {
      id: 8,
      categoryID: 3,
      title: "Chair #2",
      price: {
        final: 1199,
      },
      url: "https://via.placeholder.com/600/51aa97",
      thumbnailUrl: "https://via.placeholder.com/150/51aa97",
    },
    {
      id: 9,
      categoryID: 5,
      title: "Monitor",
      price: {
        final: 1199,
      },
      url: "https://via.placeholder.com/600/810b14",
      thumbnailUrl: "https://via.placeholder.com/150/810b14",
    },
    {
      id: 10,
      categoryID: 5,
      title: "Monitor #2",
      price: {
        final: 1199,
      },
      url: "https://via.placeholder.com/600/92c952",
      thumbnailUrl: "https://via.placeholder.com/150/92c952",
    },
    {
      id: 11,
      categoryID: 4,
      title: "Table",
      price: {
        final: 1199,
      },
      url: "https://via.placeholder.com/600/f9cee5",
      thumbnailUrl: "https://via.placeholder.com/150/f9cee5",
    },
    {
      id: 12,
      categoryID: 4,
      title: "Table #2",
      price: {
        final: 1199,
      },
      url: "https://via.placeholder.com/600/9c184f",
      thumbnailUrl: "https://via.placeholder.com/150/9c184f",
    },
  ];

  let res = cards;
  if (end) {
    res = res.slice(0, end);
  }
  if (start) {
    res = res.slice(start);
  }
  if (limit) {
    res = res.splice(0, limit);
  }
  if (ids) {
    const idsList = String(ids)
      .split(" ")
      .map((id) => Number(id));
    res = res.filter((item) => idsList.includes(item.id));
  }

  return res;
});

interface Card {
  readonly id: number;
  categoryID: number;
  title: string;
  url: string;
  thumbnailUrl: string;
  price: {
    old?: number;
    final: number;
  };
  info?: {
    model?: string;
    color?: string;
  };
}
