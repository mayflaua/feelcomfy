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
  const start = query.start;
  const end = query.end;
  const limit = query.limit;

  const cards = [
    {
      id: 1,
      categoryID: 1,
      title: "Mouse",
      price: 1199,
      url: "https://via.placeholder.com/600/92c952",
    },
    {
      id: 2,
      categoryID: 2,
      title: "Keyboard",
      price: 1499,
      url: "https://via.placeholder.com/600/771796",
    },
    {
      id: 3,
      categoryID: 3,
      title: "Chair",
      price: 2299,
      url: "https://via.placeholder.com/600/24f355",
    },
    {
      id: 4,
      categoryID: 6,
      title: "T-Shirt",
      price: 999,
      url: "https://via.placeholder.com/600/f66b97",
    },
    {
      id: 5,
      categoryID: 1,
      title: "Mouse #2",
      price: 3399,
      url: "https://via.placeholder.com/600/56a8c2",
    },
    {
      id: 6,
      categoryID: 1,
      title: "Apple Mouse",
      price: 7199,
      url: "https://via.placeholder.com/600/b0f7cc",
    },
    {
      id: 7,
      categoryID: 2,
      title: "Apple Keyboard",
      price: 7999,
      url: "https://via.placeholder.com/600/54176f",
    },
    {
      id: 8,
      categoryID: 3,
      title: "Chair #2",
      price: 12199,
      url: "https://via.placeholder.com/600/51aa97",
    },
    {
      id: 9,
      categoryID: 5,
      title: "Monitor",
      price: 12199,
      url: "https://via.placeholder.com/600/810b14",
    },
    {
      id: 10,
      categoryID: 5,
      title: "Monitor #2",
      price: 18299,
      url: "https://via.placeholder.com/600/92c952",
    },
    {
      id: 11,
      categoryID: 4,
      title: "Table",
      price: 10199,
      url: "https://via.placeholder.com/600/f9cee5",
    },
    {
      id: 12,
      categoryID: 4,
      title: "Table #2",
      price: 15199,
      url: "https://via.placeholder.com/600/9c184f",
    },
  ];

  let res = cards;
  if (end) {
    res = res.slice(res[0], end);
  }
  if (start) {
    res = res.slice(start);
  }
  if (limit) {
    res = res.splice(res[0], limit);
  }

  return res;
});
