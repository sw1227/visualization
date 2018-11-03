import IndexPage from "views/IndexPage/IndexPage.jsx";
import Harmonograph from "views/Harmonograph.jsx";

var indexRoutes = [
  { path: "/harmonograph", name: "Harmonograph", component: Harmonograph },
  { path: "/", name: "IndexPage", component: IndexPage },
];

export default indexRoutes;
