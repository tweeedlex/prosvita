export const countAndSetPages = (count, setPages, limit) => {
  console.log(count, limit);
  const pageNumber = Math.ceil(+count / (limit || 24));
  let p = [];
  for (let i = 1; i <= pageNumber; i++) {
    p.push(i);
  }
  setPages(p);
};
