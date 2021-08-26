let formatDate = (date) => {
  let day = date.slice(0, 2);
  let month = new Date(Date.parse(date.slice(3, 6) + " 1,2021")).getMonth() + 1;
  let year = date.slice(7, 11);
  console.log(String(year + "-" + "0" + month + "-" + day));
};
formatDate("15 Jun 2021");
