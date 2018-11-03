import IndexPage from "views/IndexPage/IndexPage.jsx";
import Harmonograph from "views/Harmonograph.jsx";
import Inversion from "views/Inversion.jsx";

var indexRoutes = [
  { path: "/harmonograph", name: "Harmonograph", component: Harmonograph },
  { path: "/Inversion", name: "Inversion", component: Inversion },
  { path: "/", name: "IndexPage", component: IndexPage },
];

export default indexRoutes;
