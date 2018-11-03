import IndexPage from "views/IndexPage/IndexPage.jsx";
import Harmonograph from "views/Harmonograph.jsx";
import Inversion from "views/Inversion.jsx";
import CalabiYau from "views/CalabiYau.jsx";
import Riemann from "views/Riemann.jsx";

var indexRoutes = [
  { path: "/harmonograph", name: "Harmonograph", component: Harmonograph },
  { path: "/inversion", name: "Inversion", component: Inversion },
  { path: "/calabiyau", name: "CalabiYau", component: CalabiYau },
  { path: "/riemann", name: "Riemann", component: Riemann },
  { path: "/", name: "IndexPage", component: IndexPage },
];

export default indexRoutes;
