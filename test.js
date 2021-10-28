const getTime = (a) => {
  const d = new Date(a);
  const date = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  console.log(date | 5);
};

getTime("");
