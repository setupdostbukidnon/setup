window.dueDateStart = 1;
window.dueDateEnd = 5;
window.selected = [];
window.currentDay = new Date().getDate();
window.nowDate = new Date().getTime();
window.last = {
  bottom: true,
  top: false,
  left: false,
  right: true
};
window.limitOptions = [5, 10, 15];
window.years = ["All",
"2010", "2011", "2012", "2013",
"2014", "2015", "2016", "2017",
"2018", "2019", "2020", "2021",
"2022", "2023", "2024", "2025",
"2026", "2027", "2028", "2029",
"2030", "2031", "2032", "2033"];
window.options = {
  rowSelection: true,
  multiSelect: false,
  autoSelect: true,
  decapitate: false,
  largeEditDialog: false,
  boundaryLinks: false,
  limitSelect: false,
  pageSelect: true
};
window.query = {
  filter: "",
  limit: "20",
  order: "-projectYear",
  page: 1
};
window.tooltip = {
  showTooltip: false,
  tipDirection: "bottom"
};
